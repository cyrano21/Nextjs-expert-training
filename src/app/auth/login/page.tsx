"use client";

import Link from "next/link";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { getRedirectPathByRole, getWelcomeMessageByRole } from "@/utils/roles";
import { toast } from "sonner";
import { AlertTriangle, Code } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";

// 👇 METTRE ÇA ICI, APRÈS LES IMPORTS
export const dynamic = 'force-dynamic';


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const role = session.user?.user_metadata?.role ?? 'student';
        const redirectPath = getRedirectPathByRole(role);
        router.push(redirectPath);
      }
    };

    checkSession();
  }, [router]);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || 'Login failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Log détaillé pour vérifier le rôle
        console.log('Données utilisateur après connexion:', {
          user: {
            email: data.user.email,
            metadata: data.user.user_metadata,
            hasRole: !!data.user.user_metadata?.role
          }
        });

        // Vérifier et définir un rôle par défaut si non présent
        let role = data.user.user_metadata?.role;

        if (!role) {
          console.log('Aucun rôle défini, attribution du rôle par défaut');
          const { error: updateError } = await supabase.auth.updateUser({
            data: { role: 'student' }
          });

          if (updateError) {
            console.error('Erreur lors de la mise à jour du rôle:', updateError);
            setError('Impossible de définir votre rôle. Veuillez réessayer.');
            setIsLoading(false);
            return;
          }

          // Mettre à jour le rôle après la mise à jour
          role = 'student';
        }

        toast.success(getWelcomeMessageByRole(role), {
          description: `Redirecting you to your ${role} dashboard...`,
          duration: 3000,
        });

        const redirectAfterLogin = searchParams.get('redirect') || getRedirectPathByRole(role);
        
        setTimeout(() => {
          router.push(redirectAfterLogin);
        }, 1500);
      } else {
        setError("An unexpected issue occurred during login.");
      }

      setIsLoading(false);
    } catch (catchError: unknown) {
      setError('An unexpected error occurred. Please try again.');
      console.error("Login catch error:", catchError);
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=/student/dashboard`,
          scopes: 'email profile'
        }
      });

      if (error) {
        toast.error('Erreur de connexion Google', {
          description: error.message
        });
      }
    } catch (err) {
      console.error('Erreur lors de la connexion Google:', err);
      toast.error('Une erreur est survenue');
    }
  };
  

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 selection:bg-primary/20">
      <Card className="w-full max-w-md overflow-hidden rounded-xl border-border/30 bg-background/80 shadow-xl backdrop-blur-lg">
        <CardHeader className="space-y-2 p-8 text-center">
          <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3">
            <Code className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Sign in to continue your Next.js journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-muted-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder="you@example.com"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-muted-foreground">
                  Password
                </Label>
                <Link
                  href="/auth/reset-password"
                  className="-my-1 rounded px-2 py-1 text-sm text-primary/90 hover:text-primary hover:bg-primary/10 transition-colors"
                  tabIndex={-1}
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-md font-semibold"
              disabled={isLoading}
              size="lg"
            >
              Sign In
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-5 bg-background/50 px-8 py-6 border-t border-border/30">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background/50 px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            <SocialLoginButton provider="google" onClick={handleGoogleSignIn} />
            <SocialLoginButton provider="github" />
          </div>

          <div className="pt-2 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-primary/90 hover:text-primary hover:underline underline-offset-4 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
