// src/lib/data/modules.ts

// 1. Définir et exporter le type pour une leçon individuelle
export interface LessonMetadata {
  id: number | string; // L'ID numérique de la leçon
  moduleId: string;    // ID du module auquel la leçon appartient
  slug: string;        // Slug unique de la leçon pour l'URL (ex: '01-introduction-to-nextjs')
  title: string;
  completed: boolean;
  description?: string; // Optionnel
  estimatedTime?: number; // Optionnel (en minutes)
  // Ajouter d'autres champs si nécessaire (objectifs, contenu MDX brut si chargé ici, etc.)
}

// 2. Définir et exporter le type pour un module
export interface ModuleMetadata {
  id: number | string; // L'ID numérique du module
  moduleId: string;    // Identifiant unique du module
  slug: string;        // Slug unique du module pour l'URL (ex: 'nextjs-fundamentals')
  title: string;
  description: string;
  duration: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  completed: boolean; // Statut de complétion du module entier
  status: 'completed' | 'in_progress' | 'locked' | 'available'; // Statut d'accès/progression
  lessons: LessonMetadata[]; // Utiliser le type LessonMetadata exporté
}

// 3. Vos données, en utilisant les nouveaux noms de champs 'slug' pour la clarté des URLs
//    (J'ai renommé 'moduleId' en 'slug' pour les modules et les leçons pour correspondre aux URLs)
//    Si vous préférez garder 'moduleId', assurez-vous d'utiliser `module.moduleId` et `lesson.moduleId`
//    dans la construction des URLs dans la page Roadmap.
export const modulesData: ModuleMetadata[] = [
  {
    id: 1,
    moduleId: 'nextjs-fundamentals', // Identifiant unique du module
    slug: 'nextjs-fundamentals', // Slug du module pour l'URL
    title: "Next.js Fundamentals",
    description: "Maîtrisez les bases de Next.js et de son écosystème",
    duration: "2 semaines",
    level: "Débutant",
    completed: true, // Basé sur la complétion de TOUTES les leçons
    status: 'completed',
    lessons: [
      { id: 1, moduleId: 'nextjs-fundamentals', slug: '01-introduction-to-nextjs', title: "Introduction à Next.js", completed: true, description: "...", estimatedTime: 45 },
      { id: 2, moduleId: 'nextjs-fundamentals', slug: '02-setting-up-nextjs', title: "Configuration et Structure", completed: true, description: "...", estimatedTime: 60 },
      { id: 3, moduleId: 'nextjs-fundamentals', slug: '03-routing-with-app-router', title: "Routing avec App Router", completed: true, description: "...", estimatedTime: 60 },
      { id: 4, moduleId: 'nextjs-fundamentals', slug: '04-rendering', title: "SSR vs CSR vs SSG", completed: true, description: "...", estimatedTime: 90 },
      { id: 5, moduleId: 'nextjs-fundamentals', slug: '05-data-fetching-and-caching', title: "Data Fetching et Caching", completed: true, description: "...", estimatedTime: 75 },
    ],
  },
  {
    id: 2,
    moduleId: 'styling-and-ui', // Identifiant unique du module
    slug: 'styling-and-ui', // Slug du module
    title: "Styling et UI",
    description: "Créez des interfaces modernes et réactives",
    duration: "2 semaines",
    level: "Débutant", // Ajusté car vos données indiquaient Débutant
    completed: false, // Non complété car toutes les leçons ne le sont pas
    status: 'in_progress',
    lessons: [
      { id: 1, moduleId: 'styling-and-ui', slug: '01-tailwind-css-basics', title: "Tailwind CSS Fondamentaux", completed: true, description: "...", estimatedTime: 60 },
      { id: 2, moduleId: 'styling-and-ui', slug: '02-reusable-ui-components', title: "Composants UI Réutilisables", completed: false, description: "...", estimatedTime: 90 },
      { id: 3, moduleId: 'styling-and-ui', slug: '03-animations-and-transitions', title: "Animations et Transitions", completed: false, description: "...", estimatedTime: 75 },
      { id: 4, moduleId: 'styling-and-ui', slug: '04-responsive-design', title: "Responsive Design", completed: false, description: "...", estimatedTime: 90 },
      { id: 5, moduleId: 'styling-and-ui', slug: '05-theming-and-dark-mode', title: "Thèmes et Mode Sombre", completed: false, description: "...", estimatedTime: 75 },
    ],
  },
  {
    id: 3,
    moduleId: 'authentication-and-authorization', // Identifiant unique du module
    slug: 'authentication-and-authorization', // Slug du module
    title: "Authentification et Autorisation",
    description: "Implémentez des systèmes d'authentification sécurisés",
    duration: "2 semaines",
    level: "Intermédiaire",
    completed: false,
    status: 'available', // Ce module est maintenant accessible
    lessons: [
      { id: 1, moduleId: 'authentication-and-authorization', slug: '01-introduction-to-supabase', title: "Introduction à Supabase", completed: false, description: "...", estimatedTime: 60 },
      { id: 2, moduleId: 'authentication-and-authorization', slug: '02-authentication-with-supabase', title: "Authentification avec Supabase", completed: false, description: "...", estimatedTime: 90 },
      { id: 3, moduleId: 'authentication-and-authorization', slug: '03-session-management', title: "Gestion des Sessions", completed: false, description: "...", estimatedTime: 75 },
      { id: 4, moduleId: 'authentication-and-authorization', slug: '04-access-control', title: "Contrôle d'Accès", completed: false, description: "...", estimatedTime: 90 },
      { id: 5, moduleId: 'authentication-and-authorization', slug: '05-web-security', title: "Sécurité des Applications Web", completed: false, description: "...", estimatedTime: 75 },
    ],
  },
  {
    id: 4,
    moduleId: 'backend-development', // Identifiant unique du module
    slug: 'backend-development', // Slug du module
    title: "API Routes et Backend",
    description: "Développez des API robustes et performantes",
    duration: "2 semaines",
    level: "Intermédiaire",
    completed: false,
    status: 'locked',
    lessons: [
      { id: 1, moduleId: 'backend-development', slug: '01-api-routes-with-nextjs', title: "API Routes avec Next.js", completed: false, description: "...", estimatedTime: 60 },
      { id: 2, moduleId: 'backend-development', slug: '02-database-integration', title: "Intégration de Bases de Données", completed: false, description: "...", estimatedTime: 90 },
      { id: 3, moduleId: 'backend-development', slug: '03-data-validation', title: "Validation de Données", completed: false, description: "...", estimatedTime: 75 },
      { id: 4, moduleId: 'backend-development', slug: '04-error-handling', title: "Gestion des Erreurs", completed: false, description: "...", estimatedTime: 90 },
      { id: 5, moduleId: 'backend-development', slug: '05-api-testing', title: "Tests d'API", completed: false, description: "...", estimatedTime: 75 },
    ],
  },
  {
    id: 5,
    moduleId: 'deployment-and-performance', // Identifiant unique du module
    slug: 'deployment-and-performance', // Slug du module
    title: "Déploiement et Performance",
    description: "Optimisez et déployez vos applications Next.js",
    duration: "2 semaines",
    level: "Avancé",
    completed: false,
    status: 'locked',
    lessons: [
      { id: 1, moduleId: 'deployment-and-performance', slug: '01-deploying-to-vercel', title: "Déploiement sur Vercel", completed: false, description: "...", estimatedTime: 60 },
      { id: 2, moduleId: 'deployment-and-performance', slug: '02-image-optimization', title: "Optimisation des Images", completed: false, description: "...", estimatedTime: 75 },
      { id: 3, moduleId: 'deployment-and-performance', slug: '03-caching-strategies', title: "Stratégies de Caching", completed: false, description: "...", estimatedTime: 90 },
      { id: 4, moduleId: 'deployment-and-performance', slug: '04-performance-analysis', title: "Analyse de Performance", completed: false, description: "...", estimatedTime: 90 },
      { id: 5, moduleId: 'deployment-and-performance', slug: '05-seo-metadata', title: "SEO et Métadonnées", completed: false, description: "...", estimatedTime: 75 },
    ],
  },
  {
    id: 6,
    moduleId: 'final-project', // Identifiant unique du module
    slug: 'final-project', // Slug du module
    title: "Projet Final",
    description: "Appliquez toutes vos connaissances",
    duration: "4 semaines",
    level: "Avancé",
    completed: false,
    status: 'locked',
    lessons: [
      { id: 1, moduleId: 'final-project', slug: '01-planning-and-architecture', title: "Planification et Architecture", completed: false, description: "...", estimatedTime: 90 },
      { id: 2, moduleId: 'final-project', slug: '02-frontend-development', title: "Développement Frontend", completed: false, description: "...", estimatedTime: 120 },
      { id: 3, moduleId: 'final-project', slug: '03-backend-development', title: "Développement Backend", completed: false, description: "...", estimatedTime: 120 },
      { id: 4, moduleId: 'final-project', slug: '04-testing-and-debugging', title: "Tests et Débogage", completed: false, description: "...", estimatedTime: 90 },
      { id: 5, moduleId: 'final-project', slug: '05-deployment-and-presentation', title: "Déploiement et Présentation", completed: false, description: "...", estimatedTime: 90 },
    ],
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
  return modulesData.find(m => m.slug === slug);
}

export function getLessonBySlugs(moduleSlug: string, lessonSlug: string): LessonMetadata | undefined {
   // TODO: Ajouter la logique de progression utilisateur
  const module = getModuleBySlug(moduleSlug);
  return module?.lessons.find(l => l.slug === lessonSlug);
}