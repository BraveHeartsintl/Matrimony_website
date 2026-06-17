"use client";

import ChatWindow from "@/components/messages/ChatWindow";
import ConversationList from "@/components/messages/ConversationList";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { filterCompatibleConversations } from "@/lib/matchmaking";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@/lib/mock/messages";
import { MOCK_PROFILES } from "@/lib/mock/profiles";
import type { Message } from "@/lib/types";
import { useMemo, useState } from "react";

const profilesByUserId = new Map(MOCK_PROFILES.map((p) => [p.userId, p]));

export default function MessagesPage() {
  const { session } = useAuth();
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

      {/* Mobile chat overlay */}
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
