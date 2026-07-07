import { getOrCreateConversation } from "@/lib/firebase/services/message.service";
import { resolveProfileId } from "@/lib/firebase/services/search.service";
import { getFirebaseDb } from "@/lib/firebase/config";
import { timestampToIso } from "@/lib/firebase/converters";
import type { Interest } from "@/lib/types";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";

function interestId(fromUserId: string, toUserId: string): string {
  return `${fromUserId}_${toUserId}`;
}

/** Match auth uid, profile id, or legacy seed/mock ids to the same member. */
export function isSameMemberId(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  return resolveProfileId(a) === resolveProfileId(b);
}

export function isInterestReceived(interest: Interest, userId: string): boolean {
  return isSameMemberId(interest.toUserId, userId);
}

function mapInterest(docId: string, data: Record<string, unknown>): Interest {
  return {
    id: docId,
    fromUserId: String(data.fromUserId ?? ""),
    toUserId: String(data.toUserId ?? ""),
    fromUserName: data.fromUserName as string | undefined,
    fromUserPhoto: data.fromUserPhoto as string | undefined,
    toUserName: String(data.toUserName ?? "Member"),
    toUserPhoto: String(data.toUserPhoto ?? ""),
    status: (data.status as Interest["status"]) ?? "pending",
    createdAt: timestampToIso(data.createdAt) ?? new Date().toISOString(),
  };
}

export interface SendInterestMeta {
  fromUserName?: string;
  fromUserPhoto?: string;
  toUserName?: string;
  toUserPhoto?: string;
}

export async function sendInterest(
  fromUserId: string,
  toUserId: string,
  meta?: SendInterestMeta
): Promise<Interest> {
  const db = getFirebaseDb();
  const toId = resolveProfileId(toUserId);
  const id = interestId(fromUserId, toId);
  const data = {
    fromUserId,
    toUserId: toId,
    fromUserName: meta?.fromUserName ?? null,
    fromUserPhoto: meta?.fromUserPhoto ?? null,
    toUserName: meta?.toUserName ?? "Member",
    toUserPhoto: meta?.toUserPhoto ?? "",
    status: "pending" as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, "interests", id), data, { merge: true });

  try {
    await getOrCreateConversation(fromUserId, toId, {
      participantName: meta?.toUserName ?? "Member",
      participantPhoto: meta?.toUserPhoto ?? "",
      currentUserName: meta?.fromUserName,
      currentUserPhoto: meta?.fromUserPhoto,
    });
  } catch {
    // Interest still saved; chat opens when user taps Message
  }

  return mapInterest(id, { ...data, createdAt: new Date().toISOString() });
}

export async function getInterestsForUser(userId: string): Promise<Interest[]> {
  const db = getFirebaseDb();
  const [sent, received] = await Promise.all([
    getDocs(query(collection(db, "interests"), where("fromUserId", "==", userId))),
    getDocs(query(collection(db, "interests"), where("toUserId", "==", userId))),
  ]);
  const byId = new Map<string, Interest>();
  for (const snap of [...sent.docs, ...received.docs]) {
    byId.set(snap.id, mapInterest(snap.id, snap.data() as Record<string, unknown>));
  }
  return Array.from(byId.values());
}

export function subscribeInterests(
  userId: string,
  onChange: (interests: Interest[]) => void
): Unsubscribe {
  const db = getFirebaseDb();
  const results = new Map<string, Interest>();

  const emit = () => onChange(Array.from(results.values()));

  const unsubSent = onSnapshot(
    query(collection(db, "interests"), where("fromUserId", "==", userId)),
    (snap) => {
      snap.docs.forEach((d) => results.set(d.id, mapInterest(d.id, d.data() as Record<string, unknown>)));
      emit();
    }
  );

  const unsubReceived = onSnapshot(
    query(collection(db, "interests"), where("toUserId", "==", userId)),
    (snap) => {
      snap.docs.forEach((d) => results.set(d.id, mapInterest(d.id, d.data() as Record<string, unknown>)));
      emit();
    }
  );

  return () => {
    unsubSent();
    unsubReceived();
  };
}

export async function updateInterestStatus(
  interestId: string,
  status: Interest["status"]
): Promise<void> {
  await setDoc(
    doc(getFirebaseDb(), "interests", interestId),
    { status, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function acceptInterest(interestId: string): Promise<void> {
  await updateInterestStatus(interestId, "accepted");
}

export async function declineInterest(interestId: string): Promise<void> {
  await updateInterestStatus(interestId, "declined");
}

export async function hasSentInterest(fromUserId: string, toUserId: string): Promise<boolean> {
  const db = getFirebaseDb();
  const snap = await getDocs(
    query(
      collection(db, "interests"),
      where("fromUserId", "==", fromUserId),
      where("toUserId", "==", toUserId)
    )
  );
  return !snap.empty;
}
