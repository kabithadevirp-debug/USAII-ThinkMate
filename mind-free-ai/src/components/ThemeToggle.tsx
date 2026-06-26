import { useTheme, type Theme } from "@/lib/theme-store";

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT A — Pill Toggle (for nav bar)
// ─────────────────────────────────────────────────────────────────────────────
export function ThemeTogglePill() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode (⌘⇧L)" : "Switch to dark mode (⌘⇧L)"}
      style={{
        position: "relative",
        width: "44px",
        height: "24px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        background: isDark ? "#7c3aed" : "#d4a843",
        flexShrink: 0,
        transition: "background 0.3s ease",
        padding: 0,
      }}
    >
      {/* Thumb */}
      <span
        style={{
          position: "absolute",
          top: "3px",
          left: isDark ? "23px" : "3px",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          background: "#ffffff",
          transition: "left 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          lineHeight: 1,
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT B — Segmented 3-way (for settings page)
// ─────────────────────────────────────────────────────────────────────────────
const THEME_OPTIONS: Array<{ value: Theme; icon: string; label: string }> = [
  { value: "light", icon: "☀️", label: "Light" },
  { value: "dark", icon: "🌙", label: "Dark" },
  { value: "system", icon: "💻", label: "System" },
];

export function ThemeToggleSegmented() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      role="group"
      aria-label="Theme selector"
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "20px",
        padding: "3px",
        gap: "2px",
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
      }}
    >
      {THEME_OPTIONS.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            aria-label={opt.label}
            aria-pressed={active}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              background: active ? "#ffffff" : "transparent",
              boxShadow: active ? "0 1px 4px rgba(0,0,0,0.15)" : "none",
              transition: "background 0.2s ease, box-shadow 0.2s ease",
            }}
            title={opt.label}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT C — Icon + Label pill (for mobile/sidebar)
// ─────────────────────────────────────────────────────────────────────────────
export function ThemeToggleIconLabel() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        border: "1px solid var(--accent-border)",
        background: "var(--accent-bg)",
        color: "var(--accent)",
        borderRadius: "20px",
        padding: "6px 14px",
        fontSize: "11px",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "var(--transition)",
      }}
    >
      {isDark ? "🌙" : "☀️"}
      {isDark ? "Dark" : "Light"}
    </button>
  );
}
