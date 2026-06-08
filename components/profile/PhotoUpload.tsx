"use client";

import Button from "@/components/ui/Button";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export default function PhotoUpload({ photos, onChange, maxPhotos = 5 }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || photos.length >= maxPhotos) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange([...photos, reader.result]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.map((photo, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-border">
            <Image src={photo} alt={`Photo ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 rounded bg-primary px-2 py-0.5 text-xs text-white">
                Primary
              </span>
            )}
          </div>
        ))}

        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border text-muted transition-colors hover:border-primary hover:text-primary"
          >
            <Camera className="h-8 w-8" />
            <span className="text-xs">Add Photo</span>
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      <p className="mt-3 text-xs text-muted">
        Upload up to {maxPhotos} photos. Images are stored locally for this demo only.
      </p>

      {photos.length === 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="h-4 w-4" />
          Upload Your First Photo
        </Button>
      )}
    </div>
  );
}
