import { createServerSupabaseClient } from '@/services/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const moduleId = searchParams.get('moduleId');
  const lessonId = searchParams.get('lessonId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Récupérer la progression globale de l'utilisateur
    const { data: userProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('item_type', 'course')
      .single();

    if (progressError && progressError.code !== 'PGRST116') {
      console.error('Error fetching user progress:', progressError);
      return NextResponse.json({ error: 'Failed to fetch user progress' }, { status: 500 });
    }

    // Si un moduleId est fourni, récupérer la progression pour ce module spécifique
    if (moduleId) {
      const { data: moduleProgress, error: moduleError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('item_slug', moduleId)
        .eq('item_type', 'module')
        .single();
      
      if (moduleError && moduleError.code !== 'PGRST116') { 
        console.error('Error fetching module progress:', moduleError);
        return NextResponse.json({ error: 'Failed to fetch module progress' }, { status: 500 });
      }

      // Si un lessonId est fourni, récupérer la progression pour cette leçon spécifique
      if (lessonId) {
        const { data: lessonProgress, error: lessonError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('item_slug', lessonId)
          .eq('item_type', 'lesson')
          .single();
        
        if (lessonError && lessonError.code !== 'PGRST116') {
          console.error('Error fetching lesson progress:', lessonError);
          return NextResponse.json({ error: 'Failed to fetch lesson progress' }, { status: 500 });
        }

        return NextResponse.json({
          userProgress,
          moduleProgress,
          lessonProgress
        });
      }

      return NextResponse.json({
        userProgress,
        moduleProgress
      });
    }

    return NextResponse.json({ userProgress });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
