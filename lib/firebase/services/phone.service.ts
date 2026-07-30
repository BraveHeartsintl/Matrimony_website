import { MOCK_OTP_CODE } from "@/lib/constants";
import { FirebaseError } from "firebase/app";
import { mapFirebaseError } from "@/lib/firebase/errors";
import { getFirebaseAuth } from "@/lib/firebase/config";
import {
  linkWithCredential,
  PhoneAuthProvider,
  RecaptchaVerifier,
} from "firebase/auth";

/**
 * Module-level verifier state.
 * We always mount into a *new child node* under the host so grecaptcha never
 * sees "already rendered in this element" on a reused DOM node.
 */
let activeVerifier: RecaptchaVerifier | undefined;
let activeWidgetEl: HTMLElement | undefined;
let sendInFlight = false;
let widgetSeq = 0;

const DEMO_VERIFICATION_PREFIX = "demo-otp:";
const RECAPTCHA_HOST_ID = "recaptcha-container";

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

export function clearPhoneRecaptcha(): void {
  if (activeVerifier) {
    try {
      activeVerifier.clear();
    } catch {
      // Already cleared or widget gone — safe to ignore
    }
    activeVerifier = undefined;
  }

  if (activeWidgetEl?.parentNode) {
    activeWidgetEl.parentNode.removeChild(activeWidgetEl);
  }
  activeWidgetEl = undefined;

  const host = document.getElementById(RECAPTCHA_HOST_ID);
  if (host) host.innerHTML = "";
}

function isAlreadyRenderedError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /already been rendered/i.test(message);
}

/**
 * Creates a RecaptchaVerifier on a brand-new DOM node under the host.
 * Never reuses a node that grecaptcha has already rendered into.
 */
function createFreshVerifier(hostId: string): RecaptchaVerifier {
  clearPhoneRecaptcha();

  const host = document.getElementById(hostId);
  if (!host) {
    throw new Error(
      "Security check container is missing. Refresh the page and try again."
    );
  }

  host.innerHTML = "";
  const widget = document.createElement("div");
  widget.id = `recaptcha-widget-${++widgetSeq}`;
  host.appendChild(widget);
  activeWidgetEl = widget;

  // Pass the HTMLElement (not an id string) so Firebase binds to this exact node.
  const verifier = new RecaptchaVerifier(getFirebaseAuth(), widget, {
    size: "invisible",
    callback: () => {
      // Token ready — verifyPhoneNumber continues automatically
    },
    "expired-callback": () => {
      clearPhoneRecaptcha();
    },
  });

  activeVerifier = verifier;
  return verifier;
}

async function requestOtpWithVerifier(
  phoneNumber: string,
  hostId: string
): Promise<string> {
  const auth = getFirebaseAuth();
  const verifier = createFreshVerifier(hostId);
  const provider = new PhoneAuthProvider(auth);
  // Do NOT call verifier.render() separately — verifyPhoneNumber renders once.
  return provider.verifyPhoneNumber(phoneNumber, verifier);
}

export async function sendPhoneOtp(
  phoneNumber: string,
  containerId: string = RECAPTCHA_HOST_ID
): Promise<string> {
  const auth = getFirebaseAuth();
  if (!auth.currentUser) {
    throw new Error("You must be logged in to verify your phone number.");
  }

  const normalized = normalizePhoneNumber(phoneNumber);
  if (!isValidPhoneNumber(normalized)) {
    throw new Error(
      "Enter a valid mobile number including country code (e.g. +91 98765 43210)."
    );
  }

  if (isPhoneDemoMode()) {
    await new Promise((r) => setTimeout(r, 600));
    return `${DEMO_VERIFICATION_PREFIX}${normalized}`;
  }

  if (sendInFlight) {
    throw new Error("OTP request already in progress. Please wait a moment.");
  }

  sendInFlight = true;
  try {
    try {
      return await requestOtpWithVerifier(normalized, containerId);
    } catch (error) {
      // One automatic recovery if a stale widget was left on the host.
      if (isAlreadyRenderedError(error)) {
        clearPhoneRecaptcha();
        await new Promise((r) => setTimeout(r, 150));
        return await requestOtpWithVerifier(normalized, containerId);
      }
      throw error;
    }
  } catch (error) {
    clearPhoneRecaptcha();
    if (error instanceof Error && "code" in error) {
      console.error(
        "[phone-otp] Firebase error code:",
        (error as { code?: string }).code,
        error.message
      );
    } else if (error instanceof Error) {
      console.error("[phone-otp]", error.message);
    }

    if (isAlreadyRenderedError(error)) {
      throw new Error(
        "Security check failed to reset. Refresh the page, then tap Send OTP again."
      );
    }

    throw new Error(
      mapFirebaseError(error, "Failed to send OTP. Please try again.", "phone")
    );
  } finally {
    sendInFlight = false;
  }
}

function isDemoVerificationId(verificationId: string): boolean {
  return verificationId.startsWith(DEMO_VERIFICATION_PREFIX);
}

export async function verifyPhoneOtp(
  verificationId: string,
  otpCode: string
): Promise<void> {
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
    clearPhoneRecaptcha();
  } catch (error) {
    if (error instanceof FirebaseError && error.code === "auth/provider-already-linked") {
      clearPhoneRecaptcha();
      return;
    }
    throw new Error(
      mapFirebaseError(error, "Invalid or expired OTP. Please try again.", "phone")
    );
  }
}
