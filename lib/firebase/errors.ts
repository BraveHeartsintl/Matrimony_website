import { FirebaseError } from "firebase/app";

export type FirebaseErrorContext = "login" | "register" | "phone";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "An account with this email already exists",
  "auth/invalid-credential": "Invalid email or password",
  "auth/wrong-password": "Invalid email or password",
  "auth/user-not-found": "Invalid email or password",
  "auth/weak-password": "Password must be at least 6 characters",
  "auth/too-many-requests":
    "Too many verification emails sent. Please wait 30–60 minutes, then try again.",
  "auth/invalid-email": "Please enter a valid email address",
  "auth/user-disabled": "This account has been disabled",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/invalid-action-code": "This verification link is invalid or has already been used. Request a new email.",
  "auth/expired-action-code": "This verification link has expired. Request a new email.",
  "functions/not-found":
    "Verification email is not set up yet. Deploy the sendVerificationEmail Cloud Function and SMTP settings.",
  "functions/unavailable": "Email service is temporarily unavailable. Please try again shortly.",
  "functions/unauthenticated": "You must be logged in to verify your email.",
  "functions/resource-exhausted":
    "Too many verification emails sent. Please wait 30–60 minutes, then try again.",
  "auth/invalid-phone-number": "Invalid phone number. Use international format (e.g. +91 98765 43210).",
  "auth/invalid-verification-code": "Invalid OTP. Please check the code and try again.",
  "auth/code-expired": "OTP expired. Request a new code.",
  "auth/missing-verification-code": "Enter the 6-digit OTP from your SMS.",
  "auth/invalid-verification-id": "Verification session expired. Tap Resend OTP and enter the new code.",
  "auth/missing-verification-id": "Request a new OTP, then try again.",
  "auth/rejected-credential": "Invalid or expired OTP. Request a new code.",
  "auth/credential-already-in-use": "This phone number is already linked to another account.",
  "auth/account-exists-with-different-credential":
    "This phone number is already linked to another account.",
  "auth/provider-already-linked": "This phone number is already verified on your account.",
  "auth/requires-recent-login": "Session expired. Please log in again, then verify your phone.",
  "auth/unverified-email": "Verify your email, then try phone verification again.",
  "auth/captcha-check-failed": "Security check failed. Refresh the page and try again.",
  "auth/app-not-authorized":
    "This domain is not authorized for Firebase Auth. Add your current domain in Firebase Console → Authentication → Settings → Authorized domains.",
  "auth/invalid-app-credential":
    "Phone verification failed (reCAPTCHA / app credential). Add this site domain in Firebase Console → Authentication → Settings → Authorized domains, ensure Phone sign-in is enabled, and rebuild without PHONE_TEST_MODE on production. For local testing use 127.0.0.1 or a Firebase test phone number.",
  "auth/missing-app-credential":
    "reCAPTCHA could not initialise. Refresh the page and try again. If this persists on your live domain, add it under Firebase Authorized domains.",
  "auth/quota-exceeded": "SMS limit reached. Please try again later.",
  "auth/user-token-expired": "Session expired. Please log in again.",
  "permission-denied": "Permission denied. Please try again or contact support.",
  unavailable: "Service temporarily unavailable. Please try again.",
};

function operationNotAllowedMessage(context?: FirebaseErrorContext): string {
  if (context === "phone") {
    return [
      "Phone sign-in is not enabled.",
      "In Firebase Console → Authentication → Sign-in method → Phone: click Enable and Save.",
    ].join(" ");
  }
  if (context === "register") {
    return "Registration is not enabled. Enable Email/Password in Firebase Console → Authentication → Sign-in method.";
  }
  return "Sign-in is not enabled. Enable Email/Password in Firebase Console → Authentication → Sign-in method.";
}

function getErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
}

export function mapFirebaseError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
  context?: FirebaseErrorContext
): string {
  const code = getErrorCode(error) ?? (error instanceof FirebaseError ? error.code : undefined);

  // Prefer Cloud Function HttpsError messages over generic code fallbacks.
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    const message = (error as { message: string }).message.trim();
    // Firebase wraps as "INTERNAL: actual message" or "functions/internal"
    const unwrapped = message.replace(/^(INTERNAL|UNKNOWN|ERROR):\s*/i, "").trim();
    if (
      unwrapped &&
      !/^firebase\b/i.test(unwrapped) &&
      code?.startsWith("functions/") &&
      unwrapped.toLowerCase() !== code.toLowerCase()
    ) {
      return unwrapped;
    }
  }

  if (code) {
    if (code === "auth/operation-not-allowed") {
      return operationNotAllowedMessage(context);
    }
    if (context === "phone" && code === "auth/invalid-credential") {
      return "Invalid OTP. Please check the code and try again.";
    }
    return AUTH_ERROR_MESSAGES[code] ?? fallback;
  }
  if (error instanceof Error) {
    if (/already been rendered/i.test(error.message)) {
      return "Security check needs a refresh. Tap Send OTP again — or reload the page if it persists.";
    }
    return error.message;
  }
  return fallback;
}
