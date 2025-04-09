import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { getRedirectPathByRole } from '@/utils/roles';

import { DashboardContent, DashboardSkeleton } from '.';

export default async function StudentDashboardPage() {
  const cookieStore = await cookies();

  const supabase = createServerComponentClient<Database>({
    cookies: () => ({
      get: (name: string) => {
        const cookie = cookieStore.get(name);
        return cookie ? { value: cookie.value } : null;
      },
      getAll: () => cookieStore.getAll().map(cookie => ({
        name: cookie.name,
        value: cookie.value
      }))
    })
  });

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login?message=Authentication required');
  }

  const userRole = user.user_metadata?.role ?? 'student';

  if (userRole !== 'student') {
    redirect(getRedirectPathByRole(userRole));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing');
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent 
        userId={user.id} 
        supabaseUrl={supabaseUrl} 
        supabaseKey={supabaseKey} 
      />
    </Suspense>
  );
}
