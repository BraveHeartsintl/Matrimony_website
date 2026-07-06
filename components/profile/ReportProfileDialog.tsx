"use client";

import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useAuth } from "@/context/AuthContext";
import { REPORT_REASONS } from "@/lib/constants";
import { submitReport } from "@/lib/firebase/services/report.service";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface ReportProfileDialogProps {
  profileId: string;
  profileName: string;
  open: boolean;
  onClose: () => void;
}

export default function ReportProfileDialog({
  profileId,
  profileName,
  open,
  onClose,
}: ReportProfileDialogProps) {
  const { session } = useAuth();
  const [reason, setReason] = useState<string>(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!session) {
      setError("Sign in to report a profile.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await submitReport({
        reporterId: session.user.id,
        reporterName: session.user.name,
        reportedId: profileId,
        reportedName: profileName,
        reason: details.trim() ? `${reason}: ${details.trim()}` : reason,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit report");
    } finally {
      setBusy(false);
    }
  };

  const handleClose = () => {
    setDone(false);
    setDetails("");
    setReason(REPORT_REASONS[0]);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-[12px] border border-accent/10 bg-surface p-6 shadow-xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 text-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {done ? (
          <div className="text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-accent" />
            <h3 className="mt-4 font-display text-lg font-bold">Report submitted</h3>
            <p className="mt-2 text-sm text-muted">
              Our team will review your report. Thank you for helping keep UK Matrimony safe.
            </p>
            <Button className="mt-6" onClick={handleClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <h3 className="font-display text-lg font-bold">Report profile</h3>
            <p className="mt-1 text-sm text-muted">
              Report <span className="font-medium text-foreground">{profileName}</span> for review by
              our moderation team.
            </p>

            <div className="mt-5 space-y-4">
              <Select
                label="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                options={REPORT_REASONS.map((r) => ({ value: r, label: r }))}
              />
              <Textarea
                label="Additional details (optional)"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Provide any extra context that may help our team..."
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleClose} disabled={busy}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={() => void handleSubmit()} disabled={busy}>
                  {busy ? "Submitting…" : "Submit Report"}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
