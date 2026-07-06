import {
  createDefaultProfile,
  normalizeProfile,
  type PendingVerificationSubmission,
} from "@/lib/auth";
import { profileFromFirestore, profileToFirestore, timestampToIso, userFromFirestore } from "@/lib/firebase/converters";
import { getFirebaseDb } from "@/lib/firebase/config";
import type { Profile, User } from "@/lib/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";

interface CreateUserAndProfileInput {
  name: string;
  email: string;
  profilePartial?: Partial<Profile>;
}

export async function getUser(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(getFirebaseDb(), "users", uid));
  if (!snap.exists()) return null;
  return userFromFirestore(uid, snap.data() as Record<string, unknown>);
}

export async function getProfile(uid: string): Promise<Profile | null> {
  const snap = await getDoc(doc(getFirebaseDb(), "profiles", uid));
  if (!snap.exists()) return null;
  return profileFromFirestore(uid, snap.data() as Record<string, unknown>);
}

export async function createUserAndProfile(
  uid: string,
  { name, email, profilePartial }: CreateUserAndProfileInput
): Promise<void> {
  const db = getFirebaseDb();
  const now = serverTimestamp();
  const profile = normalizeProfile({
    ...createDefaultProfile(uid),
    ...profilePartial,
    onboardingStatus: profilePartial?.onboardingStatus ?? "basic_registered",
    verified: false,
  });

  const batch = writeBatch(db);

  batch.set(doc(db, "users", uid), {
    email,
    name,
    role: "member",
    accountStatus: "active",
    createdAt: now,
    updatedAt: now,
    lastActiveAt: now,
  });

  batch.set(doc(db, "profiles", uid), {
    ...profileToFirestore(profile, { name, email }),
    memberSince: now,
    lastActiveAt: now,
    updatedAt: now,
  });

  batch.set(doc(db, "subscriptions", uid), {
    planId: "free",
    status: "active",
    createdAt: now,
    updatedAt: now,
  });

  await batch.commit();
}

export async function ensureUserAndProfile(
  uid: string,
  email: string,
  name?: string
): Promise<{ user: User; profile: Profile }> {
  let user = await getUser(uid);
  let profile = await getProfile(uid);

  if (!user) {
    const db = getFirebaseDb();
    const now = serverTimestamp();
    const userData = {
      email,
      name: name ?? email.split("@")[0],
      role: "member" as const,
      accountStatus: "active" as const,
      createdAt: now,
      updatedAt: now,
      lastActiveAt: now,
    };
    await setDoc(doc(db, "users", uid), userData);
    user = userFromFirestore(uid, {
      ...userData,
      createdAt: Timestamp.now(),
    });
  }

  if (!profile) {
    const db = getFirebaseDb();
    const now = serverTimestamp();
    const defaultProfile = normalizeProfile(createDefaultProfile(uid));
    await setDoc(doc(db, "profiles", uid), {
      ...profileToFirestore(defaultProfile, { name: user.name, email: user.email }),
      memberSince: now,
      lastActiveAt: now,
      updatedAt: now,
    });
    profile = (await getProfile(uid))!;
  }

  return { user, profile };
}

export async function updateProfile(
  uid: string,
  user: { name: string; email: string },
  updates: Partial<Profile>
): Promise<Profile> {
  const current = (await getProfile(uid)) ?? createDefaultProfile(uid);
  const updated = normalizeProfile({
    ...current,
    ...updates,
    privacySettings: { ...current.privacySettings, ...updates.privacySettings },
    preferences: { ...current.preferences, ...updates.preferences },
    matrimony: { ...current.matrimony, ...updates.matrimony },
    verification: { ...current.verification, ...updates.verification },
  });

  await setDoc(
    doc(getFirebaseDb(), "profiles", uid),
    {
      ...profileToFirestore(updated, user),
      lastActiveAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return updated;
}

export async function createVerificationRequest(
  submission: PendingVerificationSubmission
): Promise<void> {
  const db = getFirebaseDb();
  await setDoc(doc(db, "verificationRequests", submission.userId), {
    userId: submission.userId,
    name: submission.name,
    email: submission.email,
    idDocumentType: submission.idDocumentType ?? null,
    status: "pending",
    submittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getPendingVerifications(): Promise<PendingVerificationSubmission[]> {
  const db = getFirebaseDb();
  const q = query(collection(db, "verificationRequests"), where("status", "==", "pending"));
  const snap = await getDocs(q);

  return snap.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      userId: String(data.userId ?? docSnap.id),
      name: String(data.name ?? ""),
      email: String(data.email ?? ""),
      submittedAt: timestampToIso(data.submittedAt) ?? new Date().toISOString(),
      idDocumentType: data.idDocumentType as string | undefined,
    };
  });
}

export async function resolveVerificationRequest(
  userId: string,
  status: "approved" | "rejected"
): Promise<void> {
  await setDoc(
    doc(getFirebaseDb(), "verificationRequests", userId),
    { status, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function touchLastActive(uid: string): Promise<void> {
  await setDoc(
    doc(getFirebaseDb(), "users", uid),
    { lastActiveAt: serverTimestamp(), updatedAt: serverTimestamp() },
    { merge: true }
  );
}
