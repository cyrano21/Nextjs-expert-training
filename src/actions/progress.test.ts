import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateLessonProgress, getUserProgress, LessonProgressData } from './progress';

// Mock de next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock des délais pour accélérer les tests
vi.mock('node:timers/promises', () => ({
  setTimeout: vi.fn().mockResolvedValue(undefined),
}));

describe('Progress Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateLessonProgress', () => {
    it('successfully updates lesson progress with valid data', async () => {
      // Données de test valides
      const validData = {
        userId: 'user-123',
        moduleId: 'module-1',
        lessonId: 'lesson-2',
        completed: true,
      };

      // Appeler l'action serveur
      const result = await updateLessonProgress(validData);

      // Vérifier le résultat
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('handles FormData input correctly', async () => {
      // Créer un objet FormData pour le test
      const formData = new FormData();
      formData.append('userId', 'user-123');
      formData.append('moduleId', 'module-1');
      formData.append('lessonId', 'lesson-2');
      formData.append('completed', 'true');

      // Appeler l'action serveur
      const result = await updateLessonProgress(formData);

      // Vérifier le résultat
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        userId: 'user-123',
        moduleId: 'module-1',
        lessonId: 'lesson-2',
        completed: true,
      });
    });

    it('returns error for invalid data', async () => {
      // Données de test invalides (manque lessonId)
      const invalidData = {
        userId: 'user-123',
        moduleId: 'module-1',
        completed: true,
      };

      // Appeler l'action serveur
      const result = await updateLessonProgress(invalidData as Partial<LessonProgressData>);

      // Vérifier le résultat
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getUserProgress', () => {
    it('returns user progress data for valid user ID', async () => {
      // Appeler l'action serveur
      const result = await getUserProgress('user-123');

      // Vérifier le résultat
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        userId: 'user-123',
        completedLessons: ['module-1/lesson-1', 'module-1/lesson-2'],
        currentLesson: 'module-1/lesson-3',
        totalPoints: 120,
        level: 2,
      });
    });
  });
});
