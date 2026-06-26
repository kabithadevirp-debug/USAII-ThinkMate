import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { analyzeDecision, type ThinkMateDecision } from "@/lib/thinkmate.functions";
import { Loader2, Plus, Scale, Sparkles, Trash2, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/decide")({
  head: () => ({
    meta: [
      { title: "Decision Tool — ThinkMate AI" },
      { name: "description", content: "Compare options with a weighted matrix. The final decision is yours." },
    ],
  }),
  component: () => (
    <AuthGuard>
      <DecidePage />
    </AuthGuard>
  ),
});

function DecidePage() {
  const [decision, setDecision] = useState("");
  const [values, setValues] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ThinkMateDecision | null>(null);
  const analyze = useServerFn(analyzeDecision);

  async function submit() {
    const filtered = options.map((o) => o.trim()).filter(Boolean);
    if (decision.trim().length < 5 || filtered.length < 2) {
      setError("Describe the decision and at least 2 options.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const r = await analyze({ data: { decision: decision.trim(), options: filtered, values: values.trim() || undefined } });
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not run analysis.");
    } finally {
      setLoading(false);
    }
  }

  const winner = result ? [...result.options].sort((a, b) => b.totalScore - a.totalScore)[0] : null;

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    background: "var(--bg-input)",
    border: "1px solid var(--border-input)",
    borderRadius: "10px",
    color: "var(--text-primary)",
    fontSize: "13px",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
    lineHeight: 1.7,
  };

  return (
    <AppShell>
      <div style={{ background: "var(--bg)", minHeight: "calc(100vh - 56px)", padding: "40px 20px 60px" }}>
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div style={{ marginBottom: "36px" }}>
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
                marginBottom: "10px",
              }}
            >
              <Scale className="w-3.5 h-3.5" /> Decision Framework
            </p>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "8px" }}>
              When the answer isn't obvious
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", maxWidth: "500px", lineHeight: 1.7 }}>
              Describe a complex choice. ThinkMate builds a weighted comparison and gives a reasoned recommendation — but the final call is yours.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* ── Input Panel ── */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
                borderRadius: "12px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Decision */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    color: "var(--text-hint)",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    marginBottom: "10px",
                  }}
                >
                  The Decision
                </label>
                <textarea
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  disabled={loading}
                  rows={3}
                  placeholder="Should I accept the offer at Startup X or stay at BigCorp?"
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-input)")}
                />
              </div>

              {/* Options */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    color: "var(--text-hint)",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    marginBottom: "10px",
                  }}
                >
                  Options
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {options.map((o, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--text-hint)", width: "20px", flexShrink: 0 }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <input
                        value={o}
                        onChange={(e) => setOptions(options.map((v, j) => (j === i ? e.target.value : v)))}
                        disabled={loading}
                        placeholder={`Option ${i + 1}`}
                        style={{ ...inputStyle, fontSize: "13px" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-accent)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-input)")}
                      />
                      {options.length > 2 && (
                        <button
                          onClick={() => setOptions(options.filter((_, j) => j !== i))}
                          disabled={loading}
                          style={{ color: "var(--text-hint)", background: "none", border: "none", cursor: "pointer", padding: "4px", flexShrink: 0 }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--destructive)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-hint)")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {options.length < 6 && (
                    <button
                      onClick={() => setOptions([...options, ""])}
                      disabled={loading}
                      className="btn-secondary"
                      style={{ alignSelf: "flex-start", fontSize: "12px", padding: "6px 14px" }}
                    >
                      <Plus className="w-3.5 h-3.5" /> Add option
                    </button>
                  )}
                </div>
              </div>

              {/* Values */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    color: "var(--text-hint)",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    marginBottom: "10px",
                  }}
                >
                  What you value most{" "}
                  <span style={{ fontSize: "9px", color: "var(--text-hint)", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                </label>
                <input
                  value={values}
                  onChange={(e) => setValues(e.target.value)}
                  disabled={loading}
                  placeholder="Growth, work-life balance, financial stability..."
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-input)")}
                />
              </div>

              <button
                onClick={submit}
                disabled={loading}
                className="btn-primary"
                style={{ justifyContent: "center", width: "100%", opacity: loading ? 0.6 : 1 }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {loading ? "Weighing options..." : "Build comparison"}
              </button>

              {error && (
                <p style={{ fontSize: "13px", color: "var(--badge-high-fg)" }}>{error}</p>
              )}
            </div>

            {/* ── Result Panel ── */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
                borderRadius: "12px",
                padding: "24px",
                minHeight: "400px",
              }}
            >
              {!result ? (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                  <div>
                    <Scale className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--border-card)" }} />
                    <p style={{ fontSize: "13px", color: "var(--text-hint)" }}>
                      Your weighted comparison will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Recommendation */}
                  <div>
                    <p
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "9px",
                        letterSpacing: "0.15em",
                        color: "var(--accent-light)",
                        textTransform: "uppercase",
                        fontWeight: 500,
                        marginBottom: "10px",
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Recommendation
                    </p>
                    <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: "8px" }}>
                      {result.recommendation}
                    </h2>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{result.reasoning}</p>
                  </div>

                  {/* Comparison table */}
                  <div style={{ overflowX: "auto", borderRadius: "10px", border: "1px solid var(--border-card)" }}>
                    <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "var(--bg-card)" }}>
                          <th
                            style={{
                              padding: "10px 12px",
                              textAlign: "left",
                              fontSize: "9px",
                              letterSpacing: "0.12em",
                              color: "var(--text-secondary)",
                              textTransform: "uppercase",
                              fontWeight: 500,
                              borderBottom: "1px solid var(--divider)",
                            }}
                          >
                            Factor
                          </th>
                          {result.options.map((o) => (
                            <th
                              key={o.name}
                              style={{
                                padding: "10px 12px",
                                textAlign: "left",
                                fontSize: "9px",
                                letterSpacing: "0.12em",
                                color: winner?.name === o.name ? "var(--accent-light)" : "var(--text-secondary)",
                                textTransform: "uppercase",
                                fontWeight: 500,
                                borderBottom: "1px solid var(--divider)",
                                background: winner?.name === o.name ? "var(--accent-bg)" : "transparent",
                              }}
                            >
                              {o.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.factors.map((f) => (
                          <tr key={f.name} style={{ borderTop: "1px solid var(--divider)" }}>
                            <td style={{ padding: "10px 12px" }}>
                              <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "12px" }}>{f.name}</div>
                              <div style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "monospace", marginTop: "2px" }}>
                                weight {f.weight}
                              </div>
                            </td>
                            {result.options.map((o) => {
                              const s = o.scores.find((x) => x.factor === f.name);
                              const isWinner = winner?.name === o.name;
                              return (
                                <td
                                  key={o.name}
                                  style={{
                                    padding: "10px 12px",
                                    background: isWinner ? "var(--accent-bg)" : "transparent",
                                  }}
                                >
                                  <div style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--text-primary)", fontSize: "13px" }}>
                                    {s?.score ?? "—"}
                                  </div>
                                  {s?.reason && (
                                    <div style={{ fontSize: "10px", color: "var(--text-muted)", lineHeight: 1.4, marginTop: "2px" }}>
                                      {s.reason}
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                        <tr style={{ borderTop: "1px solid var(--divider)" }}>
                          <td style={{ padding: "12px", fontWeight: 700, fontSize: "13px", color: "var(--text-primary)" }}>Total</td>
                          {result.options.map((o) => (
                            <td
                              key={o.name}
                              style={{
                                padding: "12px",
                                background: winner?.name === o.name ? "var(--accent-bg)" : "transparent",
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "monospace",
                                  fontWeight: 700,
                                  fontSize: winner?.name === o.name ? "16px" : "13px",
                                  color: winner?.name === o.name ? "var(--accent-light)" : "var(--text-primary)",
                                }}
                              >
                                {o.totalScore.toFixed(1)}
                              </span>
                              {winner?.name === o.name && (
                                <span
                                  style={{
                                    marginLeft: "6px",
                                    fontSize: "9px",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    background: "var(--accent-bg)",
                                    color: "var(--accent-light)",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  Top
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                    <p
                      style={{
                        padding: "10px 14px",
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        fontStyle: "italic",
                        borderTop: "1px solid var(--divider)",
                      }}
                    >
                      Final decision is yours.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
