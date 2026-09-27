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

// value を渡さないと、進み具合の分からない表示になる。読み上げでは値を持たず、
// 名前は既定で「読み込み中」になる
export const Indeterminate: Story = {
  args: {},
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar');

    await expect(bar).toHaveAccessibleName('読み込み中');
    await expect(bar).not.toHaveAttribute('aria-valuenow');
    await expect(bar).not.toHaveAttribute('aria-valuemax');
  },
};

export const IndeterminateWithLabel: Story = {
  args: {
    label: 'アップロード中',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar')).toHaveAccessibleName(
      'アップロード中',
    );
  },
};

// max を省くと 0〜100 として扱う
export const DefaultMax: Story = {
  args: {
    value: 30,
  },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar');

    await expect(bar).toHaveAttribute('aria-valuemax', '100');
    await expect(bar).toHaveAccessibleName('30%');
  },
};
