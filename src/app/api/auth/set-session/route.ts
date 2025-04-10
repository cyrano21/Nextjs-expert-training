import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { session } = await request.json();
    const cookieStore = await cookies();
    
    // Définir le cookie d'authentification
    if (session) {
      cookieStore.set('sb-xurpenqrhqwtdkmmkkyp-auth-token', JSON.stringify(session), {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        sameSite: 'lax'
      });
    } else {
      // Si pas de session, supprimer le cookie
      cookieStore.delete('sb-xurpenqrhqwtdkmmkkyp-auth-token');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la définition de la session:', error);
    return NextResponse.json({ error: 'Échec de la définition de la session' }, { status: 500 });
  }
}
