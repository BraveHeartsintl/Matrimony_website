import { mapFirebaseError } from "@/lib/firebase/errors";
import { getFirebaseFunctions } from "@/lib/firebase/config";
import { httpsCallable } from "firebase/functions";

export type CreateVeriffSessionResponse = {
  sessionId: string;
  sessionUrl: string;
};

/** Starts a Veriff hosted ID + selfie session; open `sessionUrl` in the browser. */
export async function startVeriffSession(): Promise<CreateVeriffSessionResponse> {
  try {
    const createVeriffSession = httpsCallable<void, CreateVeriffSessionResponse>(
      getFirebaseFunctions(),
      "createVeriffSession"
    );
    const { data } = await createVeriffSession();
    if (!data?.sessionUrl || !data?.sessionId) {
      throw new Error("Veriff did not return a session URL.");
    }
    return data;
  } catch (error) {
    throw new Error(mapFirebaseError(error, "Could not start identity verification."));
  }
}
