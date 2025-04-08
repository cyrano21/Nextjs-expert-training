import type { Meta, StoryObj } from '@storybook/react';
import { AchievementCard } from './AchievementCard';

const meta: Meta<typeof AchievementCard> = {
  title: 'Cards/AchievementCard',
  component: AchievementCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Le titre de la réalisation',
    },
    description: {
      control: 'text',
      description: 'La description de la réalisation',
    },
    date: {
      control: 'text',
      description: 'La date d\'obtention',
    },
    type: {
      control: 'select',
      options: ['badge', 'certificate', 'trophy'],
      description: 'Le type de réalisation',
    },
    level: {
      control: 'select',
      options: ['bronze', 'silver', 'gold', 'platinum'],
      description: 'Le niveau de la réalisation',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AchievementCard>;

export const Badge: Story = {
  args: {
    title: 'Premier pas avec Next.js',
    description: 'Vous avez terminé votre premier module d\'introduction à Next.js',
    date: '12 avril 2025',
    type: 'badge',
    level: 'bronze',
  },
};

export const Certificate: Story = {
  args: {
    title: 'Certification Next.js Intermédiaire',
    description: 'Vous avez réussi l\'examen de certification de niveau intermédiaire',
    date: '15 avril 2025',
    type: 'certificate',
    level: 'silver',
  },
};

export const Trophy: Story = {
  args: {
    title: 'Expert Next.js',
    description: 'Vous avez complété tous les modules avancés et obtenu le statut d\'expert',
    date: '20 avril 2025',
    type: 'trophy',
    level: 'gold',
  },
};

export const Platinum: Story = {
  args: {
    title: 'Maître Next.js',
    description: 'Vous avez contribué à la communauté et partagé vos connaissances avec d\'autres étudiants',
    date: '25 avril 2025',
    type: 'trophy',
    level: 'platinum',
  },
};
