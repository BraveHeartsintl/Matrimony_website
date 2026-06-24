"use client";

import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  getPendingVerifications,
  removePendingVerification,
} from "@/lib/auth";
import { PENDING_VERIFICATIONS } from "@/lib/mock/admin";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

interface PendingUser {
  id: string;
  name: string;
  email: string;
  location?: string;
  religion?: string;
  joinedAt?: string;
  source: "localStorage" | "mock";
}

export default function AdminVerificationPage() {
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [verified, setVerified] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  useEffect(() => {
    const fromStorage = getPendingVerifications().map((s) => ({
      id: s.userId,
      name: s.name,
      email: s.email,
      joinedAt: s.submittedAt.split("T")[0],
      source: "localStorage" as const,
    }));
    const mockIds = new Set(fromStorage.map((u) => u.id));
    const fromMock = PENDING_VERIFICATIONS.filter((u) => !mockIds.has(u.id)).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      location: u.location,
      religion: u.religion,
      joinedAt: u.joinedAt,
      source: "mock" as const,
    }));
    setPending([...fromStorage, ...fromMock]);
  }, []);

  const handleVerify = (id: string, source: PendingUser["source"]) => {
    setVerified((prev) => [...prev, id]);
    setPending((prev) => prev.filter((u) => u.id !== id));
    if (source === "localStorage") {
      removePendingVerification(id);
    }
  };

  const handleReject = (id: string, source: PendingUser["source"]) => {
    setRejected((prev) => [...prev, id]);
    setPending((prev) => prev.filter((u) => u.id !== id));
    if (source === "localStorage") {
      removePendingVerification(id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Profile Verification</h1>
        <p className="text-sm text-muted">
          Review and approve member profile verifications (includes localStorage submissions)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="text-center">
          <p className="text-3xl font-bold text-accent">{pending.length}</p>
          <p className="text-sm text-muted">Pending Review</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-accent">{verified.length}</p>
          <p className="text-sm text-muted">Approved Today</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-foreground">{rejected.length}</p>
          <p className="text-sm text-muted">Rejected Today</p>
        </Card>
      </div>

      {pending.length === 0 ? (
        <Card className="py-16 text-center">
          <p className="text-lg font-medium text-foreground">All caught up!</p>
          <p className="mt-1 text-sm text-muted">No profiles pending verification</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {pending.map((user) => (
            <Card key={user.id}>
              <div className="flex items-start gap-4">
                <Avatar name={user.name} size="lg" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{user.name}</h3>
                  <p className="text-sm text-muted">{user.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {user.location && `${user.location} · `}
                    {user.religion && `${user.religion} · `}
                    Submitted {user.joinedAt}
                    {user.source === "localStorage" && " · Live submission"}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleVerify(user.id, user.source)}
                >
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleReject(user.id, user.source)}
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
