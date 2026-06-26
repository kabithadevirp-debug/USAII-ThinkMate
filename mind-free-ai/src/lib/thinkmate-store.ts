import { useEffect, useState } from "react";
import type { ThinkMateAnalysis, ThinkMateTask } from "./thinkmate.functions";
import * as db from "./db";

const KEY = "thinkmate:state:v1";

function levenshtein(s1: string, s2: string): number {
  const len1 = s1.length, len2 = s2.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= len1; i++) matrix[i] = [i];
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[len1][len2];
}

function getSimilarity(s1: string, s2: string): number {
  const l1 = s1.toLowerCase().trim();
  const l2 = s2.toLowerCase().trim();
  if (l1 === l2) return 1.0;
  const maxLength = Math.max(l1.length, l2.length);
  if (maxLength === 0) return 1.0;
  const distance = levenshtein(l1, l2);
  return (maxLength - distance) / maxLength;
}

export type StoredTask = ThinkMateTask & {
  id: string;
  completed: boolean;
  createdAt: number;
  carried_over_from?: string;
  session_id?: string | null;
  postpone_count?: number;
  is_procrastination_trigger?: boolean;
  blocker_question?: string | null;
  snooze_until?: string | null;
};

export interface ThinkMateState {
  tasks: StoredTask[];
  mentalLoadScore: number;
  mentalLoadRisk: "low" | "moderate" | "high";
  nextStep: ThinkMateAnalysis["nextStep"] | null;
  recommendation: string;
  lastBrainDump: string;
  lastUpdated: number | null;
  streak: {
    current_streak: number;
    longest_streak: number;
    last_active_at: string | null;
    last_active_date: string | null;
    total_mit_completed: number;
  } | null;
  activeCommitment: {
    id: string;
    morning_commitment: string;
    created_at: string;
  } | null;
  moodProfile: {
    stressLevel: string;
    emotionalState: string;
    toneSignals: string[];
    recommendedMode: string;
    detectedAt: number;
  } | null;
}

const empty: ThinkMateState = {
  tasks: [],
  mentalLoadScore: 0,
  mentalLoadRisk: "low",
  nextStep: null,
  recommendation: "",
  lastBrainDump: "",
  lastUpdated: null,
  streak: null,
  activeCommitment: null,
  moodProfile: null,
};

function read(): ThinkMateState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

function write(state: ThinkMateState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
  window.localStorage.setItem("thinkmate-tasks", JSON.stringify(state.tasks));
  
  const analysis: ThinkMateAnalysis & { moodProfile?: any } = {
    tasks: state.tasks,
    mentalLoadScore: state.mentalLoadScore,
    mentalLoadRisk: state.mentalLoadRisk,
    nextStep: state.nextStep || { task: "", reason: "", estimatedMinutes: 0 },
    recommendation: state.recommendation,
    moodProfile: state.moodProfile,
  };
  window.localStorage.setItem("thinkmate-analysis", JSON.stringify(analysis));
  
  window.dispatchEvent(new CustomEvent("thinkmate:update"));
}

export function useThinkMate() {
  const [state, setState] = useState<ThinkMateState>(empty);

  useEffect(() => {
    setState(read());
    const handler = () => setState(read());
    window.addEventListener("thinkmate:update", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("thinkmate:update", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return {
    state,
    saveAnalysis(brainDump: string, analysis: ThinkMateAnalysis & { moodProfile?: any }, extras?: { sessionSummary?: string; classificationExplanations?: any[]; conversationHistory?: any[]; moodProfile?: any }) {
      const tasks: StoredTask[] = analysis.tasks.map((t, i) => {
        // Ensure id is a UUID if not already formatted (for Supabase mapping)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test((t as any).id || "");
        const uuid = isUUID ? (t as any).id : (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${i}`);
        return {
          ...t,
          id: uuid,
          completed: false,
          createdAt: Date.now(),
        };
      });

      const moodProfile = extras?.moodProfile || analysis.moodProfile || null;

      const newState: ThinkMateState = {
        ...read(),
        tasks,
        mentalLoadScore: analysis.mentalLoadScore,
        mentalLoadRisk: analysis.mentalLoadRisk,
        nextStep: analysis.nextStep,
        recommendation: analysis.recommendation,
        lastBrainDump: brainDump,
        lastUpdated: Date.now(),
        moodProfile,
      };
      
      write(newState);

      // Fire-and-forget write to DB
      const sessionData = {
        brain_dump_text: brainDump,
        conversation_history: extras?.conversationHistory || [],
        analysis,
        session_summary: extras?.sessionSummary || "",
        classification_explanations: extras?.classificationExplanations || [],
      };

      db.saveSession(sessionData).then((sessionId) => {
        if (sessionId) {
          const tasksWithSession = tasks.map(t => ({ ...t, sessionId }));
          db.saveTasks(tasksWithSession);
        } else {
          db.saveTasks(tasks);
        }
      });

      db.appendLoadHistory({
        score: analysis.mentalLoadScore,
        risk_level: analysis.mentalLoadRisk,
      });

      // Procrastination trigger detection (both DB and local simulation fallback)
      const taskTitles = tasks.map(t => t.title);
      if (window.localStorage.getItem("thinkmate-demo-mode") === "true") {
        const s = read();
        const existingTasks = s.tasks.filter(t => !t.completed);
        const updatedTasks = tasks.map(t => {
          let bestMatch: any = null;
          let maxSim = 0;
          for (const old of existingTasks) {
            const sim = getSimilarity(t.title, old.title);
            if (sim > maxSim) {
              maxSim = sim;
              bestMatch = old;
            }
          }
          if (maxSim > 0.75 && bestMatch) {
            const newCount = (bestMatch.postpone_count || 0) + 1;
            return {
              ...t,
              postpone_count: newCount,
              is_procrastination_trigger: true,
              blocker_question: t.blockerQuestion || "What is a small 5-minute action you can take to get started?",
            };
          }
          return t;
        });
        write({ ...newState, tasks: updatedTasks });
      } else {
        db.detectProcrastinationTriggers(taskTitles).then((triggers) => {
          if (triggers && triggers.length > 0) {
            db.getUserTasks().then((updatedTasks) => {
              if (updatedTasks && updatedTasks.length > 0) {
                const currentS = read();
                const mapped = updatedTasks.map((t: any) => ({
                  id: t.id,
                  title: t.title,
                  priority: t.priority,
                  quadrant: t.quadrant,
                  completed: t.completed,
                  createdAt: new Date(t.created_at).getTime(),
                  estimatedMinutes: t.estimated_minutes || 15,
                  dependencies: t.dependencies || [],
                  rationale: t.rationale || "",
                  carried_over_from: t.carried_over_from || undefined,
                  session_id: t.session_id,
                  postpone_count: t.postpone_count || 0,
                  is_procrastination_trigger: t.is_procrastination_trigger || false,
                  blocker_question: t.blocker_question || null,
                  snooze_until: t.snooze_until || null,
                }));
                write({ ...currentS, tasks: mapped });
              }
            });
          }
        });
      }

      // Maintain local history cache (keep last 7)
      if (typeof window !== "undefined") {
        try {
          const rawHist = window.localStorage.getItem("thinkmate-load-history");
          const hist = rawHist ? JSON.parse(rawHist) : [];
          hist.unshift({
            date: new Date().toISOString(),
            score: analysis.mentalLoadScore,
            risk_level: analysis.mentalLoadRisk,
          });
          window.localStorage.setItem("thinkmate-load-history", JSON.stringify(hist.slice(0, 7)));
        } catch (e) {
          console.error(e);
        }
      }
    },
    
    toggleTask(id: string) {
      const s = read();
      let updatedTask: StoredTask | undefined;
      const nextTasks = s.tasks.map((t) => {
        if (t.id === id) {
          updatedTask = { ...t, completed: !t.completed };
          return updatedTask;
        }
        return t;
      });

      write({ ...s, tasks: nextTasks });

      if (updatedTask) {
        db.updateTask(id, { completed: updatedTask.completed });

        // If completed task matches nextStep.task, update streak!
        if (updatedTask.completed && s.nextStep && s.nextStep.task === updatedTask.title) {
          const completedTimeStr = new Date().toISOString();
          const completedDateStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
          
          if (window.localStorage.getItem("thinkmate-demo-mode") === "true") {
            const currentStreak = s.streak ? { ...s.streak } : { current_streak: 0, longest_streak: 0, last_active_at: null, last_active_date: null, total_mit_completed: 0 };
            
            const lastActiveAt = currentStreak.last_active_at ? new Date(currentStreak.last_active_at) : null;
            const lastActiveDateStr = currentStreak.last_active_date;
            
            let newCurrent = currentStreak.current_streak;
            let newLongest = currentStreak.longest_streak;
            let newTotal = currentStreak.total_mit_completed;

            if (!lastActiveAt || !lastActiveDateStr) {
              newCurrent = 1;
              newLongest = 1;
              newTotal = 1;
            } else {
              const lastDate = new Date(`${lastActiveDateStr}T00:00:00`);
              const compDate = new Date(`${completedDateStr}T00:00:00`);
              const oneDayMs = 24 * 60 * 60 * 1000;
              const daysDiff = Math.round((compDate.getTime() - lastDate.getTime()) / oneDayMs);

              if (daysDiff === 0) {
                // Same day: only update total and active time
                currentStreak.last_active_at = completedTimeStr;
                currentStreak.total_mit_completed += 1;
                write({ ...read(), streak: currentStreak });
                return;
              }

              const diffHours = (new Date(completedTimeStr).getTime() - lastActiveAt.getTime()) / (1000 * 60 * 60);
              const isConsecutive = daysDiff === 1;
              const withinGrace = diffHours <= 30.0;

              if (isConsecutive || withinGrace) {
                newCurrent += 1;
                newTotal += 1;
                if (newCurrent > newLongest) {
                  newLongest = newCurrent;
                }
              } else {
                newCurrent = 1;
                newTotal += 1;
              }
            }

            const simulatedStreak = {
              current_streak: newCurrent,
              longest_streak: newLongest,
              last_active_at: completedTimeStr,
              last_active_date: completedDateStr,
              total_mit_completed: newTotal,
            };

            write({ ...read(), streak: simulatedStreak });
            
            const milestoneDays = [3, 7, 14, 21, 30, 60, 100];
            if (milestoneDays.includes(simulatedStreak.current_streak)) {
              const milestoneKey = "thinkmate-streak-milestones";
              const raw = window.localStorage.getItem(milestoneKey);
              const achieved: number[] = raw ? JSON.parse(raw) : [];
              if (!achieved.includes(simulatedStreak.current_streak)) {
                achieved.push(simulatedStreak.current_streak);
                window.localStorage.setItem(milestoneKey, JSON.stringify(achieved));
                window.dispatchEvent(new CustomEvent("thinkmate:streak-milestone", {
                  detail: { streak: simulatedStreak.current_streak }
                }));
              }
            }
          } else {
            db.updateStreak(completedTimeStr, completedDateStr).then((newStreak) => {
              if (newStreak) {
                const currentS = read();
                write({ ...currentS, streak: newStreak });
                
                const milestoneDays = [3, 7, 14, 21, 30, 60, 100];
                if (milestoneDays.includes(newStreak.current_streak)) {
                  const milestoneKey = "thinkmate-streak-milestones";
                  const raw = window.localStorage.getItem(milestoneKey);
                  const achieved: number[] = raw ? JSON.parse(raw) : [];
                  if (!achieved.includes(newStreak.current_streak)) {
                    achieved.push(newStreak.current_streak);
                    window.localStorage.setItem(milestoneKey, JSON.stringify(achieved));
                    window.dispatchEvent(new CustomEvent("thinkmate:streak-milestone", {
                      detail: { streak: newStreak.current_streak }
                    }));
                  }
                }
              }
            });
          }
        }
      }
    },

    saveCommitment(commitment: string) {
      const s = read();
      const newCommitment = {
        id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}`,
        morning_commitment: commitment,
        created_at: new Date().toISOString(),
      };
      write({ ...s, activeCommitment: newCommitment });
      db.saveCommitment(commitment).then((res) => {
        if (res) {
          const currentS = read();
          write({ ...currentS, activeCommitment: res });
        }
      });
    },

    fulfillCommitment(commitmentId: string) {
      const s = read();
      write({ ...s, activeCommitment: null });
      db.fulfillCommitment(commitmentId);
    },

    snoozeTask(id: string, snoozeHours: number) {
      const s = read();
      const snoozeUntil = new Date(Date.now() + snoozeHours * 60 * 60 * 1000).toISOString();
      const nextTasks = s.tasks.map((t) => (t.id === id ? { ...t, snooze_until: snoozeUntil } : t));
      write({ ...s, tasks: nextTasks });
      db.updateTask(id, { snooze_until: snoozeUntil });
    },
    
    moveTask(id: string, quadrant: ThinkMateTask["quadrant"]) {
      const s = read();
      const nextTasks = s.tasks.map((t) => (t.id === id ? { ...t, quadrant } : t));
      write({ ...s, tasks: nextTasks });
      db.updateTask(id, { quadrant });
    },

    addTask(title: string, priority: "high" | "medium" | "low" = "medium", quadrant: ThinkMateTask["quadrant"] = "do_now", carriedOverFrom?: string) {
      const s = read();
      const uuid = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newTask: StoredTask = {
        id: uuid,
        title,
        priority,
        quadrant,
        completed: false,
        createdAt: Date.now(),
        estimatedMinutes: 15,
        dependencies: [],
        rationale: "Added manually",
        carried_over_from: carriedOverFrom,
      };

      const nextTasks = [newTask, ...s.tasks];
      write({ ...s, tasks: nextTasks });
      db.saveTasks([newTask]);
    },

    clearAll() {
      write(empty);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("thinkmate-analysis");
        window.localStorage.removeItem("thinkmate-tasks");
        window.localStorage.removeItem("thinkmate-decision");
        window.localStorage.removeItem("thinkmate-reflections");
        window.localStorage.removeItem("thinkmate-goals");
        window.localStorage.removeItem("thinkmate-load-history");
        window.localStorage.removeItem("thinkmate-session-context");
        window.localStorage.removeItem("thinkmate-streak-milestones");
      }
    },
  };
}

export async function initializeFromDB() {
  if (typeof window === "undefined") return;
  const isDemoMode = window.localStorage.getItem("thinkmate-demo-mode") === "true";
  if (isDemoMode) return;

  try {
    const [latestSession, tasks, loadHistory, streak, activeCommitment] = await Promise.all([
      db.getLatestSession(),
      db.getUserTasks(),
      db.getLoadHistory(30),
      db.getStreak(),
      db.getActiveCommitment()
    ]);

    // Hydrate tasks
    const mappedTasks: StoredTask[] = tasks.map((t: any) => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      quadrant: t.quadrant,
      completed: t.completed,
      createdAt: new Date(t.created_at).getTime(),
      estimatedMinutes: t.estimated_minutes || 15,
      dependencies: t.dependencies || [],
      rationale: t.rationale || "",
      carried_over_from: t.carried_over_from || undefined,
      session_id: t.session_id,
      postpone_count: t.postpone_count || 0,
      is_procrastination_trigger: t.is_procrastination_trigger || false,
      blocker_question: t.blocker_question || null,
      snooze_until: t.snooze_until || null,
    }));
    window.localStorage.setItem("thinkmate-tasks", JSON.stringify(mappedTasks));

    // Hydrate latest session analysis
    let score = 0;
    let risk: "low" | "moderate" | "high" = "low";
    let nextStep = null;
    let recommendation = "";
    let lastBrainDump = "";
    let moodProfile = null;

    if (latestSession) {
      const analysis = latestSession.analysis;
      score = analysis?.mentalLoadScore ?? 0;
      risk = analysis?.mentalLoadRisk ?? "low";
      nextStep = analysis?.nextStep ?? null;
      recommendation = latestSession.analysis?.recommendation || "";
      lastBrainDump = latestSession.brain_dump_text || "";
      moodProfile = analysis?.moodProfile || null;
      
      window.localStorage.setItem("thinkmate-analysis", JSON.stringify(analysis));
      window.localStorage.setItem("thinkmate-session-context", JSON.stringify({
        sessionSummary: latestSession.session_summary || "",
        classificationExplanations: latestSession.classification_explanations || [],
        conversationHistory: latestSession.conversation_history || []
      }));
    }

    // Hydrate main state v1
    const consolidatedState: ThinkMateState = {
      tasks: mappedTasks,
      mentalLoadScore: score,
      mentalLoadRisk: risk,
      nextStep,
      recommendation,
      lastBrainDump,
      lastUpdated: latestSession ? new Date(latestSession.created_at).getTime() : Date.now(),
      streak: streak || null,
      activeCommitment: activeCommitment || null,
      moodProfile: moodProfile || null,
    };
    window.localStorage.setItem(KEY, JSON.stringify(consolidatedState));

    // Hydrate load history cache (only 7 entries locally)
    const localHist = loadHistory.slice(0, 7).map((h: any) => ({
      date: h.recorded_at,
      score: h.score,
      risk_level: h.risk_level,
    }));
    window.localStorage.setItem("thinkmate-load-history", JSON.stringify(localHist));

    window.dispatchEvent(new CustomEvent("thinkmate:update"));
  } catch (err) {
    console.error("Failed to initialize state from database:", err);
  }
}

export const QUADRANTS: Record<ThinkMateTask["quadrant"], { label: string; action: string; tone: string }> = {
  do_now: { label: "Do Now", action: "Urgent + Important", tone: "risk" },
  schedule: { label: "Schedule", action: "Important, not urgent", tone: "primary" },
  delegate: { label: "Delegate", action: "Urgent, not important", tone: "warning" },
  ignore: { label: "Ignore", action: "Neither urgent nor important", tone: "muted" },
};
