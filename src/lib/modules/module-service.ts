import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { Module as CurriculumModule, Lesson } from '@/types/curriculum';
import { ModuleMetadata } from '@/lib/data/modules';

export type Module = CurriculumModule & ModuleMetadata & {
  courseId?: string;
  order?: number;
  content?: string;
  completed?: boolean;
  status?: string;
  duration?: string;
  level?: string;
  lessons?: Lesson[];
  prerequisites?: string[];
  outcomes?: string[];
};

export async function getModuleBySlug(
  moduleId: string, 
  client: SupabaseClient = supabase
): Promise<Module | null> {
  try {
    const { data, error } = await client
      .from('modules')
      .select('*')
      .eq('moduleId', moduleId)
      .single();

    if (error) {
      console.error('Error fetching module:', error);
      return null;
    }

    if (!data) {
      console.warn(`No module found with moduleId: ${moduleId}`);
      return null;
    }

    return data as Module;
  } catch (error) {
    console.error('Unexpected error in getModuleBySlug:', error);
    return null;
  }
}

export async function getPaginatedLessons(
  moduleSlug: string, 
  page: number = 1, 
  limit: number = 10,
  client: SupabaseClient = supabase
) {
  try {
    const offset = (page - 1) * limit;

    const { data, error, count } = await client
      .from('lessons')
      .select('*', { count: 'exact' })
      .eq('module_slug', moduleSlug)
      .range(offset, offset + limit - 1)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching paginated lessons:', error);
      return {
        lessons: [],
        totalLessons: 0,
        currentPage: page,
        totalPages: 0
      };
    }

    return {
      lessons: data || [],
      totalLessons: count || 0,
      currentPage: page,
      totalPages: count ? Math.ceil(count / limit) : 0
    };
  } catch (err) {
    console.error('Unexpected error in getPaginatedLessons:', err);
    return {
      lessons: [],
      totalLessons: 0,
      currentPage: page,
      totalPages: 0
    };
  }
}
