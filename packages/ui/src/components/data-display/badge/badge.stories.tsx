import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'components/data-display/badge',
  component: Badge,
  args: {
    label: 'New',
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('New')).toBeInTheDocument();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge label="Small" size="sm" />
      <Badge label="Medium" size="md" />
      <Badge label="Large" size="lg" />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge label="Neutral" />
      <Badge label="Info" tone="info" />
      <Badge label="Success" tone="success" />
      <Badge label="Warning" tone="warning" />
      <Badge label="Error" tone="error" />
    </div>
  ),
};

export const Outline: Story = {
  args: {
    label: 'Preview',
    tone: 'info',
    variant: 'outline',
  },
};

// interactive のときは button になり、label がアクセシブル名になる。
export const Interactive: Story = {
  args: {
    label: 'フィルター',
    interactive: true,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'フィルター' }),
    ).toBeInTheDocument();
  },
};
