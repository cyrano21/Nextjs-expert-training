import type { Meta, StoryObj } from '@storybook/react';
import { RegisterForm } from './RegisterForm';

const meta: Meta<typeof RegisterForm> = {
  title: 'Forms/RegisterForm',
  component: RegisterForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSuccess: { action: 'onSuccess' },
  },
};

export default meta;
type Story = StoryObj<typeof RegisterForm>;

export const Default: Story = {
  args: {},
};

export const WithError: Story = {
  args: {
    initialError: "Cette adresse e-mail est déjà utilisée.",
  },
};

export const Loading: Story = {
  args: {
    initialLoading: true,
  },
};
