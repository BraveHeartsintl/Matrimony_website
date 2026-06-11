"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
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

    const result = await login(loginEmail, loginPassword);
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-primary via-primary-dark to-[#3d0f1f] p-12 text-white lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-8 w-8 fill-accent text-accent" />
          <span className="font-display text-2xl font-bold">{SITE_NAME}</span>
        </Link>
        <div>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <Shield className="h-7 w-7 text-accent" />
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight">Welcome Back</h1>
          <p className="mt-4 max-w-md text-white/70">
            Log in to continue your journey. Search matches, send interests, and connect with
            people who share your values.
          </p>
        </div>
        <p className="text-sm text-white/40">&copy; {new Date().getFullYear()} {SITE_NAME}</p>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-border px-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 fill-primary text-primary" />
            <span className="font-display font-bold text-primary">{SITE_NAME}</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md shadow-lg">
            <h2 className="text-center font-display text-2xl font-bold">Sign In</h2>
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
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading} >
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </form>

            <div className="mt-6 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center text-xs">
              <p className="font-semibold text-primary">Demo Account</p>
              <p className="mt-1 text-muted">Email: demo@example.com</p>
              <p className="text-muted">Password: password123</p>
            </div>

            <p className="mt-6 text-center text-sm text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Register Free
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
