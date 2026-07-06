"use client";

import { AuthProvider } from "@/context/AuthContext";
import FirebaseProvider from "@/components/providers/FirebaseProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      <AuthProvider>{children}</AuthProvider>
    </FirebaseProvider>
  );
}
