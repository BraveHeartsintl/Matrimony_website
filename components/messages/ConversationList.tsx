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
      <div className="flex h-full min-h-0 items-center justify-center p-6 text-sm text-muted">
        No conversations yet
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 divide-y divide-border overflow-y-auto overscroll-contain">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          type="button"
          onClick={() => onSelect(conv.id)}
          className={cn(
            "glass-list-hover flex w-full items-center gap-3 p-4 text-left transition-colors",
            activeId === conv.id && "border-l-2 border-accent glass-subtle"
          )}
        >
          <Avatar src={conv.participantPhoto} name={conv.participantName} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium text-foreground">
                {conv.participantName}
              </span>
              <span className="shrink-0 text-xs text-muted">
                {formatRelativeTime(conv.lastMessageAt)}
              </span>
            </div>
            <p className="truncate text-xs text-muted">{conv.lastMessage || "Start chatting"}</p>
          </div>
          {conv.unreadCount > 0 && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs text-white">
              {conv.unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
