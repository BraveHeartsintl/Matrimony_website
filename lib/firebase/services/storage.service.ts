import { compressImageFile } from "@/lib/firebase/image-compress";
import { getFirebaseStorage } from "@/lib/firebase/config";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

function extensionForFile(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && fromName.length <= 5) return fromName;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "application/pdf") return "pdf";
  return "jpg";
}

function storageDemoFallbackEnabled(): boolean {
  return process.env.NEXT_PUBLIC_FIREBASE_STORAGE_DEMO_MODE !== "false";
}

function isStorageUnavailableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return (
    message.includes("cors") ||
    message.includes("network") ||
    message.includes("storage") ||
    message.includes("404") ||
    message.includes("403") ||
    message.includes("failed") ||
    message.includes("unauthorized")
  );
}

async function uploadImageWithFallback(file: File, upload: () => Promise<string>): Promise<string> {
  try {
    return await upload();
  } catch (error) {
    if (!storageDemoFallbackEnabled() || !file.type.startsWith("image/")) {
      throw new Error(
        "Firebase Storage is not available. Enable Storage in the Firebase Console (Build → Storage → Get started), then retry. " +
          (error instanceof Error ? error.message : "Upload failed")
      );
    }
    if (!isStorageUnavailableError(error)) throw error;
    console.warn("[storage] Firebase Storage upload failed; using compressed Firestore fallback.", error);
    return compressImageFile(file);
  }
}

export async function uploadProfilePhoto(userId: string, file: File): Promise<string> {
  return uploadImageWithFallback(file, async () => {
    const path = `profiles/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extensionForFile(file)}`;
    const storageRef = ref(getFirebaseStorage(), path);
    await uploadBytes(storageRef, file, { contentType: file.type || "image/jpeg" });
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
  const isImage = file.type.startsWith("image/") || kind === "id" || kind === "selfie";

  if (isImage) {
    return uploadImageWithFallback(file, async () => {
      const path = `verification/${userId}/${kind}-${Date.now()}.${extensionForFile(file)}`;
      const storageRef = ref(getFirebaseStorage(), path);
      const contentType = file.type || "image/jpeg";
      await uploadBytes(storageRef, file, { contentType });
      return getDownloadURL(storageRef);
    });
  }

  // PDFs require Firebase Storage
  const path = `verification/${userId}/${kind}-${Date.now()}.${extensionForFile(file)}`;
  const storageRef = ref(getFirebaseStorage(), path);
  try {
    await uploadBytes(storageRef, file, {
      contentType: file.type || "application/pdf",
    });
    return getDownloadURL(storageRef);
  } catch (error) {
    throw new Error(
      "Could not upload document. Enable Firebase Storage in the Firebase Console (Build → Storage → Get started). " +
        (error instanceof Error ? error.message : "")
    );
  }
}
