import type {
  AuthSession,
  MatrimonyDetails,
  OnboardingStatus,
  Profile,
  User,
  VerificationData,
} from "./types";
import { calculateAgeFromYearOfBirth } from "./utils";

const SESSION_KEY = "uk_matrimony_session";
const USERS_KEY = "uk_matrimony_users";
const PENDING_VERIFICATIONS_KEY = "uk_matrimony_pending_verifications";

const DEMO_SEED: User[] = [
  {
    id: "user-demo",
    email: "demo@example.com",
    password: "password123",
    name: "Alex Thompson",
    createdAt: "2025-01-15T10:00:00Z",
  },
];

export function createDefaultVerification(): VerificationData {
  return {
    phoneVerified: false,
    emailVerified: false,
  };
}

export function createDefaultMatrimony(): Partial<MatrimonyDetails> {
  return {
    aboutMe: "",
    partnerExpectations: "",
    familyBackground: "",
    fatherOccupation: "",
    motherOccupation: "",
    siblings: "",
    diet: "",
    smoking: "No",
    drinking: "No",
    languages: ["English"],
    community: "",
    willingToRelocate: false,
    hobbies: [],
    fitnessInterests: [],
  };
}

function ensureSeedUsers(): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_SEED));
  }
}

export function getStoredUsers(): User[] {
  if (typeof window === "undefined") return [];
  ensureSeedUsers();
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as User[]) : [];
}

export function saveStoredUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

let sessionSnapshot: AuthSession | null = null;
let sessionSnapshotRaw: string | null | undefined;

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as AuthSession) : null;
}

/** Stable snapshot for useSyncExternalStore — returns same reference until session changes. */
export function getSessionSnapshot(): AuthSession | null {
  if (typeof window === "undefined") return null;
  ensureSeedUsers();

  const raw = localStorage.getItem(SESSION_KEY);
  if (sessionSnapshotRaw !== undefined && sessionSnapshotRaw === raw) {
    return sessionSnapshot;
  }

  sessionSnapshotRaw = raw;
  sessionSnapshot = raw
    ? (() => {
        const session = JSON.parse(raw) as AuthSession;
        return { ...session, profile: normalizeProfile(session.profile) };
      })()
    : null;
  return sessionSnapshot;
}

export function setSession(session: AuthSession): void {
  const normalized: AuthSession = {
    ...session,
    profile: normalizeProfile(session.profile),
  };
  const serialized = JSON.stringify(normalized);
  localStorage.setItem(SESSION_KEY, serialized);
  sessionSnapshotRaw = serialized;
  sessionSnapshot = normalized;
  notifyAuthChange();
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  sessionSnapshotRaw = null;
  sessionSnapshot = null;
  notifyAuthChange();
}

export function createDefaultProfile(userId: string): Profile {
  const yearOfBirth = 1999;
  return {
    userId,
    age: calculateAgeFromYearOfBirth(yearOfBirth),
    yearOfBirth,
    birthMonth: 1,
    gender: "other",
    lookingFor: "bride",
    heightCm: 0,
    weightKg: 0,
    bodyType: "average",
    location: "London",
    country: "England",
    religion: "No Religion",
    education: "",
    occupation: "",
    maritalStatus: "never_married",
    bio: "",
    photos: [],
    privacySettings: {
      hidePhoto: false,
      hideContact: false,
      hideProfile: false,
    },
    preferences: {
      ageMin: 21,
      ageMax: 40,
      religions: [],
      locations: [],
    },
    matrimony: createDefaultMatrimony(),
    verification: createDefaultVerification(),
    onboardingStatus: "basic_registered",
    profileCompletion: 0,
    verified: false,
  };
}

function deriveVerified(status: OnboardingStatus, explicitVerified?: boolean): boolean {
  if (status === "verified") return true;
  if (explicitVerified === true && status === "basic_registered") {
    return true;
  }
  return false;
}

function inferOnboardingStatus(profile: Partial<Profile>): OnboardingStatus {
  if (profile.onboardingStatus) return profile.onboardingStatus;
  if (profile.verified) return "verified";
  if (profile.profileCompletion && profile.profileCompletion >= 60) return "profile_completed";
  return "basic_registered";
}

export function normalizeProfile(profile: Profile): Profile {
  const defaults = createDefaultProfile(profile.userId);
  const merged = {
    ...defaults,
    ...profile,
    preferences: { ...defaults.preferences, ...profile.preferences },
    matrimony: { ...defaults.matrimony, ...profile.matrimony },
    verification: { ...defaults.verification, ...profile.verification },
    privacySettings: { ...defaults.privacySettings, ...profile.privacySettings },
  };

  const yearOfBirth =
    merged.yearOfBirth > 0
      ? merged.yearOfBirth
      : merged.age > 0
        ? new Date().getFullYear() - merged.age
        : defaults.yearOfBirth;

  const onboardingStatus = inferOnboardingStatus(merged);

  const normalized: Profile = {
    ...merged,
    yearOfBirth,
    birthMonth: merged.birthMonth || 1,
    age: calculateAgeFromYearOfBirth(yearOfBirth),
    heightCm: merged.heightCm ?? 0,
    weightKg: merged.weightKg ?? 0,
    bodyType: merged.bodyType ?? "average",
    lookingFor: merged.lookingFor ?? "bride",
    onboardingStatus,
    verified: deriveVerified(onboardingStatus, merged.verified),
  };

  return {
    ...normalized,
    profileCompletion: calculateProfileCompletion(normalized),
  };
}

export function calculateProfileCompletion(profile: Profile): number {
  let score = 0;
  const checks = [
    profile.yearOfBirth > 0,
    profile.birthMonth > 0,
    profile.gender !== "other",
    profile.lookingFor !== undefined,
    !!profile.location,
    profile.heightCm > 0,
    !!profile.religion,
    !!profile.education,
    !!profile.occupation,
    !!profile.maritalStatus,
    !!profile.bio && profile.bio.length > 20,
    profile.photos.length > 0,
    profile.preferences.religions.length > 0,
    !!profile.matrimony.fatherOccupation,
    !!profile.matrimony.motherOccupation,
    !!profile.matrimony.diet,
    (profile.matrimony.hobbies?.length ?? 0) > 0,
    profile.onboardingStatus !== "basic_registered",
  ];
  checks.forEach((ok) => {
    if (ok) score += Math.round(100 / checks.length);
  });
  return Math.min(100, score);
}

export function completeProfileOnboarding(
  profile: Profile,
  updates: Partial<Profile>
): Profile {
  return normalizeProfile({
    ...profile,
    ...updates,
    matrimony: { ...profile.matrimony, ...updates.matrimony },
    preferences: { ...profile.preferences, ...updates.preferences },
    onboardingStatus: "profile_completed",
  });
}

export function submitVerification(profile: Profile): Profile {
  return normalizeProfile({
    ...profile,
    onboardingStatus: "verification_pending",
    verification: {
      ...profile.verification,
      submittedAt: new Date().toISOString(),
      rejectionReason: undefined,
    },
  });
}

export function approveVerification(profile: Profile): Profile {
  return normalizeProfile({
    ...profile,
    onboardingStatus: "verified",
    verified: true,
    verification: {
      ...profile.verification,
      rejectionReason: undefined,
    },
  });
}

export function rejectVerification(profile: Profile, reason: string): Profile {
  return normalizeProfile({
    ...profile,
    onboardingStatus: "rejected",
    verified: false,
    verification: {
      ...profile.verification,
      rejectionReason: reason,
    },
  });
}

export interface PendingVerificationSubmission {
  userId: string;
  name: string;
  email: string;
  submittedAt: string;
  idDocumentType?: string;
}

export function getPendingVerifications(): PendingVerificationSubmission[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(PENDING_VERIFICATIONS_KEY);
  return raw ? (JSON.parse(raw) as PendingVerificationSubmission[]) : [];
}

export function addPendingVerification(submission: PendingVerificationSubmission): void {
  const existing = getPendingVerifications().filter((s) => s.userId !== submission.userId);
  localStorage.setItem(
    PENDING_VERIFICATIONS_KEY,
    JSON.stringify([...existing, submission])
  );
}

export function removePendingVerification(userId: string): void {
  const next = getPendingVerifications().filter((s) => s.userId !== userId);
  localStorage.setItem(PENDING_VERIFICATIONS_KEY, JSON.stringify(next));
}

export function stripPassword(user: User): Omit<User, "password"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest;
}

const authListeners = new Set<() => void>();

export function subscribeAuth(listener: () => void): () => void {
  authListeners.add(listener);
  return () => authListeners.delete(listener);
}

export function notifyAuthChange(): void {
  authListeners.forEach((listener) => listener());
}
