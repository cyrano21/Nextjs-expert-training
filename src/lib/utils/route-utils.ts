/**
 * Résout les paramètres de route avec gestion cohérente des noms de paramètres
 * Cette fonction aide à gérer la transition entre les différentes conventions de nommage
 * @param params Les paramètres de route à résoudre
 * @returns Les paramètres résolus avec mappages entre moduleId et moduleId
 */
export async function resolveParams<T extends Record<string, any>>(params: T): Promise<T> {
  // Si les paramètres sont déjà résolus, les retourner
  if (params && typeof params === 'object' && !Array.isArray(params)) {
    // Créer une copie pour ne pas modifier l'original
    const resolvedParams = { ...params };
    
    // Si moduleId existe mais pas moduleId, utiliser la valeur de moduleId pour moduleId
    if ('moduleId' in resolvedParams && !('moduleId' in resolvedParams)) {
      resolvedParams.moduleId = resolvedParams.moduleId;
    }
    
    // Si moduleId existe mais pas moduleId, utiliser la valeur de moduleId pour moduleId
    if ('moduleId' in resolvedParams && !('moduleId' in resolvedParams)) {
      resolvedParams.moduleId = resolvedParams.moduleId;
    }
    
    return resolvedParams;
  }
  
  // Retourner les paramètres tels quels s'ils ne peuvent pas être résolus
  return params;
}

/**
 * Génère un chemin cohérent pour les pages d'apprentissage
 * @param courseId Identifiant du cours (moduleId ou moduleId)
 * @param lessonId Identifiant de la leçon (facultatif)
 * @returns Chemin formaté pour la navigation
 */
export function getLearningPath(courseId: string, lessonId?: string): string {
  const basePath = `/student/learn/${courseId}`;
  return lessonId ? `${basePath}/${lessonId}` : basePath;
}

/**
 * Génère des liens cohérents pour la navigation dans l'application
 */
export function getCoursePath(courseId: string): string {
  return `/student/learn/${courseId}`;
}

export function getLessonPath(courseId: string, lessonId: string): string {
  return `/student/learn/${courseId}/${lessonId}`;
}
