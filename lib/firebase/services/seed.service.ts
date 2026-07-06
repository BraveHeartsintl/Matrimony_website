import { profileToFirestore } from "@/lib/firebase/converters";
import { getFirebaseDb } from "@/lib/firebase/config";
import { normalizeProfile, createDefaultProfile } from "@/lib/auth";
import { MOCK_PROFILES } from "@/lib/mock/profiles";
import { seedPlatformContent } from "@/lib/firebase/services/platform.service";
import {
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

const SEED_MARKER = "seed-profile";
const BATCH_LIMIT = 450;

export function isSeedProfileId(uid: string): boolean {
  return uid.startsWith("seed-");
}

export async function isFirestoreSeeded(): Promise<boolean> {
  const snap = await getDoc(doc(getFirebaseDb(), "platformStats", "seed"));
  return snap.exists() && Boolean(snap.data()?.completed);
}

export async function seedMockProfiles(): Promise<{
  created: number;
  updated: number;
  total: number;
}> {
  const db = getFirebaseDb();
  let batch = writeBatch(db);
  let ops = 0;
  let created = 0;
  let updated = 0;

  const commitBatch = async () => {
    if (ops === 0) return;
    await batch.commit();
    batch = writeBatch(db);
    ops = 0;
  };

  for (const mock of MOCK_PROFILES) {
    const uid = `seed-${mock.userId}`;
    const userRef = doc(db, "users", uid);
    const exists = (await getDoc(userRef)).exists();
    if (exists) updated++;
    else created++;

    const profile = normalizeProfile({
      ...createDefaultProfile(uid),
      ...mock,
      userId: uid,
      photos: mock.photos,
      matrimony: mock.matrimony ?? {},
      onboardingStatus: mock.verified ? "verified" : "profile_completed",
    });

    batch.set(
      userRef,
      {
        email: mock.email,
        name: mock.name,
        role: "member",
        accountStatus: "active",
        isSeed: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      },
      { merge: true }
    );
    ops++;

    batch.set(
      doc(db, "profiles", uid),
      {
        ...profileToFirestore(profile, { name: mock.name, email: mock.email }),
        isSeed: true,
        memberSince: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    ops++;

    batch.set(
      doc(db, "subscriptions", uid),
      {
        planId: "free",
        status: "active",
        isSeed: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    ops++;

    if (ops >= BATCH_LIMIT) {
      await commitBatch();
    }
  }

  batch.set(
    doc(db, "platformStats", "seed"),
    {
      completed: true,
      profileCount: MOCK_PROFILES.length,
      seededAt: serverTimestamp(),
      marker: SEED_MARKER,
    },
    { merge: true }
  );
  ops++;
  await commitBatch();

  await seedPlatformContent();

  try {
    const { refreshPlatformStats } = await import("@/lib/firebase/services/platform.service");
    await refreshPlatformStats();
  } catch {
    // Stats refresh requires admin Firebase session
  }

  return { created, updated, total: MOCK_PROFILES.length };
}
