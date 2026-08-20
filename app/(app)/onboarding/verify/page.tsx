"use client";

import OnboardingShell from "@/components/onboarding/OnboardingShell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { MOCK_OTP_CODE, ID_DOCUMENT_TYPES } from "@/lib/constants";
import type { IdDocumentType } from "@/lib/types";
import Select from "@/components/ui/Select";
import {
  clearPhoneRecaptcha,
  isPhoneDemoMode,
  isValidPhoneNumber,
  normalizePhoneNumber,
  sendPhoneOtp,
  verifyPhoneOtp,
} from "@/lib/firebase/services/phone.service";
import {
  isAuthEmailVerified,
  sendAccountVerificationEmail,
} from "@/lib/firebase/services/email.service";
import { uploadVerificationDoc } from "@/lib/firebase/services/storage.service";
import { startVeriffSession } from "@/lib/firebase/services/veriff.service";
import { getFirebaseAuth } from "@/lib/firebase/config";
import { Check, Clock, ShieldCheck, Upload } from "lucide-react";
import { reload } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { flushSync } from "react-dom";
import { Suspense, useEffect, useRef, useState } from "react";

const STEPS = [
  "Mobile OTP",
  "Email Verification",
  "ID Document",
  "Optional Documents",
  "Review & Submit",
] as const;

function isVeriffIdentityDone(status: string | undefined, sessionId: string | undefined): boolean {
  if (!sessionId) return false;
  const s = (status ?? "").toLowerCase();
  return ["approved", "started", "submitted", "review", "resubmission_requested"].includes(s) || s.length > 0;
}

function OnboardingVerifyContent() {
  const { session, updateVerification, submitVerificationRequest } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [recaptchaKey, setRecaptchaKey] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [startingVeriff, setStartingVeriff] = useState(false);

  const eduInputRef = useRef<HTMLInputElement>(null);
  const empInputRef = useRef<HTMLInputElement>(null);

  const verification = session?.profile.verification;
  const status = session?.profile.onboardingStatus;

  useEffect(() => {
    if (!session) return;
    if (status === "verified") router.replace("/dashboard");
    if (status === "basic_registered") router.replace("/onboarding/profile");
  }, [session, status, router]);

  useEffect(() => {
    setPhone(session?.profile.verification.phone ?? "");
  }, [session?.profile.verification.phone]);

  useEffect(() => {
    return () => {
      clearPhoneRecaptcha();
    };
  }, []);

  useEffect(() => {
    if (step !== 1) return;
    const user = getFirebaseAuth().currentUser;
    if (!user) return;
    void reload(user)
      .then(() => {
        if (isAuthEmailVerified()) {
          void updateVerification({ emailVerified: true });
        }
      })
      .catch(() => {
        // Auth reload failed — user can still confirm manually
      });
  }, [step, updateVerification]);

  useEffect(() => {
    if (searchParams.get("veriff") !== "returned") return;
    setStep(2);
    setError("");
    if (session?.profile.verification.veriffSessionId) {
      void updateVerification({
        veriffStatus: session.profile.verification.veriffStatus ?? "submitted",
      });
    }
  }, [searchParams, session?.profile.verification.veriffSessionId, session?.profile.verification.veriffStatus, updateVerification]);

  if (!session || !verification) return null;

  if (status === "verification_pending") {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <Card padding="lg">
          <Clock className="mx-auto h-12 w-12 text-accent" />
          <h1 className="mt-4 font-display text-2xl font-bold">Verification Pending</h1>
          <p className="mt-2 text-sm text-muted">
            Your identity check was submitted
            {verification.submittedAt
              ? ` on ${new Date(verification.submittedAt).toLocaleDateString()}`
              : ""}
            . You will be notified once it is complete.
          </p>
        </Card>
      </div>
    );
  }

  if (status === "verified") return null;

  const goToStep = (next: number) => {
    setError("");
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const phoneDemoMode = isPhoneDemoMode();

  const remountRecaptcha = () => {
    clearPhoneRecaptcha();
    flushSync(() => {
      setRecaptchaKey((k) => k + 1);
    });
  };

  const handlePhoneVerify = async () => {
    const trimmed = phone.trim();
    if (!trimmed) {
      setError("Enter your phone number");
      return;
    }
    if (!isValidPhoneNumber(trimmed)) {
      setError("Use international format, e.g. +91 98765 43210");
      return;
    }

    setSendingOtp(true);
    setError("");
    try {
      const normalized = normalizePhoneNumber(trimmed);
      if (!phoneDemoMode) {
        remountRecaptcha();
      }
      const id = await sendPhoneOtp(
        normalized,
        phoneDemoMode ? "recaptcha-skip" : "recaptcha-container"
      );
      setVerificationId(id);
      updateVerification({ phone: normalized });
      setOtpSent(true);
      setOtpCode("");
    } catch (err) {
      remountRecaptcha();
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!verificationId) {
      setError("Request an OTP first");
      return;
    }

    setVerifyingOtp(true);
    setError("");
    try {
      await verifyPhoneOtp(verificationId, otpCode);
      updateVerification({ phoneVerified: true });
      setVerificationId(null);
      remountRecaptcha();
      goToStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleChangeNumber = () => {
    setOtpSent(false);
    setOtpCode("");
    setVerificationId(null);
    remountRecaptcha();
    setError("");
  };

  const handleEmailVerify = async () => {
    setSendingEmail(true);
    setError("");
    try {
      const result = await sendAccountVerificationEmail();
      if (result.alreadyVerified) {
        await updateVerification({ emailVerified: true });
        goToStep(2);
        return;
      }
      setEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send verification email");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleEmailConfirmed = async () => {
    setError("");
    const authUser = getFirebaseAuth().currentUser;
    if (!authUser) {
      setError("You must be logged in");
      return;
    }
    await reload(authUser);
    if (isAuthEmailVerified()) {
      updateVerification({ emailVerified: true });
      goToStep(2);
    } else {
      setError("Email not verified yet. Click the link in your inbox, then try again.");
    }
  };

  const handleStartVeriff = async () => {
    if (!verification.idDocumentType) {
      setError("Select an ID document type first (e.g. Passport)");
      return;
    }
    setStartingVeriff(true);
    setError("");
    try {
      const { sessionId, sessionUrl } = await startVeriffSession(verification.idDocumentType);
      await updateVerification({
        veriffSessionId: sessionId,
        veriffStatus: "started",
        rejectionReason: undefined,
      });
      window.location.assign(sessionUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start Veriff");
      setStartingVeriff(false);
    }
  };

  const identityDone = isVeriffIdentityDone(verification.veriffStatus, verification.veriffSessionId);
  const veriffApproved = (verification.veriffStatus ?? "").toLowerCase() === "approved";

  const handleSubmit = async () => {
    if (!verification.phoneVerified || !verification.emailVerified) {
      setError("Complete phone and email verification first");
      return;
    }
    if (!identityDone) {
      setError("Complete identity verification with Veriff first");
      return;
    }
    setError("");
    try {
      if (veriffApproved) {
        router.push("/dashboard");
        return;
      }
      await submitVerificationRequest();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit verification");
    }
  };

  return (
    <OnboardingShell
      steps={STEPS}
      currentStep={step}
      title="Verify Identity"
      subtitle="Unlock messaging and contact details"
    >
      <Card padding="lg">
        {status === "rejected" && verification.rejectionReason && (
          <div className="mb-6 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            Rejected: {verification.rejectionReason}. Please resubmit.
          </div>
        )}

        <p className="section-label">Step {step + 1}</p>
        <h1 className="mt-1 font-display text-2xl font-bold">{STEPS[step]}</h1>

        <div className="mt-8 space-y-5">
          {step === 0 && (
            <>
              {!phoneDemoMode && (
                <div key={recaptchaKey} id="recaptcha-container" />
              )}
              <Input
                label="Mobile Number"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                disabled={verification.phoneVerified || otpSent}
              />
              <p className="text-xs text-muted">
                {phoneDemoMode
                  ? "Demo mode: enter any valid number with country code, then use the demo OTP below."
                  : "Include country code (e.g. +91 for India). We'll text you a 6-digit code."}
              </p>
              {!verification.phoneVerified && !otpSent && (
                <Button onClick={() => void handlePhoneVerify()} disabled={sendingOtp}>
                  {sendingOtp ? "Sending OTP…" : "Send OTP"}
                </Button>
              )}
              {otpSent && !verification.phoneVerified && (
                <>
                  <Input
                    label="Enter 6-digit OTP"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                  />
                  {phoneDemoMode && (
                    <p className="rounded-[6px] glass-subtle border-dashed px-3 py-2 text-center text-xs text-muted">
                      Demo OTP: <span className="font-semibold text-foreground">{MOCK_OTP_CODE}</span>
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => void handleOtpSubmit()} disabled={verifyingOtp || otpCode.length !== 6}>
                      {verifyingOtp ? "Verifying…" : "Verify OTP"}
                    </Button>
                    <Button variant="outline" onClick={handleChangeNumber} disabled={sendingOtp || verifyingOtp}>
                      Change number
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => void handlePhoneVerify()}
                      disabled={sendingOtp || verifyingOtp}
                    >
                      {sendingOtp ? "Resending…" : "Resend OTP"}
                    </Button>
                  </div>
                </>
              )}
              {verification.phoneVerified && (
                <p className="flex items-center gap-2 text-sm text-accent">
                  <Check className="h-4 w-4" /> Phone verified
                </p>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <p className="text-sm text-muted">
                We&apos;ll send a verification link to{" "}
                <strong>{session.user.email}</strong>
              </p>
              {!verification.emailVerified ? (
                <div className="space-y-3">
                  <Button onClick={() => void handleEmailVerify()} disabled={sendingEmail}>
                    {sendingEmail
                      ? "Sending…"
                      : emailSent
                        ? "Resend Verification Email"
                        : "Send Verification Email"}
                  </Button>
                  {emailSent && (
                    <>
                      <p className="rounded-[6px] glass-subtle px-3 py-2 text-xs text-muted">
                        We sent a message from UK Indian Matrimony. Open it and tap
                        <span className="font-semibold text-foreground"> Verify email address</span>.
                        If it is not in your inbox within a minute, check Spam and Promotions.
                      </p>
                      <Button variant="outline" onClick={() => void handleEmailConfirmed()}>
                        I&apos;ve verified my email
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <p className="flex items-center gap-2 text-sm text-accent">
                  <Check className="h-4 w-4" /> Email verified
                </p>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <Select
                label="ID Document Type"
                value={verification.idDocumentType ?? ""}
                onChange={(e) =>
                  updateVerification({ idDocumentType: e.target.value as IdDocumentType })
                }
                options={[
                  { value: "", label: "Select document" },
                  ...ID_DOCUMENT_TYPES.map((d) => ({ value: d.value, label: d.label })),
                ]}
              />
              <p className="text-sm text-muted">
                You will be taken to Veriff to scan your{" "}
                {verification.idDocumentType
                  ? ID_DOCUMENT_TYPES.find((d) => d.value === verification.idDocumentType)?.label.toLowerCase() ??
                    "document"
                  : "document"}{" "}
                and take a live selfie. When finished, Veriff sends you back to the website automatically.
              </p>
              {veriffApproved ? (
                <p className="flex items-center gap-2 text-sm text-accent">
                  <Check className="h-4 w-4" /> Identity verified with Veriff
                </p>
              ) : identityDone ? (
                <div className="space-y-3">
                  <p className="flex items-center gap-2 text-sm text-accent">
                    <Clock className="h-4 w-4" /> Veriff check in progress
                    {verification.veriffStatus ? ` (${verification.veriffStatus})` : ""}
                  </p>
                  <p className="text-xs text-muted">
                    If you finished in Veriff, continue. Or open Veriff again to resubmit.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => void handleStartVeriff()}
                    disabled={startingVeriff || !verification.idDocumentType}
                  >
                    {startingVeriff ? "Opening Veriff…" : "Open Veriff again"}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => void handleStartVeriff()}
                  disabled={startingVeriff || !verification.idDocumentType}
                >
                  <ShieldCheck className="h-4 w-4" />
                  {startingVeriff
                    ? "Opening Veriff…"
                    : verification.idDocumentType === "passport"
                      ? "Verify passport with Veriff"
                      : "Verify ID with Veriff"}
                </Button>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-sm text-muted">Optional — improves trust score</p>
              <input
                ref={eduInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !session) return;
                  setUploadingDoc(true);
                  setError("");
                  try {
                    const url = await uploadVerificationDoc(session.user.id, file, "education");
                    await updateVerification({ educationDocPreview: url });
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Upload failed");
                  } finally {
                    setUploadingDoc(false);
                    e.target.value = "";
                  }
                }}
              />
              <input
                ref={empInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !session) return;
                  setUploadingDoc(true);
                  setError("");
                  try {
                    const url = await uploadVerificationDoc(session.user.id, file, "employment");
                    await updateVerification({ employmentDocPreview: url });
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Upload failed");
                  } finally {
                    setUploadingDoc(false);
                    e.target.value = "";
                  }
                }}
              />
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => eduInputRef.current?.click()}
                  disabled={uploadingDoc}
                >
                  <Upload className="h-4 w-4" />
                  {verification.educationDocPreview ? "Education ✓" : "Education Certificate"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => empInputRef.current?.click()}
                  disabled={uploadingDoc}
                >
                  <Upload className="h-4 w-4" />
                  {verification.employmentDocPreview ? "Employment ✓" : "Employment Proof"}
                </Button>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                {verification.phoneVerified ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <span className="h-4 w-4" />
                )}
                Mobile verified
              </p>
              <p className="flex items-center gap-2">
                {verification.emailVerified ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <span className="h-4 w-4" />
                )}
                Email verified
              </p>
              <p className="flex items-center gap-2">
                {identityDone ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <span className="h-4 w-4" />
                )}
                Identity (Veriff)
                {verification.veriffStatus ? ` — ${verification.veriffStatus}` : ""}
              </p>
            </div>
          )}

          {error && <p className="feedback-error">{error}</p>}

          <div className="flex gap-3 pt-4">
            {step > 0 && step < 4 && (
              <Button variant="outline" onClick={() => goToStep(step - 1)}>
                Back
              </Button>
            )}
            {step < 4 ? (
              <Button
                className="flex-1"
                onClick={() => {
                  if (step === 0 && verification.phoneVerified) goToStep(1);
                  else if (step === 1 && verification.emailVerified) goToStep(2);
                  else if (step === 2 && identityDone) goToStep(3);
                  else if (step === 3) goToStep(4);
                  else setError("Complete this step before continuing");
                }}
              >
                Continue
              </Button>
            ) : (
              <Button className="flex-1" onClick={() => void handleSubmit()}>
                {veriffApproved ? "Continue to dashboard" : "Submit for Review"}
              </Button>
            )}
            {step === 3 && (
              <Button variant="ghost" onClick={() => goToStep(4)}>
                Skip
              </Button>
            )}
          </div>
        </div>
      </Card>
    </OnboardingShell>
  );
}

export default function OnboardingVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg py-12 text-center text-sm text-muted">
          Loading verification…
        </div>
      }
    >
      <OnboardingVerifyContent />
    </Suspense>
  );
}
