import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/services/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification et les droits d'administration
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    // Vérifier si l'utilisateur est un administrateur
    const userRole = session.user.user_metadata?.role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }
    
    // Récupérer les données de la requête
    const { userId, role } = await request.json();
    
    if (!userId || !role) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }
    
    // Mettre à jour le rôle de l'utilisateur dans la table auth.users via l'API admin
    const { error } = await supabase.functions.invoke('update-user-role', {
      body: { userId, role }
    });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour du rôle' },
      { status: 500 }
    );
  }
}
