import { cn } from "@/lib/utils";

interface MentalLoadGaugeProps {
  score: number;
  risk: "low" | "moderate" | "high";
  size?: "sm" | "lg";
}

export function MentalLoadGauge({ score, risk, size = "lg" }: MentalLoadGaugeProps) {
  const dim = size === "lg" ? 200 : 120;
  const stroke = size === "lg" ? 14 : 10;
  const r = (dim - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score));
  const offset = c - (pct / 100) * c;

  const arcColor =
    risk === "high"   ? "#ef4444"
    : risk === "moderate" ? "#7c3aed"
    : "#22c55e";

  const scoreColor =
    risk === "high"   ? "#f87171"
    : risk === "moderate" ? "#a78bfa"
    : "#4ade80";

  const label =
    risk === "high" ? "High Risk" : risk === "moderate" ? "Moderate" : "Manageable";

  return (
    <div className="relative" style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} className="-rotate-90">
        {/* Track ring — uses CSS var */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          stroke="var(--gauge-track)"
          strokeWidth={stroke}
          fill="none"
        />
        {/* Score arc */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          stroke={arcColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 800ms cubic-bezier(.2,.7,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "font-mono font-semibold tabular-nums",
            size === "lg" ? "text-5xl" : "text-3xl",
          )}
          style={{ color: scoreColor }}
        >
          {score}
        </span>
        <span
          style={{
            fontSize: size === "lg" ? "10px" : "8px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginTop: "4px",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
