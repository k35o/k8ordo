import type { Meta, StoryObj } from '@storybook/react-vite';
import type { FC } from 'react';
import { expect } from 'storybook/test';

import { inEnglish } from '../../.storybook/locales';
import { Alert } from '../components/feedback/alert';
import { Spinner } from '../components/feedback/spinner';
import { Pagination } from '../components/navigation/pagination';
import { registerMessages } from './current';
import { ja } from './ja';

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
  beforeEach: inEnglish,
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

// 登録した辞書は組み込みの辞書より優先される。一部だけ替えるなら広げて上書きする
export const RegisteredOverride: Story = {
  beforeEach: () => {
    registerMessages('ja', { ...ja, close: '閉じる（Esc）' });
    return () => {
      registerMessages('ja', ja);
    };
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: '閉じる（Esc）' }),
    ).toBeVisible();
    await expect(canvas.getByRole('button', { name: '前へ' })).toBeVisible();
  },
};

// 優先順位は prop > 辞書
export const PropWinsOverMessages: Story = {
  args: {
    closeLabel: 'とじる',
    prevLabel: 'もどる',
  },
  beforeEach: inEnglish,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'とじる' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'もどる' })).toBeVisible();
    // prop を渡していないものは辞書のまま
    await expect(canvas.getByRole('button', { name: 'Next' })).toBeVisible();
  },
};
