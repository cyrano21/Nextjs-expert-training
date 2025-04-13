import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types'; // optionnel si tu l'as

export async function handleOAuthCallback(code: string) {
  if (!code) {
    console.error("Aucun code d'autorisation fourni pour l'échange OAuth");
    return { success: false, error: "Code d'autorisation manquant" };
  }
  
  console.log("OAuth Callback - Code reçu:", code.substring(0, 8) + "...");
  
  try {
    const cookieStore = await cookies();
    
    // Vérifier si PKCECodeVerifier est présent dans les cookies
    const pkceVerifier = cookieStore.get('supabase-auth-code-verifier');
    console.log("Code Verifier Cookie:", { 
      exists: !!pkceVerifier, 
      value: pkceVerifier ? 'PRESENT' : 'ABSENT' 
    });
    
    if (pkceVerifier) {
      console.log("Cleaned Code Verifier:", { 
        length: pkceVerifier.value.length,
        firstChars: pkceVerifier.value.substring(0, 10) + '...'
      });
    }

    const supabase = createServerComponentClient<Database>({
      cookies: () => cookieStore,
    });

    console.log("Échange du code contre une session...");
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Erreur lors de l'échange du code:", error);
      return { success: false, error: error.message };
    }

    console.log("Session obtenue avec succès:", {
      userId: data.user?.id,
      hasSession: !!data.session,
      expiresAt: data.session?.expires_at
    });

    return { success: true, data };
  } catch (err) {
    const error = err as Error;
    console.error("Échec de l'authentification:", error.message);
    return { success: false, error: error.message || 'Erreur serveur OAuth' };
  }
}
