// src/lib/auth/helpers.ts

import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

// Placeholder pour la fonction d'authentification côté serveur
// REMPLACER par votre vraie logique (ex: avec cookies, Supabase, NextAuth.js)
export async function getCurrentUser(): Promise<{ id: string | null, name?: string | null, email?: string | null } | null> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return null;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(session.access_token);
    
    if (userError || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split('@')[0],
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Alias for backwards compatibility
export const getUserData = getCurrentUser;

// Vous ajouterez ici d'autres helpers d'authentification si nécessaire