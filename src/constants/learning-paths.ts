export const DIFFICULTY_LEVELS = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
  EXPERT: "Expert",
};

export const SKILL_LEVELS = {
  NOVICE: "Novice",
  APPRENTICE: "Apprenti",
  PRACTITIONER: "Praticien",
  EXPERT: "Expert",
  MASTER: "Maître",
};

export const MODULE_STATUS = {
  LOCKED: "locked",
  AVAILABLE: "available",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
};

export const LESSON_STATUS = {
  LOCKED: "locked",
  AVAILABLE: "available",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
};

export const LEARNING_PATHS = [
  {
    id: "nextjs-fundamentals",
    title: "Fondamentaux de Next.js",
    description: "Maîtrisez les bases de Next.js et du développement d'applications web modernes",
    modules: [
      "introduction-to-nextjs",
      "routing-and-navigation",
      "data-fetching",
      "styling-and-ui",
    ],
    level: DIFFICULTY_LEVELS.BEGINNER,
    duration: "4 semaines",
    prerequisites: [],
  },
  {
    id: "nextjs-advanced",
    title: "Next.js Avancé",
    description: "Techniques avancées pour créer des applications Next.js performantes et évolutives",
    modules: [
      "advanced-routing",
      "server-components",
      "authentication-and-authorization",
      "api-routes-and-middlewares",
      "performance-optimization",
    ],
    level: DIFFICULTY_LEVELS.INTERMEDIATE,
    duration: "6 semaines",
    prerequisites: ["nextjs-fundamentals"],
  },
  {
    id: "nextjs-expert",
    title: "Next.js Expert",
    description: "Devenez un expert certifié Next.js avec des connaissances approfondies et des techniques de pointe",
    modules: [
      "advanced-state-management",
      "testing-and-quality-assurance",
      "deployment-and-devops",
      "internationalization",
      "accessibility",
      "advanced-patterns",
    ],
    level: DIFFICULTY_LEVELS.ADVANCED,
    duration: "8 semaines",
    prerequisites: ["nextjs-advanced"],
  },
];
