import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'sb-xurpenqrhqwtdkmmkkyp-auth-token',
    detectSessionInUrl: true,
  },
});

// Prevent multiple client instances
export function getSupabaseClient() {
  return supabase;
}
