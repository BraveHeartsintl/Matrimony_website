"use client";

import { isFirebaseConfigured } from "@/lib/firebase/config";

export default function FirebaseConfigBanner() {
  if (isFirebaseConfigured()) return null;

  return (
    <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-sm text-amber-950">
      Firebase environment variables are missing. Add{" "}
      <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_FIREBASE_*</code> in Vercel → Settings →
      Environment Variables, then redeploy.
    </div>
  );
}
