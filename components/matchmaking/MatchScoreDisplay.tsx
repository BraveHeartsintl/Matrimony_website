import Badge from "@/components/ui/Badge";
import type { MatchScoreResult } from "@/lib/matchmaking/calculateMatchScore";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

interface MatchScoreDisplayProps {
  result: MatchScoreResult;
  variant?: "compact" | "full";
  className?: string;
  /** When true, badge is positioned for image overlay (search cards). */
  overlay?: boolean;
  /** Hide the percentage badge (e.g. when shown separately on overlay). */
  showBadge?: boolean;
}

function badgeVariant(score: number): "success" | "accent" | "warning" | "default" {
  if (score >= 80) return "success";
  if (score >= 60) return "accent";
  if (score >= 40) return "warning";
  return "default";
}

export default function MatchScoreDisplay({
  result,
  variant = "compact",
  className,
  overlay = false,
  showBadge = true,
}: MatchScoreDisplayProps) {
  const { score, label, strengths, concerns } = result;
  const badge = (
    <Badge variant={badgeVariant(score)} className="font-semibold normal-case tracking-normal">
      <Sparkles className="mr-1 h-3 w-3" />
      {score}% Match
    </Badge>
  );

  if (overlay) {
    return (
      <div className={cn("absolute left-3 top-3", className)}>
        {badge}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex flex-wrap items-center gap-2">
          {showBadge && badge}
          <span className="text-xs font-medium text-muted">{label}</span>
        </div>
        {strengths.length > 0 && (
          <ul className="space-y-0.5">
            {strengths.slice(0, 3).map((s) => (
              <li key={s} className="flex items-start gap-1.5 text-xs text-muted">
                <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                <span className="line-clamp-1">{s}</span>
              </li>
            ))}
          </ul>
        )}
        {concerns.length > 0 && (
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-gold" />
            <span className="line-clamp-1">{concerns[0]}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[12px] border border-accent/15 bg-accent-soft/40 p-4 sm:p-5",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        {badge}
        <span className="text-sm font-semibold text-foreground">{label}</span>
      </div>
      <p className="mt-2 text-sm text-muted">{result.explanation}</p>

      {strengths.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Why you match
          </p>
          <ul className="mt-2 space-y-1.5">
            {strengths.slice(0, 3).map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {concerns.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Things to consider
          </p>
          <ul className="mt-2 space-y-1.5">
            {concerns.slice(0, 2).map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-muted">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
