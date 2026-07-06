import { mapFirebaseError } from "@/lib/firebase/errors";
import { getFirebaseAuth } from "@/lib/firebase/config";
import { createUserAndProfile } from "@/lib/firebase/services/profile.service";
import type { Profile } from "@/lib/types";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";

export function subscribeAuthState(callback: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
    return { success: true };
  } catch (error) {
    return { success: false, error: mapFirebaseError(error, "Login failed", "login") };
  }
}

export async function registerWithEmail(
  name: string,
  email: string,
  password: string,
  profilePartial: Partial<Profile>
): Promise<{ success: boolean; error?: string }> {
  let firebaseUser: FirebaseUser | null = null;

  try {
    const credential = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      email.trim(),
      password
    );
    firebaseUser = credential.user;
    await createUserAndProfile(firebaseUser.uid, { name, email: email.trim(), profilePartial });
    return { success: true };
  } catch (error) {
    if (firebaseUser) {
      try {
        await deleteUser(firebaseUser);
      } catch {
        // Rollback failed — account may need manual cleanup in Firebase Console
      }
    }
    return { success: false, error: mapFirebaseError(error, "Registration failed", "register") };
  }
}

export async function signOutUser(): Promise<void> {
  await signOut(getFirebaseAuth());
}
