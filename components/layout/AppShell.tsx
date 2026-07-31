"use client";

import PhaseBanner from "@/components/onboarding/PhaseBanner";
import { useAuth } from "@/context/AuthContext";
import { canAccess, getOnboardingStatusLabel } from "@/lib/onboarding/access";
import { APP_NAV } from "@/lib/constants";
import { getProfilePhotoUrl } from "@/lib/profile-photos";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Crown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import SiteLogo from "./SiteLogo";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Search,
  Heart,
  User,
  MessageCircle,
  Crown,
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { session, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/login");
    }
  }, [isLoading, session, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  const status = session.profile.onboardingStatus;
  const messagesLocked = !canAccess(status, "direct_chat");
  const profilePhoto = getProfilePhotoUrl(session.profile);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navLinkClass = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-[4px] border-l-2 px-3 py-2.5 text-xs font-medium uppercase tracking-[0.08em] transition-colors",
      active
        ? "border-accent text-accent"
        : "border-transparent text-muted hover:text-foreground"
    );

  return (
    <div className="flex min-h-screen lg:pl-64">
      <aside className="glass-sidebar fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r lg:flex">
        <div>
          <div className="flex h-16 items-center border-b border-border px-6">
            <SiteLogo href="/dashboard" size="md" />
          </div>

          <nav className="space-y-1 p-4">
            {APP_NAV.map((item) => {
              const Icon = iconMap[item.icon];
              const locked = item.href === "/messages" && messagesLocked;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    navLinkClass(pathname === item.href),
                    locked && "opacity-60"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3">
            <Avatar src={profilePhoto} name={session.user.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{session.user.name}</p>
              <p className="truncate text-xs text-muted">{session.user.email}</p>
              <p className="truncate text-[10px] font-medium uppercase tracking-wider text-accent">
                {getOnboardingStatusLabel(status)}
              </p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <ArrowLeft className="h-4 w-4" />
              Back to Website
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="glass-nav flex h-14 items-center justify-between border-b px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6 text-foreground" />
          </button>
          <SiteLogo href="/dashboard" size="sm" />
          <Avatar src={profilePhoto} name={session.user.name} size="sm" />
        </header>

        <main className="flex-1 overflow-auto p-4 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:p-8 lg:pb-8">
          <PhaseBanner status={status} />
          {children}
        </main>

        <nav className="glass-nav fixed bottom-0 left-0 right-0 z-40 flex border-t pb-[env(safe-area-inset-bottom)] lg:hidden">
          {APP_NAV.filter((item) => item.href !== "/subscription").map((item) => {
            const Icon = iconMap[item.icon];
            const active = pathname === item.href;
            const locked = item.href === "/messages" && messagesLocked;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={cn(
                  "relative flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 pb-1.5 pt-2 text-[0.625rem] font-medium uppercase leading-none tracking-wide",
                  active ? "text-accent" : "text-muted",
                  locked && "opacity-60"
                )}
              >
                {active && (
                  <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-accent" />
                )}
                <Icon className="h-5 w-5 shrink-0" />
                <span className="w-full truncate text-center">{item.shortLabel}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {sidebarOpen && (
        <div className="glass-strong fixed inset-0 z-50 flex flex-col lg:hidden">
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <SiteLogo href="/dashboard" size="sm" onClick={() => setSidebarOpen(false)} />
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-foreground" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-2">
            {APP_NAV.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={navLinkClass(pathname === item.href)}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            </div>
          </nav>
          <div className="mt-auto border-t border-border p-4">
            <Link href="/" onClick={() => setSidebarOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <ArrowLeft className="h-4 w-4" />
                Back to Website
              </Button>
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
