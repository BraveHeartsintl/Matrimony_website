"use client";

import {
  addPendingVerification,
  approveVerification,
  clearSession,
  completeProfileOnboarding,
  createDefaultProfile,
  getSession,
  getSessionSnapshot,
  getStoredUsers,
  normalizeProfile,
  rejectVerification,
  saveStoredUsers,
  setSession,
  stripPassword,
  submitVerification,
  subscribeAuth,
} from "@/lib/auth";
import { DEMO_USER } from "@/lib/mock/users";
import type { AuthSession, MatrimonyDetails, Profile, VerificationData } from "@/lib/types";
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
  updateMatrimony: (updates: Partial<MatrimonyDetails>) => void;
  updateVerification: (updates: Partial<VerificationData>) => void;
  completeOnboardingProfile: (updates: Partial<Profile>) => void;
  submitVerificationRequest: () => void;
  simulateVerificationApproval: () => void;
  simulateVerificationRejection: (reason: string) => void;
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
      profile = normalizeProfile({
        ...profile,
        age: 30,
        yearOfBirth: 1996,
        birthMonth: 6,
        heightCm: 178,
        weightKg: 75,
        bodyType: "athletic",
        gender: "male",
        lookingFor: "bride",
        location: "London",
        country: "England",
        religion: "Christian",
        education: "Bachelor's Degree",
        occupation: "IT Consultant",
        maritalStatus: "never_married",
        bio: "Looking for a genuine connection with someone who shares similar values and interests.",
        photos: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"],
        onboardingStatus: "verified",
        verified: true,
        verification: {
          phone: "+44 7700 900123",
          phoneVerified: true,
          emailVerified: true,
          idDocumentType: "passport",
          submittedAt: "2025-01-20T10:00:00Z",
        },
        preferences: {
          ageMin: 25,
          ageMax: 35,
          religions: ["Christian", "Hindu"],
          locations: ["London", "Manchester"],
        },
        matrimony: {
          aboutMe: "IT professional based in London.",
          partnerExpectations: "Someone kind and family-oriented.",
          familyBackground: "Close-knit family.",
          fatherOccupation: "Retired",
          motherOccupation: "Teacher",
          siblings: "1 sister",
          diet: "Non-Vegetarian",
          smoking: "No",
          drinking: "Socially",
          hobbies: ["Travel", "Reading"],
          community: "Christian",
          willingToRelocate: true,
          languages: ["English"],
        },
      });
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
        onboardingStatus: "basic_registered",
        verified: false,
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
      matrimony: { ...current.profile.matrimony, ...updates.matrimony },
      verification: { ...current.profile.verification, ...updates.verification },
    });
    const newSession: AuthSession = { ...current, profile: updated };
    setSession(newSession);
  }, []);

  const updateMatrimony = useCallback((updates: Partial<MatrimonyDetails>) => {
    const current = getSession();
    if (!current) return;
    updateProfile({ matrimony: { ...current.profile.matrimony, ...updates } });
  }, [updateProfile]);

  const updateVerification = useCallback((updates: Partial<VerificationData>) => {
    const current = getSession();
    if (!current) return;
    updateProfile({ verification: { ...current.profile.verification, ...updates } });
  }, [updateProfile]);

  const completeOnboardingProfile = useCallback((updates: Partial<Profile>) => {
    const current = getSession();
    if (!current) return;
    const updated = completeProfileOnboarding(current.profile, updates);
    setSession({ ...current, profile: updated });
  }, []);

  const submitVerificationRequest = useCallback(() => {
    const current = getSession();
    if (!current) return;
    const updated = submitVerification(current.profile);
    addPendingVerification({
      userId: current.user.id,
      name: current.user.name,
      email: current.user.email,
      submittedAt: updated.verification.submittedAt ?? new Date().toISOString(),
      idDocumentType: updated.verification.idDocumentType,
    });
    setSession({ ...current, profile: updated });
  }, []);

  const simulateVerificationApproval = useCallback(() => {
    const current = getSession();
    if (!current) return;
    const updated = approveVerification(current.profile);
    setSession({ ...current, profile: updated });
  }, []);

  const simulateVerificationRejection = useCallback((reason: string) => {
    const current = getSession();
    if (!current) return;
    const updated = rejectVerification(current.profile, reason);
    setSession({ ...current, profile: updated });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        updateMatrimony,
        updateVerification,
        completeOnboardingProfile,
        submitVerificationRequest,
        simulateVerificationApproval,
        simulateVerificationRejection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
