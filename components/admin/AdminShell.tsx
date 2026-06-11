"use client";

import Button from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/constants";
import { adminLogout, isAdminLoggedIn } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  CreditCard,
  Heart,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
  AlertTriangle,
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

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-slate-900 text-white lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <Heart className="h-6 w-6 fill-accent text-accent" />
          <div>
            <span className="font-display text-lg font-bold">{SITE_NAME}</span>
            <p className="text-[10px] uppercase tracking-widest text-accent">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-white/10 text-accent"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link href="/" className="mb-2 block text-xs text-white/50 hover:text-white">
            &larr; Back to website
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-white/70 hover:bg-white/10 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden" aria-label="Open menu">
            <Menu className="h-6 w-6 text-slate-700" />
          </button>
          <p className="text-sm font-medium text-slate-600 lg:text-base">Administration Dashboard</p>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            Static Demo
          </span>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-slate-900 text-white">
            <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
              <span className="font-display font-bold">Admin</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {ADMIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    pathname === item.href ? "bg-white/10 text-accent" : "text-white/70"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
