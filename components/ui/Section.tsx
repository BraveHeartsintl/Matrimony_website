import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: "base" | "surface" | "deepest" | "elevated";
}

const variants = {
  base: "",
  surface: "glass-section",
  deepest: "section-deepest",
  elevated: "glass-section",
};

export default function Section({
  className,
  variant = "base",
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("section-pad", variants[variant], className)} {...props}>
      {children}
    </section>
  );
}
