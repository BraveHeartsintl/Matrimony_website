"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

function needsUnoptimized(src: string): boolean {
  return (
    src.startsWith("data:") ||
    src.includes("firebasestorage.googleapis.com") ||
    src.includes("firebasestorage.app")
  );
}

export default function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const photoSrc = src?.trim();

  useEffect(() => {
    setFailed(false);
  }, [photoSrc]);

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-lg",
  };

  const imageSizes = { sm: 32, md: 40, lg: 56, xl: 80 };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (photoSrc && !failed) {
    return (
      <div className={cn("relative overflow-hidden rounded-full img-bw", sizes[size], className)}>
        <Image
          src={photoSrc}
          alt={name}
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="h-full w-full object-cover"
          unoptimized={needsUnoptimized(photoSrc)}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full glass-subtle font-medium text-muted",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
