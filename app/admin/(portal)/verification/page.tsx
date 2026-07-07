"use client";

import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  approveMemberVerification,
  rejectMemberVerification,
} from "@/lib/firebase/services/admin.service";
import { getPendingVerifications } from "@/lib/firebase/services/profile.service";
import type { PendingVerificationSubmission } from "@/lib/auth";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AdminVerificationPage() {
  const [pending, setPending] = useState<PendingVerificationSubmission[]>([]);
  const [verified, setVerified] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  const load = async () => {
    const fromFirestore = await getPendingVerifications();
    setPending(fromFirestore);
  };

  useEffect(() => {
    void load();
  }, []);

  const handleVerify = async (id: string) => {
    await approveMemberVerification(id);
    setVerified((prev) => [...prev, id]);
    setPending((prev) => prev.filter((u) => u.userId !== id));
  };

  const handleReject = async (id: string) => {
    await rejectMemberVerification(id, "Documents could not be verified");
    setRejected((prev) => [...prev, id]);
    setPending((prev) => prev.filter((u) => u.userId !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Profile Verification</h1>
        <p className="text-sm text-muted">
          Review uploaded ID documents and selfies from Firestore
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="text-center">
          <p className="text-3xl font-bold text-accent">{pending.length}</p>
          <p className="text-sm text-muted">Pending Review</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-foreground">{verified.length}</p>
          <p className="text-sm text-muted">Approved (session)</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-foreground">{rejected.length}</p>
          <p className="text-sm text-muted">Rejected (session)</p>
        </Card>
      </div>

      <div className="grid gap-4">
        {pending.map((user) => (
          <Card key={user.userId} className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar name={user.name} size="lg" />
                <div>
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <p className="text-sm text-muted">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Submitted {user.submittedAt.split("T")[0]}
                    {user.idDocumentType ? ` · ${user.idDocumentType}` : ""}
                    {user.stage === "in_progress" ? " · Upload in progress" : " · Ready for review"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => void handleVerify(user.userId)}>
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleReject(user.userId)}>
                  <X className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <DocPreview label="ID Document" src={user.idDocumentPreview} />
              <DocPreview label="Selfie" src={user.selfiePreview} round />
            </div>
          </Card>
        ))}
        {pending.length === 0 && (
          <Card className="py-12 text-center text-sm text-muted">No pending verifications</Card>
        )}
      </div>
    </div>
  );
}

function DocPreview({
  label,
  src,
  round = false,
}: {
  label: string;
  src?: string;
  round?: boolean;
}) {
  if (!src) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">
        {label} not uploaded
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div
        className={`relative mx-auto overflow-hidden border border-border bg-surface ${
          round ? "h-48 w-48 rounded-full" : "h-40 w-full rounded-lg"
        }`}
      >
        <Image
          src={src}
          alt={label}
          fill
          className={round ? "object-cover" : "object-contain"}
          unoptimized
        />
      </div>
    </div>
  );
}
