import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// Configurer les options Supabase pour l'authentification
export const supabaseAuthConfig = {
  // Générer un code verifier personnalisé
  generateCodeVerifier: () => {
    // Générer un code verifier aléatoire robuste
    const codeVerifier = Array(128).fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join('');
    return codeVerifier;
  },

  // Configuration des options d'authentification
  authOptions: {
    // Configurer les options de flow PKCE
    pkce: {
      enabled: true,
      // Personnaliser la génération du code verifier si nécessaire
      codeVerifierMethod: 'S256'
    },

    // Options supplémentaires si nécessaire
    persistSession: true,
    autoRefreshToken: true,
  }
};

// Créer un client Supabase avec les configurations personnalisées
export const createSupabaseClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL or Anon Key is missing');
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseAuthConfig.authOptions
  );
};
