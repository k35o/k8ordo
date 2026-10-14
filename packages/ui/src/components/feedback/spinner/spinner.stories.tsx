import type { Meta, StoryObj } from '@storybook/react-vite';

import { Spinner } from './spinner';

import styles from './spinner.stories.module.css';

const meta: Meta<typeof Spinner> = {
  title: 'components/feedback/spinner',
  component: Spinner,
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className={styles.sizes}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};
