"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database.types";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/student/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message] = useState<string | null>(
    searchParams.get("message") || null
  );

  const supabase = createClientComponentClient<Database>();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data?.user) {
        // Vérifier si l'utilisateur est confirmé
        if (!data.user.email_confirmed_at) {
          setError("Veuillez vérifier votre email pour confirmer votre compte");
          return;
        }

        // Récupérer le rôle de l'utilisateur depuis les métadonnées
        const role = data.user.user_metadata?.role || "student";

        // Redirection spécifique selon le rôle
        const roleRedirects = {
          student: "/student/dashboard",
          instructor: "/instructor/dashboard",
          admin: "/admin/dashboard",
        };

        const finalRedirect =
          roleRedirects[role as keyof typeof roleRedirects] || redirectTo;
        router.push(finalRedirect);
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError(
        "Une erreur inattendue est survenue. Veuillez réessayer plus tard."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?redirect=${redirectTo}`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error 
          ? err.message 
          : "Une erreur est survenue lors de la connexion"
      );
    } finally {
      setLoading(false);
    }
  };

  // Amélioration du message d'erreur affiché
  const renderErrorMessage = (errorMsg: string) => {
    // Mappez les messages d'erreur de Supabase à des messages plus conviviaux
    const errorMap: Record<string, string> = {
      "Invalid login credentials":
        "Identifiants invalides. Vérifiez votre email et mot de passe.",
      "Email not confirmed":
        "Veuillez vérifier votre email pour confirmer votre compte.",
      "Invalid email": "Adresse email invalide.",
    };

    return errorMap[errorMsg] || errorMsg;
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          Connectez-vous à votre compte
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
            >
              Adresse email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                Mot de passe
              </label>
              <div className="text-sm">
                <Link
                  href="/auth/reset-password"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {renderErrorMessage(error)}
            </div>
          )}

          {message && (
            <div className="text-green-500 text-sm mt-2">{message}</div>
          )}

          <div>
            <Button
              type="submit"
              className="flex w-full justify-center"
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                Ou continuer avec
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              Connexion avec Google
            </Button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Pas encore de compte ?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
