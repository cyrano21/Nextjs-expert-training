// src/lib/data/modules.ts

export interface LessonMetadata {
  id: number;
  moduleId: string; // ID du module parent
  slug: string; // Slug pour l'URL
  title: string;
  description: string;
  completed: boolean;
  estimatedTime?: number; // Temps estimé en minutes
  // ...autres propriétés nécessaires
}

export interface ModuleMetadata {
  id: number;
  moduleId: string; // ID unique du module utilisé comme slug pour les URLs
  title: string;
  description: string;
  lessons: LessonMetadata[];
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  completed: boolean;
  level: string; // Débutant, Intermédiaire, Avancé
  duration: string; // Format: "X heures"
  // ...autres propriétés nécessaires
}

// Données statiques pour démonstration
export const modulesData: ModuleMetadata[] = [
  {
    id: 1,
    moduleId: "fundamentals",
    title: "Fondamentaux de Next.js",
    description: "Découvrez les concepts de base de Next.js et configurez votre premier projet.",
    status: "completed",
    completed: true,
    level: "Débutant",
    duration: "2 heures",
    lessons: [
      {
        id: 1,
        moduleId: "fundamentals",
        slug: "intro-to-nextjs",
        title: "Introduction à Next.js",
        description: "Comprendre ce qu'est Next.js et pourquoi l'utiliser",
        completed: true,
        estimatedTime: 20
      },
      {
        id: 2,
        moduleId: "fundamentals",
        slug: "setup-environment",
        title: "Configuration de l'environnement",
        description: "Installer les outils nécessaires pour développer avec Next.js",
        completed: true,
        estimatedTime: 30
      },
      // ...autres leçons
    ]
  },
  {
    id: 2,
    moduleId: "routing",
    title: "Système de Routing",
    description: "Maîtrisez le système de routing basé sur les fichiers de Next.js.",
    status: "in_progress",
    completed: false,
    level: "Débutant",
    duration: "3 heures",
    lessons: [
      {
        id: 1,
        moduleId: "routing",
        slug: "file-based-routing",
        title: "Routing basé sur les fichiers",
        description: "Comprendre comment Next.js utilise la structure de fichiers pour le routing",
        completed: true,
        estimatedTime: 25
      },
      {
        id: 2,
        moduleId: "routing",
        slug: "dynamic-routes",
        title: "Routes dynamiques",
        description: "Créer des routes avec des paramètres dynamiques",
        completed: false,
        estimatedTime: 35
      },
      // ...autres leçons
    ]
  },
  {
    id: 3,
    moduleId: "data-fetching",
    title: "Récupération de Données",
    description: "Apprenez à récupérer des données efficacement avec Next.js.",
    status: "available",
    completed: false,
    level: "Intermédiaire", 
    duration: "4 heures",
    lessons: [
      {
        id: 1,
        moduleId: "data-fetching",
        slug: "server-components",
        title: "Composants Serveur",
        description: "Utiliser les composants serveur pour récupérer des données",
        completed: false,
        estimatedTime: 40
      },
      // ...autres leçons
    ]
  },
  {
    id: 4,
    moduleId: "advanced",
    title: "Fonctionnalités Avancées",
    description: "Explorez les fonctionnalités avancées de Next.js pour des applications performantes.",
    status: "locked",
    completed: false,
    level: "Avancé",
    duration: "5 heures",
    lessons: [
      {
        id: 1,
        moduleId: "advanced",
        slug: "middleware",
        title: "Middleware",
        description: "Implémenter des middlewares personnalisés",
        completed: false,
        estimatedTime: 45
      },
      // ...autres leçons
    ]
  }
];

// Optionnel: Fonctions pour récupérer les données
// (Ces fonctions devraient interagir avec une base de données ou une API dans une vraie app)
export function getAllModules(): ModuleMetadata[] {
  // TODO: Ajouter la logique pour fusionner avec la progression de l'utilisateur
  return modulesData;
}

export function getModuleBySlug(slug: string): ModuleMetadata | undefined {
  // TODO: Ajouter la logique de progression utilisateur
  return modulesData.find(m => m.moduleId === slug);
}

export function getLessonBySlugs(moduleSlug: string, lessonSlug: string): LessonMetadata | undefined {
   // TODO: Ajouter la logique de progression utilisateur
  const module = getModuleBySlug(moduleSlug);
  return module?.lessons.find(l => l.slug === lessonSlug);
}