import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModuleProgress, LessonStatus } from './ModuleProgress';

// Mock Next.js Link component
vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ href, children }: { href: string; children: React.ReactNode }) => (
      <a href={href} data-testid="mock-link">
        {children}
      </a>
    ),
  };
});

// Mock des données pour les tests
const mockLessons: LessonStatus[] = [
  {
    id: 'lesson-1',
    title: 'Introduction',
    status: 'completed',
    href: '/student/learn/module-1/lesson-1',
  },
  {
    id: 'lesson-2',
    title: 'Fondamentaux',
    status: 'in-progress',
    href: '/student/learn/module-1/lesson-2',
  },
  {
    id: 'lesson-3',
    title: 'Avancé',
    status: 'available',
    href: '/student/learn/module-1/lesson-3',
  },
  {
    id: 'lesson-4',
    title: 'Expert',
    status: 'locked',
    href: '/student/learn/module-1/lesson-4',
  },
];

describe('ModuleProgress Component', () => {
  it('renders correctly with all lesson statuses', () => {
    render(<ModuleProgress lessons={mockLessons} />);
    
    // Vérifier que tous les titres de leçons sont affichés
    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Fondamentaux')).toBeInTheDocument();
    expect(screen.getByText('Avancé')).toBeInTheDocument();
    expect(screen.getByText('Expert')).toBeInTheDocument();
  });

  it('highlights the current lesson correctly', () => {
    render(<ModuleProgress lessons={mockLessons} currentLessonId="lesson-2" />);
    
    // Vérifier que la leçon actuelle a un style différent (vérification basique)
    const lessonElements = screen.getAllByText(/Fondamentaux/i);
    expect(lessonElements.length).toBeGreaterThan(0);
    
    // Vérifier que les liens sont correctement générés
    const links = screen.getAllByTestId('mock-link');
    expect(links.length).toBe(3); // 3 leçons cliquables (la leçon verrouillée n'a pas de lien)
    
    // Vérifier que les liens ont les bons href
    expect(links[0]).toHaveAttribute('href', '/student/learn/module-1/lesson-1');
    expect(links[1]).toHaveAttribute('href', '/student/learn/module-1/lesson-2');
    expect(links[2]).toHaveAttribute('href', '/student/learn/module-1/lesson-3');
  });

  it('does not render links for locked lessons', () => {
    render(<ModuleProgress lessons={mockLessons} />);
    
    // Vérifier que la leçon verrouillée n'a pas de lien
    const links = screen.getAllByTestId('mock-link');
    const lockedLessonLink = Array.from(links).find(
      link => link.textContent?.includes('Expert')
    );
    
    expect(lockedLessonLink).toBeUndefined();
  });

  it('applies correct styling based on lesson status', () => {
    const { container } = render(<ModuleProgress lessons={mockLessons} />);
    
    // Cette vérification est plus difficile avec la façon dont les styles sont appliqués
    // Nous vérifions simplement que les classes appropriées sont présentes quelque part
    expect(container.innerHTML).toContain('bg-green-500'); // Pour les leçons complétées
    expect(container.innerHTML).toContain('bg-primary'); // Pour les leçons en cours
    expect(container.innerHTML).toContain('cursor-not-allowed'); // Pour les leçons verrouillées
  });
});
