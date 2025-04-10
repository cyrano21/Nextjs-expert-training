// 📄 src/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Vérifier si on accède à une page protégée
  const isProtectedRoute = 
    pathname.startsWith('/student/') || 
    pathname.startsWith('/instructor/') || 
    pathname.startsWith('/admin/');
  
  // Ajouter une vérification pour les routes de contenu éducatif MDX
  const isEducationalContentRoute = 
    pathname.includes('/learn/modules/') || 
    pathname.includes('/courses/content/');

  // Si c'est une route protégée, vérifier l'authentification
  if (isProtectedRoute || isEducationalContentRoute) {
    // Obtenir la session depuis les cookies
    const session = request.cookies.get('session')?.value;
    
    if (!session) {
      // Rediriger vers la page de connexion avec l'URL de redirection
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Pour les routes éducatives, on pourrait ajouter une vérification
    // supplémentaire pour s'assurer que l'étudiant est inscrit au cours
    if (isEducationalContentRoute) {
      // Logique de vérification d'inscription au module/cours spécifique
      // À implémenter selon votre système d'inscription
    }
  }
  
  return NextResponse.next();
}

// Configurer les routes où le middleware doit être exécuté
export const config = {
  matcher: [
    '/student/:path*',
    '/instructor/:path*',
    '/admin/:path*',
    '/learn/modules/:path*',
    '/courses/content/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
