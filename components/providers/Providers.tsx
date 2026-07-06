"use client";

import FirebaseConfigBanner from "@/components/layout/FirebaseConfigBanner";
import { AuthProvider } from "@/context/AuthContext";
import FirebaseProvider from "@/components/providers/FirebaseProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <FirebaseConfigBanner />
        {children}
      </AuthProvider>
    </FirebaseProvider>
  );
}
