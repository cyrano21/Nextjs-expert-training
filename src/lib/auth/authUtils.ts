import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

export async function getAuthSession(requiredRole?: "student" | "admin" | "instructor") {
  const cookieStore = await cookies(); // ✅ Await cookies() pour éviter l'erreur
  
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore, // ✅ Passer le cookie store déjà résolu
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const userRole = user.user_metadata?.role;

  if (requiredRole && userRole !== requiredRole) {
    return null;
  }

  return { user };
}
