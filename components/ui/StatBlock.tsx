import { cn } from "@/lib/utils";

interface StatBlockProps {
  value: string;
  label: string;
  description?: string;
  className?: string;
  align?: "left" | "right";
}

export default function StatBlock({
  value,
  label,
  description,
  className,
  align = "left",
}: StatBlockProps) {
  return (
    <div className={cn("stat-block", align === "right" && "text-right", className)}>
      <p className="stat-value">
        {value} <span className="stat-label">{label}</span>
      </p>
      {description && <p className="stat-description">{description}</p>}
    </div>
  );
}
