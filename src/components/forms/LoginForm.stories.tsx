import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './LoginForm';

const meta: Meta<typeof LoginForm> = {
  title: 'Forms/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSuccess: { action: 'onSuccess' },
  },
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {
  args: {},
};

export const WithError: Story = {
  args: {
    initialError: "L'adresse e-mail ou le mot de passe est incorrect.",
  },
};

export const Loading: Story = {
  args: {
    initialLoading: true,
  },
};
