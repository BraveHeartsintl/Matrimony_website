"use client";

import { Suspense, useEffect, useState } from "react";
import { applyActionCode, reload } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import { getFirebaseAuth } from "@/lib/firebase/config";
import { mapFirebaseError } from "@/lib/firebase/errors";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"working" | "success" | "error">("working");
  const [message, setMessage] = useState("Confirming your email…");

  useEffect(() => {
    const oobCode = searchParams.get("oobCode");
    if (!oobCode) {
      setStatus("error");
      setMessage("This verification link is missing details. Open the latest email and tap the button again.");
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const auth = getFirebaseAuth();
        await applyActionCode(auth, oobCode);
        if (auth.currentUser) {
          await reload(auth.currentUser);
        }
        if (cancelled) return;
        setStatus("success");
        setMessage("Your email is verified. You can continue setting up your profile.");
        window.setTimeout(() => {
          router.replace(auth.currentUser ? "/onboarding/verify/" : "/login/");
        }, 1200);
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setMessage(mapFirebaseError(error, "This verification link is invalid or has expired. Request a new email."));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
        Email verification
      </p>
      <h2 className="mt-2 font-display text-3xl leading-tight text-cream">
        {status === "success" ? "Email verified" : status === "error" ? "Could not verify" : "Verifying email"}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-white/70">{message}</p>
      {status !== "working" && (
        <div className="mt-8">
          <Link href="/onboarding/verify/">
            <Button>{status === "success" ? "Continue" : "Back to verification"}</Button>
          </Link>
        </div>
      )}
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthShell
      asideTitle="Confirm your email"
      asideBody="This keeps your UK Indian Matrimony account secure and lets you finish identity verification."
    >
      <Suspense
        fallback={
          <p className="text-sm text-white/70">Confirming your email…</p>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </AuthShell>
  );
}
