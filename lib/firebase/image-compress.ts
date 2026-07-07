function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return ["jpg", "jpeg", "png", "webp", "gif", "heic", "heif"].includes(ext);
}

/** Compress an image file for Firestore inline storage (demo fallback when Storage is unavailable). */
export async function compressImageFile(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<string> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.82 } = options;

  if (!isImageFile(file)) {
    throw new Error("Only image files can be stored without Firebase Storage.");
  }

  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height);
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image");

  ctx.drawImage(img, 0, 0, width, height);
  let compressed = canvas.toDataURL("image/jpeg", quality);

  // Firestore document limit is 1 MiB — keep inline images small.
  if (compressed.length > 280_000) {
    compressed = canvas.toDataURL("image/jpeg", 0.55);
  }
  if (compressed.length > 280_000) {
    compressed = canvas.toDataURL("image/jpeg", 0.4);
  }

  return compressed;
}

/** Smaller inline image for verification docs when Storage is unavailable. */
export async function compressVerificationImage(file: File): Promise<string> {
  return compressImageFile(file, { maxWidth: 720, maxHeight: 720, quality: 0.72 });
}

/** Prepare image bytes for Firebase Storage upload (resize + JPEG). */
export async function prepareImageUpload(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<{ bytes: Blob; contentType: string }> {
  if (!isImageFile(file)) {
    return { bytes: file, contentType: contentTypeForFile(file) };
  }

  const dataUrl = await compressImageFile(file, {
    maxWidth: options.maxWidth ?? 1600,
    maxHeight: options.maxHeight ?? 1600,
    quality: options.quality ?? 0.88,
  });
  const response = await fetch(dataUrl);
  const bytes = await response.blob();
  return { bytes, contentType: "image/jpeg" };
}

export function contentTypeForFile(file: File): string {
  if (file.type && file.type !== "application/octet-stream") return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    heic: "image/heic",
    heif: "image/heif",
    pdf: "application/pdf",
  };
  return map[ext] ?? "image/jpeg";
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Invalid image file"));
    img.src = src;
  });
}
