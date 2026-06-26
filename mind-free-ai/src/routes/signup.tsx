import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const signupSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/signup")({
  validateSearch: (search) => signupSearchSchema.parse(search),
  component: SignupPage,
});

function SignupPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "var(--divider)" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[a-zA-Z]/.test(password) && /[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    if (score <= 1) return { score: 1, label: "Weak", color: "#ef4444" };
    if (score <= 3) return { score: 2, label: "Fair", color: "#f59e0b" };
    return { score: 3, label: "Strong", color: "#22c55e" };
  }, [password]);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !displayName) return;
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        setError(error.message || "Failed to create account.");
      } else {
        navigate({ to: redirect || "/dashboard" });
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    background: "var(--bg-input)",
    border: "1px solid var(--border-input)",
    borderRadius: "10px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "9px",
    letterSpacing: "0.15em",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    fontWeight: 500,
    marginBottom: "8px",
  };
  const focusOn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "var(--border-accent)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.08)";
  };
  const focusOff = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "var(--border-input)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <AppShell hideNav>
      <div
        style={{
          minHeight: "calc(100vh - 56px)",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          transition: "var(--transition)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            borderRadius: "16px",
            padding: "40px",
            transition: "var(--transition)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: "8px",
              }}
            >
              Create account
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Start mapping your second brain.
            </p>
          </div>

          <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label htmlFor="displayName" style={labelStyle}>Display Name</label>
              <input
                id="displayName"
                type="text"
                required
                disabled={loading}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex"
                style={{ ...inputStyle, opacity: loading ? 0.5 : 1 }}
                onFocus={focusOn}
                onBlur={focusOff}
              />
            </div>

            <div>
              <label htmlFor="email" style={labelStyle}>Email Address</label>
              <input
                id="email"
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ ...inputStyle, opacity: loading ? 0.5 : 1 }}
                onFocus={focusOn}
                onBlur={focusOff}
              />
            </div>

            <div>
              <label htmlFor="password" style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: "44px", opacity: loading ? 0.5 : 1 }}
                  onFocus={focusOn}
                  onBlur={focusOff}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {password && (
                <div style={{ marginTop: "8px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "10px",
                      color: "var(--text-muted)",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 500,
                    }}
                  >
                    <span>Strength</span>
                    <span style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                  </div>
                  <div
                    style={{
                      height: "3px",
                      background: "var(--border-input)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(passwordStrength.score / 3) * 100}%`,
                        background: passwordStrength.color,
                        borderRadius: "2px",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                disabled={loading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle, opacity: loading ? 0.5 : 1 }}
                onFocus={focusOn}
                onBlur={focusOff}
              />
            </div>

            {error && (
              <div
                style={{
                  background: "var(--badge-high-bg)",
                  border: "1px solid var(--badge-high-fg)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  fontSize: "12px",
                  color: "var(--badge-high-fg)",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ justifyContent: "center", width: "100%", marginTop: "4px", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Create account
            </button>
          </form>

          <p
            style={{
              marginTop: "28px",
              textAlign: "center",
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              search={{ redirect }}
              style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AppShell>
  );
}
