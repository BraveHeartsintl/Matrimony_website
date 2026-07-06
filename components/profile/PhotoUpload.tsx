"use client";

import Button from "@/components/ui/Button";
import { uploadProfilePhoto } from "@/lib/firebase/services/storage.service";
import { Camera, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface PhotoUploadProps {
  userId: string;
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export default function PhotoUpload({
  userId,
  photos,
  onChange,
  maxPhotos = 5,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || photos.length >= maxPhotos) return;

    setUploading(true);
    setError("");
    try {
      const url = await uploadProfilePhoto(userId, file);
      onChange([...photos, url]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.map((photo, i) => (
          <div key={photo} className="relative aspect-square overflow-hidden rounded-lg border border-border">
            <Image src={photo} alt={`Photo ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 rounded bg-accent px-2 py-0.5 text-xs text-white">
                Primary
              </span>
            )}
          </div>
        ))}

        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-[6px] border-2 border-dashed border-border text-muted transition-colors hover:border-border-hover hover:text-foreground disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <Camera className="h-8 w-8" />
            )}
            <span className="text-xs">{uploading ? "Uploading…" : "Add Photo"}</span>
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      <p className="mt-3 text-xs text-muted">
        Upload up to {maxPhotos} photos. Images are stored securely in Firebase Storage.
      </p>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {photos.length === 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="h-4 w-4" />
          Upload Your First Photo
        </Button>
      )}
    </div>
  );
}
