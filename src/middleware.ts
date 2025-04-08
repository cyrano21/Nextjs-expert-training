// 📄 src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware simplifié pour éviter les problèmes de compilation
export function middleware(request: NextRequest) {
  // Récupérer le chemin actuel
  const { pathname } = request.nextUrl;
  
  // Chemin protégé qui nécessite une authentification
  const isProtectedRoute = pathname.startsWith('/student/') || 
                           pathname.startsWith('/instructor/') || 
                           pathname.startsWith('/admin/');
                           
  // Vérifier la présence d'un cookie d'authentification (simplifié)
  const hasAuthCookie = request.cookies.has('sb-access-token');
  
  // Si c'est une route protégée et qu'il n'y a pas de cookie d'authentification
  if (isProtectedRoute && !hasAuthCookie) {
    // Créer l'URL de redirection avec le chemin actuel comme paramètre
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    
    return NextResponse.redirect(redirectUrl);
  }
  
  // Continuer la requête normalement
  return NextResponse.next();
}

// Limiter l'exécution du middleware à certains chemins
export const config = {
  matcher: [
    // Chemins pour lesquels le middleware s'exécutera
    '/student/:path*',
    '/instructor/:path*',
    '/admin/:path*',
    '/api/protected/:path*',
  ],
};
