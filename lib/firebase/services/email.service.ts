import { mapFirebaseError } from "@/lib/firebase/errors";
import { getFirebaseAuth } from "@/lib/firebase/config";
import { sendEmailVerification } from "firebase/auth";

function continueUrl(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/onboarding/verify/`;
}

function errorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
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
    try {
      await sendEmailVerification(user, {
        url: continueUrl(),
        handleCodeInApp: false,
      });
    } catch (error) {
      const code = errorCode(error);
      if (
        code === "auth/unauthorized-continue-uri" ||
        code === "auth/invalid-continue-uri" ||
        code === "auth/missing-continue-uri"
      ) {
        await sendEmailVerification(user);
      } else {
        throw error;
      }
    }
    return { alreadyVerified: false };
  } catch (error) {
    throw new Error(mapFirebaseError(error, "Failed to send verification email."));
  }
}

export function isAuthEmailVerified(): boolean {
  return getFirebaseAuth().currentUser?.emailVerified ?? false;
}
