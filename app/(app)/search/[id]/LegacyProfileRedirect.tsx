"use client";

import { resolveProfileId } from "@/lib/firebase/services/search.service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface LegacyProfileRedirectProps {
  params: Promise<{ id: string }>;
}

export default function LegacyProfileRedirect({ params }: LegacyProfileRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    void params.then(({ id }) => {
      router.replace(`/search/profile?id=${encodeURIComponent(resolveProfileId(id))}`);
    });
  }, [params, router]);

  return null;
}
