import { getFirebaseDb } from "@/lib/firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactMessage(input: ContactMessageInput): Promise<void> {
  await addDoc(collection(getFirebaseDb(), "contactMessages"), {
    ...input,
    status: "new",
    createdAt: serverTimestamp(),
  });
}

export interface ReportInput {
  reporterId: string;
  reporterName: string;
  reportedId?: string;
  reportedName: string;
  reason: string;
}

export async function submitReport(input: ReportInput): Promise<void> {
  await addDoc(collection(getFirebaseDb(), "reports"), {
    ...input,
    status: "open",
    createdAt: serverTimestamp(),
  });
}
