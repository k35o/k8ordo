import type { Meta, StoryObj } from '@storybook/react-vite';
import { clsx } from 'clsx';
import { expect } from 'storybook/test';

import styles from './color-scheme.stories.module.css';

const meta: Meta = {
  title: 'styles/color-scheme',
  render: () => (
    <div className={styles.column}>
      <p className={styles.text}>ページの配色に従う</p>
      <div className={clsx('dark', styles.island)}>
        <p className={styles.text}>.dark を付けた領域</p>
      </div>
    </div>
  ),
};

export default meta;
type Story = StoryObj;

const colorSchemeOf = (element: Element): string =>
  getComputedStyle(element).colorScheme;

const colorOf = (element: Element): string => getComputedStyle(element).color;

// 別のトークンを読むトークンは、宣言した要素で値が決まる。.dark の中で
// 宣言し直していなければ、html の値（ライト）のまま継がれてくる
const focusRingOf = (element: Element): string =>
  getComputedStyle(element).getPropertyValue('--shadow-ring-info');

export const LightPage: Story = {
  parameters: { theme: 'light' },
  play: async ({ canvas }) => {
    const page = canvas.getByText('ページの配色に従う');
    const island = canvas.getByText('.dark を付けた領域');

    await expect(colorSchemeOf(document.documentElement)).toBe('light');
    await expect(colorSchemeOf(island)).toBe('dark');
    await expect(colorOf(island)).not.toBe(colorOf(page));
    await expect(focusRingOf(island)).not.toBe(focusRingOf(page));
  },
};

export const DarkPage: Story = {
  parameters: { theme: 'dark' },
  play: async ({ canvas }) => {
    const page = canvas.getByText('ページの配色に従う');
    const island = canvas.getByText('.dark を付けた領域');

    await expect(colorSchemeOf(document.documentElement)).toBe('dark');
    await expect(colorOf(island)).toBe(colorOf(page));
    await expect(focusRingOf(island)).toBe(focusRingOf(page));
  },
};
