import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { useThinkMate } from "@/lib/thinkmate-store";
import { generateReflection } from "@/lib/thinkmate.functions";
import * as db from "@/lib/db";
import { Moon, CheckCircle2, Circle, Loader2, Sparkles, Calendar, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/reflect")({
  head: () => ({
    meta: [
      { title: "Evening Reflection — ThinkMate AI" },
      { name: "description", content: "Reflect on your achievements and plan tomorrow." },
    ],
  }),
  component: () => (
    <AuthGuard>
      <ReflectPage />
    </AuthGuard>
  ),
});

type RecapState = {
  summary: string;
  carriedOver: string[];
  tomorrowFocus: string;
  encouragement: string;
};

function ReflectPage() {
  const { state, toggleTask, addTask, saveCommitment } = useThinkMate();
  const getRecap = useServerFn(generateReflection);

  const [journal, setJournal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recap, setRecap] = useState<RecapState | null>(null);
  const [pushedTasks, setPushedTasks] = useState<Record<string, boolean>>({});
  const [commitmentInput, setCommitmentInput] = useState("");
  const [commitmentSaved, setCommitmentSaved] = useState(false);

  useEffect(() => {
    if (recap && recap.tomorrowFocus) {
      setCommitmentInput(recap.tomorrowFocus);
    }
  }, [recap]);

  const handleSaveCommitment = () => {
    if (!commitmentInput.trim()) return;
    saveCommitment(commitmentInput.trim());
    setCommitmentSaved(true);
  };

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = window.localStorage.getItem("thinkmate-reflections");
        if (cached) {
          const list = JSON.parse(cached);
          if (list && list.length > 0) {
            // Can display latest if we want
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (state.tasks.length === 0) {
    return (
      <AppShell>
        <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", maxWidth: "380px", padding: "0 20px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "14px",
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Moon className="w-7 h-7" style={{ color: "var(--accent-light)" }} />
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>Nothing to reflect on yet</h1>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "28px" }}>
              Start with a brain dump to populate tasks, then return in the evening.
            </p>
            <Link to="/brain-dump" className="btn-primary">
              Start Brain Dump
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  async function handleGenerateRecap() {
    setLoading(true);
    setError(null);
    try {
      const completedTasks = state.tasks.filter((t) => t.completed).map((t) => t.title);
      const incompleteTasks = state.tasks.filter((t) => !t.completed).map((t) => t.title);
      const res = await getRecap({
        data: { completedTasks, incompleteTasks, freeText: journal.trim() || undefined },
      });
      setRecap(res);
      const cached = window.localStorage.getItem("thinkmate-reflections");
      const reflectionsList = cached ? JSON.parse(cached) : [];
      reflectionsList.unshift(res);
      window.localStorage.setItem("thinkmate-reflections", JSON.stringify(reflectionsList));
      db.saveReflection({
        completed_tasks: completedTasks,
        incomplete_tasks: incompleteTasks,
        free_text: journal.trim(),
        summary: res.summary,
        carried_over: res.carriedOver,
        tomorrow_focus: res.tomorrowFocus,
        encouragement: res.encouragement,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate reflection recap.");
    } finally {
      setLoading(false);
    }
  }

  function handlePushToTomorrow(taskTitle: string) {
    addTask(taskTitle, "high", "do_now", new Date().toISOString().slice(0, 10));
    setPushedTasks((prev) => ({ ...prev, [taskTitle]: true }));
  }

  return (
    <AppShell>
      <div style={{ background: "var(--bg)", minHeight: "calc(100vh - 56px)", padding: "40px 20px 60px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              paddingBottom: "24px",
              borderBottom: "1px solid var(--divider)",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Moon className="w-5 h-5" style={{ color: "var(--accent-light)" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Evening Reflection</h1>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "9px",
                  letterSpacing: "0.14em",
                  color: "var(--text-hint)",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  marginTop: "2px",
                }}
              >
                <Calendar className="w-3 h-3" /> {dateStr}
              </p>
            </div>
          </div>

          {!recap ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
              {/* Task checklist */}
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "14px" }}>
                  What did you complete today?
                </h2>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {state.tasks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => toggleTask(t.id)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "14px 0",
                        background: "none",
                        border: "none",
                        borderBottom: "1px solid var(--divider)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "opacity 0.2s",
                      }}
                    >
                      <span style={{ color: t.completed ? "var(--success)" : "var(--text-hint)", flexShrink: 0 }}>
                        {t.completed ? (
                          <CheckCircle2
                            className="w-5 h-5"
                            style={{
                              width: "18px",
                              height: "18px",
                              background: "var(--tm-accent)",
                              borderRadius: "50%",
                              color: "var(--btn-primary-fg)",
                            }}
                          />
                        ) : (
                          <Circle
                            style={{
                              width: "18px",
                              height: "18px",
                              color: "var(--text-hint)",
                            }}
                          />
                        )}
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: t.completed ? "var(--text-muted)" : "var(--text-primary)",
                          textDecoration: t.completed ? "line-through" : "none",
                          lineHeight: 1.4,
                          opacity: t.completed ? 0.6 : 1,
                        }}
                      >
                        {t.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Journal textarea */}
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Anything else on your mind?
                </h2>
                <p style={{ fontSize: "12px", color: "var(--text-hint)", marginBottom: "12px" }}>
                  A stray thought, a win you want to record, or something that's still bothering you…
                </p>
                <textarea
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  placeholder="Today was highly productive, though I spent too much time on logo design revisions. Feeling glad to clear my coding targets..."
                  style={{
                    width: "100%",
                    minHeight: "130px",
                    padding: "16px",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-input)",
                    borderRadius: "10px",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    lineHeight: 1.8,
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-input)")}
                />
              </div>

              {error && (
                <div style={{ background: "var(--badge-high-bg)", border: "1px solid var(--destructive)", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", color: "var(--badge-high-fg)" }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerateRecap}
                disabled={loading}
                className="btn-primary"
                style={{ justifyContent: "center", width: "100%", opacity: loading ? 0.6 : 1 }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? "Generating Recap..." : "Generate My Recap"}
              </button>
            </div>
          ) : (
            /* ── Recap Result ── */
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-slide-up">
              {/* Summary */}
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "12px",
                  padding: "20px 24px",
                }}
              >
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
                  Accomplishment Recap
                </p>
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "15px",
                    color: "var(--text-secondary)",
                    fontStyle: "italic",
                    lineHeight: 1.7,
                  }}
                >
                  {recap.summary}
                </p>
              </div>

              {/* Carried Over */}
              {recap.carriedOver.length > 0 && (
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "12px",
                    padding: "20px 24px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.15em",
                      color: "var(--text-hint)",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      marginBottom: "14px",
                    }}
                  >
                    Carried Over to Tomorrow
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {recap.carriedOver.map((task) => (
                      <div
                        key={task}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "16px",
                          padding: "12px 14px",
                          background: "var(--bg)",
                          border: "1px solid var(--divider)",
                          borderRadius: "8px",
                        }}
                      >
                        <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
                          {task}
                        </span>
                        <button
                          onClick={() => handlePushToTomorrow(task)}
                          disabled={pushedTasks[task]}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: 600,
                            border: pushedTasks[task]
                              ? "1px solid var(--success)"
                              : "1px solid var(--accent-border)",
                            background: pushedTasks[task]
                              ? "var(--accent-bg)"
                              : "transparent",
                            color: pushedTasks[task] ? "var(--success)" : "var(--text-secondary)",
                            cursor: pushedTasks[task] ? "default" : "pointer",
                            transition: "all 0.2s",
                            flexShrink: 0,
                          }}
                          onMouseEnter={(e) => {
                            if (!pushedTasks[task]) {
                              (e.currentTarget as HTMLElement).style.background = "var(--accent-bg)";
                              (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!pushedTasks[task]) {
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                              (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                            }
                          }}
                        >
                          {pushedTasks[task] ? <Check className="w-3.5 h-3.5" /> : null}
                          {pushedTasks[task] ? "Pushed!" : "Push to Tomorrow"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tomorrow's Focus */}
              {recap.tomorrowFocus && (
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "12px",
                    padding: "20px 24px",
                  }}
                >
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
                    Tomorrow's Focus
                  </p>
                  <p
                    style={{
                      borderLeft: "2px solid var(--tm-accent)",
                      paddingLeft: "12px",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      lineHeight: 1.4,
                    }}
                  >
                    {recap.tomorrowFocus}
                  </p>
                </div>
              )}

              {/* Encouragement */}
              {recap.encouragement && (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <p
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "15px",
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                      maxWidth: "480px",
                      margin: "0 auto",
                      lineHeight: 1.7,
                    }}
                  >
                    "{recap.encouragement}"
                  </p>
                </div>
              )}

              {/* Morning Commitment Gating Card */}
              {!commitmentSaved ? (
                <div
                  style={{
                    background: "rgba(124, 58, 237, 0.03)",
                    border: "1px solid rgba(124, 58, 237, 0.15)",
                    borderRadius: "12px",
                    padding: "24px",
                    textAlign: "center",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    marginTop: "8px"
                  }}
                  className="animate-slide-up"
                >
                  <span style={{ fontSize: "24px" }}>🎯</span>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginTop: "12px", marginBottom: "6px" }}>
                    Commit to Tomorrow's Morning Focus
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: 1.6 }}>
                    Lock in one specific task you will accomplish first thing tomorrow morning. This commitment will display on your dashboard tomorrow.
                  </p>
                  
                  <input
                    type="text"
                    value={commitmentInput}
                    onChange={(e) => setCommitmentInput(e.target.value)}
                    placeholder="e.g., Read Unit 3 midterm study notes for 45 minutes"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "var(--bg-input)",
                      border: "1px solid var(--border-input)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      outline: "none",
                      marginBottom: "16px",
                      boxSizing: "border-box",
                      textAlign: "center",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-input)")}
                  />

                  <button
                    onClick={handleSaveCommitment}
                    disabled={!commitmentInput.trim()}
                    className="btn-primary"
                    style={{
                      justifyContent: "center",
                      width: "100%",
                      opacity: commitmentInput.trim() ? 1 : 0.5
                    }}
                  >
                    Commit & Save Focus
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", paddingTop: "8px" }} className="animate-fade-in">
                  <div
                    style={{
                      background: "rgba(16, 185, 129, 0.08)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      color: "var(--success)",
                      fontSize: "13px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Morning focus locked in. See you tomorrow.
                  </div>
                  
                  <Link to="/dashboard" className="btn-secondary" style={{ padding: "10px 24px" }}>
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
