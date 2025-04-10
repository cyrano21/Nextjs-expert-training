import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database.types";

export type Role = 'student' | 'instructor' | 'admin';

interface AuthResult {
  user: NonNullable<Awaited<ReturnType<typeof getUser>>['data']['user']>;
  supabase: ReturnType<typeof createServerComponentClient<Database>>;
}

// Helper pour obtenir l'utilisateur authentifié de manière sécurisée
async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient<Database>({ 
    cookies: () => cookieStore 
  });
  
  return await supabase.auth.getUser();
}

/**
 * Récupère l'utilisateur et redirige si nécessaire
 * @param requiredRole - Rôle requis pour accéder à la page
 * @returns Utilisateur authentifié et client Supabase
 */
export async function getAuthSession(requiredRole?: Role): Promise<AuthResult> {
  try {
    // Utiliser getUser au lieu de getSession pour une authentification plus sécurisée
    const { data, error } = await getUser();
    
    // Si pas d'utilisateur ou erreur, rediriger vers login
    if (error || !data.user) {
      redirect(`/auth/login?redirect=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/')}`);
    }
    
    // Si un rôle est requis, vérifier le rôle de l'utilisateur
    if (requiredRole) {
      const userRole = data.user.user_metadata?.role as Role | undefined || 'student';
      
      if (userRole !== requiredRole) {
        // Rediriger vers le dashboard approprié
        const dashboardPaths = {
          'student': '/student/dashboard',
          'instructor': '/instructor/dashboard',
          'admin': '/admin/dashboard'
        };
        
        redirect(dashboardPaths[userRole]);
      }
    }

    // Créer un nouveau client Supabase avec les cookies
    const cookieStore = await cookies();
    const supabase = createServerComponentClient<Database>({
      cookies: () => cookieStore
    });
    
    return { user: data.user, supabase };
  } catch (error) {
    console.error("Erreur lors de la vérification de l'authentification:", error);
    redirect("/auth/login?message=Une erreur est survenue");
  }
}
