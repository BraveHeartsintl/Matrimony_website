"use client";

import OnboardingShell from "@/components/onboarding/OnboardingShell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import ProgressBar from "@/components/ui/ProgressBar";
import Select from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import { ID_DOCUMENT_TYPES, MOCK_OTP_CODE } from "@/lib/constants";
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
import { getFirebaseAuth } from "@/lib/firebase/config";
import { profileHasPhoto } from "@/lib/profile-photos";
import type { IdDocumentType } from "@/lib/types";
import { Check, Clock, ShieldCheck, Upload } from "lucide-react";
import Image from "next/image";
import { reload } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const STEPS = [
  "Mobile OTP",
  "Email Verification",
  "ID Document",
  "Selfie Verification",
  "Optional Documents",
  "Review & Submit",
] as const;

export default function OnboardingVerifyPage() {
  const {
    session,
    updateProfile,
    updateVerification,
    submitVerificationRequest,
    simulateVerificationApproval,
  } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [aiChecking, setAiChecking] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [selfiePreviewLocal, setSelfiePreviewLocal] = useState<string | null>(null);
  const [idPreviewLocal, setIdPreviewLocal] = useState<string | null>(null);

  const idInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);
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

  if (!session || !verification) return null;

  if (status === "verification_pending") {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <Card padding="lg">
          <Clock className="mx-auto h-12 w-12 text-accent" />
          <h1 className="mt-4 font-display text-2xl font-bold">Verification Pending</h1>
          <p className="mt-2 text-sm text-muted">
            Your documents were submitted on{" "}
            {verification.submittedAt
              ? new Date(verification.submittedAt).toLocaleDateString()
              : "recently"}
            . Our team is reviewing your submission.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Demo: simulate admin approval to unlock full access.
          </p>
          <Button className="mt-6" onClick={simulateVerificationApproval}>
            <ShieldCheck className="h-4 w-4" />
            Simulate Admin Approval
          </Button>
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

  const runAiCheck = async (onComplete: () => void | Promise<void>) => {
    setAiChecking(true);
    setAiProgress(0);
    setError("");
    try {
      for (let i = 0; i <= 100; i += 20) {
        await new Promise((r) => setTimeout(r, 200));
        setAiProgress(i);
      }
      await onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      throw err;
    } finally {
      setAiChecking(false);
    }
  };

  const phoneDemoMode = isPhoneDemoMode();

  const handlePhoneVerify = async () => {
    const trimmed = phone.trim();
    if (!trimmed) {
      setError("Enter your phone number");
      return;
    }
    if (!isValidPhoneNumber(trimmed)) {
      setError("Use international format, e.g. +91 86885 38590");
      return;
    }

    setSendingOtp(true);
    setError("");
    try {
      const normalized = normalizePhoneNumber(trimmed);
      const containerId = phoneDemoMode ? "recaptcha-skip" : "recaptcha-container";
      const id = await sendPhoneOtp(normalized, containerId);
      setVerificationId(id);
      updateVerification({ phone: normalized });
      setOtpSent(true);
      setOtpCode("");
    } catch (err) {
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
    clearPhoneRecaptcha();
    setError("");
  };

  const handleEmailVerify = async () => {
    setEmailSent(true);
    setError("");
    try {
      await sendAccountVerificationEmail();
    } catch (err) {
      setEmailSent(false);
      setError(err instanceof Error ? err.message : "Failed to send verification email");
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

  const idDocumentPreview = idPreviewLocal ?? verification.idDocumentPreview;
  const selfiePreview = selfiePreviewLocal ?? verification.selfiePreview;

  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !verification.idDocumentType || !session) return;
    setUploadingDoc(true);
    setError("");
    try {
      await runAiCheck(async () => {
        const url = await uploadVerificationDoc(session.user.id, file, "id");
        await updateVerification({ idDocumentPreview: url });
        setIdPreviewLocal(url);
      });
    } catch (err) {
      setIdPreviewLocal(null);
      setError(err instanceof Error ? err.message : "Failed to save ID document");
    } finally {
      setUploadingDoc(false);
      e.target.value = "";
    }
  };

  const handleSelfieUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    setUploadingDoc(true);
    setError("");
    try {
      await runAiCheck(async () => {
        const url = await uploadVerificationDoc(session.user.id, file, "selfie");
        await updateVerification({ selfiePreview: url });
        if (!profileHasPhoto(session.profile)) {
          await updateProfile({ photos: [url] });
        }
        setSelfiePreviewLocal(url);
      });
    } catch (err) {
      setSelfiePreviewLocal(null);
      setError(err instanceof Error ? err.message : "Failed to save selfie");
    } finally {
      setUploadingDoc(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!verification.phoneVerified || !verification.emailVerified) {
      setError("Complete phone and email verification first");
      return;
    }
    if (!idDocumentPreview || !selfiePreview) {
      setError("ID document and selfie are required");
      return;
    }
    setError("");
    try {
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
                <div id="recaptcha-container" />
              )}
              <Input
                label="Mobile Number"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 86885 38590"
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
                  <Button onClick={() => void handleEmailVerify()} disabled={emailSent}>
                    {emailSent ? "Email Sent" : "Send Verification Email"}
                  </Button>
                  {emailSent && (
                    <Button variant="outline" onClick={() => void handleEmailConfirmed()}>
                      I&apos;ve verified my email
                    </Button>
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
              <input
                ref={idInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleIdUpload}
              />
              {idDocumentPreview ? (
                <div className="space-y-3">
                  <div className="relative h-40 overflow-hidden rounded-lg border">
                    <Image
                      src={idDocumentPreview}
                      alt="ID document"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <p className="flex items-center gap-2 text-sm text-accent">
                    <Check className="h-4 w-4" /> ID document saved to your account
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => idInputRef.current?.click()}
                    disabled={aiChecking || uploadingDoc}
                  >
                    Replace document
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => idInputRef.current?.click()}
                  disabled={!verification.idDocumentType || aiChecking || uploadingDoc}
                >
                  <Upload className="h-4 w-4" />
                  {uploadingDoc ? "Uploading…" : "Upload ID Document"}
                </Button>
              )}
              {aiChecking && (
                <div>
                  <p className="mb-2 text-xs text-muted">AI quality check…</p>
                  <ProgressBar value={aiProgress} />
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-sm text-muted">
                Upload a clear selfie for face matching with your profile photo.
              </p>
              <input
                ref={selfieInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={handleSelfieUpload}
              />
              {selfiePreview ? (
                <div className="space-y-3">
                  <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-full border">
                    <Image
                      src={selfiePreview}
                      alt="Selfie"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="flex items-center justify-center gap-2 text-sm text-accent">
                    <Check className="h-4 w-4" /> Selfie saved to your account
                  </p>
                  <p className="text-center text-xs text-muted">Face match: pending admin review</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mx-auto block"
                    onClick={() => selfieInputRef.current?.click()}
                    disabled={aiChecking || uploadingDoc}
                  >
                    Replace selfie
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => selfieInputRef.current?.click()}
                  disabled={aiChecking || uploadingDoc}
                >
                  <Upload className="h-4 w-4" />
                  {uploadingDoc ? "Uploading…" : "Upload Selfie"}
                </Button>
              )}
              {aiChecking && (
                <div>
                  <p className="mb-2 text-xs text-muted">AI quality check…</p>
                  <ProgressBar value={aiProgress} />
                </div>
              )}
            </>
          )}

          {step === 4 && (
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
                <Button variant="outline" onClick={() => eduInputRef.current?.click()}>
                  {verification.educationDocPreview ? "Education ✓" : "Education Certificate"}
                </Button>
                <Button variant="outline" onClick={() => empInputRef.current?.click()}>
                  {verification.employmentDocPreview ? "Employment ✓" : "Employment Proof"}
                </Button>
              </div>
            </>
          )}

          {step === 5 && (
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
                {idDocumentPreview ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <span className="h-4 w-4" />
                )}
                ID document uploaded
              </p>
              <p className="flex items-center gap-2">
                {selfiePreview ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <span className="h-4 w-4" />
                )}
                Selfie uploaded
              </p>
            </div>
          )}

          {error && <p className="feedback-error">{error}</p>}

          <div className="flex gap-3 pt-4">
            {step > 0 && step < 5 && (
              <Button variant="outline" onClick={() => goToStep(step - 1)}>
                Back
              </Button>
            )}
            {step < 5 ? (
              <Button
                className="flex-1"
                onClick={() => {
                  if (step === 0 && verification.phoneVerified) goToStep(1);
                  else if (step === 1 && verification.emailVerified) goToStep(2);
                  else if (step === 2 && idDocumentPreview) goToStep(3);
                  else if (step === 3 && selfiePreview) goToStep(4);
                  else if (step === 4) goToStep(5);
                  else setError("Complete this step before continuing");
                }}
              >
                Continue
              </Button>
            ) : (
              <Button className="flex-1" onClick={() => void handleSubmit()}>
                Submit for Review
              </Button>
            )}
            {step === 4 && (
              <Button variant="ghost" onClick={() => goToStep(5)}>
                Skip
              </Button>
            )}
          </div>
        </div>
      </Card>
    </OnboardingShell>
  );
}
