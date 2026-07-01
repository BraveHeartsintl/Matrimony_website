"use client";

import { SITE_NAME, PUBLIC_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Heart, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../ui/Button";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b glass-nav">
        <div className="container-site flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-accent" />
            <span className="font-display text-lg font-bold text-foreground">{SITE_NAME}</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-link",
                  pathname === item.href && "text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Register Free</Button>
            </Link>
          </div>

          <button
            className="p-2 text-foreground md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col glass-strong mobile-menu-enter md:hidden">
          <div className="container-site flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <Heart className="h-6 w-6 text-accent" />
              <span className="font-display text-lg font-bold text-foreground">{SITE_NAME}</span>
            </Link>
            <button
              className="p-2 text-foreground"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-6 px-6">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-2xl font-display font-bold uppercase tracking-[0.08em] transition-colors",
                  pathname === item.href ? "text-accent" : "text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="container-site flex flex-col gap-3 pb-10">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full">
                Log In
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)}>
              <Button className="w-full">Register Free</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
