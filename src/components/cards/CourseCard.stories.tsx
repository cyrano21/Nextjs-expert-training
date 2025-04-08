import type { Meta, StoryObj } from '@storybook/react';
import { CourseCard } from './CourseCard';

const meta: Meta<typeof CourseCard> = {
  title: 'Cards/CourseCard',
  component: CourseCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Le titre du cours',
    },
    description: {
      control: 'text',
      description: 'La description du cours',
    },
    imageUrl: {
      control: 'text',
      description: 'L\'URL de l\'image du cours',
    },
    level: {
      control: 'select',
      options: ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'],
      description: 'Le niveau de difficulté du cours',
    },
    duration: {
      control: 'text',
      description: 'La durée du cours',
    },
    studentsCount: {
      control: 'number',
      description: 'Le nombre d\'étudiants inscrits',
    },
    lessonsCount: {
      control: 'number',
      description: 'Le nombre de leçons dans le cours',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CourseCard>;

export const Default: Story = {
  args: {
    id: '1',
    title: 'Introduction à Next.js',
    description: 'Apprenez les bases de Next.js, de la configuration initiale aux déploiements avancés.',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000',
    level: 'Débutant',
    duration: '4 heures',
    studentsCount: 1250,
    lessonsCount: 12,
    href: '/courses/introduction-nextjs',
  },
};

export const Intermediate: Story = {
  args: {
    id: '2',
    title: 'Routing avancé avec Next.js',
    description: 'Maîtrisez le système de routing de Next.js et créez des applications web complexes.',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000',
    level: 'Intermédiaire',
    duration: '6 heures',
    studentsCount: 850,
    lessonsCount: 15,
    href: '/courses/advanced-routing',
  },
};

export const Expert: Story = {
  args: {
    id: '3',
    title: 'Performance et optimisation Next.js',
    description: 'Techniques avancées pour optimiser les performances de vos applications Next.js.',
    imageUrl: 'https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=1000',
    level: 'Expert',
    duration: '8 heures',
    studentsCount: 420,
    lessonsCount: 20,
    href: '/courses/performance-optimization',
  },
};
