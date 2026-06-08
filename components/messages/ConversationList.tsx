"use client";

import Avatar from "@/components/ui/Avatar";
import type { Conversation } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-muted">
        No conversations yet
      </div>
    );
  }

  return (
    <div className="divide-y divide-border overflow-y-auto">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={cn(
            "flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-background",
            activeId === conv.id && "bg-primary/5"
          )}
        >
          <Avatar src={conv.participantPhoto} name={conv.participantName} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="truncate text-sm font-medium">{conv.participantName}</span>
              <span className="shrink-0 text-xs text-muted">
                {formatRelativeTime(conv.lastMessageAt)}
              </span>
            </div>
            <p className="truncate text-xs text-muted">{conv.lastMessage}</p>
          </div>
          {conv.unreadCount > 0 && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
              {conv.unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
