import { profileFromFirestore } from "@/lib/firebase/converters";
import { getFirebaseDb } from "@/lib/firebase/config";
import { DEFAULT_PROFILE_PHOTO } from "@/lib/constants";
import { photosFromFirestoreData } from "@/lib/profile-photos";
import { MOCK_PROFILES } from "@/lib/mock/profiles";
import { filterProfiles, type SearchFilters } from "@/lib/search-filters";
import type { SearchProfile } from "@/lib/types";
import { collection, doc, getDoc, getDocs, limit, query } from "firebase/firestore";

/** Map legacy mock ids (profile-1) to Firestore seed ids (seed-user-1). */
export function resolveProfileId(id: string): string {
  if (id.startsWith("seed-")) return id;
  const mock = MOCK_PROFILES.find((p) => p.id === id || p.userId === id);
  if (mock) return `seed-${mock.userId}`;
  return id;
}

function isProfileSearchVisible(data: Record<string, unknown>): boolean {
  if (data.searchVisibility === false) return false;
  const privacy = data.privacySettings as { hideProfile?: boolean } | undefined;
  if (privacy?.hideProfile === true) return false;
  return true;
}

function toSearchProfile(uid: string, data: Record<string, unknown>): SearchProfile {
  const profile = profileFromFirestore(uid, data);
  const photos = (() => {
    const resolved = photosFromFirestoreData(data);
    return resolved.length > 0 ? resolved : [DEFAULT_PROFILE_PHOTO];
  })();
  return {
    ...profile,
    photos,
    id: uid,
    name: String(data.displayName ?? "Member"),
    email: "",
  };
}


export async function fetchSearchProfiles(excludeUserId?: string): Promise<SearchProfile[]> {
  const db = getFirebaseDb();
  const snap = await getDocs(query(collection(db, "profiles"), limit(150)));
  return snap.docs
    .filter((docSnap) => isProfileSearchVisible(docSnap.data() as Record<string, unknown>))
    .map((docSnap) => toSearchProfile(docSnap.id, docSnap.data() as Record<string, unknown>))
    .filter((p) => p.userId !== excludeUserId && p.id !== excludeUserId);
}

export async function getPublicSearchProfile(rawId: string): Promise<SearchProfile | null> {
  const uid = resolveProfileId(rawId);
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, "profiles", uid));
  if (!snap.exists()) return null;
  const data = snap.data() as Record<string, unknown>;
  if (!isProfileSearchVisible(data)) return null;
  return toSearchProfile(uid, data);
}

export async function fetchFeaturedProfiles(limitCount = 6): Promise<SearchProfile[]> {
  const all = await fetchSearchProfiles();
  const verified = all.filter((p) => p.verified);
  const pool = verified.length > 0 ? verified : all;
  return pool.slice(0, limitCount);
}

export function applyClientSearchFilters(
  profiles: SearchProfile[],
  filters: SearchFilters
): SearchProfile[] {
  return filterProfiles(profiles, filters);
}
