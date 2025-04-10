import path from 'path';
import fs from 'fs/promises';
import matter from 'gray-matter';

/**
 * Récupère le contenu d'une leçon spécifique
 */
export async function getLessonContent(moduleId: string, lessonId: string) {
  try {
    // Chemin vers le fichier MDX de la leçon
    const lessonPath = path.join(process.cwd(), 'content', 'courses', moduleId, `${lessonId}.mdx`);
    
    // Vérifier que le fichier existe
    try {
      await fs.access(lessonPath);
    } catch (error) {
      console.error(`Fichier de leçon non trouvé: ${lessonPath}`, error);
      return null;
    }

    // Lire le contenu du fichier
    const fileContent = await fs.readFile(lessonPath, 'utf8');
    
    // Parser le frontmatter et le contenu
    const { data, content } = matter(fileContent);
    
    // Consigner des informations pour le débogage
    console.log(`Leçon chargée: ${lessonId} du module ${moduleId}`);
    console.log(`Métadonnées: ${JSON.stringify(data)}`);
    console.log(`Longueur du contenu: ${content.length} caractères`);

    // Retourner les données structurées
    return {
      id: lessonId,
      title: data.title || 'Sans titre',
      description: data.description || '',
      objectives: data.objectives || [],
      estimatedTimeMinutes: data.estimatedTimeMinutes || 0,
      tags: data.tags || [],
      content: content
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération de la leçon ${lessonId}:`, error);
    return null;
  }
}
