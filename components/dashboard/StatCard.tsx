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
    <div className="glass glass-hover h-full rounded-[10px] p-4 transition-colors sm:p-5">
      <div
        className={cn(
          "glass-subtle flex h-10 w-10 items-center justify-center rounded-[8px] sm:h-11 sm:w-11",
          accent === "accent" && "glass-accent"
        )}
      >
        <Icon className={cn("h-5 w-5 text-foreground", accent === "accent" && "text-accent")} />
      </div>
      <p className="mt-3 text-xl font-bold tracking-tight text-foreground sm:mt-4 sm:text-2xl">{value}</p>
      <p className="mt-0.5 text-xs text-muted sm:text-sm">{label}</p>
      {trend && <p className="mt-1.5 text-xs font-medium text-accent sm:mt-2">{trend}</p>}
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
