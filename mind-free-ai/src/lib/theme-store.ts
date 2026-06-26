import { useState, useEffect, useCallback } from "react";

export type Theme = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

const STORAGE_KEY = "thinkmate-theme";
const DEFAULT_THEME: Theme = "dark";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === "system") return getSystemTheme();
  return theme;
}

function applyTheme(resolved: ResolvedTheme) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", resolved);
  }
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light" || stored === "system") return stored;
  } catch {}
  return DEFAULT_THEME;
}

// ─────────────────────────────────────────────────────────────────────────────
// useTheme hook
// ─────────────────────────────────────────────────────────────────────────────
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);
  const resolvedTheme: ResolvedTheme = resolveTheme(theme);

  // Apply on every change
  useEffect(() => {
    applyTheme(resolveTheme(theme));
  }, [theme]);

  // Listen for system changes when theme === 'system'
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme(getSystemTheme());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolveTheme(theme) === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, resolvedTheme, setTheme, toggleTheme };
}
