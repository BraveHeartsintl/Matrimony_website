/** Compress an image file for Firestore inline storage (demo fallback when Storage is unavailable). */
export async function compressImageFile(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<string> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.82 } = options;

  if (!file.type.startsWith("image/")) {
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
  const compressed = canvas.toDataURL("image/jpeg", quality);

  // Firestore field limit is ~1 MiB; keep a safety margin.
  if (compressed.length > 900_000) {
    return canvas.toDataURL("image/jpeg", 0.65);
  }

  return compressed;
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
