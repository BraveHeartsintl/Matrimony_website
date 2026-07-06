import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/config";
import { timestampToIso } from "@/lib/firebase/converters";
import { resolveProfileId } from "@/lib/firebase/services/search.service";
import type { Conversation, Message } from "@/lib/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";

function requireAuthUserId(): string {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) {
    throw new Error("You must be signed in to use messaging.");
  }
  return uid;
}

function participantMatches(participantId: string, userId: string): boolean {
  return (
    participantId === userId ||
    resolveProfileId(participantId) === resolveProfileId(userId)
  );
}

function conversationIdFor(userA: string, userB: string): string {
  const a = resolveProfileId(userA);
  const b = resolveProfileId(userB);
  return [a, b].sort().join("_");
}

export function getConversationId(userA: string, userB: string): string {
  return conversationIdFor(userA, userB);
}

function mapMessage(docId: string, data: Record<string, unknown>): Message {
  return {
    id: docId,
    fromUserId: String(data.fromUserId ?? ""),
    toUserId: String(data.toUserId ?? ""),
    content: String(data.content ?? ""),
    timestamp: timestampToIso(data.timestamp) ?? new Date().toISOString(),
    read: Boolean(data.read),
  };
}

function mapConversationDoc(
  docSnap: { id: string; data: () => Record<string, unknown> },
  userId: string,
  profileLookup: Map<string, { name: string; photo: string }>
): Conversation {
  const data = docSnap.data();
  const participantIds = (data.participantIds as string[]) ?? [];
  const otherId =
    participantIds.find((id) => !participantMatches(id, userId)) ?? "";
  const meta = (data.participantMeta as Record<string, { name: string; photo: string }>) ?? {};
  const lookup =
    profileLookup.get(otherId) ??
    profileLookup.get(resolveProfileId(otherId));
  const unreadCounts = (data.unreadCounts as Record<string, number>) ?? {};
  return {
    id: docSnap.id,
    participantId: otherId,
    participantName: meta[otherId]?.name || lookup?.name || "Member",
    participantPhoto: meta[otherId]?.photo || lookup?.photo || "",
    lastMessage: String(data.lastMessage ?? ""),
    lastMessageAt: timestampToIso(data.lastMessageAt) ?? new Date().toISOString(),
    unreadCount: Number(
      unreadCounts[userId] ??
        unreadCounts[resolveProfileId(userId)] ??
        0
    ),
  };
}

function sortConversations(conversations: Conversation[]): Conversation[] {
  return [...conversations].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );
}

export interface ConversationParticipantMeta {
  participantName: string;
  participantPhoto: string;
  currentUserName?: string;
  currentUserPhoto?: string;
}

export async function getOrCreateConversation(
  currentUserId: string,
  otherUserId: string,
  meta: ConversationParticipantMeta
): Promise<string> {
  const db = getFirebaseDb();
  const authUid = requireAuthUserId();
  const currentId = resolveProfileId(currentUserId || authUid);
  const otherId = resolveProfileId(otherUserId);

  if (currentId === otherId) {
    throw new Error("You cannot message yourself.");
  }

  if (currentId !== authUid && resolveProfileId(authUid) !== currentId) {
    throw new Error("Session mismatch. Please sign out and sign in again.");
  }

  const convId = conversationIdFor(authUid, otherId);
  const ref = doc(db, "conversations", convId);
  const snap = await getDoc(ref);

  const participantMeta: Record<string, { name: string; photo: string }> = {
    [otherId]: { name: meta.participantName, photo: meta.participantPhoto },
    [authUid]: {
      name: meta.currentUserName ?? "",
      photo: meta.currentUserPhoto ?? "",
    },
  };

  if (!snap.exists()) {
    await setDoc(ref, {
      participantIds: [authUid, otherId],
      participantMeta,
      lastMessage: "",
      lastMessageAt: serverTimestamp(),
      unreadCounts: { [authUid]: 0, [otherId]: 0 },
      createdAt: serverTimestamp(),
    });
  } else {
    const existing = (snap.data()?.participantMeta as Record<string, { name: string; photo: string }>) ?? {};
    const existingParticipants = (snap.data()?.participantIds as string[]) ?? [];
    const participantIds = [
      ...new Set([
        ...existingParticipants,
        authUid,
        otherId,
        ...existingParticipants.filter((id) => participantMatches(id, authUid)),
        ...existingParticipants.filter((id) => participantMatches(id, otherId)),
      ]),
    ];
    if (!participantIds.includes(authUid)) participantIds.push(authUid);
    if (!participantIds.includes(otherId)) participantIds.push(otherId);

    await setDoc(
      ref,
      {
        participantIds,
        participantMeta: {
          ...existing,
          [otherId]: {
            name: meta.participantName || existing[otherId]?.name || "Member",
            photo: meta.participantPhoto || existing[otherId]?.photo || "",
          },
          [authUid]: {
            name: meta.currentUserName || existing[authUid]?.name || existing[currentId]?.name || "",
            photo: meta.currentUserPhoto || existing[authUid]?.photo || existing[currentId]?.photo || "",
          },
        },
      },
      { merge: true }
    );
  }

  return convId;
}

export async function fetchConversations(
  userId: string,
  profileLookup: Map<string, { name: string; photo: string }>
): Promise<Conversation[]> {
  const db = getFirebaseDb();
  const authUid = requireAuthUserId();
  const q = query(collection(db, "conversations"), where("participantIds", "array-contains", authUid));
  const snap = await getDocs(q);
  return sortConversations(
    snap.docs.map((docSnap) => mapConversationDoc(docSnap, authUid, profileLookup))
  );
}

export function subscribeConversations(
  userId: string,
  getProfileLookup: () => Map<string, { name: string; photo: string }>,
  onChange: (conversations: Conversation[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const db = getFirebaseDb();
  let authUid: string;
  try {
    authUid = requireAuthUserId();
  } catch (err) {
    onError?.(err instanceof Error ? err : new Error(String(err)));
    onChange([]);
    return () => {};
  }

  const q = query(collection(db, "conversations"), where("participantIds", "array-contains", authUid));
  return onSnapshot(
    q,
    (snap) => {
      const profileLookup = getProfileLookup();
      const conversations = sortConversations(
        snap.docs.map((docSnap) => mapConversationDoc(docSnap, authUid, profileLookup))
      );
      onChange(conversations);
    },
    (err) => {
      onError?.(err instanceof Error ? err : new Error(String(err)));
      onChange([]);
    }
  );
}

export function subscribeMessages(
  conversationId: string,
  onChange: (messages: Message[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const db = getFirebaseDb();
  const messagesRef = collection(db, "conversations", conversationId, "messages");
  return onSnapshot(
    messagesRef,
    (snap) => {
      const messages = snap.docs
        .map((d) => mapMessage(d.id, d.data() as Record<string, unknown>))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      onChange(messages);
    },
    (err) => {
      onError?.(err instanceof Error ? err : new Error(String(err)));
      onChange([]);
    }
  );
}

export async function sendMessage(
  conversationId: string,
  fromUserId: string,
  toUserId: string,
  content: string
): Promise<Message> {
  const db = getFirebaseDb();
  const authUid = requireAuthUserId();
  const toId = resolveProfileId(toUserId);
  const convRef = doc(db, "conversations", conversationId);
  const convSnap = await getDoc(convRef);
  if (!convSnap.exists()) {
    throw new Error("Conversation not found. Please open the chat again.");
  }
  const participantIds = (convSnap.data()?.participantIds as string[]) ?? [];
  if (!participantIds.some((id) => participantMatches(id, authUid))) {
    throw new Error("You are not a participant in this conversation.");
  }

  const ref = await addDoc(collection(db, "conversations", conversationId, "messages"), {
    fromUserId: authUid,
    toUserId: toId,
    content,
    read: false,
    timestamp: serverTimestamp(),
  });

  const unreadCounts = (convSnap.data()?.unreadCounts as Record<string, number>) ?? {};
  await updateDoc(convRef, {
    lastMessage: content,
    lastMessageAt: serverTimestamp(),
    unreadCounts: {
      ...unreadCounts,
      [toId]: Number(unreadCounts[toId] ?? 0) + 1,
      [authUid]: 0,
    },
  });

  return {
    id: ref.id,
    fromUserId: authUid,
    toUserId: toId,
    content,
    timestamp: new Date().toISOString(),
    read: false,
  };
}

export async function markConversationRead(
  conversationId: string,
  userId: string
): Promise<void> {
  try {
    const authUid = requireAuthUserId();
    const convRef = doc(getFirebaseDb(), "conversations", conversationId);
    const convSnap = await getDoc(convRef);
    if (!convSnap.exists()) return;
    const unreadCounts = (convSnap.data()?.unreadCounts as Record<string, number>) ?? {};
    await updateDoc(convRef, {
      unreadCounts: { ...unreadCounts, [authUid]: 0, [userId]: 0 },
    });
  } catch {
    // Non-critical; don't block message display
  }
}
