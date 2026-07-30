"use client";

import Button from "@/components/ui/Button";
import SiteLogo from "@/components/layout/SiteLogo";
import { adminLogout, ensureAdminFirebaseAuth, isAdminLoggedIn } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BarChart3,
  CreditCard,
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
    void (async () => {
      const session = sessionStorage.getItem("uk_matrimony_admin_session");
      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const firebase = await ensureAdminFirebaseAuth();
      if (!firebase.success) {
        sessionStorage.removeItem("uk_matrimony_admin_session");
        router.replace("/admin/login");
        return;
      }

      if (!isAdminLoggedIn()) {
        router.replace("/admin/login");
        return;
      }

      setReady(true);
    })();
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
    <div className="flex min-h-screen lg:pl-64">
      <aside className="glass-sidebar fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r lg:flex">
        <div>
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <SiteLogo href="/admin" size="sm" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-accent">Admin Portal</p>
            </div>
          </div>

          <nav className="space-y-1 p-4">
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
        </div>

        <div className="mt-auto border-t border-border p-4">
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
            Live
          </span>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>

      {sidebarOpen && (
        <div className="glass-strong fixed inset-0 z-50 flex flex-col lg:hidden">
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <SiteLogo href="/admin" size="sm" onClick={() => setSidebarOpen(false)} />
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-foreground" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
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
            </div>
          </nav>
          <div className="mt-auto border-t border-border p-4">
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="mb-2 block text-xs uppercase tracking-wider text-muted transition-colors hover:text-foreground"
            >
              &larr; Back to website
            </Link>
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
