"use client";

import AuthShell from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { adminLogin } from "@/lib/admin-auth";
import { ADMIN_CREDENTIALS, matchesAdminCredentials } from "@/lib/admin-config";
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
    <AuthShell
      asideTitle="Welcome back"
      asideBody="Log in to continue your journey. Browse matches, message connections, and pick up where you left off."
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
        Sign in
      </p>
      <h2 className="mt-2 font-display text-3xl leading-tight text-[#fff8e7]">
        Log in to your account
      </h2>
      <p className="mt-2 text-sm text-white/70">
        Enter your details to access UK Matrimony
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
          <p className="auth-feedback-error rounded-lg px-3 py-2 text-sm">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/70">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-gold transition-colors hover:text-gold-hover"
        >
          Register Free
        </Link>
      </p>

      <div className="auth-glass-chip mt-6 rounded-xl p-3 text-center text-xs text-white/55">
        <p className="font-medium uppercase tracking-wider text-white/80">
          Admin access
        </p>
        <p className="mt-1">Email: {ADMIN_CREDENTIALS.email}</p>
        <p>Password: {ADMIN_CREDENTIALS.password}</p>
        <p className="mt-2">
          Or use{" "}
          <Link href="/admin/login" className="text-gold hover:underline">
            admin login
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
