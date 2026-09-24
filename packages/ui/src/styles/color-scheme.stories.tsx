import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

const meta: Meta = {
  title: 'styles/color-scheme',
  render: () => (
    <div className="flex flex-col gap-4">
      <p>ページの配色に従う</p>
      <div className="dark bg-bg-base text-fg-base rounded-xl p-4">
        <p>.dark を付けた領域</p>
      </div>
    </div>
  ),
};

export default meta;
type Story = StoryObj;

const colorSchemeOf = (element: Element): string =>
  getComputedStyle(element).colorScheme;

export const LightPage: Story = {
  parameters: { theme: 'light' },
  play: async ({ canvas }) => {
    await expect(colorSchemeOf(document.documentElement)).toBe('light');
    await expect(colorSchemeOf(canvas.getByText('.dark を付けた領域'))).toBe(
      'dark',
    );
  },
};

export const DarkPage: Story = {
  parameters: { theme: 'dark' },
  play: async () => {
    await expect(colorSchemeOf(document.documentElement)).toBe('dark');
  },
};
