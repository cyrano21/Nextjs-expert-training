import { z } from 'zod';
import { getAuthSession } from '@/lib/auth/authUtils';

// Schéma de validation pour les données de progression
const progressSchema = z.object({
  userId: z.string(),
  moduleId: z.string(),
  lessonId: z.string(),
  completed: z.boolean(),
});

// Type for lesson progress data
export type LessonProgressData = z.infer<typeof progressSchema>;

// Type for user progress
export interface UserProgressData {
  userId: string;
  completedLessons: string[];
  currentLesson: string;
  totalPoints: number;
  level: number;
  progress?: {
    [moduleId: string]: {
      [lessonId: string]: boolean;
    }
  };
  achievements?: string[];
  lastUpdated?: Date;
}

// Authentication schema
const authSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(['student', 'admin', 'instructor']).optional(),
});

// Utility function for authentication
async function authenticateUser(userId: string) {
  try {
    // Use getAuthSession to validate user
    const session = await getAuthSession();
    
    // Check if the authenticated user matches the provided userId
    if (!session?.user || session.user.id !== userId) {
      throw new Error('Unauthorized');
    }

    return session.user;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw new Error('Authentication failed');
  }
}

/**
 * Action serveur pour mettre à jour la progression d'une leçon
 */
export async function updateLessonProgress(formData: FormData | Record<string, unknown>) {
  try {
    // Extract userId from formData
    const userId = formData instanceof FormData 
      ? formData.get('userId')?.toString() 
      : formData['userId'] as string;

    if (!userId) {
      return { 
        success: false, 
        error: 'User ID is required' 
      };
    }

    // Authenticate user
    const user = await authenticateUser(userId);
    if (!user) {
      return { 
        success: false, 
        error: 'Authentication failed' 
      };
    }

    // Extraire et valider les données
    const rawData = formData instanceof FormData 
      ? Object.fromEntries(formData.entries())
      : formData;
    
    const validatedData = progressSchema.parse(rawData);
    
    // Simuler un délai pour l'exemple
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Ici, nous simulons la mise à jour de la progression dans une base de données
    // Dans une implémentation réelle, vous utiliseriez votre client de base de données
    console.log('Mise à jour de la progression:', validatedData);
    
    return { success: true, data: validatedData };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la progression:', error);
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Une erreur est survenue' 
    };
  }
}

/**
 * Action serveur pour récupérer la progression d'un utilisateur
 */
export async function getUserProgress(userId: string) {
  // Authenticate user
  const user = await authenticateUser(userId);
  if (!user) {
    return { 
      success: false, 
      error: 'Authentication failed' 
    };
  }

  try {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock progress data - replace with actual database retrieval
    const mockProgress: UserProgressData = {
      userId,
      completedLessons: ['module-1/lesson-1', 'module-1/lesson-2'],
      currentLesson: 'module-1/lesson-3',
      totalPoints: 120,
      level: 2,
      progress: {
        'module-1': {
          'lesson-1': true,
          'lesson-2': true,
        },
      },
      achievements: ['achievement-1', 'achievement-2'],
      lastUpdated: new Date(),
    };
    
    return { 
      success: true, 
      data: mockProgress 
    };
  } catch (error) {
    console.error('Error retrieving user progress:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      switch (true) {
        case error.message.includes('401') || error.message.includes('Unauthorized'):
          return { 
            success: false, 
            error: 'Authentication required. Please log in.',
            data: null,
            redirectToLogin: true
          };
        
        case error.message.includes('Network') || error.message.includes('fetch'):
          return { 
            success: false, 
            error: 'Network error. Please check your connection.',
            data: null 
          };
        
        default:
          return { 
            success: false, 
            error: error.message || 'An unexpected error occurred',
            data: null 
          };
      }
    }
    
    // Fallback for non-Error objects
    return { 
      success: false, 
      error: 'An unknown error occurred',
      data: null 
    };
  }
}

// Server action to mark lesson as completed
export async function markLessonCompleteAction(data: LessonProgressData) {
  // Validate input data
  const validationResult = progressSchema.safeParse(data);
  if (!validationResult.success) {
    throw new Error('Invalid input data');
  }

  // Authenticate user
  const session = await getAuthSession();
  
  // Verify user matches
  if (session.user.id !== data.userId) {
    throw new Error('Unauthorized');
  }

  // TODO: Implement actual lesson completion logic
  // This might involve updating a database record
  console.log(`Lesson ${data.lessonId} marked as completed for user ${session.user.id}`);

  return {
    success: true,
    message: 'Lesson marked as completed',
  };
}
