// src/types/course.types.ts

// --- Type/Interface pour une Leçon ---
export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description?: string;
  estimatedTimeMinutes?: number;
  objectives?: string[];
  moduleId: string; // Essentiel
  moduleTitle?: string;
  tags?: string[];
  isCompleted?: boolean; // Depuis DB/Service
}

// --- Type/Interface pour un Module ---
export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration?: string;
  level?: 'Débutant' | 'Intermédiaire' | 'Avancé';
  lessons: Array<Pick<Lesson, 'id' | 'slug' | 'title' | 'isCompleted'>>;
  status?: 'completed' | 'in_progress' | 'locked' | 'available';
}

// --- Type pour la Navigation ---
export interface LessonNavigationInfo {
    slug: string;
    title: string;
    moduleId: string; // Requis pour construire l'URL
}

// Type retourné par getLessonWithNavigation
export interface LessonWithNavigationData {
  lesson: Lesson | null;
  prevLesson: LessonNavigationInfo | null;
  nextLesson: LessonNavigationInfo | null;
}

// --- Type pour un Parcours d'Apprentissage Complet ---
// ... (inchangé)

// --- Type pour le contenu MDX Compilé ---
export interface CompiledMdxResult {
  // 'source' contient maintenant la chaîne compilée par @mdx-js/mdx
  source: string;
  // Nouveau champ pour stocker le contenu MDX brut
  rawSource?: string;
  // Métadonnées du frontmatter
  frontmatter: Record<string, unknown>;
  // Variables de portée pour le rendu
  scope?: Record<string, unknown>;
  // Message d'erreur éventuel lors de la compilation
  error?: string;
}