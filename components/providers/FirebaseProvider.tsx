"use client";

import { getFirebaseAnalytics } from "@/lib/firebase/analytics";
import { getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase/config";
import { useEffect } from "react";

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      console.warn(
        "[Firebase] Environment variables are not configured. Auth and database features are disabled."
      );
      return;
    }
    getFirebaseApp();
    void getFirebaseAnalytics();
  }, []);

  return children;
}
