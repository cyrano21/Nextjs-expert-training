// src/app/page.tsx
import { redirect } from "next/navigation";
// Utilisez un chemin absolu ou relatif au lieu de l'alias @/sx"; // Ajout de l'extension .tsx
import PublicLandingPage from "../components/landing/PublicLandingPage";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";

// --- Main Page Logic (Server Component) ---
export default async function Home() {
  // Création d'un client Supabase côté serveur
  const supabase = createServerComponentClient<Database>({ cookies });

  // Vérification de la session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Si l'utilisateur est connecté, rediriger vers le tableau de bord approprié
  if (session?.user) {
    const userRole = session.user.user_metadata?.role || "student";

    // Redirection basée sur le rôle
    const dashboardPaths = {
      student: "/student/dashboard",
      instructor: "/instructor/dashboard",
      admin: "/admin/dashboard",
    };

    const redirectPath =
      dashboardPaths[userRole as keyof typeof dashboardPaths] ||
      "/student/dashboard";
    redirect(redirectPath);
  }

  // Pour les utilisateurs non connectés, montrer la landing page publique
  // avec isLoggedIn=false et userRole=null
  return (
    <div>
      <PublicLandingPage isLoggedIn={false} userRole={null} />
    </div>
  );
}
