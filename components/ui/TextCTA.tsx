import { cn } from "@/lib/utils";
import Link from "next/link";

interface TextCTAProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function TextCTA({ href, children, className }: TextCTAProps) {
  const classes = cn("text-cta", className);
  const arrow = (
    <span className="arrow" aria-hidden="true">
      →
    </span>
  );

  // Native <a> for same-page hashes — Next.js Link often skips scroll on static export
  if (href.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {children}
        {arrow}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      {arrow}
    </Link>
  );
}
