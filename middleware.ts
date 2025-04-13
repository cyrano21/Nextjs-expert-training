import { NextResponse, NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database.types'; // adapte selon ton projet

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si l'utilisateur n'est pas connecté → redirige vers /auth/login
  if (!user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// 🔒 Définir les routes protégées
export const config = {
  matcher: ['/student/:path*', '/instructor/:path*', '/admin/:path*'],
};
