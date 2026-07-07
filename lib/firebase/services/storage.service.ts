import {
  compressVerificationImage,
  contentTypeForFile,
  prepareImageUpload,
} from "@/lib/firebase/image-compress";
import { getFirebaseAuth, getFirebaseStorage } from "@/lib/firebase/config";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

function extensionForFile(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && fromName.length <= 5) return fromName;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "application/pdf") return "pdf";
  return "jpg";
}

/** Only use Firestore inline images when explicitly enabled (local demo without Storage). */
function storageDemoFallbackEnabled(): boolean {
  return process.env.NEXT_PUBLIC_FIREBASE_STORAGE_DEMO_MODE === "true";
}

function storageSetupHint(): string {
  return (
    "Firebase Storage upload failed. In Firebase Console open Build → Storage, confirm the bucket is enabled, " +
    "then deploy rules: firebase deploy --only storage"
  );
}

function getStorageErrorCode(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    return String((error as { code?: string }).code);
  }
  return "";
}

function isStorageInfrastructureError(error: unknown): boolean {
  const code = getStorageErrorCode(error).toLowerCase();
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  return (
    code === "storage/bucket-not-found" ||
    code === "storage/object-not-found" ||
    code === "storage/canceled" ||
    code === "storage/retry-limit-exceeded" ||
    message.includes("cors") ||
    message.includes("network error") ||
    message.includes("failed to fetch")
  );
}

function assertSignedInUploader(userId: string): void {
  const authUser = getFirebaseAuth().currentUser;
  if (!authUser) {
    throw new Error("You must be signed in to upload files.");
  }
  if (authUser.uid !== userId) {
    throw new Error("Upload session mismatch. Please sign out and sign in again.");
  }
}

async function uploadImageWithFallback(file: File, upload: () => Promise<string>): Promise<string> {
  try {
    return await upload();
  } catch (error) {
    const code = getStorageErrorCode(error);
    console.error("[storage] Upload failed", code, error);

    if (storageDemoFallbackEnabled() && isStorageInfrastructureError(error)) {
      console.warn("[storage] Using compressed Firestore fallback (demo mode).");
      return compressVerificationImage(file);
    }

    if (code === "storage/unauthorized" || code === "storage/unauthenticated") {
      throw new Error(
        `${storageSetupHint()} Storage rules blocked this upload (not signed in or rules not deployed).`
      );
    }

    throw new Error(
      `${storageSetupHint()}${error instanceof Error ? `: ${error.message}` : ""}`
    );
  }
}

export async function uploadProfilePhoto(userId: string, file: File): Promise<string> {
  return uploadImageWithFallback(file, async () => {
    assertSignedInUploader(userId);
    const { bytes, contentType } = await prepareImageUpload(file);
    const path = `profiles/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const storageRef = ref(getFirebaseStorage(), path);
    await uploadBytes(storageRef, bytes, { contentType });
    return getDownloadURL(storageRef);
  });
}

export async function deleteStorageUrl(url: string): Promise<void> {
  if (!url.startsWith("https://firebasestorage.googleapis.com")) return;
  try {
    const storageRef = ref(getFirebaseStorage(), url);
    await deleteObject(storageRef);
  } catch {
    // File may already be deleted or URL is external
  }
}

export type VerificationDocKind = "id" | "selfie" | "education" | "employment";

export async function uploadVerificationDoc(
  userId: string,
  file: File,
  kind: VerificationDocKind
): Promise<string> {
  const isImage =
    file.type.startsWith("image/") ||
    kind === "id" ||
    kind === "selfie" ||
    ["jpg", "jpeg", "png", "webp", "gif", "heic", "heif"].includes(
      file.name.split(".").pop()?.toLowerCase() ?? ""
    );

  if (isImage) {
    return uploadImageWithFallback(file, async () => {
      assertSignedInUploader(userId);
      const { bytes, contentType } = await prepareImageUpload(file, {
        maxWidth: 1400,
        maxHeight: 1400,
        quality: 0.86,
      });
      const path = `verification/${userId}/${kind}-${Date.now()}.jpg`;
      const storageRef = ref(getFirebaseStorage(), path);
      await uploadBytes(storageRef, bytes, { contentType });
      return getDownloadURL(storageRef);
    });
  }

  assertSignedInUploader(userId);
  const path = `verification/${userId}/${kind}-${Date.now()}.${extensionForFile(file)}`;
  const storageRef = ref(getFirebaseStorage(), path);
  try {
    await uploadBytes(storageRef, file, {
      contentType: contentTypeForFile(file),
    });
    return getDownloadURL(storageRef);
  } catch (error) {
    throw new Error(
      `${storageSetupHint()}${error instanceof Error ? `: ${error.message}` : ""}`
    );
  }
}
