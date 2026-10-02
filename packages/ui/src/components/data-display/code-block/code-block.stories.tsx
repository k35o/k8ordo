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
    // トークンの色は k8o のブログと同じ one-light / plastic のままで、コメント
    // などは地に対して 4.5:1 に届かない。コントラストの検査はコードの中だけ
    // 外し、見出しの行の文字は検査する
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', selector: '*:not(.ao-code-block pre *)' },
        ],
      },
    },
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
  play: async ({ canvas }) => {
    await expect(canvas.getByText('tsx')).toBeInTheDocument();
  },
};

// 色はトークンではなく、k8o のブログと同じ固定の値。ライトは one-light、
// ダークは plastic で、見出しの行は線ではなく地の段差でコードと分ける
const colorsOf = (canvasElement: HTMLElement) => {
  const figure = canvasElement.querySelector('figure') as HTMLElement;
  const header = figure.firstElementChild as HTMLElement;
  const keyword = [...figure.querySelectorAll('pre span span')].find(
    (token) => token.textContent === 'import',
  ) as HTMLElement;
  return {
    surface: getComputedStyle(figure).backgroundColor,
    border: getComputedStyle(figure).borderTopWidth,
    header: getComputedStyle(header).backgroundColor,
    headerDivider: getComputedStyle(header).borderBottomWidth,
    keyword: getComputedStyle(keyword).color,
  };
};

export const LightColors: Story = {
  args: { code: SAMPLE, lang: 'tsx' },
  parameters: { theme: 'light' },
  play: async ({ canvasElement }) => {
    await expect(colorsOf(canvasElement)).toStrictEqual({
      surface: 'rgb(250, 250, 250)',
      border: '0px',
      header: 'rgb(237, 238, 240)',
      headerDivider: '0px',
      keyword: 'rgb(166, 38, 164)',
    });
  },
};

export const DarkColors: Story = {
  args: { code: SAMPLE, lang: 'tsx' },
  parameters: { theme: 'dark' },
  play: async ({ canvasElement }) => {
    await expect(colorsOf(canvasElement)).toStrictEqual({
      surface: 'rgb(33, 37, 43)',
      border: '0px',
      header: 'rgb(44, 49, 59)',
      headerDivider: '0px',
      // plastic の #e06c75 そのまま
      keyword: 'rgb(224, 108, 117)',
    });
  },
};

// 並べた 2 つの高さを親がそろえても、見出しの行は自分の高さのまま。
// 余った高さはコードの行が受ける
const SHORT = { code: 'pnpm add @k8ordo/ui', lang: 'bash' };
const LONG = {
  code: Array.from(
    { length: 12 },
    (_, index) => `line ${String(index + 1)}`,
  ).join('\n'),
  lang: 'text',
};

const heightOf = (element: Element | null | undefined) =>
  element?.getBoundingClientRect().height ?? 0;

export const StretchedByParent: Story = {
  args: SHORT,
  loaders: [
    async () => ({
      short: await CodeBlock(SHORT),
      long: await CodeBlock(LONG),
    }),
  ],
  render: (_args, { loaded }) => {
    const { short, long } = loaded as {
      short: ReactElement;
      long: ReactElement;
    };
    return (
      <div className="grid grid-cols-2 gap-4 *:min-w-0">
        {short}
        {long}
      </div>
    );
  },
  play: async ({ canvas }) => {
    const [short, long] = await canvas.findAllByRole('figure');

    // 親のグリッドが短い方を長い方の高さまで引き伸ばしている
    await expect(heightOf(short)).toBeCloseTo(heightOf(long), 0);
    await expect(heightOf(short?.firstElementChild)).toBeCloseTo(
      heightOf(long?.firstElementChild),
      0,
    );
  },
};

export const WithTitle: Story = {
  args: {
    code: SAMPLE,
    lang: 'tsx',
    title: 'save.tsx',
  },
  play: async ({ canvas }) => {
    const name = await canvas.findByText('save.tsx');
    const caption = name.parentElement;

    // figure の名前になるのは、最初（か最後）の子の figcaption だけ
    await expect(caption?.tagName).toBe('FIGCAPTION');
    await expect(canvas.getByRole('figure').firstElementChild).toBe(caption);
    // ファイル名はコードの識別子なので、等幅の code で見せる
    await expect(name.tagName).toBe('CODE');
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
