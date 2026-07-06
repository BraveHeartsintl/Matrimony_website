"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ADMIN_CREDENTIALS } from "@/lib/admin-config";
import {
  bootstrapPlatformAdmin,
  isAdminBootstrapAvailable,
} from "@/lib/firebase/services/admin-bootstrap.service";
import { SITE_NAME } from "@/lib/constants";
import { Check, Heart, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSetupPage() {
  const router = useRouter();
  const [available, setAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void isAdminBootstrapAvailable().then(setAvailable);
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    const result = await bootstrapPlatformAdmin();
    setLoading(false);
    if (result.success) {
      setDone(true);
    } else {
      setError(result.error ?? "Failed to create admin account");
    }
  };

  if (available === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!available && !done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="max-w-md text-center">
          <Shield className="mx-auto h-10 w-10 text-accent" />
          <h1 className="mt-4 font-display text-xl font-bold">Admin already configured</h1>
          <p className="mt-2 text-sm text-muted">Sign in at the admin portal.</p>
          <Link href="/admin/login" className="mt-6 inline-block">
            <Button>Go to Admin Login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-1/2 flex-col justify-between glass-sidebar p-12 lg:flex">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-accent" />
          <span className="font-display text-2xl font-bold text-foreground">{SITE_NAME}</span>
        </div>
        <div>
          <Shield className="mb-6 h-14 w-14 text-accent" />
          <h1 className="font-display text-4xl font-bold">Create Admin Account</h1>
          <p className="mt-4 max-w-md text-muted">
            One-time setup for the platform administrator. This page is disabled after the first
            admin is created.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          {done ? (
            <div className="text-center">
              <Check className="mx-auto h-12 w-12 text-accent" />
              <h2 className="mt-4 font-display text-xl font-bold">Admin account ready</h2>
              <p className="mt-2 text-sm text-muted">Use these credentials at admin login:</p>
              <div className="mt-4 rounded-[6px] glass-subtle p-4 text-left text-sm">
                <p>
                  <span className="text-muted">Email:</span>{" "}
                  <strong>{ADMIN_CREDENTIALS.email}</strong>
                </p>
                <p className="mt-2">
                  <span className="text-muted">Password:</span>{" "}
                  <strong>{ADMIN_CREDENTIALS.password}</strong>
                </p>
              </div>
              <Button className="mt-6 w-full" onClick={() => router.push("/admin/login")}>
                Sign In to Admin
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-center font-display text-2xl font-bold">First-time admin setup</h2>
              <p className="mt-2 text-center text-sm text-muted">
                Creates the default platform admin in Firebase Auth and Firestore.
              </p>

              <div className="mt-6 rounded-[6px] glass-subtle p-4 text-sm">
                <p className="font-medium text-foreground">Credentials that will be created:</p>
                <p className="mt-2 text-muted">
                  Email: <strong className="text-foreground">{ADMIN_CREDENTIALS.email}</strong>
                </p>
                <p className="text-muted">
                  Password: <strong className="text-foreground">{ADMIN_CREDENTIALS.password}</strong>
                </p>
              </div>

              {error && (
                <p className="mt-4 rounded-[6px] bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <Button className="mt-6 w-full" onClick={() => void handleCreate()} disabled={loading}>
                {loading ? "Creating admin…" : "Create Admin Account"}
              </Button>

              <p className="mt-4 text-center text-xs text-muted">
                Already set up?{" "}
                <Link href="/admin/login" className="text-accent hover:underline">
                  Admin login
                </Link>
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
