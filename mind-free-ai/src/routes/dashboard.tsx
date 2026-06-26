import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { MentalLoadGauge } from "@/components/MentalLoadGauge";
import { useThinkMate, QUADRANTS } from "@/lib/thinkmate-store";
import { ArrowRight, CheckCircle2, Circle, Clock, PenLine, Sparkles, Target, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ThinkMate AI" },
      { name: "description", content: "Your mental load score, today's top priorities, and your single smart next step." },
    ],
  }),
  component: () => (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  ),
});

type LoadHistoryItem = {
  date: string;
  score: number;
  risk_level: string;
};

type SessionContext = {
  sessionSummary: string;
  classificationExplanations: Array<{
    taskTitle: string;
    quadrant: "do_now" | "schedule" | "delegate" | "ignore";
    reason: string;
  }>;
};

function Dashboard() {
  const { state, toggleTask, saveCommitment, fulfillCommitment, snoozeTask } = useThinkMate();
  const hasData = state.lastUpdated !== null;

  const [explainExpanded, setExplainExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("thinkmate-explain-expanded") === "true";
    }
    return false;
  });

  const [loadHistory, setLoadHistory] = useState<LoadHistoryItem[]>([]);
  const [sessionContext, setSessionContext] = useState<SessionContext | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.streak) {
        import("sonner").then(({ toast }) => {
          toast.success(`🎉 Milestone Reached: ${detail.streak}-Day Streak!`, {
            description: "Incredible momentum. You're building a life-changing daily habit.",
            duration: 6000,
          });
        });
      }
    };
    window.addEventListener("thinkmate:streak-milestone", handler);
    return () => window.removeEventListener("thinkmate:streak-milestone", handler);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawHist = window.localStorage.getItem("thinkmate-load-history");
        if (rawHist) setLoadHistory(JSON.parse(rawHist));

        const rawCtx = window.localStorage.getItem("thinkmate-session-context");
        if (rawCtx) setSessionContext(JSON.parse(rawCtx));
      } catch (e) {
        console.error(e);
      }
    }
  }, [state.lastUpdated]);

  const toggleExplain = () => {
    setExplainExpanded((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("thinkmate-explain-expanded", String(next));
      }
      return next;
    });
  };

  const carriedOverTasks = useMemo(() => {
    const today = new Date().toDateString();
    return state.tasks.filter((t) => {
      const isPast = new Date(t.createdAt).toDateString() !== today;
      return !t.completed && isPast;
    });
  }, [state.tasks]);

  const sparklineData = useMemo(() => {
    if (loadHistory.length === 0) return [];
    const sorted = [...loadHistory].slice(0, 7).reverse();
    const result = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const totalSlots = 7;
    const placeholderCount = totalSlots - sorted.length;
    for (let i = 0; i < placeholderCount; i++) {
      result.push({ dayLabel: "-", score: 10, isPlaceholder: true, dateStr: "No data" });
    }
    sorted.forEach((item) => {
      const d = new Date(item.date);
      result.push({
        dayLabel: days[d.getDay()],
        score: item.score,
        isPlaceholder: false,
        dateStr: d.toLocaleDateString(),
      });
    });
    return result;
  }, [loadHistory]);

  const commentaryText = useMemo(() => {
    if (loadHistory.length < 1) return "";
    if (loadHistory.length < 3) return "Keep using ThinkMate daily to see your load trend here.";
    const last3 = loadHistory.slice(0, 3).map((h) => h.score);
    const allHigh = last3.every((s) => s > 70);
    const allLow = last3.every((s) => s < 40);
    if (allHigh) return "Your load has been high 3 days running. Consider dropping or delegating something today.";
    if (allLow) return "You've had a light few days. Good time to tackle something you've been avoiding.";
    return "Your load is fluctuating. Try to keep one consistent priority each morning.";
  }, [loadHistory]);
  const activeTasks = useMemo(() => {
    return state.tasks.filter((t) => {
      if (t.completed) return false;
      if (t.snooze_until && new Date(t.snooze_until).getTime() > Date.now()) return false;
      return true;
    });
  }, [state.tasks]);

  const top3 = useMemo(() => {
    return [...activeTasks]
      .sort((a, b) => {
        const order = { do_now: 0, schedule: 1, delegate: 2, ignore: 3 } as const;
        if (order[a.quadrant] !== order[b.quadrant]) return order[a.quadrant] - order[b.quadrant];
        const p = { high: 0, medium: 1, low: 2 } as const;
        return p[a.priority] - p[b.priority];
      })
      .slice(0, 3);
  }, [activeTasks]);

  // ── EMPTY STATE ──
  if (!hasData) {
    return (
      <AppShell>
        <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", maxWidth: "400px", padding: "0 20px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <Sparkles className="w-7 h-7" style={{ color: "var(--accent-light)" }} />
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "12px" }}>
              Your dashboard is empty
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "32px" }}>
              Do a brain dump and ThinkMate AI will fill this in with your priorities, load score, and next step.
            </p>
            <Link to="/brain-dump" className="btn-primary">
              <PenLine className="w-4 h-4" /> Start Brain Dump
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const completed = state.tasks.filter((t) => t.completed).length;
  const total = state.tasks.length;

  const priorityBadgeStyle = (priority: string) => {
    if (priority === "high")
      return { background: "var(--badge-high-bg)", color: "var(--badge-high-fg)", borderRadius: "20px", padding: "2px 8px", fontSize: "10px", fontWeight: 600 };
    if (priority === "medium")
      return { background: "var(--badge-med-bg)", color: "var(--badge-med-fg)", borderRadius: "20px", padding: "2px 8px", fontSize: "10px", fontWeight: 600 };
    return { background: "var(--badge-low-bg)", color: "var(--badge-low-fg)", borderRadius: "20px", padding: "2px 8px", fontSize: "10px", fontWeight: 600 };
  };

  return (
    <AppShell>
      <div
        style={{
          background: "var(--bg)",
          minHeight: "calc(100vh - 56px)",
          padding: "40px 20px 60px",
        }}
      >
        <div className="mx-auto max-w-6xl">
          {/* ── Morning Commitment Banner ── */}
          {state.activeCommitment && (
            <div
              className="animate-fade-in"
              style={{
                marginBottom: "24px",
                background: "rgba(124, 58, 237, 0.04)",
                border: "1px dashed rgba(124, 58, 237, 0.3)",
                borderRadius: "8px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "20px" }}>🎯</span>
                <div>
                  <span
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.15em",
                      color: "#a78bfa",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    Morning Commitment Locked
                  </span>
                  <p style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 600, marginTop: "2px", margin: 0 }}>
                    {state.activeCommitment.morning_commitment}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => fulfillCommitment(state.activeCommitment!.id)}
                  className="btn-primary"
                  style={{ fontSize: "12px", padding: "6px 14px" }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Started It
                </button>
                <button
                  onClick={() => {
                    const newCommitment = prompt("Change your morning focus:", state.activeCommitment!.morning_commitment);
                    if (newCommitment && newCommitment.trim()) {
                      saveCommitment(newCommitment.trim());
                    }
                  }}
                  className="btn-secondary"
                  style={{ fontSize: "12px", padding: "6px 14px" }}
                >
                  Reschedule
                </button>
              </div>
            </div>
          )}

          {/* ── Carried Over Banner ── */}
          {carriedOverTasks.length > 0 && (
            <div
              className="animate-fade-in"
              style={{
                marginBottom: "24px",
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                borderRadius: "8px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <AlertCircle className="w-4 h-4" style={{ color: "var(--accent-light)", flexShrink: 0 }} />
                <p style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: 500 }}>
                  {carriedOverTasks.length} task{carriedOverTasks.length > 1 ? "s" : ""} carried over from yesterday — want to review them?
                </p>
              </div>
              <Link
                to="/matrix"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "var(--accent-bg)",
                  border: "1px solid var(--accent-border)",
                  color: "var(--accent-light)",
                  borderRadius: "20px",
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Review in Matrix <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* ── Header ── */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "32px" }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: 0 }}>Your Dashboard</h1>
              <p style={{ fontSize: "12px", color: "var(--text-hint)", marginTop: "6px" }}>
                Last updated {new Date(state.lastUpdated!).toLocaleString()}
              </p>
            </div>
            <Link to="/brain-dump" className="btn-secondary" style={{ fontSize: "12px", padding: "8px 16px" }}>
              <PenLine className="w-4 h-4" /> New dump
            </Link>
          </div>

          {/* ── Top Grid: Gauge + Next Step ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", marginBottom: "32px" }}>
            {/* Left Sidebar Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Mental Load Card */}
              <div
                className="dark-card"
              style={{ padding: "28px", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <p
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  color: "var(--text-hint)",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  marginBottom: "20px",
                }}
              >
                MENTAL LOAD
              </p>
              <MentalLoadGauge score={state.mentalLoadScore} risk={state.mentalLoadRisk} />

              {/* Mood Mode Chip */}
              {state.moodProfile && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "rgba(124, 58, 237, 0.08)",
                      border: "1px solid rgba(124, 58, 237, 0.15)",
                      borderRadius: "16px",
                      padding: "5px 12px",
                      fontSize: "11px",
                      color: "#a78bfa",
                      fontWeight: 600,
                      marginTop: "16px",
                      cursor: "help"
                    }}
                    title={`Emotional State: ${state.moodProfile.emotionalState}\nRecommended Mode: ${state.moodProfile.recommendedMode}\nSignals: ${state.moodProfile.toneSignals.join(", ")}`}
                  >
                    <span>🧠 Mode: {state.moodProfile.recommendedMode}</span>
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--text-hint)", marginTop: "4px" }}>
                    COI re-weighted for <span style={{ color: "#a78bfa" }}>{state.moodProfile.emotionalState}</span> state
                  </div>
                </div>
              )}

              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  textAlign: "center",
                  lineHeight: 1.6,
                  maxWidth: "220px",
                  marginTop: "20px",
                  marginBottom: "24px",
                }}
              >
                {state.mentalLoadRisk === "high"
                  ? "High cognitive load. Consider postponing or delegating non-essentials."
                  : state.mentalLoadRisk === "moderate"
                  ? "Moderate load. Build in buffer time and protect deep work blocks."
                  : "Manageable. Keep moving with intention."}
              </p>

              {/* Sparkline */}
              {loadHistory.length > 0 && (
                <div style={{ width: "100%", borderTop: "1px solid var(--divider)", paddingTop: "20px" }}>
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
                    YOUR LOAD THIS WEEK
                  </p>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "64px", gap: "4px" }}>
                    {sparklineData.map((item, idx) => {
                      const isToday = idx === sparklineData.length - 1 && !item.isPlaceholder;
                      const height = item.isPlaceholder ? 8 : Math.max(8, (item.score / 100) * 56);
                      return (
                        <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: "4px", position: "relative" }}>
                          <div
                            title={!item.isPlaceholder ? `Score: ${item.score} (${item.dateStr})` : "No data"}
                            style={{
                              width: "100%",
                              maxWidth: "24px",
                              borderRadius: "3px 3px 0 0",
                              height: `${height}px`,
                              background: item.isPlaceholder
                                ? "var(--gauge-track)"
                                : isToday
                                ? "var(--sparkline-today)"
                                : "var(--sparkline-bar)",
                              transition: "height 0.3s",
                            }}
                          />
                          <span style={{ fontSize: "9px", color: "var(--text-hint)", fontFamily: "monospace" }}>
                            {item.dayLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {commentaryText && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        lineHeight: 1.6,
                        borderLeft: "2px solid var(--tm-accent)",
                        paddingLeft: "10px",
                        marginTop: "12px",
                        fontStyle: "italic",
                      }}
                    >
                      {commentaryText}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Momentum Streak Sidebar Card */}
            <div
              className="dark-card"
              style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <p
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  color: "var(--text-hint)",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  margin: 0
                }}
              >
                Momentum Streak
              </p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "32px" }}>
                  {state.streak && state.streak.current_streak > 0 ? "🔥" : "⚡"}
                </span>
                <div>
                  <h4 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                    {state.streak ? state.streak.current_streak : 0} Day Streak
                  </h4>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
                    Longest Streak: {state.streak ? state.streak.longest_streak : 0} days
                  </p>
                </div>
              </div>

              {/* Progress Bar towards next milestone */}
              {(() => {
                const current = state.streak ? state.streak.current_streak : 0;
                const milestones = [3, 7, 14, 21, 30, 60, 100];
                const nextMilestone = milestones.find(m => m > current) || 100;
                const prevMilestone = [...milestones].reverse().find(m => m <= current) || 0;
                const totalRange = nextMilestone - prevMilestone;
                const progressInRange = current - prevMilestone;
                const percent = Math.min(100, Math.round((progressInRange / totalRange) * 100));

                return (
                  <div style={{ marginTop: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                      <span>Milestone Progress</span>
                      <span>{current} / {nextMilestone} days</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "var(--gauge-track)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: `${percent}%`, height: "100%", background: "linear-gradient(90deg, #7c3aed, #ec4899)", borderRadius: "3px" }} />
                    </div>
                    <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "6px", fontStyle: "italic", margin: 0 }}>
                      {nextMilestone - current} days until your next milestone reward!
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Smart Next Step Card */}
            <div
              style={{
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                borderRadius: "12px",
                padding: "28px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: "-60px",
                  top: "-60px",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background: "var(--orb-glow-2)",
                  filter: "blur(40px)",
                }}
              />
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    color: "var(--accent-light)",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    marginBottom: "16px",
                  }}
                >
                  <Target className="w-3.5 h-3.5" />
                  SMART NEXT STEP
                </div>
                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    marginBottom: "16px",
                  }}
                >
                  {state.nextStep?.task}
                </h2>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "24px" }}>
                  {state.nextStep?.reason}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "var(--accent-bg)",
                      color: "var(--accent-light)",
                      borderRadius: "20px",
                      padding: "5px 12px",
                      fontSize: "11px",
                      fontWeight: 500,
                    }}
                  >
                    <Clock className="w-3.5 h-3.5" /> ≈ {state.nextStep?.estimatedMinutes} min
                  </span>
                  <Link
                    to="/matrix"
                    className="btn-secondary"
                    style={{ fontSize: "12px", padding: "5px 16px" }}
                  >
                    See full matrix →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Today's Top 3 ── */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Today's Top 3</h2>
              <span style={{ fontSize: "11px", color: "var(--text-hint)", fontFamily: "monospace" }}>
                {completed}/{total} done
              </span>
            </div>

            {top3.length === 0 ? (
              <div
                style={{
                  padding: "32px",
                  textAlign: "center",
                  fontSize: "13px",
                  color: "var(--text-hint)",
                  border: "1px dashed var(--border-card)",
                  borderRadius: "12px",
                }}
              >
                Nothing left in your top 3. Beautiful.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
                {top3.map((t, i) => {
                  const q = QUADRANTS[t.quadrant];
                  return (
                    <div
                      key={t.id}
                      className="dark-card"
                      style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "10px", color: "var(--accent-light)" }}>
                          #{String(i + 1).padStart(2, "0")}
                        </span>
                        <span style={priorityBadgeStyle(t.priority)}>{t.priority}</span>
                      </div>
                      <p
                        style={{
                          fontSize: "14px",
                          color: t.completed ? "var(--text-muted)" : "var(--text-primary)",
                          textDecoration: t.completed ? "line-through" : "none",
                          lineHeight: 1.4,
                          fontWeight: 500,
                        }}
                      >
                        {t.title}
                      </p>
                      {t.deadline && (
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>Due: {t.deadline}</p>
                      )}
                      {t.is_procrastination_trigger && (
                        <div
                          style={{
                            background: "rgba(245, 158, 11, 0.04)",
                            border: "1px solid rgba(245, 158, 11, 0.15)",
                            borderRadius: "8px",
                            padding: "10px 12px",
                            marginTop: "4px",
                            fontSize: "12px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fbbf24", fontWeight: 600 }}>
                            <span>⚠️</span> Postponed {t.postpone_count || 1}x
                          </div>
                          {t.blocker_question && (
                            <p style={{ color: "var(--text-secondary)", fontStyle: "italic", margin: 0, lineHeight: 1.4 }}>
                              "{t.blocker_question}"
                            </p>
                          )}
                          <div style={{ display: "flex", gap: "8px", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "6px", marginTop: "2px" }}>
                            <button
                              onClick={() => snoozeTask(t.id, 3)}
                              style={{ fontSize: "10px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                              className="hover:underline hover:text-[var(--text-primary)]"
                            >
                              Snooze 3h
                            </button>
                            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "10px" }}>•</span>
                            <button
                              onClick={() => snoozeTask(t.id, 24)}
                              style={{ fontSize: "10px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                              className="hover:underline hover:text-[var(--text-primary)]"
                            >
                              Snooze 1d
                            </button>
                            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "10px" }}>•</span>
                            <Link
                              to="/goals"
                              style={{ fontSize: "10px", color: "var(--accent-light)", textDecoration: "none" }}
                              className="hover:underline"
                            >
                              Break down
                            </Link>
                          </div>
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", borderTop: "1px solid var(--divider)", paddingTop: "12px" }}>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                          {t.estimatedMinutes} min
                        </span>
                        <button
                          onClick={() => toggleTask(t.id)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            fontWeight: 500,
                            color: t.completed ? "var(--success)" : "var(--text-secondary)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            transition: "color 0.15s",
                          }}
                        >
                          {t.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                          Done
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── AI Rationale Panel ── */}
          {sessionContext && sessionContext.classificationExplanations && sessionContext.classificationExplanations.length > 0 && (
            <div
              style={{
                borderRadius: "12px",
                border: "1px solid var(--border-card)",
                overflow: "hidden",
                marginBottom: "24px",
              }}
            >
              <button
                onClick={toggleExplain}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 20px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-primary)",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600 }}>
                  <Sparkles className="w-4 h-4" style={{ color: "var(--accent-light)" }} />
                  Rationale: Why ThinkMate classified your tasks
                </span>
                {explainExpanded ? (
                  <ChevronUp className="w-5 h-5" style={{ color: "var(--text-hint)" }} />
                ) : (
                  <ChevronDown className="w-5 h-5" style={{ color: "var(--text-hint)" }} />
                )}
              </button>

              {explainExpanded && (
                <div
                  className="animate-slide-up"
                  style={{
                    borderTop: "1px solid var(--divider)",
                    padding: "20px",
                    background: "var(--bg-input)",
                  }}
                >
                  {sessionContext.sessionSummary && (
                    <div
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-card)",
                        borderRadius: "8px",
                        padding: "16px",
                        marginBottom: "16px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "9px",
                          letterSpacing: "0.15em",
                          color: "var(--text-hint)",
                          textTransform: "uppercase",
                          fontWeight: 500,
                          marginBottom: "8px",
                        }}
                      >
                        Session Context Summary
                      </p>
                      <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        {sessionContext.sessionSummary}
                      </p>
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {sessionContext.classificationExplanations.map((item, idx) => {
                      const q = QUADRANTS[item.quadrant];
                      return (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                            padding: "14px",
                            borderRadius: "8px",
                            border: "1px solid var(--border-card)",
                            background: "var(--bg)",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "9px",
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              fontWeight: 700,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: "var(--accent-bg)",
                              color: "var(--accent-light)",
                              flexShrink: 0,
                              marginTop: "2px",
                            }}
                          >
                            {q.label}
                          </span>
                          <div>
                            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{item.taskTitle}</p>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: "4px" }}>
                              {item.reason}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── ThinkMate Says ── */}
          {state.recommendation && (
            <div
              style={{
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                borderRadius: "12px",
                padding: "20px 24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <Sparkles className="w-5 h-5" style={{ color: "var(--accent-light)", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <p
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.15em",
                      color: "var(--accent-light)",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      marginBottom: "8px",
                    }}
                  >
                    ThinkMate says
                  </p>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                    {state.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
