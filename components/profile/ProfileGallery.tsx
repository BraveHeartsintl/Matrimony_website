"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProfileGalleryProps {
  photos: string[];
  name: string;
}

export default function ProfileGallery({ photos, name }: ProfileGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = photos.length > 1;

  const goTo = (index: number) => {
    setActiveIndex((index + photos.length) % photos.length);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] border border-accent/10 bg-surface shadow-[0_12px_40px_rgba(61,18,40,0.1)] sm:aspect-[3/4]">
        <Image
          src={photos[activeIndex]}
          alt={`${name} — photo ${activeIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition hover:bg-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition hover:bg-white"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {photos.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === activeIndex ? "w-6 bg-gold" : "w-2 bg-white/70"
                  )}
                  aria-label={`View photo ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {photos.map((photo, index) => (
            <button
              key={photo}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-[10px] border-2 transition-all",
                index === activeIndex
                  ? "border-accent shadow-md"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={photo}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
