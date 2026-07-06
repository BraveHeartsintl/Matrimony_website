import { mapFirebaseError } from "@/lib/firebase/errors";
import { getFirebaseAuth } from "@/lib/firebase/config";
import { sendEmailVerification } from "firebase/auth";

export async function sendAccountVerificationEmail(): Promise<void> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to verify your email.");
  }
  if (user.emailVerified) {
    return;
  }
  try {
    await sendEmailVerification(user);
  } catch (error) {
    throw new Error(mapFirebaseError(error, "Failed to send verification email."));
  }
}

export function isAuthEmailVerified(): boolean {
  return getFirebaseAuth().currentUser?.emailVerified ?? false;
}
