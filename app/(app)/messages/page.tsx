"use client";

import ChatWindow from "@/components/messages/ChatWindow";
import ConversationList from "@/components/messages/ConversationList";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@/lib/mock/messages";
import type { Message } from "@/lib/types";
import { useState } from "react";

export default function MessagesPage() {
  const { session } = useAuth();
  const [activeConvId, setActiveConvId] = useState<string | null>(
    MOCK_CONVERSATIONS[0]?.id ?? null
  );
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);

  if (!session) return null;

  const activeConv = MOCK_CONVERSATIONS.find((c) => c.id === activeConvId) ?? null;
  const activeMessages = activeConvId ? messages[activeConvId] || [] : [];

  const handleSend = (content: string) => {
    if (!activeConvId) return;
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
      [activeConvId]: [...(prev[activeConvId] || []), newMsg],
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
              conversations={MOCK_CONVERSATIONS}
              activeId={activeConvId}
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
      {activeConvId && (
        <div className="fixed inset-0 z-50 bg-card lg:hidden">
          <div className="flex h-full flex-col">
            <button
              onClick={() => setActiveConvId(null)}
              className="border-b border-border p-4 text-left text-sm font-medium text-primary"
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
