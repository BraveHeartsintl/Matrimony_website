"use client";

import { ADMIN_CREDENTIALS, matchesAdminCredentials } from "@/lib/admin-config";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/config";
import { bootstrapPlatformAdmin } from "@/lib/firebase/services/admin-bootstrap.service";
import { signInWithEmail, signOutUser } from "@/lib/firebase/services/auth.service";
import { getUser } from "@/lib/firebase/services/profile.service";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const ADMIN_SESSION_KEY = "uk_matrimony_admin_session";

export async function ensureAdminFirebaseAuth(): Promise<{ success: boolean; error?: string }> {
  try {
    await signOutUser();

    let signIn = await signInWithEmail(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
    if (!signIn.success) {
      await bootstrapPlatformAdmin();
      signIn = await signInWithEmail(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
    }

    const uid = getFirebaseAuth().currentUser?.uid;
    if (!uid || !signIn.success) {
      return {
        success: false,
        error:
          signIn.error ??
          "Could not connect to Firebase as admin. Open /admin/setup once to create the admin account, then sign in again.",
      };
    }

    const user = await getUser(uid);
    if (user?.role !== "admin") {
      await setDoc(
        doc(getFirebaseDb(), "users", uid),
        { role: "admin", accountStatus: "active", updatedAt: serverTimestamp() },
        { merge: true }
      );
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, uid);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Firebase admin authentication failed",
    };
  }
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (!matchesAdminCredentials(email, password)) {
    return { success: false, error: "Invalid admin credentials" };
  }

  const firebase = await ensureAdminFirebaseAuth();
  if (!firebase.success) {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    return { success: false, error: firebase.error };
  }

  return { success: true };
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return false;
  const currentUid = getFirebaseAuth().currentUser?.uid;
  return Boolean(currentUid && currentUid === session);
}

export function adminLogout(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  void signOutUser();
}

export async function getAdminSessionUser(): Promise<{
  id: string;
  name: string;
  email: string;
} | null> {
  if (!isAdminLoggedIn()) return null;

  const uid = getFirebaseAuth().currentUser?.uid;
  if (uid) {
    const user = await getUser(uid);
    if (user) {
      return { id: user.id, name: user.name, email: user.email };
    }
  }

  return {
    id: "admin",
    name: ADMIN_CREDENTIALS.name,
    email: ADMIN_CREDENTIALS.email,
  };
}
