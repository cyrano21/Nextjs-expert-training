/* eslint-disable @typescript-eslint/no-explicit-any */
/* stylelint-disable */

import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Journaliser pour le débogage
  console.log("Callback OAuth appelé");
  
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect") || "/student/dashboard";
  
  if (!code) {
    console.error("No code provided in callback");
    return NextResponse.redirect(
      new URL("/auth/login?message=Paramètres%20de%20callback%20invalides", requestUrl.origin)
    );
  }
  
  try {
    // Créer un client Supabase pour le handler de route
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // Échanger le code d'autorisation contre une session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Erreur lors de l'échange du code:", error);
      return NextResponse.redirect(
        new URL("/auth/login?message=Échec%20de%20l%27authentification", requestUrl.origin)
      );
    }
    
    // Journaliser le succès
    console.log("Session créée avec succès:", data?.session ? "Session valide" : "Pas de session");
    
    // Authentification réussie, rediriger vers la destination demandée
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
    
  } catch (error: any) {
    console.error("Erreur dans le callback d'authentification:", error?.message || error);
    return NextResponse.redirect(
      new URL("/auth/login?message=Erreur%20inattendue", requestUrl.origin)
    );
  }
}
/* stylelint-enable */
/* eslint-enable @typescript-eslint/no-explicit-any */
