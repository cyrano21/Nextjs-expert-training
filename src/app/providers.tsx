// ✅ Correction dans src/app/providers.tsx
"use client";
import AuthProvider from "@/contexts/auth-context"; // 👈 pas de { }
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
