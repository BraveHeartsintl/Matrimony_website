import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "accent";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "glass-subtle text-muted border border-white/8",
    success: "glass-accent text-accent",
    warning: "glass-accent text-accent-hover",
    accent: "glass-accent text-accent",
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
