"use client";

import { getFirebaseAnalytics } from "@/lib/firebase/analytics";
import { getFirebaseApp, getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/config";
import { initializeRecaptchaConfig } from "firebase/auth";
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

    // Required for Firebase phone auth (12.x + Blaze plan).
    // Without this, reCAPTCHA Enterprise config is empty and phone OTP fails with 400.
    void initializeRecaptchaConfig(getFirebaseAuth()).catch(() => {
      // Non-fatal — falls back to reCAPTCHA v2 on domains where Enterprise is not configured.
    });
  }, []);

  return children;
}
