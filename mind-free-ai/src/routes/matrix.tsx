import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useThinkMate, QUADRANTS } from "@/lib/thinkmate-store";
import type { ThinkMateTask } from "@/lib/thinkmate.functions";
import { CheckCircle2, Circle, Clock, PenLine } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/matrix")({
  head: () => ({
    meta: [
      { title: "Eisenhower Matrix — ThinkMate AI" },
      { name: "description", content: "Your tasks classified by urgency and importance." },
    ],
  }),
  component: () => (
    <AuthGuard>
      <MatrixPage />
    </AuthGuard>
  ),
});

const QUADRANT_ORDER: Array<ThinkMateTask["quadrant"]> = ["do_now", "schedule", "delegate", "ignore"];

// Static dot + header accent colors (these don't change with theme)
const QUADRANT_META: Record<string, { dotColor: string; headerColor: string; cssClass: string }> = {
  do_now:   { dotColor: "var(--quad-do-now-dot)", headerColor: "var(--quad-do-now-header)", cssClass: "matrix-quad-do-now" },
  schedule: { dotColor: "var(--quad-schedule-dot)", headerColor: "var(--quad-schedule-header)",  cssClass: "matrix-quad-schedule" },
  delegate: { dotColor: "var(--quad-delegate-dot)", headerColor: "var(--quad-delegate-header)",  cssClass: "matrix-quad-delegate" },
  ignore:   { dotColor: "var(--quad-ignore-dot)", headerColor: "var(--quad-ignore-header)", cssClass: "matrix-quad-ignore" },
};

// Dynamic themed inline styles using custom properties
const QUADRANT_STYLE: Record<string, { background: string; border: string; boxShadow: string }> = {
  do_now:   { background: "var(--quad-do-now-bg)", border: "var(--quad-do-now-border)", boxShadow: "var(--quad-do-now-shadow)" },
  schedule: { background: "var(--quad-schedule-bg)", border: "var(--quad-schedule-border)", boxShadow: "var(--quad-schedule-shadow)" },
  delegate: { background: "var(--quad-delegate-bg)", border: "var(--quad-delegate-border)", boxShadow: "var(--quad-delegate-shadow)" },
  ignore:   { background: "var(--quad-ignore-bg)", border: "var(--quad-ignore-border)", boxShadow: "var(--quad-ignore-shadow)" },
};

function MatrixPage() {
  const { state, toggleTask, moveTask } = useThinkMate();

  if (state.tasks.length === 0) {
    return (
      <AppShell>
        <div
          style={{
            minHeight: "calc(100vh - 56px)",
            background: "var(--bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "var(--transition)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "380px", padding: "0 20px" }}>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "12px",
              }}
            >
              No tasks yet
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginBottom: "28px",
                lineHeight: 1.7,
              }}
            >
              Drop a brain dump first and we'll build your matrix.
            </p>
            <Link to="/brain-dump" className="btn-primary">
              <PenLine className="w-4 h-4" /> Start Brain Dump
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div
        style={{
          background: "var(--bg)",
          minHeight: "calc(100vh - 56px)",
          padding: "40px 20px 60px",
          transition: "var(--transition)",
        }}
      >
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <p
              style={{
                fontSize: "9px",
                letterSpacing: "0.15em",
                color: "var(--accent-light)",
                textTransform: "uppercase",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              Eisenhower Matrix
            </p>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                marginBottom: "6px",
              }}
            >
              Sort by what actually matters
            </h1>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Drag tasks across quadrants to override the AI.
            </p>
          </div>

          {/* 2×2 Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {QUADRANT_ORDER.map((q) => {
              const meta = QUADRANTS[q];
              const accent = QUADRANT_META[q];
              const dynamicStyle = QUADRANT_STYLE[q];
              const tasks = state.tasks.filter((t) => t.quadrant === q);

              return (
                <div
                  key={q}
                  className={accent.cssClass}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const id = e.dataTransfer.getData("text/plain");
                    if (id) moveTask(id, q);
                  }}
                  style={{
                    ...dynamicStyle,
                    borderRadius: "12px",
                    padding: "20px",
                    minHeight: "280px",
                    display: "flex",
                    flexDirection: "column",
                    transition: "var(--transition)",
                  }}
                >
                  {/* Quadrant Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: accent.dotColor,
                            flexShrink: 0,
                          }}
                        />
                        <h2
                          style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: accent.headerColor,
                          }}
                        >
                          {meta.label}
                        </h2>
                      </div>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          marginTop: "2px",
                          paddingLeft: "16px",
                        }}
                      >
                        {meta.action}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-hint)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {tasks.length}
                    </span>
                  </div>

                  {/* Tasks */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                    {tasks.length === 0 ? (
                      <div
                        style={{
                          flex: 1,
                          minHeight: "100px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          color: "var(--text-hint)",
                          border: "1px dashed var(--border-card)",
                          borderRadius: "8px",
                        }}
                      >
                        Drop tasks here
                      </div>
                    ) : (
                      tasks.map((t) => (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData("text/plain", t.id)}
                          style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-card)",
                            borderRadius: "8px",
                            padding: "10px 12px",
                            cursor: "grab",
                            opacity: t.completed ? 0.4 : 1,
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLElement).style.background = "var(--bg-card-hover)")
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLElement).style.background = "var(--bg-card)")
                          }
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                            <button
                              onClick={() => toggleTask(t.id)}
                              style={{
                                color: t.completed ? "var(--success)" : "var(--text-muted)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                marginTop: "1px",
                                padding: 0,
                                flexShrink: 0,
                              }}
                            >
                              {t.completed ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p
                                style={{
                                  fontSize: "13px",
                                  color: "var(--text-primary)",
                                  fontWeight: 500,
                                  lineHeight: 1.4,
                                  textDecoration: t.completed ? "line-through" : "none",
                                }}
                              >
                                {t.title}
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  marginTop: "6px",
                                  fontSize: "10px",
                                  color: "var(--text-muted)",
                                }}
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "3px",
                                    fontFamily: "var(--font-mono)",
                                  }}
                                >
                                  <Clock className="w-3 h-3" /> {t.estimatedMinutes}m
                                </span>
                                {t.deadline && <span>· {t.deadline}</span>}
                                <span
                                  style={{
                                    padding: "1px 6px",
                                    borderRadius: "4px",
                                    background: "var(--bg-input)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    fontSize: "9px",
                                  }}
                                >
                                  {t.priority}
                                </span>
                              </div>
                              {t.rationale && (
                                <p
                                  style={{
                                    fontSize: "11px",
                                    color: "var(--text-hint)",
                                    fontStyle: "italic",
                                    lineHeight: 1.5,
                                    marginTop: "6px",
                                  }}
                                >
                                  {t.rationale}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
