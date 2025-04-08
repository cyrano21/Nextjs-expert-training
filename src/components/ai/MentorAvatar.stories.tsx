import type { Meta, StoryObj } from '@storybook/react';
import { MentorAvatar } from './MentorAvatar';

const meta: Meta<typeof MentorAvatar> = {
  title: 'AI/MentorAvatar',
  component: MentorAvatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Le nom du mentor',
    },
    role: {
      control: 'text',
      description: 'Le rôle ou la spécialité du mentor',
    },
    avatarUrl: {
      control: 'text',
      description: 'L\'URL de l\'avatar du mentor',
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'busy'],
      description: 'Le statut de disponibilité du mentor',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MentorAvatar>;

export const Online: Story = {
  args: {
    name: 'Sophie Martin',
    role: 'Expert Next.js',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    status: 'online',
  },
};

export const Offline: Story = {
  args: {
    name: 'Thomas Dubois',
    role: 'Spécialiste React',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'offline',
  },
};

export const Busy: Story = {
  args: {
    name: 'Émilie Bernard',
    role: 'Coach Full-Stack',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    status: 'busy',
  },
};
