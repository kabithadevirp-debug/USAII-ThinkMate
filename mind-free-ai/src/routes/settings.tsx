import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ThemeToggleSegmented } from "@/components/ThemeToggle";
import { AuthGuard } from "@/components/AuthGuard";
import { Palette, Keyboard } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ThinkMate AI" },
      { name: "description", content: "Manage your ThinkMate preferences." },
    ],
  }),
  component: () => (
    <AuthGuard>
      <SettingsPage />
    </AuthGuard>
  ),
});

function SettingsPage() {
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
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          {/* Page header */}
          <div style={{ marginBottom: "40px" }}>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              Settings
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Manage your ThinkMate preferences.
            </p>
          </div>

          {/* ── APPEARANCE SECTION ── */}
          <section
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-card)",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "20px",
              transition: "var(--transition)",
            }}
          >
            {/* Section header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--divider)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Palette className="w-4 h-4" style={{ color: "var(--accent-light)" }} />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Appearance
              </span>
            </div>

            {/* Theme row */}
            <div style={{ padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "24px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "4px",
                    }}
                  >
                    Theme
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    Choose how ThinkMate looks for you.
                    <br />
                    <span style={{ color: "var(--text-hint)" }}>
                      "System" follows your device's preference automatically.
                    </span>
                  </p>
                </div>
                <ThemeToggleSegmented />
              </div>
            </div>
          </section>

          {/* ── KEYBOARD SHORTCUTS SECTION ── */}
          <section
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-card)",
              borderRadius: "12px",
              overflow: "hidden",
              transition: "var(--transition)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--divider)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Keyboard className="w-4 h-4" style={{ color: "var(--accent-light)" }} />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Keyboard Shortcuts
              </span>
            </div>

            <div style={{ padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: "1px solid var(--divider)",
                }}
              >
                <span
                  style={{ fontSize: "13px", color: "var(--text-secondary)" }}
                >
                  Toggle theme
                </span>
                <div style={{ display: "flex", gap: "4px" }}>
                  {["⌘", "⇧", "L"].map((key) => (
                    <kbd
                      key={key}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "24px",
                        height: "24px",
                        padding: "0 6px",
                        borderRadius: "5px",
                        fontSize: "12px",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 600,
                        background: "var(--bg-input)",
                        border: "1px solid var(--border-input)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
                <span
                  style={{ fontSize: "13px", color: "var(--text-secondary)" }}
                >
                  Go to Brain Dump
                </span>
                <div style={{ display: "flex", gap: "4px" }}>
                  {["⌘", "⇧", "B"].map((key) => (
                    <kbd
                      key={key}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "24px",
                        height: "24px",
                        padding: "0 6px",
                        borderRadius: "5px",
                        fontSize: "12px",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 600,
                        background: "var(--bg-input)",
                        border: "1px solid var(--border-input)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
