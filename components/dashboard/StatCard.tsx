import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  accent?: "default" | "accent";
  href?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "default",
  href,
}: StatCardProps) {
  const content = (
    <div className="glass glass-hover h-full rounded-[10px] p-5 transition-colors">
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

  if (!href) return content;

  if (href.startsWith("#")) {
    return (
      <a href={href} className="block h-full cursor-pointer" aria-label={`Open ${label}`}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full cursor-pointer" aria-label={`Open ${label}`}>
      {content}
    </Link>
  );
}
