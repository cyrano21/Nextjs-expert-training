import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database.types';

export async function getServerSession() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ 
    cookies: () => cookieStore 
  });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.user_metadata?.name,
      role: session.user.user_metadata?.role || 'student'
    }
  };
}
