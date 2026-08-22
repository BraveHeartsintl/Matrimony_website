import { mapFirebaseError } from "@/lib/firebase/errors";
import { getFirebaseAuth, getFirebaseFunctions } from "@/lib/firebase/config";
import { sendEmailVerification, type User } from "firebase/auth";
import { httpsCallable } from "firebase/functions";

function verificationContinueUrl(): string {
  if (typeof window === "undefined") {
    return "/onboarding/verify/";
  }
  return `${window.location.origin}/onboarding/verify/`;
}

async function sendViaFirebaseAuth(user: User): Promise<{ alreadyVerified: boolean }> {
  await sendEmailVerification(user, {
    url: verificationContinueUrl(),
    handleCodeInApp: false,
  });
  return { alreadyVerified: false };
}

function shouldFallbackToFirebaseAuth(error: unknown): boolean {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : undefined;
  return code !== "functions/unauthenticated" && code !== "functions/failed-precondition";
}

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
    const sendVerificationEmail = httpsCallable<void, { alreadyVerified: boolean }>(
      getFirebaseFunctions(),
      "sendVerificationEmail"
    );
    const { data } = await sendVerificationEmail();
    return { alreadyVerified: Boolean(data.alreadyVerified) };
  } catch (error) {
    if (!shouldFallbackToFirebaseAuth(error)) {
      throw new Error(mapFirebaseError(error, "Failed to send verification email."));
    }

    try {
      return await sendViaFirebaseAuth(user);
    } catch (fallbackError) {
      throw new Error(
        mapFirebaseError(fallbackError, mapFirebaseError(error, "Failed to send verification email."))
      );
    }
  }
}

export function isAuthEmailVerified(): boolean {
  return getFirebaseAuth().currentUser?.emailVerified ?? false;
}
