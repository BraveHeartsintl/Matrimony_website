import { ADMIN_CREDENTIALS } from "@/lib/admin-config";
import { getFirebaseDb } from "@/lib/firebase/config";
import { registerWithEmail } from "@/lib/firebase/services/auth.service";
import { getFirebaseAuth } from "@/lib/firebase/config";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

export async function isAdminBootstrapAvailable(): Promise<boolean> {
  const snap = await getDoc(doc(getFirebaseDb(), "platformStats", "adminBootstrap"));
  return !snap.exists();
}

export async function bootstrapPlatformAdmin(): Promise<{
  success: boolean;
  error?: string;
  email?: string;
}> {
  const available = await isAdminBootstrapAvailable();
  if (!available) {
    return { success: false, error: "Admin account already exists. Use /admin/login." };
  }

  const { name, email, password } = ADMIN_CREDENTIALS;

  const register = await registerWithEmail(name, email, password, {
    onboardingStatus: "verified",
    verified: true,
  });

  if (!register.success) {
    if (register.error?.toLowerCase().includes("email-already-in-use")) {
      const auth = getFirebaseAuth();
      const { signInWithEmail } = await import("@/lib/firebase/services/auth.service");
      const login = await signInWithEmail(email, password);
      if (!login.success) {
        return {
          success: false,
          error:
            "Admin email exists in Firebase Auth but password does not match. Reset it in Firebase Console or use the correct password.",
        };
      }
      const uid = auth.currentUser?.uid;
      if (!uid) return { success: false, error: "Could not resolve admin user." };
      await updateDoc(doc(getFirebaseDb(), "users", uid), {
        role: "admin",
        updatedAt: serverTimestamp(),
      });
      await setDoc(doc(getFirebaseDb(), "platformStats", "adminBootstrap"), {
        completed: true,
        email,
        uid,
        createdAt: serverTimestamp(),
      });
      const { signOutUser } = await import("@/lib/firebase/services/auth.service");
      await signOutUser();
      return { success: true, email };
    }
    return { success: false, error: register.error };
  }

  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) {
    return { success: false, error: "Admin user was created but session is missing." };
  }

  await updateDoc(doc(getFirebaseDb(), "users", uid), {
    role: "admin",
    accountStatus: "active",
    updatedAt: serverTimestamp(),
  });

  await setDoc(doc(getFirebaseDb(), "platformStats", "adminBootstrap"), {
    completed: true,
    email,
    uid,
    createdAt: serverTimestamp(),
  });

  const { signOutUser } = await import("@/lib/firebase/services/auth.service");
  await signOutUser();

  return { success: true, email };
}
