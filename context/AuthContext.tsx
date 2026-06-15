"use client";

import {
  clearSession,
  createDefaultProfile,
  getSession,
  getSessionSnapshot,
  getStoredUsers,
  normalizeProfile,
  saveStoredUsers,
  setSession,
  stripPassword,
  subscribeAuth,
} from "@/lib/auth";
import { DEMO_USER } from "@/lib/mock/users";
import type { AuthSession, Profile } from "@/lib/types";
import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

interface AuthContextType {
  session: AuthSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    profile: Partial<Profile>;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function subscribeNoop(): () => void {
  return () => {};
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(subscribeAuth, getSessionSnapshot, () => null);
  const isLoading = useSyncExternalStore(
    subscribeNoop,
    () => false,
    () => true
  );

  const login = useCallback(async (email: string, password: string) => {
    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
      return { success: false, error: "Invalid email or password" };
    }

    let profile = createDefaultProfile(user.id);
    if (user.id === DEMO_USER.id) {
      profile = {
        ...profile,
        age: 30,
        yearOfBirth: 1996,
        heightCm: 178,
        weightKg: 75,
        bodyType: "athletic",
        gender: "male",
        location: "London",
        religion: "Christian",
        education: "Bachelor's Degree",
        occupation: "IT Consultant",
        maritalStatus: "never_married",
        bio: "Looking for a genuine connection with someone who shares similar values and interests.",
        photos: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"],
        profileCompletion: 75,
        verified: true,
        preferences: {
          ageMin: 25,
          ageMax: 35,
          religions: ["Christian", "Hindu"],
          locations: ["London", "Manchester"],
        },
      };
    }

    const newSession: AuthSession = { user: stripPassword(user), profile };
    setSession(newSession);
    return { success: true };
  }, []);

  const register = useCallback(
    async (data: { name: string; email: string; password: string; profile: Partial<Profile> }) => {
      const users = getStoredUsers();
      if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
        return { success: false, error: "An account with this email already exists" };
      }

      const newUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        password: data.password,
        name: data.name,
        createdAt: new Date().toISOString(),
      };

      const profile: Profile = normalizeProfile({
        ...createDefaultProfile(newUser.id),
        ...data.profile,
        profileCompletion: 0,
      });

      saveStoredUsers([...users, newUser]);
      const newSession: AuthSession = { user: stripPassword(newUser), profile };
      setSession(newSession);
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();
  }, []);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    const current = getSession();
    if (!current) return;
    const updated: Profile = normalizeProfile({
      ...current.profile,
      ...updates,
      privacySettings: { ...current.profile.privacySettings, ...updates.privacySettings },
      preferences: { ...current.profile.preferences, ...updates.preferences },
    });
    const newSession: AuthSession = { ...current, profile: updated };
    setSession(newSession);
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
