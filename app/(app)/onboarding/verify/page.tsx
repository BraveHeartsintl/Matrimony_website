"use client";

import OnboardingShell from "@/components/onboarding/OnboardingShell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import ProgressBar from "@/components/ui/ProgressBar";
import Select from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import { ID_DOCUMENT_TYPES, MOCK_OTP_CODE } from "@/lib/constants";
import type { IdDocumentType } from "@/lib/types";
import { Check, Clock, ShieldCheck, Upload } from "lucide-react";
import Image from "next/image";
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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function OnboardingVerifyPage() {
  const {
    session,
    updateVerification,
    submitVerificationRequest,
    simulateVerificationApproval,
  } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [aiChecking, setAiChecking] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);

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

  const runAiCheck = async (onComplete: () => void) => {
    setAiChecking(true);
    setAiProgress(0);
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((r) => setTimeout(r, 200));
      setAiProgress(i);
    }
    setAiChecking(false);
    onComplete();
  };

  const handlePhoneVerify = () => {
    if (!verification.phone) {
      setError("Enter your phone number");
      return;
    }
    setOtpSent(true);
    setError("");
  };

  const handleOtpSubmit = () => {
    if (otpCode !== MOCK_OTP_CODE) {
      setError(`Invalid code. Use ${MOCK_OTP_CODE} for demo.`);
      return;
    }
    updateVerification({ phoneVerified: true });
    goToStep(1);
  };

  const handleEmailVerify = async () => {
    setEmailSent(true);
    await new Promise((r) => setTimeout(r, 800));
    updateVerification({ emailVerified: true });
    goToStep(2);
  };

  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !verification.idDocumentType) return;
    const preview = await readFileAsDataUrl(file);
    await runAiCheck(() => {
      updateVerification({ idDocumentPreview: preview });
      goToStep(3);
    });
    e.target.value = "";
  };

  const handleSelfieUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = await readFileAsDataUrl(file);
    await runAiCheck(() => {
      updateVerification({ selfiePreview: preview });
      goToStep(4);
    });
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (!verification.phoneVerified || !verification.emailVerified) {
      setError("Complete phone and email verification first");
      return;
    }
    if (!verification.idDocumentPreview || !verification.selfiePreview) {
      setError("ID document and selfie are required");
      return;
    }
    submitVerificationRequest();
    router.push("/dashboard");
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
              <Input
                label="Mobile Number"
                value={verification.phone ?? ""}
                onChange={(e) => updateVerification({ phone: e.target.value })}
                placeholder="+44 7700 900000"
                disabled={verification.phoneVerified}
              />
              {!verification.phoneVerified && !otpSent && (
                <Button onClick={handlePhoneVerify}>Send OTP</Button>
              )}
              {otpSent && !verification.phoneVerified && (
                <>
                  <Input
                    label="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder={MOCK_OTP_CODE}
                    maxLength={6}
                  />
                  <p className="text-xs text-muted">Demo code: {MOCK_OTP_CODE}</p>
                  <Button onClick={handleOtpSubmit}>Verify OTP</Button>
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
                <Button onClick={handleEmailVerify} disabled={emailSent}>
                  {emailSent ? "Verifying…" : "Send Verification Email"}
                </Button>
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
              {verification.idDocumentPreview ? (
                <div className="relative h-40 overflow-hidden rounded-lg border">
                  <Image
                    src={verification.idDocumentPreview}
                    alt="ID document"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => idInputRef.current?.click()}
                  disabled={!verification.idDocumentType || aiChecking}
                >
                  <Upload className="h-4 w-4" />
                  Upload ID Document
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
              {verification.selfiePreview ? (
                <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-full border">
                  <Image
                    src={verification.selfiePreview}
                    alt="Selfie"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => selfieInputRef.current?.click()}
                  disabled={aiChecking}
                >
                  <Upload className="h-4 w-4" />
                  Upload Selfie
                </Button>
              )}
              {verification.selfiePreview && (
                <p className="text-xs text-muted">Face match: pending admin review</p>
              )}
              {aiChecking && <ProgressBar value={aiProgress} />}
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
                  if (file) {
                    const preview = await readFileAsDataUrl(file);
                    updateVerification({ educationDocPreview: preview });
                  }
                  e.target.value = "";
                }}
              />
              <input
                ref={empInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const preview = await readFileAsDataUrl(file);
                    updateVerification({ employmentDocPreview: preview });
                  }
                  e.target.value = "";
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
                {verification.idDocumentPreview ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <span className="h-4 w-4" />
                )}
                ID document uploaded
              </p>
              <p className="flex items-center gap-2">
                {verification.selfiePreview ? (
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
                  else if (step === 2 && verification.idDocumentPreview) goToStep(3);
                  else if (step === 3 && verification.selfiePreview) goToStep(4);
                  else if (step === 4) goToStep(5);
                  else setError("Complete this step before continuing");
                }}
              >
                Continue
              </Button>
            ) : (
              <Button className="flex-1" onClick={handleSubmit}>
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
