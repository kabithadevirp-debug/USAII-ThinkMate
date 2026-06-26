import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SYSTEM_PROMPT = `You are ThinkMate AI — a calm, focused personal thinking partner. Your job is not to impress users with everything you can do. Your job is to help them think clearly and take their most important next step.

CORE BEHAVIOURS:
1. Extract tasks from the user's brain dump, identify deadlines, spot dependencies, classify each by urgency and importance (Eisenhower).
2. Always return STRICT JSON matching the schema. No prose outside JSON.
3. Recommend exactly ONE next step. Justify in one sentence.
4. Calculate Mental Load Score (0-100): tasks count 30%, urgent tasks 40%, high-stakes decisions 20%, interdependencies 10%.
5. Never list more than 3 priority tasks. Focus beats comprehensiveness.
6. Tone: calm, grounding, never catastrophising.
7. If mental load > 75, suggest 1-2 tasks to postpone/delegate proactively in the recommendation field.
8. Preserve human agency — surface options, not mandates.`;

const TaskSchema = z.object({
  title: z.string(),
  deadline: z.string().nullable().optional(),
  priority: z.enum(["high", "medium", "low"]),
  quadrant: z.enum(["do_now", "schedule", "delegate", "ignore"]),
  estimatedMinutes: z.number().int().nonnegative(),
  dependencies: z.array(z.string()).default([]),
  rationale: z.string().optional(),
  blockerQuestion: z.string().nullable().optional(),
});

const AnalysisSchema = z.object({
  tasks: z.array(TaskSchema),
  mentalLoadScore: z.number().min(0).max(100),
  mentalLoadRisk: z.enum(["low", "moderate", "high"]),
  nextStep: z.object({
    task: z.string(),
    reason: z.string(),
    estimatedMinutes: z.number().int().nonnegative(),
  }),
  recommendation: z.string(),
});

export type ThinkMateAnalysis = z.infer<typeof AnalysisSchema>;
export type ThinkMateTask = z.infer<typeof TaskSchema>;

function convertSchemaToGemini(schema: any): any {
  if (!schema || typeof schema !== 'object') return schema;
  const result: any = { ...schema };
  if (typeof result.type === 'string') {
    result.type = result.type.toUpperCase();
  }
  
  delete result.minimum;
  delete result.maximum;
  delete result.minItems;
  delete result.maxItems;

  if (result.properties) {
    const nextProps: any = {};
    for (const key of Object.keys(result.properties)) {
      nextProps[key] = convertSchemaToGemini(result.properties[key]);
    }
    result.properties = nextProps;
  }
  if (result.items) {
    result.items = convertSchemaToGemini(result.items);
  }
  return result;
}

async function callGateway(messages: Array<{ role: string; content: string }>, tool: {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  const errors: string[] = [];

  // 1. Try OpenRouter if an OpenRouter key is available
  const openRouterApiKey = openRouterKey || (lovableKey?.startsWith("sk-or-") ? lovableKey : undefined) || (geminiKey?.startsWith("sk-or-") ? geminiKey : undefined) || (groqKey?.startsWith("sk-or-") ? groqKey : undefined);
  if (openRouterApiKey) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lovable.dev",
          "X-Title": "ThinkMate AI",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages,
          tools: [{ type: "function", function: tool }],
          tool_choice: { type: "function", function: { name: tool.name } },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`OpenRouter API error ${res.status}: ${text.slice(0, 300)}`);
      }

      const data = await res.json();
      const call = data?.choices?.[0]?.message?.tool_calls?.[0];
      if (!call?.function?.arguments) {
        throw new Error("OpenRouter returned no tool call: " + JSON.stringify(data));
      }
      return JSON.parse(call.function.arguments);
    } catch (e: any) {
      const causeStr = e.cause ? (e.cause.message || (typeof e.cause === 'object' ? JSON.stringify(e.cause) : String(e.cause))) : '';
      const fullError = causeStr ? `${e.message} (Cause: ${causeStr})` : e.message;
      console.error("OpenRouter attempt failed, trying fallback...", e);
      errors.push(`OpenRouter: ${fullError}`);
    }
  }

  // 2. Try Groq if a Groq key is available and looks valid
  const groqApiKey = groqKey || (lovableKey?.startsWith("gsk_") ? lovableKey : undefined) || (geminiKey?.startsWith("gsk_") ? geminiKey : undefined);
  if (groqApiKey) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages,
          tools: [{ type: "function", function: tool }],
          tool_choice: { type: "function", function: { name: tool.name } },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Groq API error ${res.status}: ${text.slice(0, 300)}`);
      }

      const data = await res.json();
      const call = data?.choices?.[0]?.message?.tool_calls?.[0];
      if (!call?.function?.arguments) {
        throw new Error("Groq returned no tool call: " + JSON.stringify(data));
      }
      return JSON.parse(call.function.arguments);
    } catch (e: any) {
      const causeStr = e.cause ? (e.cause.message || (typeof e.cause === 'object' ? JSON.stringify(e.cause) : String(e.cause))) : '';
      const fullError = causeStr ? `${e.message} (Cause: ${causeStr})` : e.message;
      console.error("Groq attempt failed, trying fallback...", e);
      errors.push(`Groq: ${fullError}`);
    }
  }

  // 2. Try Direct Gemini if a direct Gemini key is available (usually starts with AIzaSy)
  const geminiApiKey = (geminiKey?.startsWith("AIzaSy") ? geminiKey : undefined) || (lovableKey?.startsWith("AIzaSy") ? lovableKey : undefined);
  if (geminiApiKey) {
    try {
      const systemMessage = messages.find(m => m.role === 'system');
      const systemInstruction = systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined;
      const contents = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

      const responseSchema = convertSchemaToGemini(tool.parameters);

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction,
          contents,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema
          }
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Gemini API error ${res.status}: ${text.slice(0, 300)}`);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("Gemini returned no text response: " + JSON.stringify(data));
      }
      return JSON.parse(text);
    } catch (e: any) {
      const causeStr = e.cause ? (e.cause.message || (typeof e.cause === 'object' ? JSON.stringify(e.cause) : String(e.cause))) : '';
      const fullError = causeStr ? `${e.message} (Cause: ${causeStr})` : e.message;
      console.error("Direct Gemini attempt failed, trying fallback...", e);
      errors.push(`Direct Gemini: ${fullError}`);
    }
  }

  // 3. Try Lovable API Gateway if a Lovable key is available (usually starts with AQ.)
  const lovableApiKey = (lovableKey?.startsWith("AQ.") ? lovableKey : undefined) || (geminiKey?.startsWith("AQ.") ? geminiKey : undefined) || lovableKey;
  if (lovableApiKey) {
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages,
          tools: [{ type: "function", function: tool }],
          tool_choice: { type: "function", function: { name: tool.name } },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`AI gateway error ${res.status}: ${text.slice(0, 300)}`);
      }

      const data = await res.json();
      const call = data?.choices?.[0]?.message?.tool_calls?.[0];
      if (!call?.function?.arguments) {
        throw new Error("AI returned no tool call");
      }
      return JSON.parse(call.function.arguments);
    } catch (e: any) {
      const causeStr = e.cause ? (e.cause.message || (typeof e.cause === 'object' ? JSON.stringify(e.cause) : String(e.cause))) : '';
      const fullError = causeStr ? `${e.message} (Cause: ${causeStr})` : e.message;
      console.error("Lovable Gateway attempt failed...", e);
      errors.push(`Lovable Gateway: ${fullError}`);
    }
  }

  if (errors.length === 0) {
    throw new Error("No AI API keys (LOVABLE_API_KEY, GEMINI_API_KEY, or GROQ_API_KEY) are configured.");
  } else {
    throw new Error(`All configured AI providers failed:\n${errors.join("\n")}`);
  }
}

export const analyzeBrainDump = createServerFn({ method: "POST" })
  .inputValidator(z.object({ text: z.string().min(3).max(8000) }))
  .handler(async ({ data }) => {
    const result = await callGateway(
      [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Today is ${new Date().toISOString().slice(0, 10)}.\n\nBRAIN DUMP:\n${data.text}\n\nAnalyse and return structured JSON via the tool.`,
        },
      ],
      {
        name: "submit_analysis",
        description: "Submit ThinkMate analysis of the user's brain dump.",
        parameters: {
          type: "object",
          required: ["tasks", "mentalLoadScore", "mentalLoadRisk", "nextStep", "recommendation"],
          properties: {
            tasks: {
              type: "array",
              items: {
                type: "object",
                required: ["title", "priority", "quadrant", "estimatedMinutes"],
                properties: {
                  title: { type: "string" },
                  deadline: { type: "string", description: "ISO date or human label, or empty" },
                  priority: { type: "string", enum: ["high", "medium", "low"] },
                  quadrant: { type: "string", enum: ["do_now", "schedule", "delegate", "ignore"] },
                  estimatedMinutes: { type: "integer", minimum: 0 },
                  dependencies: { type: "array", items: { type: "string" } },
                  rationale: { type: "string" },
                },
              },
            },
            mentalLoadScore: { type: "integer", minimum: 0, maximum: 100 },
            mentalLoadRisk: { type: "string", enum: ["low", "moderate", "high"] },
            nextStep: {
              type: "object",
              required: ["task", "reason", "estimatedMinutes"],
              properties: {
                task: { type: "string" },
                reason: { type: "string" },
                estimatedMinutes: { type: "integer", minimum: 0 },
              },
            },
            recommendation: { type: "string" },
          },
        },
      },
    );

    return AnalysisSchema.parse(result);
  });

const DecisionSchema = z.object({
  factors: z.array(z.object({ name: z.string(), weight: z.number().min(1).max(10) })),
  options: z.array(
    z.object({
      name: z.string(),
      scores: z.array(z.object({ factor: z.string(), score: z.number().min(1).max(10), reason: z.string() })),
      totalScore: z.number(),
    }),
  ),
  recommendation: z.string(),
  reasoning: z.string(),
});

export type ThinkMateDecision = z.infer<typeof DecisionSchema>;

export const analyzeDecision = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      decision: z.string().min(5).max(2000),
      options: z.array(z.string().min(1).max(200)).min(2).max(6),
      values: z.string().max(500).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const userMsg = `DECISION: ${data.decision}\n\nOPTIONS:\n${data.options.map((o, i) => `${i + 1}. ${o}`).join("\n")}\n\nUSER VALUES: ${data.values || "Not specified — infer reasonable factors."}\n\nBuild a weighted comparison. End with "Final decision is yours." in the recommendation.`;

    const result = await callGateway(
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMsg },
      ],
      {
        name: "submit_decision",
        description: "Submit a weighted decision comparison.",
        parameters: {
          type: "object",
          required: ["factors", "options", "recommendation", "reasoning"],
          properties: {
            factors: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "weight"],
                properties: {
                  name: { type: "string" },
                  weight: { type: "number", minimum: 1, maximum: 10 },
                },
              },
            },
            options: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "scores", "totalScore"],
                properties: {
                  name: { type: "string" },
                  weight: { type: "number" },
                  scores: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["factor", "score", "reason"],
                      properties: {
                        factor: { type: "string" },
                        score: { type: "number", minimum: 1, maximum: 10 },
                        reason: { type: "string" },
                      },
                    },
                  },
                  totalScore: { type: "number" },
                },
              },
            },
            recommendation: { type: "string" },
            reasoning: { type: "string" },
          },
        },
      },
    );

    return DecisionSchema.parse(result);
  });

// --- NEW AKINATOR BRAIN DUMP SYSTEM ---

const AkinatorQuestionSchema = z.object({
  type: z.literal("question"),
  questionNumber: z.number(),
  question: z.string(),
  hint: z.string(),
  quickOptions: z.array(z.string()).optional(),
});

const MoodProfileSchema = z.object({
  stressLevel: z.enum(["low", "moderate", "high", "crisis"]),
  emotionalState: z.enum(["anxious", "overwhelmed", "determined", "fatigued", "focused", "avoidant", "neutral"]),
  toneSignals: z.array(z.string()),
  recommendedMode: z.enum(["execution", "triage", "rest", "clarity"]),
  detectedAt: z.number(),
});

const AkinatorResultSchema = z.object({
  type: z.literal("result"),
  tasks: z.array(TaskSchema),
  mentalLoadScore: z.number().min(0).max(100),
  riskLevel: z.enum(["low", "moderate", "high"]),
  recommendedNextStep: z.object({
    task: z.string(),
    reason: z.string(),
    estimatedMinutes: z.number().int().nonnegative(),
  }),
  classificationExplanations: z.array(z.object({
    taskTitle: z.string(),
    quadrant: z.enum(["do_now", "schedule", "delegate", "ignore"]),
    reason: z.string(),
  })),
  sessionSummary: z.string(),
  moodProfile: MoodProfileSchema.optional().nullable(),
});

export type AkinatorQuestion = z.infer<typeof AkinatorQuestionSchema>;
export type AkinatorResult = z.infer<typeof AkinatorResultSchema>;

export const conductBrainDumpSession = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      brainDump: z.string(),
      conversationHistory: z.array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      ),
      action: z.enum(["next_question", "finalize"]),
    })
  )
  .handler(async ({ data }) => {
    const qCount = data.conversationHistory.length;

    // --- FEATURE 3: PRE-PASS TONE ANALYSIS ---
    let toneAnalysis: any = null;
    if (data.action === "finalize" || qCount >= 5) {
      try {
        const toneSystemPrompt = `Analyze the emotional tone of this text in 3 dimensions.
Return ONLY valid JSON, no prose:
{
  "stressLevel": "low" | "moderate" | "high" | "crisis",
  "emotionalState": "anxious" | "overwhelmed" | "determined" | "fatigued" | "focused" | "avoidant" | "neutral",
  "toneSignals": string[], // max 3 phrases that led to this classification
  "recommendedMode": "execution" | "triage" | "rest" | "clarity"
}
Base this purely on linguistic signals: word choice, sentence length, punctuation density, hedging language, urgency markers, emotional vocabulary.`;

        const toneResult = await callGateway(
          [
            { role: "system", content: toneSystemPrompt },
            { role: "user", content: `Analyze the tone of this brain dump: "${data.brainDump}"` }
          ],
          {
            name: "submit_tone_analysis",
            description: "Submit the emotional tone analysis results.",
            parameters: {
              type: "object",
              required: ["stressLevel", "emotionalState", "toneSignals", "recommendedMode"],
              properties: {
                stressLevel: { type: "string", enum: ["low", "moderate", "high", "crisis"] },
                emotionalState: { type: "string", enum: ["anxious", "overwhelmed", "determined", "fatigued", "focused", "avoidant", "neutral"] },
                toneSignals: { type: "array", items: { type: "string" } },
                recommendedMode: { type: "string", enum: ["execution", "triage", "rest", "clarity"] }
              }
            }
          }
        );
        toneAnalysis = toneResult;
      } catch (err) {
        console.error("Tone analysis pre-pass failed:", err);
      }
    }

    let formulaInstructions = "Calculate Mental Load Score (0-100) using Standard mode: task_volume 25%, deadline_pressure 30%, dependency 15%, decision_count 20%, context_switching 10%.";
    let emotionalContext = "";

    if (toneAnalysis) {
      if (toneAnalysis.emotionalState === "overwhelmed" || toneAnalysis.emotionalState === "anxious") {
        formulaInstructions = "Calculate Mental Load Score using Overwhelmed mode: task_volume 15%, deadline_pressure 25%, dependency 10%, decision_count 35% (decisions cause overload), context_switching 15%. Recommend maximum 2 tasks. Tone should be extremely soothing.";
      } else if (toneAnalysis.emotionalState === "fatigued") {
        formulaInstructions = "Calculate Mental Load Score using Fatigued mode: task_volume 20%, deadline_pressure 40% (deadlines matter most when energy is low), dependency 20%, decision_count 10% (skip decisions today), context_switching 10%. Recommend maximum 2 tasks.";
      } else if (toneAnalysis.emotionalState === "determined" || toneAnalysis.emotionalState === "focused") {
        formulaInstructions = "Calculate Mental Load Score using Determined mode: task_volume 30%, deadline_pressure 25%, dependency 20%, decision_count 15%, context_switching 10%. Standard execution mode.";
      } else if (toneAnalysis.emotionalState === "avoidant") {
        formulaInstructions = "Calculate Mental Load Score using Avoidant mode: task_volume 10%, deadline_pressure 45% (force deadline focus), dependency 15%, decision_count 20%, context_switching 10%. Prioritize deadline urgency to combat procrastination.";
      }

      emotionalContext = `
[MOOD MODE ACTIVE]
User's detected emotional state: ${toneAnalysis.emotionalState}
Recommended mode: ${toneAnalysis.recommendedMode}
Tone signals detected: ${toneAnalysis.toneSignals.join(", ")}
Mental Load Calculation weighting updates: ${formulaInstructions}
Adjust task prioritization, recommendations, and the tone of rationale accordingly. 
If in 'rest' mode (recommendedMode === 'rest' or emotionalState === 'fatigued'), recommend maximum 2 tasks.
If in 'crisis' mode (recommendedMode === 'triage' or stressLevel === 'crisis'), recommend only 1 task.
`;
    }

    const procrastinationPrompt = `
[PROCRASTINATION TRACKING ACTIVE]
For tasks where the user is expressing avoidance, anxiety, delay, or procrastination, you must generate:
- blockerQuestion: a single empathetic, non-judgmental question that helps the user identify what is actually stopping them. Examples:
  - "Is this task unclear, scary, or just boring?"
  - "What would need to be true for you to start this today?"
  - "Is there a smaller version of this you could do in 5 minutes?"
Never use the word lazy. Never guilt-trip. Keep it supportive and grounding.
`;

    const baseSystemPrompt = `You are ThinkMate AI — a calm, focused personal thinking partner.
Your goal is to conduct an interactive questioning loop (maximum 5 questions) to clarify the user's brain dump before rendering their tasks and mental load score.

RULES FOR FLOW:
1. Examine the user's raw brain dump: "${data.brainDump}".
2. Review the Q&A history: ${JSON.stringify(data.conversationHistory)}.
3. Based on the user action: "${data.action}" and current context:
   - If action is "finalize", OR if the user has answered at least 2 questions and you have high confidence, OR if you have reached 5 questions (qCount >= 5), you MUST return a "result" type.
   - Otherwise, return a "question" type to ask ONE clarifying question.
4. If returning a "question":
   - Target the single highest uncertainty dimension: deadline pressure, personal vs. professional splits, delegation availability, energy level, or decision complexity.
   - Ground the question based on previous answers (e.g. "You mentioned x - does that mean y?").
   - Offer a one-line calm "hint".
   - Optionally list 2-4 "quickOptions" (e.g., ["Yes", "No", "Not sure"] or short options) to make input easy.
   - Return questionNumber = ${qCount + 1}.
5. If returning a "result":
   - Extract tasks from the dump and the conversation history.
   - For each task, map details to quadrant (do_now, schedule, delegate, ignore), priority (high, medium, low), and estimatedMinutes.
   - ${formulaInstructions}
   - Suggest exactly ONE recommendedNextStep (task title, reason, estimated minutes).
   - Write a sessionSummary (2-3 sentences summarizing key insights from this conversation).
   - Write classificationExplanations (an array matching each task title with its quadrant and a 1-2 sentence explanation of WHY it was placed there).
   
Make sure your tone is conversational, grounding, and calm. No prose outside the tool call.

IMPORTANT STRUCTURE REQUIREMENT:
All fields are strictly required by the output schema:
- If returning a "question" type, you must provide real values for 'type', 'questionNumber', 'question', and 'hint'. For the result properties, you MUST return dummy values: tasks = [], mentalLoadScore = 0, riskLevel = "low", recommendedNextStep = {task: "", reason: "", estimatedMinutes: 0}, classificationExplanations = [], sessionSummary = "".
- If returning a "result" type, you must provide real values for 'type', 'tasks', 'mentalLoadScore', 'riskLevel', 'recommendedNextStep', 'classificationExplanations', and 'sessionSummary'. For the question properties, you MUST return dummy values: questionNumber = 0, question = "", hint = "", quickOptions = [].`;

    const systemPrompt = baseSystemPrompt + (emotionalContext ? `\n\n${emotionalContext}` : "") + `\n\n${procrastinationPrompt}`;

    const result = await callGateway(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Process the session state. Current question count: ${qCount}. Action: ${data.action}` },
      ],
      {
        name: "submit_session_update",
        description: "Submit either the next clarifying question or the final analysis result.",
        parameters: {
          type: "object",
          required: [
            "type",
            "questionNumber",
            "question",
            "hint",
            "tasks",
            "mentalLoadScore",
            "riskLevel",
            "recommendedNextStep",
            "classificationExplanations",
            "sessionSummary"
          ],
          properties: {
            type: { type: "string", enum: ["question", "result"] },
            // Question properties
            questionNumber: { type: "integer" },
            question: { type: "string" },
            hint: { type: "string" },
            quickOptions: { type: "array", items: { type: "string" } },
            // Result properties
            tasks: {
              type: "array",
              items: {
                type: "object",
                required: ["title", "priority", "quadrant", "estimatedMinutes"],
                properties: {
                  title: { type: "string" },
                  deadline: { type: "string", description: "ISO date or label" },
                  priority: { type: "string", enum: ["high", "medium", "low"] },
                  quadrant: { type: "string", enum: ["do_now", "schedule", "delegate", "ignore"] },
                  estimatedMinutes: { type: "integer", minimum: 0 },
                  dependencies: { type: "array", items: { type: "string" } },
                  rationale: { type: "string" },
                  blockerQuestion: { type: "string", description: "Empathetic question if user is procrastinating on this task, else null." }
                },
              },
            },
            mentalLoadScore: { type: "integer", minimum: 0, maximum: 100 },
            riskLevel: { type: "string", enum: ["low", "moderate", "high"] },
            recommendedNextStep: {
              type: "object",
              required: ["task", "reason", "estimatedMinutes"],
              properties: {
                task: { type: "string" },
                reason: { type: "string" },
                estimatedMinutes: { type: "integer" },
              },
            },
            classificationExplanations: {
              type: "array",
              items: {
                type: "object",
                required: ["taskTitle", "quadrant", "reason"],
                properties: {
                  taskTitle: { type: "string" },
                  quadrant: { type: "string", enum: ["do_now", "schedule", "delegate", "ignore"] },
                  reason: { type: "string" },
                },
              },
            },
            sessionSummary: { type: "string" },
          },
        },
      },
    );

    if (result.type === "question") {
      return AkinatorQuestionSchema.parse(result);
    } else {
      if (toneAnalysis) {
        result.moodProfile = {
          ...toneAnalysis,
          detectedAt: Date.now()
        };
      }
      return AkinatorResultSchema.parse(result);
    }
  });

// --- NEW REFLECTION SYSTEM ---

export const generateReflection = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      completedTasks: z.array(z.string()),
      incompleteTasks: z.array(z.string()),
      freeText: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const systemPrompt = `You are ThinkMate AI — a calm, focused personal thinking partner. Your job is to generate a daily evening recap.
Based on the completed tasks, incomplete tasks, and user's reflections:
1. Write a 2-sentence summary of their accomplishments.
2. Formulate a tailored, highly specific encouragement based on what they completed. Do NOT use generic phrases. If they completed nothing, acknowledge the effort of showing up to reflect.
3. Select or formulate a single tomorrowFocus task (title + brief reason why this is key).
4. Identify which incomplete tasks should be carriedOver.

No prose outside the tool call.`;

    const result = await callGateway(
      [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `COMPLETED TASKS:\n${data.completedTasks.map((t) => `- ${t}`).join("\n") || "None"}\n\nINCOMPLETE TASKS:\n${data.incompleteTasks.map((t) => `- ${t}`).join("\n") || "None"}\n\nADDITIONAL JOURNAL:\n${data.freeText || "None"}`,
        },
      ],
      {
        name: "submit_reflection",
        description: "Submit evening reflection analysis.",
        parameters: {
          type: "object",
          required: ["summary", "carriedOver", "tomorrowFocus", "encouragement"],
          properties: {
            summary: { type: "string" },
            carriedOver: { type: "array", items: { type: "string" } },
            tomorrowFocus: { type: "string" },
            encouragement: { type: "string" },
          },
        },
      },
    );

    return z.object({
      summary: z.string(),
      carriedOver: z.array(z.string()),
      tomorrowFocus: z.string(),
      encouragement: z.string(),
    }).parse(result);
  });

// --- NEW GOAL BREAKDOWN SYSTEM ---

export const breakdownGoal = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      goalText: z.string(),
      timeline: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const systemPrompt = `You are ThinkMate AI — a calm, focused personal thinking partner. Your job is to break down a high-level goal into actionable milestones.
Inputs: Goal description: "${data.goalText}". Target timeline: "${data.timeline || "reasonable duration"}".

Generate:
1. Restate the goal in clear, focused language.
2. Outline 3 to 6 logical milestones (each with a month label, title, and 3 concrete sub-actions).
3. Outline exactly 3 specific actions for Week 1.
4. Suggest a single, highly actionable, tiny first step they can do TODAY.
5. Provide a realistic estimated overall duration (e.g. "6-9 months").

No prose outside the tool call.`;

    const result = await callGateway(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Break down goal: "${data.goalText}" timeline: "${data.timeline || "not specified"}"` },
      ],
      {
        name: "submit_goal_breakdown",
        description: "Submit parsed goal breakdown.",
        parameters: {
          type: "object",
          required: ["goal", "milestones", "weekOneActions", "todayFirstStep", "estimatedDuration"],
          properties: {
            goal: { type: "string" },
            estimatedDuration: { type: "string" },
            todayFirstStep: { type: "string" },
            weekOneActions: { type: "array", items: { type: "string" } },
            milestones: {
              type: "array",
              items: {
                type: "object",
                required: ["month", "title", "actions"],
                properties: {
                  month: { type: "string" },
                  title: { type: "string" },
                  actions: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
      },
    );

    return z.object({
      goal: z.string(),
      milestones: z.array(
        z.object({
          month: z.string(),
          title: z.string(),
          actions: z.array(z.string()),
        })
      ),
      weekOneActions: z.array(z.string()),
      todayFirstStep: z.string(),
      estimatedDuration: z.string(),
    }).parse(result);
  });
