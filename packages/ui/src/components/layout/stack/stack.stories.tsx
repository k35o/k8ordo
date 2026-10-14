import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stack } from './stack';

import styles from './stack.stories.module.css';

const meta: Meta<typeof Stack> = {
  title: 'components/layout/stack',
  component: Stack,
};

export default meta;
type Story = StoryObj<typeof Stack>;

const items = Array.from({ length: 3 }, (_, i) => (
  <div className={styles.item} key={`item-${i}`}>
    {i + 1}
  </div>
));

export const Default: Story = {
  render: (args) => <Stack {...args}>{items}</Stack>,
};

export const Row: Story = {
  render: () => <Stack direction="row">{items}</Stack>,
};

export const GapSmall: Story = {
  render: () => (
    <Stack direction="row" gap="sm">
      {items}
    </Stack>
  ),
};

export const GapLarge: Story = {
  render: () => (
    <Stack direction="row" gap="xl">
      {items}
    </Stack>
  ),
};

export const AlignCenter: Story = {
  render: () => (
    <Stack align="center" direction="row">
      <div className={styles.small}>small</div>
      <div className={styles.large}>large</div>
      <div className={styles.small}>small</div>
    </Stack>
  ),
};

export const JustifyBetween: Story = {
  render: () => (
    <div className={styles.frame}>
      <Stack direction="row" justify="between">
        {items}
      </Stack>
    </div>
  ),
};
