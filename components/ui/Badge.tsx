import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "accent";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-surface text-muted border border-accent/10",
    success: "bg-accent-soft text-accent border border-accent/15",
    warning: "bg-gold-soft text-accent-deep border border-gold/30",
    accent: "bg-accent text-accent-foreground border border-accent/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium uppercase tracking-[0.05em]",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
