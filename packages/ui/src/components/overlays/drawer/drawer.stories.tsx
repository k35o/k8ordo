import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { Drawer } from './drawer';

import styles from './drawer.stories.module.css';

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
      <nav className={styles.nav}>
        <a className={styles.link} href="/">
          ホーム
        </a>
        <a className={styles.link} href="/about">
          このサイトについて
        </a>
        <a className={styles.link} href="/blog">
          ブログ
        </a>
        <a className={styles.link} href="/contact">
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
    const rect = dialog.getBoundingClientRect();
    await expect(rect.left).toBe(0);
    await expect(rect.right).toBeLessThan(document.documentElement.clientWidth);
  },
  args: {
    isOpen: true,
    onClose: fn(),
    side: 'left',
    title: 'メニュー',
    children: (
      <nav className={styles.nav}>
        <a className={styles.link} href="/">
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
      <nav className={styles.nav}>
        <a className={styles.link} href="/">
          ホーム
        </a>
        <a className={styles.link} href="/about">
          このサイトについて
        </a>
      </nav>
    ),
  },
};

// 閉じるのは <dialog> 自身（枠外）を押したときだけ。中身のクリックでは閉じず、
// document まで届く
export const ClickInside: Story = {
  args: {
    defaultOpen: true,
    onClose: fn(),
    title: 'メニュー',
    children: <p>中身</p>,
  },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const dialog = canvas.getByRole('dialog', { name: 'メニュー' });
    const onDocumentClick = fn();
    canvasElement.ownerDocument.addEventListener('click', onDocumentClick);

    await userEvent.click(canvas.getByText('中身'));

    canvasElement.ownerDocument.removeEventListener('click', onDocumentClick);
    await expect(onDocumentClick).toHaveBeenCalledOnce();
    await expect(dialog).toHaveAttribute('open');

    await userEvent.click(canvas.getByRole('button', { name: '閉じる' }));

    await expect(dialog).not.toHaveAttribute('open');
    await waitFor(() => {
      expect(args.onClose).toHaveBeenCalledOnce();
    });
  },
};
