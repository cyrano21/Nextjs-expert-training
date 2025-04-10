export interface Course {
  id: string;
  title: string;
  moduleId: string;
  description: string;
  tags?: string[];
  level: string;
  estimatedTimeMinutes: number;
  objectives: string[];
  icon?: string;
  content?: string;
  learningPath?: {
    id: string;
    title: string;
    moduleId: string;
    level: string;
    description: string;
    estimatedDuration?: {
      min: number;
      max: number;
    };
    generalObjective?: string;
    learningStructure?: string;
    modules?: Array<{
      id: string;
      title: string;
      moduleId: string;
      duration: string;
      objective: string;
      lessons: Array<{
        id: string;
        moduleId: string;
        title: string;
        description: string;
      }>;
    }>;
    crossCuttingElements?: {
      gamification: boolean;
      aiMentor: boolean;
      communitySupport: boolean;
      spacedRepetition: boolean;
    };
  };
}
