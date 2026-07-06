"use client";

import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { resolveProfileId } from "@/lib/firebase/services/search.service";
import type { Conversation, Message } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  onSend: (content: string) => Promise<void>;
}

function isOwnMessage(msg: Message, currentUserId: string): boolean {
  const current = resolveProfileId(currentUserId);
  const from = resolveProfileId(msg.fromUserId);
  return from === current || msg.fromUserId === currentUserId;
}

export default function ChatWindow({
  conversation,
  messages,
  currentUserId,
  onSend,
}: ChatWindowProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages, conversation?.id]);

  const handleSend = async () => {
    const content = text.trim();
    if (!content || isSending || !conversation) return;
    setIsSending(true);
    try {
      await onSend(content);
      setText("");
    } catch {
      // Parent shows error banner
    } finally {
      setIsSending(false);
    }
  };

  if (!conversation) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center text-sm text-muted">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-border p-4">
        <Avatar src={conversation.participantPhoto} name={conversation.participantName} />
        <div>
          <h3 className="font-semibold text-foreground">{conversation.participantName}</h3>
          <p className="text-xs text-muted">Online</p>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4"
      >
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No messages yet. Say hello!</p>
        ) : (
          messages.map((msg) => {
            const isMine = isOwnMessage(msg, currentUserId);
            const isPending = msg.id.startsWith("pending-");
            return (
              <div key={msg.id} className={cn("flex w-full", isMine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[75%] rounded-[6px] px-4 py-2 text-sm",
                    isMine
                      ? "bg-accent text-accent-foreground"
                      : "glass-bubble text-foreground",
                    isPending && "opacity-80"
                  )}
                >
                  <p className="break-words">{msg.content}</p>
                  <p className={cn("mt-1 text-xs", isMine ? "text-white/60" : "text-muted")}>
                    {isPending ? "Sending…" : formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex shrink-0 gap-2 border-t border-border bg-background p-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
          placeholder="Type a message..."
          disabled={isSending}
          className="glass-input min-w-0 flex-1 rounded-[8px] px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
        />
        <Button
          onClick={() => void handleSend()}
          disabled={!text.trim() || isSending}
          className="shrink-0"
        >
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
