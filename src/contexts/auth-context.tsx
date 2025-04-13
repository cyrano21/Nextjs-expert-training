"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Session,
  User,
  AuthError,
  AuthResponse,
  UserMetadata,
} from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase-client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    metadata?: UserMetadata
  ) => Promise<{ error: AuthError | null; data: AuthResponse["data"] | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Au premier chargement, vérifier s'il existe une session active
    const initializeAuth = async () => {
      try {
        // Récupérer la session existante
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Erreur lors de la récupération de la session:", error);
          setLoading(false);
          return;
        }

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
        }
      } catch (err) {
        console.error("Erreur d'initialisation de l'auth:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Configurer l'écouteur de changement d'état d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Événement auth:", event);

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: UserMetadata
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Erreur lors de la connexion avec Google:", error);
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
