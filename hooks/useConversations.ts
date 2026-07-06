"use client";

import {
  getOrCreateConversation,
  markConversationRead,
  sendMessage,
  subscribeConversations,
  subscribeMessages,
} from "@/lib/firebase/services/message.service";
import { subscribeAuthState } from "@/lib/firebase/services/auth.service";
import type { Conversation, Message } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";

export function useConversations(
  userId: string | undefined,
  profileLookup: Map<string, { name: string; photo: string }>
) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const lookupRef = useRef(profileLookup);
  lookupRef.current = profileLookup;

  useEffect(() => {
    return subscribeAuthState((user) => setAuthReady(!!user));
  }, []);

  useEffect(() => {
    if (!userId || !authReady) {
      setConversations([]);
      setLoading(!authReady && !!userId);
      return;
    }
    setLoading(true);
    setError(null);
    const unsub = subscribeConversations(
      userId,
      () => lookupRef.current,
      (data) => {
        setConversations(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [userId, authReady]);

  const openWith = useCallback(
    async (
      otherUserId: string,
      meta: {
        participantName: string;
        participantPhoto: string;
        currentUserName?: string;
        currentUserPhoto?: string;
      }
    ) => {
      if (!userId) return null;
      return getOrCreateConversation(userId, otherUserId, meta);
    },
    [userId]
  );

  return { conversations, loading, error, openWith, authReady };
}

export function useMessages(conversationId: string | null, userId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const pendingRef = useRef<Map<string, Message>>(new Map());

  useEffect(() => {
    return subscribeAuthState((user) => setAuthReady(!!user));
  }, []);

  useEffect(() => {
    if (!conversationId || !authReady) {
      setMessages([]);
      setError(null);
      pendingRef.current.clear();
      return;
    }
    setLoading(true);
    setError(null);
    const unsub = subscribeMessages(
      conversationId,
      (data) => {
        const merged = [...data];
        for (const pending of pendingRef.current.values()) {
          const alreadySaved = data.some(
            (m) => m.content === pending.content && m.fromUserId === pending.fromUserId
          );
          if (!alreadySaved) merged.push(pending);
        }
        merged.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(merged);
        setLoading(false);
        if (userId) {
          void markConversationRead(conversationId, userId).catch(() => {});
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [conversationId, userId, authReady]);

  const send = useCallback(
    async (content: string, toUserId: string, conversationIdOverride?: string) => {
      const targetConversationId = conversationIdOverride ?? conversationId;
      if (!targetConversationId || !userId) {
        throw new Error("No active conversation");
      }

      const optimisticId = `pending-${Date.now()}`;
      const optimistic: Message = {
        id: optimisticId,
        fromUserId: userId,
        toUserId,
        content,
        timestamp: new Date().toISOString(),
        read: false,
      };
      pendingRef.current.set(optimisticId, optimistic);
      setMessages((prev) => [...prev, optimistic]);

      try {
        await sendMessage(targetConversationId, userId, toUserId, content);
        pendingRef.current.delete(optimisticId);
      } catch (err) {
        pendingRef.current.delete(optimisticId);
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        throw err;
      }
    },
    [conversationId, userId]
  );

  return { messages, loading, error, send };
}
