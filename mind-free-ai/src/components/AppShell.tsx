import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Brain, LayoutDashboard, Grid3x3, Scale, PenLine, Target, Moon, House, LogOut, User as UserIcon, Settings } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme-store";
import { ThemeTogglePill } from "@/components/ThemeToggle";
import * as db from "@/lib/db";
import { useThinkMate } from "@/lib/thinkmate-store";

const nav = [
  { to: "/", label: "Home", icon: House },
  { to: "/brain-dump", label: "Brain Dump", icon: PenLine },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/matrix", label: "Matrix", icon: Grid3x3 },
  { to: "/decide", label: "Decide", icon: Scale },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/reflect", label: "Reflect", icon: Moon },
] as const;

const mobileNav = nav.filter((n) => n.to !== "/" && n.to !== "/decide");

interface AppShellProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { isAuthenticated, signOut, user } = useAuth();
  const { toggleTheme, resolvedTheme } = useTheme();
  const { state } = useThinkMate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [lastSessionTime, setLastSessionTime] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDemo(window.localStorage.getItem("thinkmate-demo-mode") === "true");
      const updateHandler = () => {
        setIsDemo(window.localStorage.getItem("thinkmate-demo-mode") === "true");
      };
      window.addEventListener("thinkmate:update", updateHandler);
      db.getLatestSession().then((session) => {
        if (session && session.created_at) {
          setLastSessionTime(getRelativeTime(new Date(session.created_at).getTime()));
        }
      });
      return () => window.removeEventListener("thinkmate:update", updateHandler);
    }
  }, [isAuthenticated]);

  // ⌘ + Shift + L keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "L") {
        e.preventDefault();
        toggleTheme();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [toggleTheme]);

  function getRelativeTime(timestamp: number) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "yesterday";
    return `${days} days ago`;
  }

  const handleExitDemo = () => {
    localStorage.removeItem("thinkmate-demo-mode");
    localStorage.removeItem("thinkmate-analysis");
    localStorage.removeItem("thinkmate-tasks");
    localStorage.removeItem("thinkmate-decision");
    localStorage.removeItem("thinkmate-reflections");
    localStorage.removeItem("thinkmate-goals");
    localStorage.removeItem("thinkmate-load-history");
    localStorage.removeItem("thinkmate-session-context");
    window.location.href = "/";
  };

  const displayName = user?.display_name || user?.email?.split("@")[0] || "User";
  const avatarLetter = displayName.trim().charAt(0).toUpperCase();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)", transition: "var(--transition)" }}
    >
      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "var(--bg)",
          borderBottom: "1px solid var(--nav-border)",
          transition: "var(--transition)",
        }}
      >
        <div className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span
                className="relative grid place-items-center w-8 h-8 rounded-xl transition-transform group-hover:scale-105"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4c1d95)" }}
              >
                <Brain className="w-4.5 h-4.5 text-white" strokeWidth={2.4} />
              </span>
              <span className="flex flex-col leading-none">
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  ThinkMate
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.18em",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  Second Brain
                </span>
              </span>
            </Link>

            {/* Demo Mode Pill */}
            {isDemo && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  color: "#f59e0b",
                }}
              >
                Demo Mode
                <button
                  onClick={handleExitDemo}
                  className="hover:bg-yellow-500/20 rounded-full w-4 h-4 grid place-items-center font-bold text-[10px]"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          {!hideNav && (
            <>
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-1">
                {nav.slice(1).map((n) => {
                  const active = pathname === n.to;
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      style={{
                        fontSize: "12px",
                        color: active
                          ? "var(--nav-link-active)"
                          : "var(--nav-link)",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontWeight: active ? 600 : 400,
                        transition: "color 0.15s",
                        textDecoration: "none",
                      }}
                      className="hover:text-[var(--nav-link-hover)]"
                    >
                      {n.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Right side */}
              <div className="flex items-center gap-3">
                {isAuthenticated && (
                  <div className="hidden sm:flex flex-col text-right leading-tight">
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      Hi, {displayName}
                    </span>
                    {lastSessionTime && (
                      <span
                        style={{
                          fontSize: "10px",
                          color: "var(--text-muted)",
                        }}
                      >
                        Last: {lastSessionTime}
                      </span>
                    )}
                  </div>
                )}

                {/* Streak Flame Badge */}
                {isAuthenticated && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      background: state.streak && state.streak.current_streak > 0 ? "rgba(124, 58, 237, 0.08)" : "rgba(255, 255, 255, 0.03)",
                      border: state.streak && state.streak.current_streak > 0 ? "1px solid rgba(124, 58, 237, 0.25)" : "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "16px",
                      padding: "4.5px 10.5px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: state.streak && state.streak.current_streak > 0 ? "#a78bfa" : "rgba(255, 255, 255, 0.3)",
                      cursor: "help",
                    }}
                    title={state.streak && state.streak.current_streak > 0 ? `Current Streak: ${state.streak.current_streak} days. Keep completing your MITs!` : "No active streak. Complete today's MIT to start a streak!"}
                  >
                    <span>{state.streak && state.streak.current_streak > 0 ? "🔥" : "⚡"}</span>
                    <span>{state.streak ? state.streak.current_streak : 0}</span>
                  </div>
                )}

                {/* Theme toggle pill */}
                <ThemeTogglePill />

                {/* "New dump" pill */}
                <Link
                  to="/brain-dump"
                  onClick={() => localStorage.removeItem("thinkmate-demo-mode")}
                  className="hidden sm:inline-flex items-center gap-1.5 btn-primary"
                  style={{ fontSize: "12px", padding: "8px 16px" }}
                >
                  <PenLine className="w-3.5 h-3.5" />
                  New dump →
                </Link>

                {/* Auth dropdown */}
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center hover:opacity-90 active:scale-95 transition-transform"
                      style={{ background: "#7c3aed", color: "#ffffff" }}
                    >
                      {avatarLetter}
                    </button>
                    {showDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowDropdown(false)}
                        />
                        <div
                          className="absolute right-0 mt-2 w-52 rounded-xl p-1.5 z-50 animate-slide-up"
                          style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-card)",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                          }}
                        >
                          <div
                            className="px-3 py-2 text-xs truncate"
                            style={{
                              borderBottom: "1px solid var(--divider)",
                              color: "var(--text-muted)",
                            }}
                          >
                            {user?.email}
                          </div>
                          <Link
                            to="/dashboard"
                            onClick={() => setShowDropdown(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            <UserIcon className="w-4 h-4" /> My Dashboard
                          </Link>
                          <Link
                            to="/settings"
                            onClick={() => setShowDropdown(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            <Settings className="w-4 h-4" /> Settings
                          </Link>
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              signOut().then(() => navigate({ to: "/" }));
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left"
                            style={{ color: "#f87171" }}
                          >
                            <LogOut className="w-4 h-4" /> Sign out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  !isDemo && (
                    <Link
                      to="/login"
                      className="btn-secondary"
                      style={{ fontSize: "12px", padding: "8px 16px" }}
                    >
                      Log in
                    </Link>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1">{children}</main>

      {/* ── MOBILE NAV ── */}
      {!hideNav && (
        <nav
          className="md:hidden sticky bottom-0 z-40 backdrop-blur-xl"
          style={{
            background:
              resolvedTheme === "dark"
                ? "rgba(0,0,0,0.95)"
                : "rgba(245,244,240,0.95)",
            borderTop: "1px solid var(--nav-border)",
            transition: "var(--transition)",
          }}
        >
          <div className="grid grid-cols-5">
            {mobileNav.map((n) => {
              const active = pathname === n.to;
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  )}
                  style={{
                    color: active ? "#a78bfa" : "var(--nav-link)",
                  }}
                >
                  <Icon className="w-5 h-5" />
                  {n.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
