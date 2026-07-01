"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type FadeDirection = "up" | "left" | "right" | "scale";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: FadeDirection;
}

const hiddenClasses: Record<FadeDirection, string> = {
  up: "fade-in-hidden-up",
  left: "fade-in-hidden-left",
  right: "fade-in-hidden-right",
  scale: "fade-in-hidden-scale",
};

export default function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible ? "fade-in-visible" : cn("fade-in-hidden", hiddenClasses[direction]),
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
