import { MOCK_OTP_CODE } from "@/lib/constants";
import { FirebaseError } from "firebase/app";
import { mapFirebaseError } from "@/lib/firebase/errors";
import { getFirebaseAuth } from "@/lib/firebase/config";
import {
  linkWithCredential,
  PhoneAuthProvider,
  RecaptchaVerifier,
} from "firebase/auth";

// Single module-level verifier — always cleared before each send to avoid
// "reCAPTCHA has already been rendered in this element" errors.
let activeVerifier: RecaptchaVerifier | undefined;
let activeContainerId: string | undefined;

const DEMO_VERIFICATION_PREFIX = "demo-otp:";

export function isPhoneDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_FIREBASE_PHONE_DEMO_MODE === "true";
}

/** Normalize UK/local input to E.164 (defaults to +44 when no country code). */
export function normalizePhoneNumber(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("+")) {
    return "+" + trimmed.slice(1).replace(/\D/g, "");
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("44")) {
    return `+${digits}`;
  }
  if (digits.startsWith("0")) {
    return `+44${digits.slice(1)}`;
  }
  if (digits.startsWith("91")) {
    return `+${digits}`;
  }
  return `+44${digits}`;
}

export function isValidPhoneNumber(input: string): boolean {
  const normalized = normalizePhoneNumber(input);
  return /^\+\d{10,15}$/.test(normalized);
}

function clearContainerHtml(containerId: string): void {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = "";
}

export function clearPhoneRecaptcha(): void {
  if (activeVerifier) {
    try {
      activeVerifier.clear();
    } catch {
      // Already cleared or widget gone — safe to ignore
    }
    activeVerifier = undefined;
  }
  if (activeContainerId) {
    clearContainerHtml(activeContainerId);
    activeContainerId = undefined;
  }
}

/**
 * Always creates a fresh RecaptchaVerifier.
 * Clears any existing widget first so we never hit
 * "reCAPTCHA has already been rendered in this element".
 */
function createFreshVerifier(containerId: string): RecaptchaVerifier {
  // Destroy the old one unconditionally before creating a new one.
  clearPhoneRecaptcha();

  const el = document.getElementById(containerId);
  if (!el) {
    throw new Error(`reCAPTCHA container #${containerId} not found in DOM.`);
  }
  el.innerHTML = "";

  const verifier = new RecaptchaVerifier(getFirebaseAuth(), containerId, {
    size: "invisible",
  });

  activeVerifier = verifier;
  activeContainerId = containerId;
  return verifier;
}

export async function sendPhoneOtp(
  phoneNumber: string,
  containerId: string,
): Promise<string> {
  const auth = getFirebaseAuth();
  if (!auth.currentUser) {
    throw new Error("You must be logged in to verify your phone number.");
  }

  const normalized = normalizePhoneNumber(phoneNumber);
  if (!isValidPhoneNumber(normalized)) {
    throw new Error("Enter a valid mobile number including country code (e.g. +91 86885 38590).");
  }

  if (isPhoneDemoMode()) {
    await new Promise((r) => setTimeout(r, 600));
    return `${DEMO_VERIFICATION_PREFIX}${normalized}`;
  }

  try {
    const verifier = createFreshVerifier(containerId);
    const provider = new PhoneAuthProvider(auth);
    return await provider.verifyPhoneNumber(normalized, verifier);
  } catch (error) {
    clearPhoneRecaptcha();
    // Log the raw Firebase error code to help diagnose reCAPTCHA/backend issues.
    if (error instanceof Error && "code" in error) {
      console.error("[phone-otp] Firebase error code:", (error as { code?: string }).code, error.message);
    }
    throw new Error(mapFirebaseError(error, "Failed to send OTP. Please try again.", "phone"));
  }
}

function isDemoVerificationId(verificationId: string): boolean {
  return verificationId.startsWith(DEMO_VERIFICATION_PREFIX);
}

export async function verifyPhoneOtp(verificationId: string, otpCode: string): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth.currentUser) {
    throw new Error("You must be logged in to verify your phone number.");
  }

  const code = otpCode.trim();
  if (!/^\d{6}$/.test(code)) {
    throw new Error("Enter the 6-digit code from your SMS.");
  }

  if (isDemoVerificationId(verificationId)) {
    if (code !== MOCK_OTP_CODE) {
      throw new Error(`Invalid code. Use ${MOCK_OTP_CODE} for demo verification.`);
    }
    return;
  }

  try {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    await linkWithCredential(auth.currentUser, credential);
  } catch (error) {
    if (error instanceof FirebaseError && error.code === "auth/provider-already-linked") {
      return;
    }
    throw new Error(mapFirebaseError(error, "Invalid or expired OTP. Please try again.", "phone"));
  }
}
