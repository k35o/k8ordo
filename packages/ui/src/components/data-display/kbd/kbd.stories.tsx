import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Kbd } from './kbd';

import styles from './kbd.stories.module.css';

const meta: Meta<typeof Kbd> = {
  title: 'components/data-display/kbd',
  component: Kbd,
  args: {
    children: 'Esc',
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Esc').tagName).toBe('KBD');
  },
};

// 組み合わせは 1 キーずつ並べる
export const Combination: Story = {
  render: () => (
    <p className={styles.combination}>
      <Kbd label="Command">⌘</Kbd>
      <Kbd>K</Kbd>
      <span className={styles.caption}>でコマンドパレットを開く</span>
    </p>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('kbd')).toHaveLength(2);
  },
};

// label は読み上げだけに渡り、記号は読み上げから外れる
export const SymbolWithLabel: Story = {
  args: {
    children: '⇧',
    label: 'Shift',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('⇧')).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.getByText('Shift')).toHaveStyle({
      position: 'absolute',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
    });
  },
};

export const InSentence: Story = {
  render: () => (
    <p className={styles.sentence}>
      保存するには <Kbd>Ctrl</Kbd> と <Kbd>S</Kbd> を同時に押します。
    </p>
  ),
};
