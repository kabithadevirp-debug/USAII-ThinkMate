import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/AppShell";
import { conductBrainDumpSession, type ThinkMateAnalysis } from "@/lib/thinkmate.functions";
import { useThinkMate } from "@/lib/thinkmate-store";
import { Loader2, Sparkles, ArrowRight, Mic, MicOff, Square } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/brain-dump")({
  head: () => ({
    meta: [
      { title: "Brain Dump — ThinkMate AI" },
      { name: "description", content: "Empty your mind. ThinkMate AI structures it into clear priorities." },
    ],
  }),
  component: () => (
    <AuthGuard>
      <BrainDumpPage />
    </AuthGuard>
  ),
});

const SAMPLES = [
  "I have a midterm on Friday I haven't started studying for, an internship application due tomorrow, and my mom wants me to visit this weekend. I also said I'd help my friend with their resume and I keep meaning to start working out. I'm overwhelmed.",
  "Need to decide between two job offers by next week. Should ship the v2 launch announcement, prep slides for Thursday board meeting, follow up with the legal team on contract review. Also Mom's birthday is Sunday and I haven't bought a gift.",
  "Client A wants their site redesign mockups by Wednesday. Client B keeps asking for revisions on logo. I want to launch my newsletter but haven't written first issue. Quarterly taxes due in 2 weeks. Should I hire a VA?",
];

type QuestionState = {
  questionNumber: number;
  question: string;
  hint: string;
  quickOptions?: string[];
};

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

function useVoiceDump(onTranscript: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let final = "";
          let interim = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          if (final) {
            onTranscript(final);
          }
          setInterimTranscript(interim);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error);
          if (event.error === "not-allowed") {
            setError("Microphone access needed for voice input. You can still type your thoughts below.");
          } else {
            // Auto-stop, preserve captured text
            setError(`Recognition stopped: ${event.error}`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript("");
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  useEffect(() => {
    if (isListening) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isListening]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setError(null);
    setInterimTranscript("");
    try {
      recognitionRef.current.start();
      setIsListening(true);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([100]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([100]);
      }
      toast.success("Voice captured — review and analyze when ready");
    } catch (e) {
      console.error(e);
    }
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? "0" : ""}${remaining}`;
  };

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    error,
    interimTranscript,
    setInterimTranscript,
    recordingSeconds,
    formatDuration,
  };
}

function BrainDumpPage() {
  const navigate = useNavigate();
  const conductSession = useServerFn(conductBrainDumpSession);
  const { saveAnalysis } = useThinkMate();
  const isMobile = useIsMobile();

  const [phase, setPhase] = useState<"input" | "wizard">("input");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    isListening,
    isSupported: isVoiceSupported,
    startListening,
    stopListening,
    error: voiceError,
    interimTranscript,
    recordingSeconds,
    formatDuration,
  } = useVoiceDump((newTranscript) => {
    setText((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${newTranscript}` : newTranscript;
    });
  });

  const [history, setHistory] = useState<Array<{ question: string; answer: string }>>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionState | null>(null);
  const [qInput, setQInput] = useState("");
  const [animateCard, setAnimateCard] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDemo = window.localStorage.getItem("thinkmate-demo-mode") === "true";
      if (isDemo) {
        const demoText =
          "I have a project submission due this Friday, Java exam on Monday, hackathon this Sunday, need to apply for 3 internships before month end, call my team for project update, haven't started studying Unit 3, also need to pay hostel fee by tomorrow, and I got two internship offers I can't decide between — Offer A pays more but Offer B has better learning.";
        setText(demoText);
        setLoading(true);
        conductSession({
          data: { brainDump: demoText, conversationHistory: [], action: "finalize" },
        })
          .then((res) => {
            if (res.type === "result") {
              const analysis: ThinkMateAnalysis = {
                tasks: res.tasks,
                mentalLoadScore: res.mentalLoadScore,
                mentalLoadRisk: res.riskLevel,
                nextStep: res.recommendedNextStep,
                recommendation: res.sessionSummary,
              };
              saveAnalysis(demoText, analysis, {
                sessionSummary: res.sessionSummary,
                classificationExplanations: res.classificationExplanations,
                conversationHistory: [],
              });
              navigate({ to: "/dashboard" });
            }
          })
          .catch((e) => {
            setError(e instanceof Error ? e.message : "Demo analysis failed.");
            setLoading(false);
          });
      }
    }
  }, []);

  async function handleStartDump() {
    if (text.trim().length < 3) return;
    setLoading(true);
    setError(null);
    try {
      const res = await conductSession({
        data: { brainDump: text.trim(), conversationHistory: [], action: "next_question" },
      });
      if (res.type === "question") {
        setCurrentQuestion({
          questionNumber: res.questionNumber,
          question: res.question,
          hint: res.hint,
          quickOptions: res.quickOptions,
        });
        setPhase("wizard");
        setAnimateCard(true);
      } else {
        const analysis: ThinkMateAnalysis = {
          tasks: res.tasks,
          mentalLoadScore: res.mentalLoadScore,
          mentalLoadRisk: res.riskLevel,
          nextStep: res.recommendedNextStep,
          recommendation: res.sessionSummary,
        };
        saveAnalysis(text.trim(), analysis, {
          sessionSummary: res.sessionSummary,
          classificationExplanations: res.classificationExplanations,
          conversationHistory: [],
        });
        navigate({ to: "/dashboard" });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to analyze your input.");
    } finally {
      setLoading(false);
    }
  }

  async function handleNextQuestion(answerText: string) {
    if (!answerText.trim() || !currentQuestion) return;
    setLoading(true);
    setError(null);
    setAnimateCard(false);
    setSelectedOption(null);
    const updatedHistory = [...history, { question: currentQuestion.question, answer: answerText.trim() }];
    setHistory(updatedHistory);
    setQInput("");
    try {
      const res = await conductSession({
        data: { brainDump: text.trim(), conversationHistory: updatedHistory, action: "next_question" },
      });
      if (res.type === "question") {
        setCurrentQuestion({
          questionNumber: res.questionNumber,
          question: res.question,
          hint: res.hint,
          quickOptions: res.quickOptions,
        });
        setTimeout(() => setAnimateCard(true), 50);
      } else {
        const analysis: ThinkMateAnalysis = {
          tasks: res.tasks,
          mentalLoadScore: res.mentalLoadScore,
          mentalLoadRisk: res.riskLevel,
          nextStep: res.recommendedNextStep,
          recommendation: res.sessionSummary,
        };
        saveAnalysis(text.trim(), analysis, {
          sessionSummary: res.sessionSummary,
          classificationExplanations: res.classificationExplanations,
          conversationHistory: updatedHistory,
        });
        navigate({ to: "/dashboard" });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load next step.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSkipToFinalize() {
    setLoading(true);
    setError(null);
    try {
      const res = await conductSession({
        data: { brainDump: text.trim(), conversationHistory: history, action: "finalize" },
      });
      if (res.type === "result") {
        const analysis: ThinkMateAnalysis = {
          tasks: res.tasks,
          mentalLoadScore: res.mentalLoadScore,
          mentalLoadRisk: res.riskLevel,
          nextStep: res.recommendedNextStep,
          recommendation: res.sessionSummary,
        };
        saveAnalysis(text.trim(), analysis, {
          sessionSummary: res.sessionSummary,
          classificationExplanations: res.classificationExplanations,
          conversationHistory: history,
        });
        navigate({ to: "/dashboard" });
      } else {
        setError("AI returned a question instead of final result.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to finalize analysis.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div style={{ background: "var(--bg)", minHeight: "calc(100vh - 56px)", padding: "48px 20px 64px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          {phase === "input" ? (
            <div>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "36px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "var(--accent-bg)",
                    border: "1px solid var(--accent-border)",
                    borderRadius: "20px",
                    padding: "5px 14px",
                    fontSize: "11px",
                    color: "var(--accent-light)",
                    fontWeight: 500,
                    marginBottom: "20px",
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Step 1 of ~5
                </span>
                <h1
                  style={{
                    fontSize: "40px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    marginBottom: "12px",
                  }}
                >
                  What's on your mind?
                </h1>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  Tasks, worries, deadlines, decisions — type it raw. No structure required.
                </p>
              </div>

              {/* Textarea card */}
              <div
                className={cn(isListening && "animate-pulse")}
                style={{
                  background: "var(--bg-input)",
                  border: isListening ? "1px solid var(--destructive)" : "1px solid var(--border-input)",
                  boxShadow: isListening ? "0 0 0 3px rgba(239, 68, 68, 0.15)" : "none",
                  borderRadius: "12px",
                  overflow: "hidden",
                  marginBottom: "16px",
                  transition: "all 0.2s",
                }}
              >
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={loading || isListening}
                  placeholder={
                    isListening
                      ? "Listening to your thoughts... click Stop to finish recording."
                      : "I have three deadlines this week, my apartment lease ends next month, I keep meaning to call my dad, and I'm trying to decide whether to take that promotion..."
                  }
                  style={{
                    width: "100%",
                    minHeight: "260px",
                    padding: "24px",
                    background: "transparent",
                    color: "var(--text-primary)",
                    fontSize: "15px",
                    lineHeight: 1.8,
                    border: "none",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                  // @ts-ignore
                  onFocus={(e) => {
                    if (!isListening) {
                      e.currentTarget.parentElement!.style.borderColor = "var(--border-accent)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!isListening) {
                      e.currentTarget.parentElement!.style.borderColor = "var(--border-input)";
                    }
                  }}
                />
                
                {interimTranscript && (
                  <div
                    style={{
                      padding: "0 24px 16px",
                      fontSize: "14px",
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                    }}
                  >
                    {interimTranscript}...
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 24px",
                    borderTop: "1px solid var(--divider)",
                    background: "var(--bg-card)",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "var(--text-hint)", fontFamily: "monospace" }}>
                    {text.length} / 8000
                  </span>
                  
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {isVoiceSupported && !isMobile && (
                      <button
                        type="button"
                        onClick={isListening ? stopListening : startListening}
                        disabled={loading}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 600,
                          padding: "6px 14px",
                          border: isListening ? "1px solid var(--destructive)" : "1px solid var(--btn-ghost-border)",
                          background: isListening ? "var(--badge-high-bg)" : "transparent",
                          color: isListening ? "var(--badge-high-fg)" : "var(--btn-ghost-fg)",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          marginRight: "12px",
                        }}
                        onMouseEnter={(e) => {
                          if (!isListening) {
                            e.currentTarget.style.color = "var(--btn-ghost-fg-hover)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isListening) {
                            e.currentTarget.style.color = "var(--btn-ghost-fg)";
                          }
                        }}
                      >
                        {isListening ? (
                          <>
                            <Square className="w-3.5 h-3.5" /> Stop — {formatDuration(recordingSeconds)}
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5" /> Speak
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={handleStartDump}
                      disabled={loading || text.trim().length < 3 || isListening}
                      className="btn-primary"
                      style={{ fontSize: "13px", padding: "9px 20px", opacity: (loading || text.trim().length < 3 || isListening) ? 0.5 : 1 }}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      {loading ? "Thinking..." : "Analyze My Thoughts"}
                    </button>
                  </div>
                </div>
              </div>

              {isVoiceSupported && isMobile && (
                <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={loading}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: isListening ? "1px solid var(--destructive)" : "1px solid var(--accent-border)",
                      background: isListening ? "var(--badge-high-bg)" : "var(--accent-bg)",
                      color: isListening ? "var(--destructive)" : "var(--accent-light)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {isListening ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                        <Square className="w-4 h-4 text-red-500 animate-pulse" />
                        <span style={{ fontSize: "9px", fontWeight: 700 }}>{formatDuration(recordingSeconds)}</span>
                      </div>
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                </div>
              )}

              {voiceError && (
                <div
                  style={{
                    background: "var(--badge-high-bg)",
                    border: "1px solid var(--destructive)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--badge-high-fg)",
                    marginBottom: "16px",
                  }}
                >
                  {voiceError}
                </div>
              )}

              {error && (
                <div
                  style={{
                    background: "var(--badge-high-bg)",
                    border: "1px solid var(--destructive)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--badge-high-fg)",
                    marginBottom: "16px",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Sample prompts */}
              <div style={{ marginTop: "32px" }}>
                <p
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    color: "var(--text-hint)",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    marginBottom: "12px",
                  }}
                >
                  Or try a sample
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
                  {SAMPLES.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setText(s)}
                      disabled={loading}
                      style={{
                        textAlign: "left",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-card)",
                        borderRadius: "10px",
                        padding: "14px",
                        cursor: "pointer",
                        transition: "border-color 0.2s, background 0.2s",
                        opacity: loading ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-accent)";
                        (e.currentTarget as HTMLElement).style.background = "var(--accent-bg)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-card)";
                        (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
                      }}
                    >
                      <span style={{ fontFamily: "monospace", fontSize: "9px", color: "var(--accent-light)", display: "block", marginBottom: "6px" }}>
                        SAMPLE 0{i + 1}
                      </span>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {s}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ── WIZARD PHASE ── */
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Progress */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    color: "var(--accent-light)",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  Step {history.length + 2} of ~5
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: i <= history.length ? "var(--tm-accent)" : "var(--border-input)",
                        transition: "background 0.3s",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: "2px", background: "var(--border-card)", borderRadius: "2px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    background: "var(--tm-accent)",
                    width: `${history.length * 25}%`,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>

              {loading ? (
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "12px",
                    padding: "64px",
                    textAlign: "center",
                    minHeight: "300px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                >
                  <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--tm-accent)" }} />
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    ThinkMate is thinking...
                  </p>
                </div>
              ) : (
                currentQuestion && (
                  <div
                    className={animateCard ? "animate-slide-up" : ""}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-card)",
                      borderRadius: "12px",
                      padding: "32px",
                      minHeight: "300px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          fontSize: "22px",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          lineHeight: 1.3,
                          marginBottom: "24px",
                        }}
                      >
                        {currentQuestion.question}
                      </h2>

                      {currentQuestion.quickOptions && currentQuestion.quickOptions.length > 0 ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                          {currentQuestion.quickOptions.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                setSelectedOption(opt);
                                handleNextQuestion(opt);
                              }}
                              className="option-pill"
                              style={
                                selectedOption === opt
                                  ? {
                                      border: "1px solid var(--tm-accent)",
                                      background: "var(--accent-bg)",
                                      color: "var(--accent-light)",
                                      borderRadius: "20px",
                                      padding: "8px 18px",
                                      fontSize: "13px",
                                      cursor: "pointer",
                                    }
                                  : {}
                              }
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <input
                            type="text"
                            value={qInput}
                            onChange={(e) => setQInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleNextQuestion(qInput)}
                            placeholder="Type your response..."
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              background: "var(--bg-input)",
                              border: "1px solid var(--border-input)",
                              borderRadius: "10px",
                              color: "var(--text-primary)",
                              fontSize: "14px",
                              outline: "none",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-accent)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-input)")}
                          />
                          <p style={{ fontSize: "11px", color: "var(--text-hint)", fontStyle: "italic", marginTop: "8px" }}>
                            {currentQuestion.hint}
                          </p>
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                        paddingTop: "24px",
                        borderTop: "1px solid var(--divider)",
                        marginTop: "24px",
                      }}
                    >
                      <button
                        onClick={handleSkipToFinalize}
                        style={{
                          fontSize: "11px",
                          color: "var(--text-hint)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-hint)")}
                      >
                        Skip to instant analysis
                      </button>
                      {!currentQuestion.quickOptions && (
                        <button
                          onClick={() => handleNextQuestion(qInput)}
                          disabled={!qInput.trim()}
                          className="btn-primary"
                          style={{ opacity: !qInput.trim() ? 0.4 : 1, fontSize: "13px", padding: "9px 20px" }}
                        >
                          Next <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}

              {error && (
                <div
                  style={{
                    background: "var(--badge-high-bg)",
                    border: "1px solid var(--destructive)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--badge-high-fg)",
                  }}
                >
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
