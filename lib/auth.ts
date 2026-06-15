import type { AuthSession, Profile, User } from "./types";
import { calculateAgeFromYearOfBirth } from "./utils";

const SESSION_KEY = "uk_matrimony_session";
const USERS_KEY = "uk_matrimony_users";

const DEMO_SEED: User[] = [
  {
    id: "user-demo",
    email: "demo@example.com",
    password: "password123",
    name: "Alex Thompson",
    createdAt: "2025-01-15T10:00:00Z",
  },
];

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
    gender: "other",
    heightCm: 0,
    weightKg: 0,
    bodyType: "average",
    location: "London",
    religion: "No Religion",
    education: "Bachelor's Degree",
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
    profileCompletion: 20,
    verified: false,
  };
}

export function normalizeProfile(profile: Profile): Profile {
  const defaults = createDefaultProfile(profile.userId);
  const merged = { ...defaults, ...profile };
  const yearOfBirth =
    merged.yearOfBirth > 0
      ? merged.yearOfBirth
      : merged.age > 0
        ? new Date().getFullYear() - merged.age
        : defaults.yearOfBirth;

  const normalized = {
    ...merged,
    yearOfBirth,
    age: calculateAgeFromYearOfBirth(yearOfBirth),
    heightCm: merged.heightCm ?? 0,
    weightKg: merged.weightKg ?? 0,
    bodyType: merged.bodyType ?? "average",
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
    profile.gender !== "other",
    profile.heightCm > 0,
    profile.weightKg > 0,
    !!profile.bodyType,
    !!profile.location,
    !!profile.religion,
    !!profile.education,
    !!profile.occupation,
    !!profile.maritalStatus,
    !!profile.bio && profile.bio.length > 20,
    profile.photos.length > 0,
    profile.preferences.religions.length > 0,
  ];
  checks.forEach((ok) => {
    if (ok) score += Math.round(100 / checks.length);
  });
  return Math.min(100, score);
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
