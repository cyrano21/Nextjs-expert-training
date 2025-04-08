import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/services/supabase/server';
import { Database } from '@/types/database.types';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    
    // Vérifier que tous les champs requis sont présents
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }
    
    const supabase = await createServerSupabaseClient();
    
    // Créer un nouvel utilisateur
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          created_at: new Date().toISOString(),
        },
      },
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Créer un profil étudiant pour le nouvel utilisateur
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        email,
        role: 'student',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      
      // Initialiser les statistiques de progression
      await supabase.from('user_progress').upsert([{
        user_id: data.user.id,
        item_slug: 'initial_registration',
        item_type: 'registration' as Database['public']['Enums']['progress_item_type'],
        status: 'started' as Database['public']['Enums']['progress_status'],
        progress_data: JSON.stringify({
          lessons_completed: 0,
          total_points: 0,
          streak_days: 0
        }),
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
        id: undefined
      }], { onConflict: 'user_id,item_slug' });
    }
    
    return NextResponse.json({
      message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.',
      user: data.user,
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  }
}
