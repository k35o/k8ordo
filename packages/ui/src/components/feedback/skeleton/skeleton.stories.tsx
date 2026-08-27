import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from './skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'components/feedback/skeleton',
  component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {};

export const Circle: Story = {
  args: {
    shape: 'circle',
  },
};
