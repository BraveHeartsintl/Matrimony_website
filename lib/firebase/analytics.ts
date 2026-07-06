"use client";

import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getFirebaseApp } from "./config";

let analytics: Analytics | undefined;

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (analytics) {
    return analytics;
  }

  const supported = await isSupported();
  if (!supported) {
    return null;
  }

  analytics = getAnalytics(getFirebaseApp());
  return analytics;
}
