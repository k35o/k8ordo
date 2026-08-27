import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { Drawer } from './drawer';

const meta: Meta<typeof Drawer> = {
  title: 'components/overlays/drawer',
  component: Drawer,
};

export default meta;
type Story = StoryObj<typeof Drawer>;

// title が <dialog> のアクセシブル名になり、modal dialog の中に
// region ランドマークを生やさない。
export const Default: Story = {
  play: async ({ canvas }) => {
    const dialog = await waitFor(() => {
      const el = canvas.getByRole('dialog', { name: 'メニュー' });
      if (getComputedStyle(el).opacity !== '1') {
        throw new Error('waiting for animation');
      }
      return el;
    });
    await expect(dialog).toBeInstanceOf(HTMLDialogElement);
    await expect(canvas.queryAllByRole('region')).toHaveLength(0);
    await expect(canvas.getAllByRole('dialog')).toHaveLength(1);
  },
  args: {
    isOpen: true,
    onClose: fn(),
    title: 'メニュー',
    children: (
      <nav className="flex flex-col gap-2">
        <a className="hover:bg-bg-mute rounded-md px-3 py-2" href="/">
          ホーム
        </a>
        <a className="hover:bg-bg-mute rounded-md px-3 py-2" href="/about">
          このサイトについて
        </a>
        <a className="hover:bg-bg-mute rounded-md px-3 py-2" href="/blog">
          ブログ
        </a>
        <a className="hover:bg-bg-mute rounded-md px-3 py-2" href="/contact">
          お問い合わせ
        </a>
      </nav>
    ),
  },
};

export const Left: Story = {
  play: async ({ canvas }) => {
    const dialog = await waitFor(() => {
      const el = canvas.getByRole('dialog', { name: 'メニュー' });
      if (getComputedStyle(el).opacity !== '1') {
        throw new Error('waiting for animation');
      }
      return el;
    });
    await expect(dialog).toHaveClass('ao-modal-left');
  },
  args: {
    isOpen: true,
    onClose: fn(),
    side: 'left',
    title: 'メニュー',
    children: (
      <nav className="flex flex-col gap-2">
        <a className="hover:bg-bg-mute rounded-md px-3 py-2" href="/">
          ホーム
        </a>
      </nav>
    ),
  },
};

export const Uncontrolled: Story = {
  play: async ({ canvas }) => {
    await waitFor(() => {
      const dialog = canvas.getByRole('dialog');
      if (getComputedStyle(dialog).opacity !== '1') {
        throw new Error('waiting for animation');
      }
    });
  },
  args: {
    defaultOpen: true,
    title: 'メニュー',
    children: (
      <nav className="flex flex-col gap-2">
        <a className="hover:bg-bg-mute rounded-md px-3 py-2" href="/">
          ホーム
        </a>
        <a className="hover:bg-bg-mute rounded-md px-3 py-2" href="/about">
          このサイトについて
        </a>
      </nav>
    ),
  },
};
