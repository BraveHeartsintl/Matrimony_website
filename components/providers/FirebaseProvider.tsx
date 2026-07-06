"use client";

import { getFirebaseAnalytics } from "@/lib/firebase/analytics";
import { getFirebaseApp } from "@/lib/firebase/config";
import { useEffect } from "react";

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    getFirebaseApp();
    void getFirebaseAnalytics();
  }, []);

  return children;
}
