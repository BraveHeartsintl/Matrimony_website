import { cn } from "@/lib/utils";

interface SplitHeadlineProps {
  as?: "h1" | "h2" | "h3";
  primary: React.ReactNode;
  muted: React.ReactNode;
  className?: string;
}

export default function SplitHeadline({
  as: Tag = "h2",
  primary,
  muted,
  className,
}: SplitHeadlineProps) {
  return (
    <Tag className={cn("font-display", className)}>
      <span className="text-foreground">{primary}</span>{" "}
      <span className="headline-split-muted">{muted}</span>
    </Tag>
  );
}
