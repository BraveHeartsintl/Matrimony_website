import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
}

export default function Card({
  className,
  padding = "md",
  hover = false,
  children,
  ...props
}: CardProps) {
  const paddings = {
    sm: "p-4",
    md: "p-8",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-[14px] glass glass-hover shadow-sm",
        hover && "hover:border-accent/35",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
