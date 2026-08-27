import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, waitFor, within } from 'storybook/test';

import { Alert } from '../components/feedback/alert';
import { Spinner } from '../components/feedback/spinner';
import { Pagination } from '../components/navigation/pagination';
import { UIProvider } from '../components/providers';
import { en } from './en';

const noop = () => undefined;

const Sample: FC<{ closeLabel?: string; prevLabel?: string }> = ({
  closeLabel,
  prevLabel,
}) => (
  <div className="flex flex-col items-start gap-4">
    <Spinner />
    <Alert
      closeLabel={closeLabel}
      message="設定を保存しました"
      onClose={noop}
      tone="success"
    />
    <Pagination
      currentPage={2}
      onChange={noop}
      prevLabel={prevLabel}
      totalPages={3}
    />
  </div>
);

// グローバルデコレーターが全ストーリーを UIProvider で包むため、
// 同じ木の中では context を外せない。Provider 未設置の状態は別ルートで作る
const DetachedRoot: FC = () => {
  const [host, setHost] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (host === null) {
      return undefined;
    }
    const root = createRoot(host);
    root.render(<Sample />);
    return () => {
      // 同期 unmount は親のレンダー中になりうるので次のタスクへ逃がす
      queueMicrotask(() => {
        root.unmount();
      });
    };
  }, [host]);

  return <div ref={setHost} />;
};

const meta: Meta<typeof Sample> = {
  title: 'i18n',
  component: Sample,
};

export default meta;
type Story = StoryObj<typeof Sample>;

export const Japanese: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('status', { name: '読み込み中' }),
    ).toBeVisible();
    await expect(canvas.getByRole('button', { name: '閉じる' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: '前へ' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: '次へ' })).toBeVisible();
    await expect(
      canvas.getByRole('navigation', { name: 'ページネーション' }),
    ).toBeVisible();
  },
};

export const English: Story = {
  decorators: [
    (Story) => (
      <UIProvider messages={en}>
        <Story />
      </UIProvider>
    ),
  ],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status', { name: 'Loading' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Close' })).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Previous' }),
    ).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Next' })).toBeVisible();
    await expect(
      canvas.getByRole('navigation', { name: 'Pagination' }),
    ).toBeVisible();
  },
};

// 全キーの翻訳を強制せず、渡されたキーだけ差し替わる
export const PartialOverride: Story = {
  decorators: [
    (Story) => (
      <UIProvider messages={{ close: 'Dismiss' }}>
        <Story />
      </UIProvider>
    ),
  ],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Dismiss' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: '前へ' })).toBeVisible();
  },
};

// 優先順位は prop > 辞書 > 既定値
export const PropWinsOverMessages: Story = {
  args: {
    closeLabel: 'とじる',
    prevLabel: 'もどる',
  },
  decorators: [
    (Story) => (
      <UIProvider messages={en}>
        <Story />
      </UIProvider>
    ),
  ],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'とじる' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'もどる' })).toBeVisible();
    // prop を渡していないものは辞書のまま
    await expect(canvas.getByRole('button', { name: 'Next' })).toBeVisible();
  },
};

export const WithoutProvider: Story = {
  render: () => <DetachedRoot />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => {
      await expect(
        canvas.getByRole('button', { name: '閉じる' }),
      ).toBeVisible();
    });
    await expect(
      canvas.getByRole('status', { name: '読み込み中' }),
    ).toBeVisible();
    await expect(canvas.getByRole('button', { name: '前へ' })).toBeVisible();
  },
};
