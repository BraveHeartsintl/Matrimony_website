"use client";

import Button from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/constants";
import { adminLogout, isAdminLoggedIn } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BarChart3,
  CreditCard,
  Heart,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/verification", label: "Verification", icon: ShieldCheck },
  { href: "/admin/reports", label: "Reports", icon: AlertTriangle },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [router]);

  const handleLogout = () => {
    adminLogout();
    router.push("/admin/login");
  };

  const navLinkClass = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-[4px] border-l-2 px-3 py-2.5 text-xs font-medium uppercase tracking-[0.08em] transition-colors",
      active
        ? "border-accent text-accent"
        : "border-transparent text-muted hover:text-foreground"
    );

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="glass-sidebar hidden w-64 flex-col border-r lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Heart className="h-6 w-6 text-accent" />
          <div>
            <span className="font-display text-lg font-bold text-foreground">{SITE_NAME}</span>
            <p className="text-[10px] uppercase tracking-widest text-accent">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navLinkClass(pathname === item.href)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <Link
            href="/"
            className="mb-2 block text-xs uppercase tracking-wider text-muted transition-colors hover:text-foreground"
          >
            &larr; Back to website
          </Link>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="glass-nav flex h-14 items-center justify-between border-b px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden" aria-label="Open menu">
            <Menu className="h-6 w-6 text-foreground" />
          </button>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted lg:text-sm">
            Administration Dashboard
          </p>
          <span className="glass-accent rounded px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
            Static Demo
          </span>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>

      {sidebarOpen && (
        <div className="glass-strong fixed inset-0 z-50 lg:hidden">
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <span className="font-display font-bold text-foreground">Admin</span>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-foreground" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(pathname === item.href)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
