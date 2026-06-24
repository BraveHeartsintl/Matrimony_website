import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", children, ...props }, ref) => {
    const variants = {
      primary:
        "bg-accent text-accent-foreground hover:bg-accent-hover uppercase tracking-[0.06em] font-semibold shadow-[0_4px_24px_rgba(155,45,92,0.28)]",
      secondary:
        "glass text-foreground border border-accent/15 hover:border-accent/35 glass-hover uppercase tracking-[0.06em] font-semibold",
      outline:
        "glass-subtle glass-btn-outline border border-accent/30 text-accent uppercase tracking-[0.06em] font-semibold",
      ghost: "text-muted hover:text-accent uppercase tracking-[0.06em] font-medium",
      accent:
        "bg-gold text-white hover:bg-gold-hover uppercase tracking-[0.06em] font-semibold shadow-[0_4px_20px_rgba(201,149,108,0.35)]",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-7 py-3.5 text-sm",
      lg: "px-7 py-3.5 text-sm",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-[4px] transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
