import { getFirebaseDb } from "@/lib/firebase/config";
import { timestampToIso } from "@/lib/firebase/converters";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";

export async function getFavoriteIds(userId: string): Promise<string[]> {
  const snap = await getDocs(collection(getFirebaseDb(), "users", userId, "favorites"));
  return snap.docs.map((d) => d.id);
}

export function subscribeFavorites(
  userId: string,
  onChange: (ids: string[]) => void
): Unsubscribe {
  return onSnapshot(collection(getFirebaseDb(), "users", userId, "favorites"), (snap) => {
    onChange(snap.docs.map((d) => d.id));
  });
}

export async function addFavorite(userId: string, profileId: string): Promise<void> {
  await setDoc(doc(getFirebaseDb(), "users", userId, "favorites", profileId), {
    profileId,
    createdAt: serverTimestamp(),
  });
}

export async function removeFavorite(userId: string, profileId: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), "users", userId, "favorites", profileId));
}

export async function toggleFavoriteRemote(
  userId: string,
  profileId: string,
  currentIds: string[]
): Promise<string[]> {
  if (currentIds.includes(profileId)) {
    await removeFavorite(userId, profileId);
    return currentIds.filter((id) => id !== profileId);
  }
  await addFavorite(userId, profileId);
  return [...currentIds, profileId];
}
