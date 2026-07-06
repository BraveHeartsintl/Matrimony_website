"use client";

import ChatWindow from "@/components/messages/ChatWindow";
import ConversationList from "@/components/messages/ConversationList";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useConversations, useMessages } from "@/hooks/useConversations";
import { useInterests } from "@/hooks/useInterests";
import { canAccess, getNextOnboardingRoute } from "@/lib/onboarding/access";
import {
  fetchSearchProfiles,
  getPublicSearchProfile,
  resolveProfileId,
} from "@/lib/firebase/services/search.service";
import { getConversationId } from "@/lib/firebase/services/message.service";
import type { Conversation } from "@/lib/types";
import { Lock, Loader2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function buildConversationStub(
  convId: string,
  participantId: string,
  participantName: string,
  participantPhoto: string,
  lastMessage = "Start the conversation…"
): Conversation {
  return {
    id: convId,
    participantId,
    participantName,
    participantPhoto,
    lastMessage,
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
  };
}

function mergeConversations(...groups: Conversation[][]): Conversation[] {
  const byId = new Map<string, Conversation>();
  for (const group of groups) {
    for (const conv of group) {
      const existing = byId.get(conv.id);
      if (!existing) {
        byId.set(conv.id, conv);
        continue;
      }
      const preferNew =
        conv.lastMessage &&
        conv.lastMessage !== "Start the conversation…" &&
        (!existing.lastMessage || existing.lastMessage === "Start the conversation…");
      byId.set(conv.id, preferNew ? conv : existing);
    }
  }
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );
}

export default function MessagesClient() {
  const { session, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const withUserId = searchParams.get("with");

  const status = session?.profile.onboardingStatus ?? "basic_registered";
  const canChat = canAccess(status, "direct_chat");
  const nextRoute = getNextOnboardingRoute(status);

  const [profileLookup, setProfileLookup] = useState(
    () => new Map<string, { name: string; photo: string }>()
  );
  const [openingChat, setOpeningChat] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const syncedInterestIds = useRef(new Set<string>());
  const openedWithRef = useRef<string | null>(null);

  useEffect(() => {
    if (!session) return;
    void (async () => {
      const profiles = await fetchSearchProfiles(session.user.id);
      const map = new Map<string, { name: string; photo: string }>();
      map.set(session.user.id, {
        name: session.user.name,
        photo: session.profile.photos[0] ?? "",
      });
      profiles.forEach((p) => map.set(p.id, { name: p.name, photo: p.photos[0] ?? "" }));
      setProfileLookup(map);
    })();
  }, [session]);

  const { interests } = useInterests(session?.user.id);
  const { conversations, loading, error: convError, openWith, authReady } = useConversations(
    session?.user.id,
    profileLookup
  );

  const interestConversations = useMemo(() => {
    if (!session) return [];
    return interests.map((interest) => {
      const otherRawId =
        interest.fromUserId === session.user.id ? interest.toUserId : interest.fromUserId;
      const otherId = resolveProfileId(otherRawId);
      const isReceived = interest.toUserId === session.user.id;
      const lookup = profileLookup.get(otherId);
      return buildConversationStub(
        getConversationId(session.user.id, otherId),
        otherId,
        (isReceived ? interest.fromUserName : interest.toUserName) ?? lookup?.name ?? "Member",
        (isReceived ? interest.fromUserPhoto : interest.toUserPhoto) ?? lookup?.photo ?? ""
      );
    });
  }, [interests, session, profileLookup]);

  const displayConversations = useMemo(
    () => mergeConversations(conversations, interestConversations),
    [conversations, interestConversations]
  );

  const ensureConversation = useCallback(
    async (conv: Conversation) => {
      if (!session) return conv.id;
      const lookup =
        profileLookup.get(conv.participantId) ??
        (await getPublicSearchProfile(conv.participantId).then((p) =>
          p ? { name: p.name, photo: p.photos[0] ?? "" } : null
        ));

      return openWith(conv.participantId, {
        participantName: conv.participantName || lookup?.name || "Member",
        participantPhoto: conv.participantPhoto || lookup?.photo || "",
        currentUserName: session.user.name,
        currentUserPhoto: session.profile.photos[0] ?? "",
      });
    },
    [session, profileLookup, openWith]
  );

  useEffect(() => {
    if (!session || !canChat || !authReady || interests.length === 0) return;

    void (async () => {
      for (const interest of interests) {
        if (syncedInterestIds.current.has(interest.id)) continue;
        syncedInterestIds.current.add(interest.id);

        const otherRawId =
          interest.fromUserId === session.user.id ? interest.toUserId : interest.fromUserId;
        const otherId = resolveProfileId(otherRawId);
        const isReceived = interest.toUserId === session.user.id;

        try {
          await openWith(otherId, {
            participantName: (isReceived ? interest.fromUserName : interest.toUserName) ?? "Member",
            participantPhoto: (isReceived ? interest.fromUserPhoto : interest.toUserPhoto) ?? "",
            currentUserName: session.user.name,
            currentUserPhoto: session.profile.photos[0] ?? "",
          });
        } catch (err) {
          syncedInterestIds.current.delete(interest.id);
          setPageError(err instanceof Error ? err.message : "Could not sync conversations");
        }
      }
    })();
  }, [session, canChat, authReady, interests, openWith]);

  useEffect(() => {
    if (!session || !withUserId || !canChat || !authReady) return;
    if (openedWithRef.current === withUserId) return;

    const otherId = resolveProfileId(withUserId);
    let cancelled = false;

    void (async () => {
      setOpeningChat(true);
      setPageError(null);
      try {
        let lookup = profileLookup.get(otherId) ?? profileLookup.get(withUserId);
        if (!lookup) {
          const profile = await getPublicSearchProfile(withUserId);
          if (profile) {
            lookup = { name: profile.name, photo: profile.photos[0] ?? "" };
            if (!cancelled) {
              setProfileLookup((prev) => {
                const next = new Map(prev);
                next.set(otherId, lookup!);
                return next;
              });
            }
          }
        }

        const convId = await openWith(otherId, {
          participantName: lookup?.name ?? "Member",
          participantPhoto: lookup?.photo ?? "",
          currentUserName: session.user.name,
          currentUserPhoto: session.profile.photos[0] ?? "",
        });

        if (!cancelled && convId) {
          openedWithRef.current = withUserId;
          setActiveConvId(convId);
        }
      } catch (err) {
        if (!cancelled) {
          setPageError(err instanceof Error ? err.message : "Could not open conversation");
        }
      } finally {
        if (!cancelled) setOpeningChat(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user.id, withUserId, canChat, authReady, openWith, profileLookup]);

  useEffect(() => {
    if (activeConvId || displayConversations.length === 0) return;
    setActiveConvId(displayConversations[0]?.id ?? null);
  }, [displayConversations, activeConvId]);

  const activeConvIdResolved = activeConvId ?? displayConversations[0]?.id ?? null;
  const activeConv =
    displayConversations.find((c) => c.id === activeConvIdResolved) ?? null;
  const { messages, send, error: msgError } = useMessages(activeConvIdResolved, session?.user.id);

  const handleSelectConversation = (convId: string) => {
    setActiveConvId(convId);
    setSendError(null);
    const conv = displayConversations.find((c) => c.id === convId);
    if (conv) void ensureConversation(conv);
  };

  const handleSend = async (content: string) => {
    if (!activeConv?.participantId || !session) return;
    setSendError(null);
    try {
      const convId = (await ensureConversation(activeConv)) ?? activeConvIdResolved;
      if (!convId) {
        throw new Error("Could not open conversation");
      }
      if (convId !== activeConvIdResolved) {
        setActiveConvId(convId);
      }
      await send(content, activeConv.participantId, convId);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Failed to send message");
      throw err;
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!session) return null;

  if (!canChat) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold">Messages</h1>
          <p className="text-sm text-muted">Chat with your connections</p>
        </div>
        <Card padding="lg" className="flex flex-col items-center py-12">
          <Lock className="h-12 w-12 text-accent" />
          <h2 className="mt-4 font-display text-xl font-semibold">Messaging locked</h2>
          <p className="mt-2 text-sm text-muted">
            {status === "basic_registered"
              ? "Complete your profile and verify your identity to start conversations."
              : status === "profile_completed" || status === "rejected"
                ? "Verify your identity to unlock direct messaging."
                : "Your verification is pending. Messaging unlocks once approved."}
          </p>
          {nextRoute && (
            <Link href={nextRoute} className="mt-6">
              <Button>
                <MessageCircle className="h-4 w-4" />
                {status === "basic_registered" ? "Complete Profile" : "Verify Identity"}
              </Button>
            </Link>
          )}
        </Card>
      </div>
    );
  }

  const displayError = pageError || convError || msgError || sendError;
  const showSpinner = (loading || openingChat) && displayConversations.length === 0;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Messages</h1>
        <p className="text-sm text-muted">Chat with your connections</p>
      </div>

      {displayError && (
        <p className="mb-4 rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {displayError}
        </p>
      )}

      <Card padding="sm" className="overflow-hidden p-0">
        {showSpinner ? (
          <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid h-[min(720px,calc(100vh-12rem))] min-h-[420px] grid-cols-1 overflow-hidden lg:grid-cols-3">
            <div className="min-h-0 overflow-hidden border-r border-border lg:col-span-1">
              <ConversationList
                conversations={displayConversations}
                activeId={activeConvIdResolved}
                onSelect={handleSelectConversation}
              />
            </div>
            <div className="min-h-0 overflow-hidden lg:col-span-2">
              {activeConv ? (
                <ChatWindow
                  conversation={activeConv}
                  messages={messages}
                  currentUserId={session.user.id}
                  onSend={handleSend}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-muted" />
                  <p className="mt-4 font-medium">No conversations yet</p>
                  <p className="mt-1 text-sm text-muted">
                    Send an interest or open a profile and tap <strong>Message</strong> to start
                    chatting
                  </p>
                  <Link href="/search" className="mt-4">
                    <Button size="sm">Browse Profiles</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
