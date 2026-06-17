import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  accent?: "default" | "accent";
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "default",
}: StatCardProps) {
  return (
    <div className="glass glass-hover rounded-[10px] p-5 transition-colors">
      <div
        className={cn(
          "glass-subtle flex h-11 w-11 items-center justify-center rounded-[8px]",
          accent === "accent" && "glass-accent"
        )}
      >
        <Icon className={cn("h-5 w-5 text-foreground", accent === "accent" && "text-accent")} />
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-0.5 text-sm text-muted">{label}</p>
      {trend && <p className="mt-2 text-xs font-medium text-accent">{trend}</p>}
    </div>
  );
}
