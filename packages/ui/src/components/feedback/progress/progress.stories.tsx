import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Progress } from '.';

const meta: Meta<typeof Progress> = {
  title: 'components/feedback/progress',
  component: Progress,
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Primary: Story = {
  args: {
    value: 50,
    max: 100,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar')).toHaveAccessibleName('50%');
  },
};

export const WithMinProgress: Story = {
  args: {
    value: 150,
    min: 100,
    max: 200,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar')).toHaveAccessibleName('50%');
  },
};
