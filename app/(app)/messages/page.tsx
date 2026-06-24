"use client";

import ChatWindow from "@/components/messages/ChatWindow";
import ConversationList from "@/components/messages/ConversationList";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { canAccess, getNextOnboardingRoute } from "@/lib/onboarding/access";
import { filterCompatibleConversations } from "@/lib/matchmaking";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@/lib/mock/messages";
import { MOCK_PROFILES } from "@/lib/mock/profiles";
import type { Message } from "@/lib/types";
import { Lock, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const profilesByUserId = new Map(MOCK_PROFILES.map((p) => [p.userId, p]));

export default function MessagesPage() {
  const { session } = useAuth();
  const status = session?.profile.onboardingStatus ?? "basic_registered";
  const canChat = canAccess(status, "direct_chat");
  const nextRoute = getNextOnboardingRoute(status);

  const conversations = useMemo(() => {
    if (!session) return MOCK_CONVERSATIONS;
    return filterCompatibleConversations(
      MOCK_CONVERSATIONS,
      session.profile.gender,
      profilesByUserId
    );
  }, [session]);

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);

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

  const activeConvIdResolved = activeConvId ?? conversations[0]?.id ?? null;
  const activeConv = conversations.find((c) => c.id === activeConvIdResolved) ?? null;
  const activeMessages = activeConvIdResolved ? messages[activeConvIdResolved] || [] : [];

  const handleSend = (content: string) => {
    if (!activeConvIdResolved) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      fromUserId: session.user.id,
      toUserId: activeConv?.participantId || "",
      content,
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMessages((prev) => ({
      ...prev,
      [activeConvIdResolved]: [...(prev[activeConvIdResolved] || []), newMsg],
    }));
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Messages</h1>
        <p className="text-sm text-muted">Chat with your connections</p>
      </div>

      <Card padding="sm" className="overflow-hidden p-0">
        <div className="grid h-[calc(100vh-12rem)] lg:grid-cols-3">
          <div className="border-r border-border lg:col-span-1">
            <ConversationList
              conversations={conversations}
              activeId={activeConvIdResolved}
              onSelect={setActiveConvId}
            />
          </div>
          <div className="hidden lg:col-span-2 lg:block">
            <ChatWindow
              conversation={activeConv}
              messages={activeMessages}
              currentUserId={session.user.id}
              onSend={handleSend}
            />
          </div>
        </div>
      </Card>

      {activeConvIdResolved && (
        <div className="fixed inset-0 z-50 glass lg:hidden">
          <div className="flex h-full flex-col">
            <button
              onClick={() => setActiveConvId(null)}
              className="border-b border-border p-4 text-left text-xs font-medium uppercase tracking-wider text-accent"
            >
              &larr; Back to conversations
            </button>
            <ChatWindow
              conversation={activeConv}
              messages={activeMessages}
              currentUserId={session.user.id}
              onSend={handleSend}
            />
          </div>
        </div>
      )}
    </div>
  );
}
