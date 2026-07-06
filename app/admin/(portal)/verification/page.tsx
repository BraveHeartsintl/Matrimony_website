"use client";

import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  approveMemberVerification,
  rejectMemberVerification,
} from "@/lib/firebase/services/admin.service";
import { getPendingVerifications } from "@/lib/firebase/services/profile.service";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

interface PendingUser {
  id: string;
  name: string;
  email: string;
  joinedAt?: string;
}

export default function AdminVerificationPage() {
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [verified, setVerified] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  const load = async () => {
    const fromFirestore = (await getPendingVerifications()).map((s) => ({
      id: s.userId,
      name: s.name,
      email: s.email,
      joinedAt: s.submittedAt.split("T")[0],
    }));
    setPending(fromFirestore);
  };

  useEffect(() => {
    void load();
  }, []);

  const handleVerify = async (id: string) => {
    await approveMemberVerification(id);
    setVerified((prev) => [...prev, id]);
    setPending((prev) => prev.filter((u) => u.id !== id));
  };

  const handleReject = async (id: string) => {
    await rejectMemberVerification(id, "Documents could not be verified");
    setRejected((prev) => [...prev, id]);
    setPending((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Profile Verification</h1>
        <p className="text-sm text-muted">
          Review and approve member profile verifications from Firestore
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
          <Card key={user.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={user.name} size="lg" />
              <div>
                <p className="font-semibold text-foreground">{user.name}</p>
                <p className="text-sm text-muted">{user.email}</p>
                {user.joinedAt && (
                  <p className="text-xs text-muted-foreground">Submitted {user.joinedAt}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => void handleVerify(user.id)}>
                <Check className="h-4 w-4" />
                Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => void handleReject(user.id)}>
                <X className="h-4 w-4" />
                Reject
              </Button>
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
