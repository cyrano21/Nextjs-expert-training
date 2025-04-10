import { Database } from '@/types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export type DashboardData = {
  user: { 
    name: string;
    verified: boolean;
  };
  progress: { 
    overallCompletion: number; 
    currentStreak: number; 
    points: number; 
  };
  nextLesson: { 
    title: string; 
    moduleId: string; 
    course: string;
    description: string;
  };
  currentProject: { 
    title: string; 
    moduleId: string; 
    progress: number; 
  };
  recentBadge: { 
    name: string; 
    id: string; 
  };
  communityActivity: Array<{ 
    type: string; 
    text: string; 
    moduleId: string; 
  }>;
};

export async function fetchDashboardData(
  userId: string, 
  client: SupabaseClient<Database> = supabase
): Promise<DashboardData> {
  console.log(`Fetching dashboard data for ${userId}`);
  
  try {
    // Verify user existence with more robust error handling
    const { data: userExists, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle to handle cases with 0 or 1 rows

    if (error) {
      console.warn('User verification failed:', error);
      throw error;
    }

    // Simulated data fetch with a delay
    await new Promise(r => setTimeout(r, 600));

    return {
      user: { 
        name: userExists?.full_name || userExists?.username || 'Cyrano Student',
        verified: !!userExists 
      },
      progress: { 
        overallCompletion: userExists?.current_streak || 42, 
        currentStreak: userExists?.current_streak || 3, 
        points: userExists?.points || 850 
      },
      nextLesson: { 
        title: 'Understanding Server Components', 
        moduleId: 'nextjs-advanced/01-server-components', 
        course: 'Next.js Advanced',
        description: 'Dive deep into React Server Components and their role in Next.js architectural patterns and performance optimization.'
      },
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
