import { SITE_NAME } from "@/lib/constants";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthShellProps {
  children: ReactNode;
  eyebrow?: string;
  asideTitle?: string;
  asideBody?: string;
}

export default function AuthShell({
  children,
  eyebrow = "UK's Indian matchmaking",
  asideTitle,
  asideBody,
}: AuthShellProps) {
  return (
    <div className="auth-shell relative flex min-h-dvh">
      <div className="auth-shell-bg absolute inset-0" aria-hidden="true">
        <Image
          src="/images/hero/login-background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center] sm:object-[72%_center]"
        />
        <div className="auth-shell-veil absolute inset-0" />
      </div>

      <div className="relative z-10 flex min-h-dvh w-full flex-col lg:flex-row">
        <aside className="hidden w-[40%] flex-col justify-between px-10 py-10 xl:w-[42%] xl:px-14 lg:flex">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md">
              <Heart className="h-5 w-5 text-gold" aria-hidden="true" />
            </span>
            <span className="font-display text-2xl tracking-wide text-white">
              {SITE_NAME}
            </span>
          </Link>

          <div className="max-w-md">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold/90">
                {eyebrow}
              </p>
            )}
            {asideTitle && (
              <h1 className="mt-4 font-display text-4xl leading-tight text-[#fff8e7] xl:text-5xl">
                {asideTitle}
              </h1>
            )}
            {asideBody && (
              <p className="mt-5 text-base leading-relaxed text-white/80">
                {asideBody}
              </p>
            )}
          </div>

          <p className="text-sm text-white/45">
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
        </aside>

        <div className="flex min-h-dvh flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between px-4 sm:h-16 sm:px-6 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <Heart className="h-5 w-5 text-gold" aria-hidden="true" />
              <span className="font-display text-lg text-white">{SITE_NAME}</span>
            </Link>
          </header>

          <div className="flex flex-1 items-start justify-center px-3 pb-8 pt-2 sm:px-6 sm:pb-10 sm:pt-4 lg:items-center lg:justify-start lg:px-10 lg:py-12 xl:px-16">
            <div className="auth-glass auth-glass-shine w-full max-w-[22.5rem] rounded-[1.25rem] p-5 sm:max-w-md sm:rounded-2xl sm:p-8 lg:max-w-lg lg:p-9">
              <div className="auth-glass-inner relative z-[1]">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
