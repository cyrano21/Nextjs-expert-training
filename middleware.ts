import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  // Ignorer les routes de callback d'authentification pour éviter les problèmes OAuth
  if (req.nextUrl.pathname.includes('/auth/callback') || 
      req.nextUrl.pathname.startsWith('/api/auth/callback')) {
    return NextResponse.next();
  }

  // Initialiser la réponse
  const res = NextResponse.next();
  
  // Définir les chemins à protéger et les pages publiques
  const protectedPaths = ['/student/', '/instructor/', '/admin/'];
  const publicPaths = ['/auth/', '/', '/courses', '/pricing', '/blog', '/api/'];
  const staticPaths = ['/_next/', '/static/', '/images/', '/favicon.ico'];
  
  // Vérifier si le chemin actuel est protégé
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  );
  
  // Ignorer les ressources statiques
  const isStaticPath = staticPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  );
  
  if (isStaticPath) {
    return res;
  }
  
  // Créer le client Supabase avec les cookies de la requête
  const supabase = createMiddlewareClient({ req, res });
  
  try {
    // Vérifier si l'utilisateur est authentifié
    const { data: { session } } = await supabase.auth.getSession();

    // Si l'utilisateur tente d'accéder à une page protégée sans être connecté
    if (isProtectedPath && !session) {
      // Rediriger vers la page de connexion avec l'URL de retour
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Si l'utilisateur est connecté et tente d'accéder à des pages d'authentification
    if (session && req.nextUrl.pathname.startsWith('/auth/') && 
        !req.nextUrl.pathname.includes('/callback')) {
      // Rediriger vers le tableau de bord approprié en fonction du rôle
      const role = session.user?.user_metadata?.role || 'student';
      let redirectPath = '/student/dashboard';
      
      if (role === 'instructor') {
        redirectPath = '/instructor/dashboard';
      } else if (role === 'admin') {
        redirectPath = '/admin/dashboard';
      }
      
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }
    
    return res;
  } catch (error) {
    console.error("Middleware auth error:", error);
    return res;
  }
}

// Configurer les routes sur lesquelles le middleware s'applique
export const config = {
  matcher: [
    // Exclusion des chemins d'APIs critiques pour éviter les problèmes
    '/((?!_next/static|_next/image|favicon.ico|api/auth/callback|auth/callback).*)',
  ],
};
