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

// 変数の文字列は light-dark() のまま継がれて配色によらず同じなので、輪を
// 描いた box-shadow を読む。スナップショットに残らないよう、読んだらすぐ外す
const focusRingOf = (element: Element): string => {
  const probe = document.createElement('span');
  probe.style.boxShadow = 'var(--shadow-ring-info)';
  element.append(probe);
  const { boxShadow } = getComputedStyle(probe);
  probe.remove();
  return boxShadow;
};

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
