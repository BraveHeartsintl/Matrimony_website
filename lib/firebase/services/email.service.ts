import { mapFirebaseError } from "@/lib/firebase/errors";
import { getFirebaseAuth } from "@/lib/firebase/config";
import { sendEmailVerification } from "firebase/auth";

function verificationContinueUrl(): string {
  if (typeof window === "undefined") {
    return "/onboarding/verify/";
  }
  return `${window.location.origin}/onboarding/verify/`;
}

/**
 * Sends a Firebase Auth verification email from the browser.
 * Uses one API call (identitytoolkit sendOobCode) — avoids the Cloud Function
 * path that was burning quota when SMTP failed and then retrying via fallback.
 *
 * Branded SMTP email via sendVerificationEmail Cloud Function can be re-enabled
 * once SMTP_PASS is set correctly in Firebase secrets.
 */
export async function sendAccountVerificationEmail(): Promise<{ alreadyVerified: boolean }> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to verify your email.");
  }
  if (!user.email) {
    throw new Error("This account has no email address to verify.");
  }
  if (user.emailVerified) {
    return { alreadyVerified: true };
  }

  try {
    await sendEmailVerification(user, {
      url: verificationContinueUrl(),
      handleCodeInApp: false,
    });
    return { alreadyVerified: false };
  } catch (error) {
    throw new Error(mapFirebaseError(error, "Failed to send verification email."));
  }
}

export function isAuthEmailVerified(): boolean {
  return getFirebaseAuth().currentUser?.emailVerified ?? false;
}
