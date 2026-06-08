import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  accent?: "primary" | "accent" | "rose" | "emerald";
}

const accents = {
  primary: "from-primary/15 to-primary/5 text-primary",
  accent: "from-accent/25 to-accent/10 text-amber-700",
  rose: "from-rose-100 to-rose-50 text-rose-600",
  emerald: "from-emerald-100 to-emerald-50 text-emerald-600",
};

export default function StatCard({ label, value, icon: Icon, trend, accent = "primary" }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 opacity-60 transition-transform group-hover:scale-110" />
      <div
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br",
          accents[accent]
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="relative mt-4 text-2xl font-bold tracking-tight">{value}</p>
      <p className="relative mt-0.5 text-sm text-muted">{label}</p>
      {trend && (
        <p className="relative mt-2 text-xs font-medium text-emerald-600">{trend}</p>
      )}
    </div>
  );
}
