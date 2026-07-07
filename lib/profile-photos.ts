import type { Profile } from "@/lib/types";

type PhotoSource = {
  photos?: string[];
  primaryPhotoUrl?: string | null;
  verification?: {
    selfiePreview?: string | null;
  };
};

function cleanPhotoList(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

/** Resolve all displayable profile photos from Firestore/session fields. */
export function resolveProfilePhotos(source: PhotoSource): string[] {
  const fromArray = cleanPhotoList(source.photos);
  if (fromArray.length > 0) return fromArray;

  const primary = String(source.primaryPhotoUrl ?? "").trim();
  if (primary) return [primary];

  const selfie = String(source.verification?.selfiePreview ?? "").trim();
  if (selfie) return [selfie];

  return [];
}

export function getProfilePhotoUrl(
  source: PhotoSource | Profile,
  index = 0
): string | undefined {
  return resolveProfilePhotos(source)[index];
}

export function profileHasPhoto(source: PhotoSource | Profile): boolean {
  return resolveProfilePhotos(source).length > 0;
}

/** Normalize Firestore profile document fields into a photos array. */
export function photosFromFirestoreData(data: Record<string, unknown>): string[] {
  return resolveProfilePhotos({
    photos: data.photos as string[] | undefined,
    primaryPhotoUrl: data.primaryPhotoUrl as string | undefined,
    verification: data.verification as PhotoSource["verification"],
  });
}

export function getPrimaryPhotoUrl(photos: string[]): string {
  return photos[0] ?? "";
}
