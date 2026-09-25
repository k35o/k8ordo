import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Alert } from '../../feedback/alert';
import { Prose } from './prose';

const meta: Meta<typeof Prose> = {
  title: 'components/data-display/prose',
  component: Prose,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Prose>;

const styleOf = (element: Element | null) =>
  getComputedStyle(element as Element);

// Markdown（remark / MDX）が出すのと同じ、クラスの無い HTML
const Article = () => (
  <>
    <h2>はじめに</h2>
    <p>
      この文書では、<strong>本文の組版</strong>を確かめます。
      <em>強調</em>は傍点で示し、<a href="#lists">リンク</a>や
      <code>inline code</code>、<kbd>Ctrl</kbd> も本文の中で読みやすく並びます。
    </p>
    <p>段落と段落のあいだには、行間とは別に余白が空きます。</p>
    <h3 id="lists">リスト</h3>
    <ul>
      <li>リセットで消えた黒丸を戻す</li>
      <li>
        入れ子のリスト
        <ul>
          <li>白丸になる</li>
        </ul>
      </li>
    </ul>
    <ol>
      <li>番号付きのリスト</li>
      <li>2 番目</li>
    </ol>
    <blockquote>
      <p>引用は左の罫線と、控えめな文字色で示します。</p>
    </blockquote>
    <pre>
      <code>const answer = 42;</code>
    </pre>
    <table>
      <thead>
        <tr>
          <th>要素</th>
          <th>扱い</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>見出し</td>
          <td>太字と大きさ</td>
        </tr>
      </tbody>
    </table>
    <hr />
    <p>区切りの後の段落。</p>
  </>
);

export const Default: Story = {
  render: () => (
    <div className="max-w-2xl" lang="ja">
      <Prose>
        <Article />
      </Prose>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(styleOf(canvas.getByText('本文の組版')).fontWeight).toBe(
      '700',
    );
    await expect(
      styleOf(canvas.getByRole('heading', { name: 'はじめに' })).fontWeight,
    ).toBe('700');
    await expect(
      styleOf(canvas.getByText('リセットで消えた黒丸を戻す').closest('ul'))
        .listStyleType,
    ).toBe('disc');
    await expect(
      styleOf(canvas.getByText('白丸になる').closest('ul')).listStyleType,
    ).toBe('circle');
    // 日本語の強調は傍点にする
    await expect(styleOf(canvas.getByText('強調')).textEmphasisStyle).toBe(
      'sesame',
    );
    await expect(
      styleOf(canvas.getByText('inline code')).backgroundColor,
    ).not.toBe('rgba(0, 0, 0, 0)');
    // pre の中の code には、インラインのコードの地を敷かない
    await expect(
      styleOf(canvas.getByText('const answer = 42;')).backgroundColor,
    ).toBe('rgba(0, 0, 0, 0)');
  },
};

// 段落の間は空くが、最初の子の上には余白を足さない
export const Flow: Story = {
  render: () => (
    <div className="max-w-2xl" lang="ja">
      <Prose>
        <p>1 つ目の段落</p>
        <p>2 つ目の段落</p>
        <h2>見出し</h2>
        <p>見出しの直後の段落</p>
      </Prose>
    </div>
  ),
  play: async ({ canvas }) => {
    const first = styleOf(canvas.getByText('1 つ目の段落'));
    const second = styleOf(canvas.getByText('2 つ目の段落'));
    const heading = styleOf(canvas.getByRole('heading', { name: '見出し' }));
    const afterHeading = styleOf(canvas.getByText('見出しの直後の段落'));

    await expect(first.marginBlockStart).toBe('0px');
    await expect(second.marginBlockStart).toBe('16px');
    await expect(heading.marginBlockStart).toBe('48px');
    await expect(afterHeading.marginBlockStart).toBe('12px');
  },
};

// 部品は自分の見た目を持つ。前後の間は本文と同じに空くが、部品の中の
// リストや段落は Prose の組版を受けない
export const ComponentsInside: Story = {
  render: () => (
    <div className="max-w-2xl" lang="ja">
      <Prose>
        <p>部品の前の段落</p>
        <Alert message={['1 つ目の注意', '2 つ目の注意']} tone="warning" />
        <p>部品の後の段落</p>
      </Prose>
    </div>
  ),
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('alert');
    const list = canvas.getByText('1 つ目の注意').closest('ul');

    await expect(styleOf(alert).marginBlockStart).toBe('16px');
    await expect(styleOf(list).listStyleType).toBe('none');
    await expect(styleOf(list).paddingInlineStart).toBe('0px');
  },
};

// GFM（remark-gfm）が付けるクラスは、素の HTML の一部として整える。
// remark-gfm のチェックボックスには名前が無いので、ここでは aria-label を足している
export const GitHubFlavored: Story = {
  render: () => (
    <div className="max-w-2xl" lang="ja">
      <Prose>
        <ul className="contains-task-list">
          <li className="task-list-item">
            <input
              aria-label="終わった作業"
              checked
              disabled
              readOnly
              type="checkbox"
            />{' '}
            終わった作業
          </li>
          <li className="task-list-item">
            <input aria-label="残っている作業" disabled type="checkbox" />{' '}
            残っている作業
          </li>
        </ul>
        <p>
          脚注の付いた文
          <sup>
            <a
              aria-describedby="footnote-label"
              data-footnote-ref
              href="#user-content-fn-1"
              id="user-content-fnref-1"
            >
              1
            </a>
          </sup>
          。
        </p>
        <section className="footnotes" data-footnotes>
          <h2 className="sr-only" id="footnote-label">
            脚注
          </h2>
          <ol>
            <li id="user-content-fn-1">
              <p>
                脚注の本文{' '}
                <a
                  aria-label="本文へ戻る"
                  className="data-footnote-backref"
                  data-footnote-backref=""
                  href="#user-content-fnref-1"
                >
                  ↩
                </a>
              </p>
            </li>
          </ol>
        </section>
      </Prose>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      styleOf(canvas.getByText('終わった作業').closest('li')).listStyleType,
    ).toBe('none');
    await expect(
      styleOf(canvas.getByText('脚注の本文', { exact: false }).closest('ol'))
        .listStyleType,
    ).toBe('decimal');
    await expect(
      styleOf(canvas.getByRole('link', { name: '本文へ戻る' }))
        .textDecorationLine,
    ).toBe('underline');
  },
};

// 日本語でない本文の強調は、傍点ではなく斜体にする
export const English: Story = {
  render: () => (
    <div className="max-w-2xl" lang="en">
      <Prose>
        <p>
          Emphasis in <em>English</em> is italic, and <strong>strong</strong> is
          bold.
        </p>
      </Prose>
    </div>
  ),
  play: async ({ canvas }) => {
    const em = styleOf(canvas.getByText('English'));

    await expect(em.fontStyle).toBe('italic');
    await expect(em.textEmphasisStyle).toBe('none');
  },
};

// 縦書きの本文は、段落の頭を 1 字下げる
export const Vertical: Story = {
  parameters: {
    writingMode: 'vertical',
  },
  render: () => (
    <div className="h-80" lang="ja">
      <Prose>
        <h2>縦書きの見出し</h2>
        <p>縦書きでは、段落の頭を一字下げて組みます。</p>
        <p>二つ目の段落も同じです。</p>
      </Prose>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      styleOf(canvas.getByText('縦書きでは、段落の頭を一字下げて組みます。'))
        .textIndent,
    ).toBe('16px');
  },
};
