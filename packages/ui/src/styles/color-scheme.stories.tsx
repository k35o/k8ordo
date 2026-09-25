import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

const meta: Meta = {
  title: 'styles/color-scheme',
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="light:underline">ページの配色に従う</p>
      <div className="dark bg-bg-base text-fg-base rounded-xl p-4">
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
