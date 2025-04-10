import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import type { Course } from '@/types/course.types';

// Utiliser le répertoire data/courses au lieu du content/courses
const COURSES_DIRECTORY = path.join(process.cwd(), 'src/data/courses');

/**
 * Récupère tous les cours disponibles
 */
export async function getAllCourses(): Promise<Course[]> {
  try {
    console.log(`📁 Courses Directory: ${COURSES_DIRECTORY}`);
    
    // Vérifier si le répertoire existe
    if (!fs.existsSync(COURSES_DIRECTORY)) {
      console.error(`Le répertoire des cours n'existe pas: ${COURSES_DIRECTORY}`);
      await fsPromises.mkdir(COURSES_DIRECTORY, { recursive: true });
      
      // Créer un cours exemple
      const exampleCourse: Course = {
        id: "01-introduction",
        title: "Introduction à Next.js",
        moduleId: "01-introduction",
        description: "Découvrez ce qu'est Next.js et pourquoi c'est un framework révolutionnaire pour le développement web",
        tags: ["next.js", "framework", "web development"],
        level: "Beginner",
        estimatedTimeMinutes: 30,
        objectives: [
          "Comprendre ce qu'est Next.js",
          "Connaître les avantages de Next.js",
          "Installer votre premier projet Next.js"
        ],
        content: "# Introduction à Next.js\n\nNext.js est un framework React qui permet de créer des applications web complètes, avec rendu côté serveur, génération de sites statiques, et plus encore.\n\n## Pourquoi utiliser Next.js?\n\n- Performance optimisée\n- SEO amélioré\n- Expérience développeur exceptionnelle"
      };
      
      // Sauvegarder le cours exemple
      await fsPromises.writeFile(
        path.join(COURSES_DIRECTORY, '01-introduction.json'),
        JSON.stringify(exampleCourse, null, 2)
      );
      
      return [exampleCourse];
    }
    
    // Lister tous les fichiers de cours
    const files = await fsPromises.readdir(COURSES_DIRECTORY);
    const courseFiles = files.filter(file => file.endsWith('.json'));
    
    // Charger tous les cours
    const coursesPromises = courseFiles.map(async (filename) => {
      const filePath = path.join(COURSES_DIRECTORY, filename);
      const fileContent = await fsPromises.readFile(filePath, 'utf8');
      return JSON.parse(fileContent) as Course;
    });
    
    const courses = await Promise.all(coursesPromises);
    console.log(`📚 Courses retrieved: ${courses.length}`);
    
    return courses;
  } catch (error) {
    console.error('Erreur lors du chargement des cours:', error);
    return [];
  }
}

/**
 * Récupère un cours par son moduleId
 */
export async function getCourseBySlug(moduleId: string): Promise<Course | null> {
  try {
    const courses = await getAllCourses();
    const course = courses.find(course => course.moduleId === moduleId);
    
    return course || null;
  } catch (error) {
    console.error(`Erreur lors de la récupération du cours ${moduleId}:`, error);
    return null;
  }
}
