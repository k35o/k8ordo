import type { Meta, StoryObj } from '@storybook/react-vite';
import type { FC } from 'react';
import { expect } from 'storybook/test';

import { ChromeIcon, EdgeIcon, FirefoxIcon, SafariIcon } from './browsers';

const meta: Meta<FC> = {
  title: 'components/icons/browsers',
};

export default meta;
type Story = StoryObj<FC>;

export const Primary: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <div className="flex flex-col items-center gap-2">
        <ChromeIcon />
        <p className="text-fg-mute text-sm">Chrome</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EdgeIcon />
        <p className="text-fg-mute text-sm">Edge</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <FirefoxIcon />
        <p className="text-fg-mute text-sm">Firefox</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SafariIcon />
        <p className="text-fg-mute text-sm">Safari</p>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svgs = [...canvasElement.querySelectorAll('svg')];
    await expect(svgs).toHaveLength(4);
    await Promise.all(
      svgs.flatMap((svg) => [
        expect(svg).toHaveAttribute('aria-hidden', 'true'),
        expect(svg).toHaveAttribute('focusable', 'false'),
      ]),
    );
  },
};

// 対応表のように同じアイコンを 1 ページで何度も描画するケース。useId により
// グラデーションの DOM id がインスタンスごとに一意になり、重複しないことを検証する。
export const UniqueIds: Story = {
  render: () => (
    <div className="flex gap-6">
      <ChromeIcon />
      <ChromeIcon />
      <EdgeIcon />
      <EdgeIcon />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const ids = [...canvasElement.querySelectorAll('[id]')].map((el) => el.id);
    await expect(ids.length).toBeGreaterThan(0);
    await expect(new Set(ids).size).toBe(ids.length);
  },
};
