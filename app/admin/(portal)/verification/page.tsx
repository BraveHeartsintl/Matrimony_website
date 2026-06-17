"use client";

import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { PENDING_VERIFICATIONS } from "@/lib/mock/admin";
import { Check, X } from "lucide-react";
import { useState } from "react";

export default function AdminVerificationPage() {
  const [pending, setPending] = useState(PENDING_VERIFICATIONS);
  const [verified, setVerified] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  const handleVerify = (id: string) => {
    setVerified((prev) => [...prev, id]);
    setPending((prev) => prev.filter((u) => u.id !== id));
  };

  const handleReject = (id: string) => {
    setRejected((prev) => [...prev, id]);
    setPending((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Profile Verification</h1>
        <p className="text-sm text-muted">Review and approve member profile verifications</p>
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
                    {user.location} &middot; {user.religion} &middot; Joined {user.joinedAt}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => handleVerify(user.id)}>
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleReject(user.id)}>
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
