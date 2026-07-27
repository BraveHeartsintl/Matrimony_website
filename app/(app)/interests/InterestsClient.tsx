"use client";

import InterestCard from "@/components/dashboard/InterestCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Tabs from "@/components/ui/Tabs";
import { useAuth } from "@/context/AuthContext";
import { useEnrichedInterests } from "@/hooks/useEnrichedInterests";
import { ArrowLeft, Heart, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const TABS = [
  { id: "received", label: "Received" },
  { id: "sent", label: "Sent" },
];

export default function InterestsClient() {
  const { session } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam === "sent" ? "sent" : "received";

  const userId = session?.user.id;
  const { received, sent, pendingReceived, loading } = useEnrichedInterests(userId);

  const receivedPending = useMemo(
    () => received.filter((i) => i.status === "pending"),
    [received]
  );
  const receivedOther = useMemo(
    () => received.filter((i) => i.status !== "pending"),
    [received]
  );

  if (!session) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="mb-3 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Interest Requests
          </h1>
          <p className="mt-1 text-sm text-muted">
            Review who is interested in you and manage requests you have sent.
          </p>
        </div>
        {pendingReceived.length > 0 && (
          <div className="rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
            {pendingReceived.length} waiting for your approval
          </div>
        )}
      </div>

      <Tabs
        tabs={TABS.map((tab) => ({
          ...tab,
          label:
            tab.id === "received" && pendingReceived.length > 0
              ? `Received (${pendingReceived.length})`
              : tab.id === "sent" && sent.length > 0
                ? `Sent (${sent.length})`
                : tab.label,
        }))}
        activeTab={activeTab}
        onChange={(id) => router.replace(`/interests?tab=${id}`)}
      />

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : activeTab === "received" ? (
        <div className="space-y-6">
          {receivedPending.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-accent">
                Approve or reject
              </h2>
              <div className="space-y-3">
                {receivedPending.map((interest) => (
                  <InterestCard
                    key={interest.id}
                    interest={interest}
                    currentUserId={session.user.id}
                    highlight
                  />
                ))}
              </div>
            </section>
          )}

          {receivedOther.length > 0 && (
            <section>
              {receivedPending.length > 0 && (
                <h2 className="mb-3 text-sm font-medium text-muted">Earlier requests</h2>
              )}
              <div className="space-y-3">
                {receivedOther.map((interest) => (
                  <InterestCard
                    key={interest.id}
                    interest={interest}
                    currentUserId={session.user.id}
                  />
                ))}
              </div>
            </section>
          )}

          {received.length === 0 && (
            <Card className="py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full glass">
                <Heart className="h-7 w-7 text-accent" />
              </div>
              <p className="mt-4 font-medium text-foreground">No interests received yet</p>
              <p className="mt-1 text-sm text-muted">
                When someone sends you an interest, they will appear here for approval.
              </p>
              <Link href="/search" className="mt-4 inline-block">
                <Button size="sm">
                  <Search className="h-4 w-4" />
                  Browse Profiles
                </Button>
              </Link>
            </Card>
          )}
        </div>
      ) : sent.length > 0 ? (
        <div className="space-y-3">
          {sent.map((interest) => (
            <InterestCard
              key={interest.id}
              interest={interest}
              currentUserId={session.user.id}
            />
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full glass">
            <Heart className="h-7 w-7 text-accent" />
          </div>
          <p className="mt-4 font-medium text-foreground">No interests sent yet</p>
          <p className="mt-1 text-sm text-muted">
            Send interests to profiles you like and track responses here.
          </p>
          <Link href="/search" className="mt-4 inline-block">
            <Button size="sm">
              <Search className="h-4 w-4" />
              Find Matches
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
