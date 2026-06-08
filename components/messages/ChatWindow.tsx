"use client";

import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import type { Conversation, Message } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useState } from "react";

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  onSend: (content: string) => void;
}

export default function ChatWindow({
  conversation,
  messages,
  currentUserId,
  onSend,
}: ChatWindowProps) {
  const [text, setText] = useState("");

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted">
        Select a conversation to start chatting
      </div>
    );
  }

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border p-4">
        <Avatar src={conversation.participantPhoto} name={conversation.participantName} />
        <div>
          <h3 className="font-semibold">{conversation.participantName}</h3>
          <p className="text-xs text-muted">Online</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg) => {
          const isMine = msg.fromUserId === currentUserId;
          return (
            <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                  isMine
                    ? "rounded-br-sm bg-primary text-white"
                    : "rounded-bl-sm bg-border text-foreground"
                )}
              >
                <p>{msg.content}</p>
                <p
                  className={cn(
                    "mt-1 text-xs",
                    isMine ? "text-white/60" : "text-muted"
                  )}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 border-t border-border p-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <Button onClick={handleSend} disabled={!text.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
