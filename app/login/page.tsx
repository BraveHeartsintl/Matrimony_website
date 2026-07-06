"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { adminLogin } from "@/lib/admin-auth";
import { ADMIN_CREDENTIALS, matchesAdminCredentials } from "@/lib/admin-config";
import { SITE_NAME } from "@/lib/constants";
import { Heart, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const loginEmail = String(fd.get("email") ?? email).trim();
    const loginPassword = String(fd.get("password") ?? password);

    if (matchesAdminCredentials(loginEmail, loginPassword)) {
      const adminResult = await adminLogin(loginEmail, loginPassword);
      setLoading(false);
      if (adminResult.success) {
        router.push("/admin");
      } else {
        setError(adminResult.error || "Admin login failed");
      }
      return;
    }

    const result = await login(loginEmail, loginPassword);
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-deepest via-navy-royal to-deepest p-12 lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-gold" />
          <span className="font-display text-2xl font-bold text-white">{SITE_NAME}</span>
        </Link>
        <div>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[10px] glass-dark">
            <Shield className="h-7 w-7 text-gold" />
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight text-white">
            Welcome Back
          </h1>
          <p className="mt-4 max-w-md text-white/75">
            Log in to continue your journey. Sign up in under 60 seconds, browse matches
            immediately, then complete your profile and verify when you&apos;re ready to connect.
          </p>
        </div>
        <p className="text-sm text-white/45">
          &copy; {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-border px-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-accent" />
            <span className="font-display font-bold text-foreground">{SITE_NAME}</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <Card className="animate-scale-in w-full max-w-md" style={{ animationDelay: "0.15s" }}>
            <h2 className="text-center font-display text-2xl font-bold text-foreground">
              Sign In
            </h2>
            <p className="mt-2 text-center text-sm text-muted">
              Log in to your UK Matrimony account
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onInput={(e) => setEmail(e.currentTarget.value)}
                placeholder="you@example.com"
              />
              <Input
                label="Password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onInput={(e) => setPassword(e.currentTarget.value)}
                placeholder="Enter your password"
              />

              {error && (
                <p className="feedback-error rounded-[6px] px-3 py-2 text-sm">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-foreground transition-colors hover:text-accent">
                Register Free
              </Link>
            </div>

            <div className="mt-6 rounded-[6px] glass-subtle p-3 text-center text-xs text-muted">
              <p className="font-medium uppercase tracking-wider text-foreground">Admin access</p>
              <p className="mt-1">Email: {ADMIN_CREDENTIALS.email}</p>
              <p>Password: {ADMIN_CREDENTIALS.password}</p>
              <p className="mt-2 text-muted-foreground">
                Use these on this page to open the admin portal, or{" "}
                <Link href="/admin/login" className="text-accent hover:underline">
                  admin login
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
