import type { PendingVerificationSubmission } from "@/lib/auth";
import { timestampToIso } from "@/lib/firebase/converters";
import { getFirebaseDb } from "@/lib/firebase/config";
import type { VerificationData } from "@/lib/types";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

function verificationToAdminPayload(
  userId: string,
  user: { name: string; email: string },
  verification: VerificationData,
  submitted: boolean
): Record<string, unknown> {
  return {
    userId,
    name: user.name,
    email: user.email,
    idDocumentType: verification.idDocumentType ?? null,
    idDocumentPreview: verification.idDocumentPreview ?? null,
    selfiePreview: verification.selfiePreview ?? null,
    educationDocPreview: verification.educationDocPreview ?? null,
    employmentDocPreview: verification.employmentDocPreview ?? null,
    phoneVerified: verification.phoneVerified ?? false,
    emailVerified: verification.emailVerified ?? false,
    status: "pending",
    stage: submitted ? "submitted" : "in_progress",
    updatedAt: serverTimestamp(),
    ...(submitted ? { submittedAt: serverTimestamp() } : {}),
  };
}

/** Save verification fields without replacing the whole profile document (avoids Firestore merge bugs). */
export async function saveVerificationFields(
  userId: string,
  user: { name: string; email: string },
  verification: VerificationData,
  options?: { submitted?: boolean }
): Promise<void> {
  const db = getFirebaseDb();
  const profileRef = doc(db, "profiles", userId);
  const flat: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
    lastActiveAt: serverTimestamp(),
  };

  for (const [key, value] of Object.entries(verification)) {
    flat[`verification.${key}`] = value ?? null;
  }

  try {
    await updateDoc(profileRef, flat);
  } catch (error) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code?: string }).code)
        : "";
    if (code !== "not-found") throw error;
    await setDoc(
      profileRef,
      {
        verification,
        updatedAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  await setDoc(
    doc(db, "verificationRequests", userId),
    verificationToAdminPayload(userId, user, verification, options?.submitted ?? false),
    { merge: true }
  );
}

export async function getPendingVerifications(): Promise<PendingVerificationSubmission[]> {
  const db = getFirebaseDb();
  const snap = await getDocs(
    query(collection(db, "verificationRequests"), where("status", "==", "pending"))
  );

  const rows = snap.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      userId: String(data.userId ?? docSnap.id),
      name: String(data.name ?? ""),
      email: String(data.email ?? ""),
      submittedAt: timestampToIso(data.submittedAt) ?? timestampToIso(data.updatedAt) ?? new Date().toISOString(),
      idDocumentType: data.idDocumentType as string | undefined,
      idDocumentPreview: data.idDocumentPreview as string | undefined,
      selfiePreview: data.selfiePreview as string | undefined,
      educationDocPreview: data.educationDocPreview as string | undefined,
      employmentDocPreview: data.employmentDocPreview as string | undefined,
      stage: (data.stage as string | undefined) ?? "in_progress",
    };
  });

  return rows.filter(
    (row) =>
      Boolean(row.idDocumentPreview) ||
      Boolean(row.selfiePreview) ||
      Boolean(row.educationDocPreview) ||
      Boolean(row.employmentDocPreview)
  );
}
