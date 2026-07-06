"use client";

import {
  approveVerification,
  completeProfileOnboarding,
  rejectVerification,
  submitVerification,
} from "@/lib/auth";
import {
  registerWithEmail,
  signInWithEmail,
  signOutUser,
  subscribeAuthState,
} from "@/lib/firebase/services/auth.service";
import {
  createVerificationRequest,
  ensureUserAndProfile,
  touchLastActive,
  updateProfile as updateProfileInFirestore,
} from "@/lib/firebase/services/profile.service";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import type { AuthSession, MatrimonyDetails, Profile, VerificationData } from "@/lib/types";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

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
  updateVerification: (updates: Partial<VerificationData>) => Promise<void>;
  completeOnboardingProfile: (updates: Partial<Profile>) => Promise<void>;
  submitVerificationRequest: () => void;
  simulateVerificationApproval: () => void;
  simulateVerificationRejection: (reason: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function buildSession(uid: string, email: string, displayName?: string | null): Promise<AuthSession> {
  const { user, profile } = await ensureUserAndProfile(uid, email, displayName ?? undefined);
  void touchLastActive(uid);
  return { user, profile };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionRef = useRef<AuthSession | null>(null);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setSession(null);
      setIsLoading(false);
      return;
    }

    const unsubscribe = subscribeAuthState(async (firebaseUser) => {
      if (!firebaseUser) {
        setSession(null);
        setIsLoading(false);
        return;
      }

      try {
        const nextSession = await buildSession(
          firebaseUser.uid,
          firebaseUser.email ?? "",
          firebaseUser.displayName
        );
        setSession(nextSession);
      } catch {
        setSession(null);
        await signOutUser();
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const persistProfile = useCallback(async (profileOverride?: Profile) => {
    const current = sessionRef.current;
    if (!current) return;
    const profileToSave = profileOverride ?? sessionRef.current?.profile ?? current.profile;
    const saved = await updateProfileInFirestore(current.user.id, current.user, profileToSave);
    const latest = sessionRef.current;
    if (latest) {
      const merged: Profile = {
        ...latest.profile,
        ...saved,
        verification: { ...latest.profile.verification, ...saved.verification },
        matrimony: { ...latest.profile.matrimony, ...saved.matrimony },
        preferences: { ...latest.profile.preferences, ...saved.preferences },
        privacySettings: { ...latest.profile.privacySettings, ...saved.privacySettings },
      };
      const nextSession = { ...latest, profile: merged };
      setSession(nextSession);
      sessionRef.current = nextSession;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!isFirebaseConfigured()) {
      return {
        success: false,
        error: "Firebase is not configured on this deployment. Add environment variables in Vercel.",
      };
    }
    const result = await signInWithEmail(email, password);
    return result;
  }, []);

  const register = useCallback(
    async (data: { name: string; email: string; password: string; profile: Partial<Profile> }) => {
      if (!isFirebaseConfigured()) {
        return {
          success: false,
          error: "Firebase is not configured on this deployment. Add environment variables in Vercel.",
        };
      }
      return registerWithEmail(data.name, data.email, data.password, data.profile);
    },
    []
  );

  const logout = useCallback(() => {
    void signOutUser();
  }, []);

  const updateProfile = useCallback(
    (updates: Partial<Profile>) => {
      const current = sessionRef.current;
      if (!current) return;

      const updatedProfile: Profile = {
        ...current.profile,
        ...updates,
        privacySettings: { ...current.profile.privacySettings, ...updates.privacySettings },
        preferences: { ...current.profile.preferences, ...updates.preferences },
        matrimony: { ...current.profile.matrimony, ...updates.matrimony },
        verification: { ...current.profile.verification, ...updates.verification },
      };

      const nextSession = { ...current, profile: updatedProfile };
      setSession(nextSession);
      sessionRef.current = nextSession;

      void persistProfile(updatedProfile);
    },
    [persistProfile]
  );

  const updateMatrimony = useCallback(
    (updates: Partial<MatrimonyDetails>) => {
      const current = sessionRef.current;
      if (!current) return;
      updateProfile({ matrimony: { ...current.profile.matrimony, ...updates } });
    },
    [updateProfile]
  );

  const updateVerification = useCallback(
    async (updates: Partial<VerificationData>) => {
      const current = sessionRef.current;
      if (!current) return;

      const updatedProfile: Profile = {
        ...current.profile,
        verification: { ...current.profile.verification, ...updates },
      };

      const nextSession = { ...current, profile: updatedProfile };
      setSession(nextSession);
      sessionRef.current = nextSession;

      await persistProfile(updatedProfile);
    },
    [persistProfile]
  );

  const completeOnboardingProfile = useCallback(
    async (updates: Partial<Profile>) => {
      const current = sessionRef.current;
      if (!current) return;

      const updated = completeProfileOnboarding(current.profile, updates);
      setSession({ ...current, profile: updated });

      const saved = await updateProfileInFirestore(current.user.id, current.user, updated);
      setSession({ ...current, profile: saved });
    },
    []
  );

  const submitVerificationRequest = useCallback(() => {
    const current = sessionRef.current;
    if (!current) return;

    const updated = submitVerification(current.profile);
    void (async () => {
      await persistProfile(updated);
      await createVerificationRequest({
        userId: current.user.id,
        name: current.user.name,
        email: current.user.email,
        submittedAt: updated.verification.submittedAt ?? new Date().toISOString(),
        idDocumentType: updated.verification.idDocumentType,
      });
    })();
  }, [persistProfile]);

  const simulateVerificationApproval = useCallback(() => {
    const current = sessionRef.current;
    if (!current) return;
    const updated = approveVerification(current.profile);
    void persistProfile(updated);
  }, [persistProfile]);

  const simulateVerificationRejection = useCallback(
    (reason: string) => {
      const current = sessionRef.current;
      if (!current) return;
      const updated = rejectVerification(current.profile, reason);
      void persistProfile(updated);
    },
    [persistProfile]
  );

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
