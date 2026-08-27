import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { en } from '../../../i18n/en';
import { UIProvider } from '../../providers';
import { Response } from './response';

const meta: Meta<typeof Response> = {
  title: 'components/ai/response',
  component: Response,
  parameters: { vrt: { skip: true } },
};

export default meta;
type Story = StoryObj<typeof Response>;

const markdown = [
  '# 見出し',
  '',
  '**太字** と *斜体* のテキスト。',
  '',
  '- 項目1',
  '- 項目2',
].join('\n');

const linkMarkdown = '詳細は [ドキュメント](https://example.com/docs) を参照。';

const codeMarkdown = ['```ts', "const a = 'hello';", '```'].join('\n');

export const Default: Story = {
  args: { children: markdown },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('見出し')).toBeVisible();
  },
};

export const IncompleteWhileStreaming: Story = {
  args: {
    children: '生成中のテキスト。**強調はまだ閉じて',
    isStreaming: true,
  },
};

// 既定では linkSafety を切っており、リンクは <button> ではなく本物の <a href> になる
export const Link: Story = {
  args: { children: linkMarkdown },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'ドキュメント' });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'https://example.com/docs');
    await expect(link).toHaveAttribute('target', '_blank');
    expect(link.getAttribute('rel')).toContain('noreferrer');
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

// rehype-harden がスキームを潰すので、linkSafety を切っても javascript: は踏めない
export const UnsafeLinkScheme: Story = {
  args: { children: '[危険](javascript:alert(1))' },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
    await expect(canvas.getByText(/危険/u)).not.toHaveAttribute('href');
  },
};

export const CodeBlock: Story = {
  args: { children: codeMarkdown },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'コードをコピー' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'ファイルをダウンロード' }),
    ).toBeVisible();
  },
};

export const Table: Story = {
  args: {
    children: ['| 名前 | 値 |', '| --- | --- |', '| a | 1 |'].join('\n'),
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: '表をコピー' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: '表をダウンロード' }),
    ).toBeVisible();
  },
};

export const EnglishMessages: Story = {
  args: { children: codeMarkdown },
  decorators: [
    (Story) => (
      <UIProvider messages={en}>
        <Story />
      </UIProvider>
    ),
  ],
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Copy code' }),
    ).toBeVisible();
  },
};

// 優先順位は prop > 辞書
export const TranslationsPropWinsOverMessages: Story = {
  args: {
    children: codeMarkdown,
    translations: { copyCode: 'まるごと写す' },
  },
  decorators: [
    (Story) => (
      <UIProvider messages={en}>
        <Story />
      </UIProvider>
    ),
  ],
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'まるごと写す' }),
    ).toBeVisible();
    // 渡していないキーは辞書のまま
    await expect(
      canvas.getByRole('button', { name: 'Download file' }),
    ).toBeVisible();
  },
};

export const LinkSafetyEnabled: Story = {
  args: { children: linkMarkdown, linkSafety: { enabled: true } },
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByRole('link', { name: 'ドキュメント' }),
    ).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'ドキュメント' }));

    await expect(canvas.getByText('外部リンクを開きますか？')).toBeVisible();
    await expect(
      canvas.getByText('外部サイトに移動しようとしています。'),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'リンクを開く' }),
    ).toBeVisible();

    // モーダルは body の overflow を握るので閉じてから終わる
    await userEvent.click(canvas.getByRole('button', { name: '閉じる' }));
    await expect(
      canvas.queryByText('外部リンクを開きますか？'),
    ).not.toBeInTheDocument();
  },
};
