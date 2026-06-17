import { cn } from "@/lib/utils";
import Link from "next/link";

interface TextCTAProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function TextCTA({ href, children, className }: TextCTAProps) {
  return (
    <Link href={href} className={cn("text-cta", className)}>
      {children}
      <span className="arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
