import { Database } from '@/types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

export async function fetchDashboardData(
  userId: string, 
  supabase: SupabaseClient<Database>
) {
  console.log(`Fetching dashboard data for ${userId}`);
  
  try {
    // Verify user existence (even if not fetching full data)
    const { data: userExists, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('User verification failed:', error);
    }

    // Simulated data fetch with a delay
    await new Promise(r => setTimeout(r, 600));

    return {
      user: { 
        name: userExists?.id ? 'Cyrano Student' : 'Unknown Student',
        verified: !!userExists 
      },
      progress: { overallCompletion: 42, currentStreak: 3, points: 850 },
      nextLesson: { title: 'Understanding Server Components', moduleId: 'nextjs-advanced/01-server-components', course: 'Next.js Advanced' },
      currentProject: { title: 'Portfolio Site Enhancement', moduleId: 'portfolio-v2', progress: 65 },
      recentBadge: { name: 'CSS Wizard', id: 'css-mastery' },
      communityActivity: [
        { type: 'forum', text: 'Debating RSC vs Client Components...', moduleId: 'forum/789' },
        { type: 'showcase', text: 'JaneDoe shared an animation project!', moduleId: 'showcase/anim-proj-1' }
      ]
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}
