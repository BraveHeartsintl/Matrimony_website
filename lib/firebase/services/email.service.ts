import { mapFirebaseError } from "@/lib/firebase/errors";
import { getFirebaseAuth, getFirebaseFunctions } from "@/lib/firebase/config";
import { httpsCallable } from "firebase/functions";

export async function sendAccountVerificationEmail(): Promise<{ alreadyVerified: boolean }> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to verify your email.");
  }
  if (!user.email) {
    throw new Error("This account has no email address to verify.");
  }
  if (user.emailVerified) {
    return { alreadyVerified: true };
  }

  try {
    const sendVerificationEmail = httpsCallable<void, { alreadyVerified: boolean }>(
      getFirebaseFunctions(),
      "sendVerificationEmail"
    );
    const { data } = await sendVerificationEmail();
    return { alreadyVerified: Boolean(data.alreadyVerified) };
  } catch (error) {
    throw new Error(mapFirebaseError(error, "Failed to send verification email."));
  }
}

export function isAuthEmailVerified(): boolean {
  return getFirebaseAuth().currentUser?.emailVerified ?? false;
}
