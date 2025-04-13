// src/lib/modules/lesson-service.ts
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createServerSupabaseClient } from '@/services/supabase/server';
import { getUserData } from '@/lib/auth/helpers';

// --- Types ---
export interface LessonFrontmatter {
  title?: string;
  description?: string;
  tags?: string[];
  estimatedTimeMinutes?: number;
  objectives?: string[];
  prev?: string; // Slug de la leçon précédente
  next?: string; // Slug de la leçon suivante
  [key: string]: unknown; // Remplacé 'any' par 'unknown' pour plus de type-safety
}

export interface LessonContent {
  frontmatter: LessonFrontmatter; // Objet imbriqué
  content: string; // Contenu MDX après le frontmatter
  rawSource: string; // Source brute complète
  moduleId: string;
  lessonId: string;
}

export interface LessonCompletionStatus {
    isCompleted: boolean;
    completedAt?: Date | null;
}

export interface LessonWithNavigation extends LessonContent {
    moduleTitle?: string; // Optionnel: titre du module parent
    prevLesson?: { slug: string; title?: string } | null;
    nextLesson?: { slug: string; title?: string } | null;
    completionStatus: LessonCompletionStatus;
}

// --- Fonctions Service ---

export async function getLessonContent(moduleId: string, lessonId: string): Promise<LessonContent | null> {
    const modulePath = moduleId;
    const lessonPath = `${lessonId}.mdx`;
    const fullPath = path.join(process.cwd(), 'content', 'courses', modulePath, lessonPath);
    console.log(`Server: Reading lesson file: ${fullPath}`);
    try {
        const rawSource = await fs.readFile(fullPath, 'utf-8');
        const { data, content } = matter(rawSource);
        return {
            frontmatter: data as LessonFrontmatter,
            content: content, // Contenu sans frontmatter
            rawSource: rawSource, // Source originale complète
            moduleId: moduleId,
            lessonId: lessonId,
         };
    } catch (error: unknown) { // Remplacé 'any' par 'unknown'
        // Vérification de type plus stricte
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            console.warn(`Lesson file not found: ${fullPath}`); return null;
        }
        console.error(`Error reading or parsing MDX file ${fullPath}:`, error);
        throw new Error(`Could not load lesson content for ${moduleId}/${lessonId}.`);
    }
}

async function checkLessonCompletion(userId: string | null, lessonUniqueId: string): Promise<LessonCompletionStatus> {
    if (!userId) return { isCompleted: false };
    try {
        // CORRECTION: Appelez la fonction SYNCHRONE sans await
        const supabase = createServerSupabaseClient();
        // Les appels DB SONT async et nécessitent await
        const { data, error } = await supabase
          .from('user_progress')
          .select('completed_at')
          .eq('user_id', userId)
          .eq('item_type', 'lesson')
          .eq('item_slug', lessonUniqueId)
          .maybeSingle();

        if (error) {
            console.error(`Supabase error checking completion for ${lessonUniqueId}:`, error);
            return { isCompleted: false };
        }
        if (data?.completed_at) {
            return { isCompleted: true, completedAt: new Date(data.completed_at) };
        }
        return { isCompleted: false };
    } catch (error) {
        console.error(`Error checking lesson completion for ${lessonUniqueId}:`, error);
        return { isCompleted: false };
    }
}

// --- Fonction Principale getLessonWithNavigation (Type de retour explicite) ---
export async function getLessonWithNavigation(
    moduleId: string,
    lessonId: string
): Promise<LessonWithNavigation | null> { // <--- Type de retour explicite

    const userData = await getUserData(); // Récupère l'ID utilisateur côté serveur
    const userId = userData?.id ?? null;

    console.log(`Server: Fetching lesson: Module=${moduleId}, Lesson=${lessonId}, User=${userId ?? 'N/A'}`);
    const lessonContent = await getLessonContent(moduleId, lessonId);

    if (!lessonContent) return null; // Retourne null si le contenu de base n'est pas trouvé

    const lessonUniqueId = `${moduleId}/${lessonId}`;

    const [completionStatus, prevLessonContent, nextLessonContent] = await Promise.all([
        checkLessonCompletion(userId, lessonUniqueId),
        lessonContent.frontmatter.prev ? getLessonContent(moduleId, lessonContent.frontmatter.prev) : Promise.resolve(null),
        lessonContent.frontmatter.next ? getLessonContent(moduleId, lessonContent.frontmatter.next) : Promise.resolve(null)
    ]);

    const prevLesson = prevLessonContent ? { slug: lessonContent.frontmatter.prev!, title: prevLessonContent.frontmatter.title } : null;
    const nextLesson = nextLessonContent ? { slug: lessonContent.frontmatter.next!, title: nextLessonContent.frontmatter.title } : null;
    const moduleTitle = moduleId.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // Construction explicite de l'objet retourné pour correspondre à LessonWithNavigation
    const result: LessonWithNavigation = {
        // Propriétés de LessonContent
        frontmatter: lessonContent.frontmatter,
        content: lessonContent.content,
        rawSource: lessonContent.rawSource,
        moduleId: lessonContent.moduleId,
        lessonId: lessonContent.lessonId,
        // Propriétés ajoutées
        moduleTitle: moduleTitle,
        prevLesson: prevLesson,
        nextLesson: nextLesson,
        completionStatus: completionStatus,
    };
    return result;
}