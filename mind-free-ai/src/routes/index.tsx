import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Brain, Grid3x3, Scale, Sparkles } from "lucide-react";
import { useThinkMate } from "@/lib/thinkmate-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ThinkMate AI — Your Personal Thinking Partner" },
      {
        name: "description",
        content:
          "ThinkMate AI is an AI-powered second brain. Dump everything on your mind and get one focused next step, a mental load score, and a clear plan.",
      },
      { property: "og:title", content: "ThinkMate AI — Your Personal Thinking Partner" },
      {
        property: "og:description",
        content: "Brain dump → structured tasks, mental load score, and your single most important next step.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { state } = useThinkMate();

  const mentalLoadScore = state.mentalLoadScore ?? 42;
  const mentalLoadRisk = state.mentalLoadRisk ?? "moderate";
  const nextStep = state.nextStep ?? { task: "Review project scope", estimatedMinutes: 25 };

  const riskLabel =
    mentalLoadRisk === "high" ? "High Risk ↑"
    : mentalLoadRisk === "moderate" ? "Moderate →"
    : "Manageable ✓";

  const riskColor =
    mentalLoadRisk === "high" ? "var(--badge-high-fg)"
    : mentalLoadRisk === "moderate" ? "var(--badge-med-fg)"
    : "var(--success)";

  return (
    <AppShell>
      {/* ══════════════════════ HERO — 3-column ══════════════════════ */}
      <section
        style={{
          background: "var(--bg)",
          padding: "80px 0 0",
          position: "relative",
          overflow: "hidden",
          transition: "var(--transition)",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "300px",
            background: "radial-gradient(ellipse at 50% 0%, var(--orb-glow-1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="mx-auto max-w-6xl px-5"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 260px 1fr",
            gap: "40px",
            alignItems: "center",
            minHeight: "420px",
          }}
        >
          {/* ── LEFT: Text ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid var(--border-card)",
                borderRadius: "20px",
                padding: "5px 12px",
                width: "fit-content",
              }}
            >
              <span
                className="animate-pulse-dot"
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "var(--tm-accent)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.14em",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                USAII GLOBAL HACKATHON · PRODUCTIVITY
              </span>
            </span>

            {/* H1 */}
            <h1
              className="hero-h1"
              style={{
                fontSize: "46px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Think less about{" "}
              <em
                style={{
                  fontStyle: "normal",
                  color: "var(--text-secondary)",
                }}
              >
                what to do.
              </em>
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                maxWidth: "280px",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Dump everything on your mind. ThinkMate organises it, scores your
              load, and surfaces the{" "}
              <strong style={{ color: "var(--text-secondary)" }}>
                one next step
              </strong>{" "}
              worth doing.
            </p>

            {/* CTA Row */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                to="/brain-dump"
                onClick={() => localStorage.removeItem("thinkmate-demo-mode")}
                className="btn-primary"
              >
                Start brain dump
              </Link>
              <Link
                to="/brain-dump"
                onClick={() => localStorage.setItem("thinkmate-demo-mode", "true")}
                className="btn-secondary"
              >
                See a live demo
              </Link>
            </div>
          </div>

          {/* ── CENTER: The Orb ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "215px",
                height: "215px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Outer ring 1 */}
              <div
                className="animate-breathe-outer"
                style={{
                  position: "absolute",
                  width: "215px",
                  height: "215px",
                  borderRadius: "50%",
                  border: "1px solid var(--orb-ring-3)",
                }}
              />
              {/* Outer ring 2 */}
              <div
                className="animate-breathe-slow"
                style={{
                  position: "absolute",
                  width: "190px",
                  height: "190px",
                  borderRadius: "50%",
                  border: "1px solid var(--orb-ring-2)",
                }}
              />
              {/* Inner ring */}
              <div
                className="animate-breathe"
                style={{
                  position: "absolute",
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  border: "1px solid var(--orb-ring-1)",
                }}
              />
              {/* Glow bg */}
              <div
                className="animate-breathe orb-glow"
                style={{
                  position: "absolute",
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, var(--orb-glow-1) 0%, var(--orb-glow-2) 50%, transparent 75%)",
                  transform: "scale(1.15)",
                }}
              />
              {/* Core */}
              <div
                className="animate-core-pulse orb-core"
                style={{
                  position: "relative",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 38% 38%, #a78bfa, #7c3aed 60%, #4c1d95)",
                  zIndex: 1,
                }}
              />

              {/* Floating Card 1 — bottom-left */}
              <div
                className="float-card floating-card animate-float"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "-30px",
                  zIndex: 10,
                  minWidth: "110px",
                }}
              >
                <div className="label-upper" style={{ marginBottom: "4px" }}>
                  MENTAL LOAD
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    lineHeight: 1,
                  }}
                >
                  {mentalLoadScore}
                </div>
                <div style={{ fontSize: "10px", color: riskColor, marginTop: "2px" }}>
                  {riskLabel}
                </div>
              </div>

              {/* Floating Card 2 — top-right */}
              <div
                className="float-card floating-card animate-float-2"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "-40px",
                  zIndex: 10,
                  minWidth: "140px",
                }}
              >
                <div className="label-upper" style={{ marginBottom: "4px" }}>
                  SMART NEXT STEP
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    lineHeight: 1.3,
                  }}
                >
                  {nextStep.task}
                </div>
                <div style={{ fontSize: "10px", color: "var(--accent-light)", marginTop: "2px" }}>
                  Do now · ~{nextStep.estimatedMinutes} min
                </div>
              </div>
            </div>

            {/* Orb label */}
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.15em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              COGNITIVE OVERLOAD INDEX
            </span>
          </div>

          {/* ── RIGHT: Label stack ── */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              { text: "FOR CLEARING YOUR MIND", active: true },
              { text: "TO PRIORITISE WHAT MATTERS", active: false },
              { text: "DECIDED BY AI · APPROVED BY YOU", active: false },
              { text: "BUILT IN 24 HOURS", active: false },
            ].map((item, i) => (
              <div
                key={i}
                className={item.active ? "feature-line active" : "feature-line"}
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid var(--divider)",
                  fontSize: "10px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: item.active ? "var(--text-secondary)" : "var(--text-muted)",
                  fontWeight: 500,
                  cursor: "default",
                  transition: "color 0.2s",
                }}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* ══ METRICS ROW ══ */}
        <div
          className="mx-auto max-w-6xl"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            borderTop: "1px solid var(--divider)",
            borderBottom: "1px solid var(--divider)",
            marginTop: "64px",
          }}
        >
          {[
            { value: "5+", label: "AI-POWERED VIEWS" },
            { value: "2–4s", label: "FROM DUMP TO CLARITY" },
            { value: "100%", label: "YOUR DECISION, ALWAYS" },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                padding: "28px 40px",
                borderRight: i < 2 ? "1px solid var(--divider)" : "none",
              }}
            >
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  marginTop: "6px",
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ FEATURES STRIP ══════════════════════ */}
      <section
        style={{
          background: "var(--bg)",
          borderTop: "1px solid var(--divider)",
          transition: "var(--transition)",
        }}
      >
        <div
          className="mx-auto max-w-6xl"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}
        >
          {featureItems.map((f, i) => (
            <div
              key={f.name}
              style={{
                padding: "24px 24px 24px 40px",
                borderRight: i < 3 ? "1px solid var(--divider)" : "none",
                cursor: "default",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "var(--bg-card-hover)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "transparent")
              }
            >
              <div style={{ fontSize: "18px", color: "var(--accent-light)", marginBottom: "10px" }}>
                <f.icon className="w-5 h-5" />
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  marginBottom: "6px",
                }}
              >
                {f.name}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ TICKER BAR ══════════════════════ */}
      <div
        style={{
          background: "var(--bg)",
          borderTop: "1px solid var(--divider)",
          padding: "14px 0",
          overflowX: "auto",
          transition: "var(--transition)",
        }}
      >
        <div
          className="mx-auto max-w-6xl px-5"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            whiteSpace: "nowrap",
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: "var(--text-hint)",
            textTransform: "uppercase",
          }}
        >
          {[
            "BRAIN DUMP",
            "AI EXTRACTION",
            "EISENHOWER SORT",
            "COI SCORE",
            "SMART NEXT STEP",
            "REFLECT & CARRY FORWARD",
            "NO SIGNUP REQUIRED",
          ].map((step, i, arr) => (
            <span
              key={step}
              className="ticker-item"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              {step}
              {i < arr.length - 1 && (
                 <span style={{ color: "var(--tm-accent)" }}>→</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

const featureItems = [
  {
    icon: Brain,
    name: "Brain Dump",
    desc: "Type everything raw — tasks, worries, deadlines, decisions. No templates.",
  },
  {
    icon: Grid3x3,
    name: "Eisenhower Matrix",
    desc: "AI-classified tasks sorted by urgency × importance. Drag to override.",
  },
  {
    icon: Scale,
    name: "Decision Framework",
    desc: "Weighted comparisons for choices that actually matter. Final call is yours.",
  },
  {
    icon: Sparkles,
    name: "Evening Reflect",
    desc: "End-of-day recap that carries unfinished work into tomorrow's plan.",
  },
];
