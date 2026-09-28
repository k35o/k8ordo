import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { expect, spyOn, waitFor } from 'storybook/test';

import { CodeBlock } from '.';
import { blurActiveElement } from '../../../../.storybook/focus';

// CodeBlock はサーバーでハイライトする async の Server Component で、
// ブラウザの React は async の部品を描かない。RSC の描画と同じく関数として
// 呼んで待ち、できた要素を描く
const meta: Meta<typeof CodeBlock> = {
  title: 'components/data-display/code-block',
  component: CodeBlock,
  parameters: {
    layout: 'padded',
  },
  loaders: [
    async ({ args }) => ({
      codeBlock: await CodeBlock(args),
    }),
  ],
  render: (_args, { loaded }) =>
    (loaded as { codeBlock: ReactElement }).codeBlock,
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

const SAMPLE = `import { Button } from '@k8ordo/ui';

export function Save({ onSave }: { onSave: () => Promise<void> }) {
  // 保存中は二重送信を防ぐ
  return <Button onAction={onSave}>保存</Button>;
}`;

export const Default: Story = {
  args: {
    code: SAMPLE,
    lang: 'tsx',
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('tsx')).toBeInTheDocument();
    await expect(
      canvasElement.querySelector('pre [style*="--shiki-token-keyword"]'),
    ).toHaveTextContent('import');
  },
};

export const WithTitle: Story = {
  args: {
    code: SAMPLE,
    lang: 'tsx',
    title: 'save.tsx',
  },
  play: async ({ canvas }) => {
    const caption = await canvas.findByText('save.tsx');

    // figure の名前になるのは、最初（か最後）の子の figcaption だけ
    await expect(caption.tagName).toBe('FIGCAPTION');
    await expect(canvas.getByRole('figure').firstElementChild).toBe(caption);
  },
};

export const Marks: Story = {
  args: {
    code: `const total = items.length;
const done = items.filter((item) => item.done).length;
const rate = done / total;
const rate = total === 0 ? 0 : done / total;`,
    lang: 'ts',
    marks: { 2: 'highlight', 3: 'remove', 4: 'add' },
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(canvasElement.querySelectorAll('[data-mark]')).toHaveLength(3);
    });
    const removed = canvasElement.querySelector('[data-mark="remove"]');

    await expect(removed).toHaveTextContent('const rate = done / total;');
    await expect(getComputedStyle(removed as Element, '::before').content).toBe(
      '"−"',
    );
  },
};

export const Callouts: Story = {
  args: {
    code: `const [state, formAction] = useActionState(save, initialState);`,
    lang: 'tsx',
    callouts: { 1: 'フォームの action に渡す関数と、前回の結果が返る' },
  },
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByText(
        'フォームの action に渡す関数と、前回の結果が返る',
      ),
    ).toHaveAttribute('data-callout');
  },
};

// 知らない言語名でも描けなくはならず、色を付けずに出す
export const UnknownLanguage: Story = {
  args: {
    code: 'SELECT * FROM users;',
    lang: 'no-such-language',
  },
  play: async ({ canvas }) => {
    const code = await canvas.findByText('SELECT * FROM users;');

    await expect(code.closest('pre')).toBeInTheDocument();
  },
};

// クリップボードを読み返すには権限が要るので、書き込み口で受け取って確かめる
const written: ClipboardItem[] = [];

export const Copy: Story = {
  args: {
    code: 'pnpm add @k8ordo/ui',
    lang: 'bash',
  },
  beforeEach: () => {
    written.length = 0;
    const spy = spyOn(navigator.clipboard, 'write').mockImplementation(
      (items) => {
        written.push(...items);
        return Promise.resolve();
      },
    );
    return () => {
      spy.mockRestore();
    };
  },
  afterEach: blurActiveElement,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      await canvas.findByRole('button', { name: 'コードをコピー' }),
    );

    const blob = await written.at(-1)?.getType('text/plain');
    await expect(await blob?.text()).toBe('pnpm add @k8ordo/ui');
    await waitFor(() => {
      expect(canvas.getByRole('status')).toHaveTextContent('コピーしました');
    });
  },
};

// 縦書きの中でも、コードは横書きの島として描く
export const InVerticalText: Story = {
  parameters: {
    writingMode: 'vertical',
  },
  args: {
    code: SAMPLE,
    lang: 'tsx',
    title: 'save.tsx',
  },
  play: async ({ canvas }) => {
    const figure = await canvas.findByRole('figure');

    await expect(getComputedStyle(figure).writingMode).toBe('horizontal-tb');
  },
};

// 強制カラー（Windows のハイコントラストなど）では影と地の色が消える。
// 行の印の線とフォーカスリングは、システムの色で塗り直されて残る
export const ForcedColors: Story = {
  tags: ['forced-colors'],
  args: {
    code: 'const a = 1;\nconst b = 2;',
    lang: 'ts',
    marks: { 1: 'highlight' },
  },
  play: async ({ canvasElement }) => {
    await expect(matchMedia('(forced-colors: active)').matches).toBe(true);

    const mark = canvasElement.querySelector('[data-mark="highlight"]');
    const bar = getComputedStyle(mark as Element, '::after');

    await expect(bar.borderInlineStartStyle).toBe('solid');
    await expect(bar.borderInlineStartColor).not.toBe('rgba(0, 0, 0, 0)');

    const pre = canvasElement.querySelector('pre') as HTMLElement;
    pre.focus();
    const focused = getComputedStyle(pre);

    await expect(focused.outlineStyle).toBe('solid');
    await expect(focused.outlineColor).not.toBe('rgba(0, 0, 0, 0)');
  },
};
