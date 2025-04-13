// src/services/supabase/server.ts

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers'; // Import de cookies
import type { Database } from '@/types/database.types'; // Importez votre type de base de données

// Cette fonction DOIT rester synchrone pour être appelée directement dans un Server Component / Action
export function createServerSupabaseClient() {
  // Appelez cookies() directement ici, car cette fonction est appelée dans un contexte serveur
  const cookieStore = cookies();
  return createServerComponentClient<Database>({
    // Passez la fonction qui retourne le cookieStore
    cookies: () => cookieStore,
  });
}

// Cette fonction peut être async si elle utilise le client pour faire des appels DB
export async function getServerSession() {
  // Initialisation du client Supabase (synchrone ici)
  const supabase = createServerSupabaseClient();
  // Les appels à Supabase (comme getSession) SONT async et nécessitent await
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}