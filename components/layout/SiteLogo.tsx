import { SITE_LOGO, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const sizes = {
  sm: { box: "h-9 w-9", px: 36, text: "text-sm" },
  md: { box: "h-10 w-10", px: 40, text: "text-base sm:text-lg" },
  lg: { box: "h-12 w-12", px: 48, text: "text-xl" },
  xl: { box: "h-16 w-16", px: 64, text: "text-2xl" },
} as const;

type SiteLogoProps = {
  href?: string | null;
  size?: keyof typeof sizes;
  /** Show site name beside the mark. Default true so “Matrimony” is always readable. */
  withText?: boolean;
  /** `onDark` = ice text for dark panels; `onLight` = slate text for white headers. */
  variant?: "onDark" | "onLight";
  className?: string;
  priority?: boolean;
  onClick?: () => void;
};

export default function SiteLogo({
  href = "/",
  size = "md",
  withText = true,
  variant = "onLight",
  className,
  priority = false,
  onClick,
}: SiteLogoProps) {
  const s = sizes[size];

  const mark = (
    <span className={cn("inline-flex min-w-0 items-center gap-2 sm:gap-2.5", className)}>
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl border border-gold/35 bg-deepest shadow-sm",
          s.box
        )}
      >
        <Image
          src={SITE_LOGO}
          alt=""
          width={s.px}
          height={s.px}
          className="h-full w-full object-cover object-[center_35%]"
          priority={priority}
          aria-hidden
        />
      </span>
      {withText && (
          <span
            className={cn(
              "min-w-0 font-display font-bold tracking-wide leading-tight",
              s.text,
              variant === "onDark" ? "text-cream" : "text-foreground"
            )}
          >
            UK Indian Matrimony
          </span>
      )}
    </span>
  );

  if (!href) {
    return (
      <span className="inline-flex items-center" role="img" aria-label={SITE_NAME}>
        {mark}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center"
      aria-label={SITE_NAME}
      onClick={onClick}
    >
      {mark}
    </Link>
  );
}
