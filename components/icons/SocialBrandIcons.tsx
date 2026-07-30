import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  className?: string;
};

/** Simple brand mark — lucide-react no longer ships Facebook/Instagram icons. */
export function FacebookIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M14 8.5h2.5V5.75C16.08 5.66 15.05 5.5 13.86 5.5 11.37 5.5 9.7 6.98 9.7 9.84V12H7.25v3.1H9.7V22h3.2v-6.9h2.55l.45-3.1h-3V10.12c0-.9.25-1.62 1.55-1.62z" />
    </svg>
  );
}

export function InstagramIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
