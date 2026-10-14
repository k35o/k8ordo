import type { Meta, StoryObj } from '@storybook/react-vite';
import { clsx } from 'clsx';
import { expect } from 'storybook/test';

import styles from './color-scheme.stories.module.css';

const meta: Meta = {
  title: 'styles/color-scheme',
  render: () => (
    <div className={styles.column}>
      <p className="light:underline">ページの配色に従う</p>
      <div className={clsx('dark', styles.island)}>
        <p className="light:underline">.dark を付けた領域</p>
      </div>
    </div>
  ),
};

export default meta;
type Story = StoryObj;

const colorSchemeOf = (element: Element): string =>
  getComputedStyle(element).colorScheme;

const isUnderlined = (element: Element): boolean =>
  getComputedStyle(element).textDecorationLine === 'underline';

export const LightPage: Story = {
  parameters: { theme: 'light' },
  play: async ({ canvas }) => {
    await expect(colorSchemeOf(document.documentElement)).toBe('light');
    await expect(isUnderlined(canvas.getByText('ページの配色に従う'))).toBe(
      true,
    );

    const island = canvas.getByText('.dark を付けた領域');
    await expect(colorSchemeOf(island)).toBe('dark');
    await expect(isUnderlined(island)).toBe(false);
  },
};

export const DarkPage: Story = {
  parameters: { theme: 'dark' },
  play: async ({ canvas }) => {
    await expect(colorSchemeOf(document.documentElement)).toBe('dark');
    await expect(isUnderlined(canvas.getByText('ページの配色に従う'))).toBe(
      false,
    );
  },
};
