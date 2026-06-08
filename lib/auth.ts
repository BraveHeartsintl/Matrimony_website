import type { AuthSession, Profile, User } from "./types";

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
  sessionSnapshot = raw ? (JSON.parse(raw) as AuthSession) : null;
  return sessionSnapshot;
}

export function setSession(session: AuthSession): void {
  const serialized = JSON.stringify(session);
  localStorage.setItem(SESSION_KEY, serialized);
  sessionSnapshotRaw = serialized;
  sessionSnapshot = session;
  notifyAuthChange();
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  sessionSnapshotRaw = null;
  sessionSnapshot = null;
  notifyAuthChange();
}

export function createDefaultProfile(userId: string): Profile {
  return {
    userId,
    age: 25,
    gender: "other",
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

export function calculateProfileCompletion(profile: Profile): number {
  let score = 0;
  const checks = [
    profile.age > 0,
    profile.gender !== "other",
    !!profile.location,
    !!profile.religion,
    !!profile.education,
    !!profile.occupation,
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
