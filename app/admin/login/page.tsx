"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { adminLogin, isAdminLoggedIn } from "@/lib/admin-auth";
import { SITE_NAME } from "@/lib/constants";
import { Heart, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn()) router.replace("/admin");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await adminLogin(email, password);
    setLoading(false);
    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error ?? "Invalid admin credentials");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-1/2 flex-col justify-between glass-sidebar p-12 lg:flex">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-accent" />
          <span className="font-display text-2xl font-bold text-foreground">{SITE_NAME}</span>
        </div>
        <div>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[6px] glass">
            <Shield className="h-7 w-7 text-accent" />
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight text-foreground">
            Admin Portal
          </h1>
          <p className="mt-4 max-w-md text-muted">
            Sign in to access the dashboard, manage users, and review matches.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <h2 className="text-center font-display text-2xl font-bold text-foreground">
            Admin Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-muted">
            Restricted access for administrators only
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              label="Admin Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
            />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
            />
            {error && (
              <p className="feedback-error rounded-[6px] px-3 py-2 text-sm">{error}</p>
            )}
            <p className="text-center text-xs text-muted">
              First time?{" "}
              <Link href="/admin/setup" className="text-accent hover:underline">
                Run admin setup
              </Link>
            </p>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign In to Admin"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            <Link href="/" className="text-foreground transition-colors hover:text-accent">
              &larr; Back to website
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
