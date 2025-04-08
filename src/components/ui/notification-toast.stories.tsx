import type { Meta, StoryObj } from '@storybook/react';
import { Notification } from './notification-toast';

const meta: Meta<typeof Notification> = {
  title: 'UI/Notification',
  component: Notification,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Le type de notification',
    },
    title: {
      control: 'text',
      description: 'Le titre de la notification',
    },
    message: {
      control: 'text',
      description: 'Le message de la notification',
    },
    duration: {
      control: 'number',
      description: 'La durée d\'affichage en millisecondes (Infinity pour ne jamais disparaître)',
    },
    open: {
      control: 'boolean',
      description: 'Si la notification est visible',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const Info: Story = {
  args: {
    title: 'Information',
    message: 'Voici une information importante pour vous.',
    type: 'info',
    duration: 5000,
  },
};

export const Success: Story = {
  args: {
    title: 'Succès !',
    message: 'L\'opération a été effectuée avec succès.',
    type: 'success',
    duration: 5000,
  },
};

export const Warning: Story = {
  args: {
    title: 'Attention',
    message: 'Cette action pourrait avoir des conséquences.',
    type: 'warning',
    duration: 5000,
  },
};

export const Error: Story = {
  args: {
    title: 'Erreur',
    message: 'Une erreur est survenue lors de l\'opération.',
    type: 'error',
    duration: 5000,
  },
};

export const WithAction: Story = {
  args: {
    title: 'Mise à jour disponible',
    message: 'Une nouvelle version de l\'application est disponible.',
    type: 'info',
    duration: Infinity,
    action: (
      <button 
        className="mt-2 inline-flex items-center rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground"
      >
        Mettre à jour
      </button>
    ),
  },
};
