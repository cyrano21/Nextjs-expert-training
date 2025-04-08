// 📄 src/services/supabase/server.ts

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

// ⛔️ PAS de async ici
export function createServerSupabaseClient() {
  const cookieStore = cookies(); // ✅ PAS de await ici
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
}

// ✅ Cette fonction peut être async car elle fait un appel Supabase
export async function getServerSession() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
