import { FirebaseError } from "firebase/app";

export type FirebaseErrorContext = "login" | "register" | "phone";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "An account with this email already exists",
  "auth/invalid-credential": "Invalid email or password",
  "auth/wrong-password": "Invalid email or password",
  "auth/user-not-found": "Invalid email or password",
  "auth/weak-password": "Password must be at least 6 characters",
  "auth/too-many-requests": "Too many attempts. Please try again later",
  "auth/invalid-email": "Please enter a valid email address",
  "auth/user-disabled": "This account has been disabled",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/invalid-phone-number": "Invalid phone number. Use international format (e.g. +91 86885 38590).",
  "auth/invalid-verification-code": "Invalid OTP. Please check the code and try again.",
  "auth/code-expired": "OTP expired. Request a new code.",
  "auth/missing-verification-code": "Enter the 6-digit OTP from your SMS.",
  "auth/credential-already-in-use": "This phone number is already linked to another account.",
  "auth/provider-already-linked": "This phone number is already verified on your account.",
  "auth/captcha-check-failed": "Security check failed. Refresh the page and try again.",
  "auth/quota-exceeded": "SMS limit reached. Please try again later.",
  "auth/user-token-expired": "Session expired. Please log in again.",
  "permission-denied": "Permission denied. Please try again or contact support.",
  unavailable: "Service temporarily unavailable. Please try again.",
};

function operationNotAllowedMessage(context?: FirebaseErrorContext): string {
  if (context === "phone") {
    return [
      "Phone OTP could not be sent.",
      "Check Firebase Console → Authentication → Sign-in method:",
      "1) Enable Phone",
      "2) Enable Email/Password (required for login)",
      "3) Upgrade to Blaze plan for real SMS",
      "4) Add localhost under Authorized domains",
      "5) For testing, add your number under Phone numbers for testing",
    ].join(" ");
  }
  if (context === "register") {
    return "Registration is not enabled. Enable Email/Password in Firebase Console → Authentication → Sign-in method.";
  }
  return "Sign-in is not enabled. Enable Email/Password in Firebase Console → Authentication → Sign-in method.";
}

export function mapFirebaseError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
  context?: FirebaseErrorContext
): string {
  if (error instanceof FirebaseError) {
    if (error.code === "auth/operation-not-allowed") {
      return operationNotAllowedMessage(context);
    }
    return AUTH_ERROR_MESSAGES[error.code] ?? fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
