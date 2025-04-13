import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { handleOAuthCallback } from '@/lib/auth/oauth-handler';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const redirectTo = url.searchParams.get('callbackUrl') || '/student/dashboard';

  if (!code) {
    return NextResponse.redirect(
      new URL(`/auth/login?message=${encodeURIComponent("Code d'autorisation manquant")}`, request.url)
    );
  }

  const cookieStore = await cookies(); // ✅ await ici
  const codeVerifier = cookieStore.get("sb-code-verifier")?.value;

  if (!codeVerifier) {
    return NextResponse.redirect(
      new URL(`/auth/login?message=${encodeURIComponent("Code verifier manquant")}`, request.url)
    );
  }

  const result = await handleOAuthCallback(code); // ✅ on passe seulement le code

  if (!result.success) {
    return NextResponse.redirect(
      new URL(`/auth/login?message=${encodeURIComponent(result.error || 'Erreur OAuth')}`, request.url)
    );
  }

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
