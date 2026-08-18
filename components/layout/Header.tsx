"use client";

import { useAuth } from "@/context/AuthContext";
import { APP_NAV, PUBLIC_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import SiteLogo from "./SiteLogo";

export default function Header() {
  const pathname = usePathname();
  const { session, isLoading } = useAuth();
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

  const memberLinks = APP_NAV.filter((item) =>
    ["/dashboard", "/search", "/profile"].includes(item.href)
  );

  return (
    <>
      <header className="site-header sticky top-0 z-40 border-b border-gold/30 bg-deepest/92 backdrop-blur-xl">
        <div className="container-site flex h-16 min-w-0 items-center justify-between gap-3">
          <SiteLogo href="/" size="md" variant="onDark" priority className="min-w-0" />

          <nav className="hidden items-center gap-8 md:flex">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-link !text-cream/75 hover:!text-gold",
                  pathname === item.href && "active !text-gold !font-bold"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {!isLoading &&
              (session ? (
                <>
                  <Link href="/search">
                    <Button variant="ghost" size="sm" className="!text-cream/85 hover:!text-gold">
                      Search
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="sm">
                      Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="!text-cream/85 hover:!text-gold">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">
                      Register Free
                    </Button>
                  </Link>
                </>
              ))}
          </div>

          <button
            className="p-2 text-cream md:hidden"
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
            <SiteLogo href="/" size="md" variant="onDark" onClick={() => setMobileOpen(false)} />
            <button
              className="p-2 text-cream"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-8 px-6">
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
            {session &&
              memberLinks.map((item) => (
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
            {session ? (
              <>
                <Link href="/search" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Search Profiles
                  </Button>
                </Link>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Register Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
