import type { Meta, StoryObj } from '@storybook/react-vite';
import { clsx } from 'clsx';
import type { ComponentProps, FC } from 'react';
import { expect, waitFor } from 'storybook/test';

import { TableOfContents } from '.';
import type { TableOfContentsItem } from '.';

import styles from './table-of-contents.stories.module.css';

const ITEMS: TableOfContentsItem[] = [
  { id: 'install', label: 'インストール' },
  {
    id: 'usage',
    label: '使い方',
    children: [
      { id: 'usage-basic', label: '基本' },
      { id: 'usage-advanced', label: '応用' },
    ],
  },
  { id: 'よくある質問', label: 'よくある質問' },
];

const SECTIONS = [
  { id: 'install', title: 'インストール', level: 'h2' },
  { id: 'usage', title: '使い方', level: 'h2' },
  { id: 'usage-basic', title: '基本', level: 'h3' },
  { id: 'usage-advanced', title: '応用', level: 'h3' },
  { id: 'よくある質問', title: 'よくある質問', level: 'h2' },
] as const;

// 見出しには、目次から飛んだときに止まる位置（scroll-margin）を付けておく
const Article: FC<{ shortLastSection?: boolean }> = ({
  shortLastSection = false,
}) => (
  <article className={styles.article}>
    {SECTIONS.map((section, index) => {
      const Heading = section.level;
      const isLast = index === SECTIONS.length - 1;
      return (
        <section key={section.id}>
          <Heading className={styles.heading} id={section.id}>
            {section.title}
          </Heading>
          <p
            className={clsx(
              styles.body,
              !(isLast && shortLastSection) && styles.long,
            )}
          >
            {section.title}の本文。
          </p>
        </section>
      );
    })}
  </article>
);

// 目次は文書をスクロールして今の見出しを決めるので、どのストーリーも
// 本文と並べたページ全体で描く
const Layout: FC<
  ComponentProps<typeof TableOfContents> & { shortLastSection?: boolean }
> = ({ shortLastSection, ...props }) => (
  <div className={styles.layout}>
    <div className={styles.main}>
      <Article shortLastSection={shortLastSection} />
    </div>
    <aside className={styles.aside}>
      <TableOfContents {...props} />
    </aside>
  </div>
);

const meta: Meta<typeof TableOfContents> = {
  title: 'components/navigation/table-of-contents',
  component: TableOfContents,
  parameters: {
    layout: 'padded',
  },
  args: {
    items: ITEMS,
  },
  render: (args) => <Layout {...args} />,
};

export default meta;
type Story = StoryObj<typeof TableOfContents>;

const currentLink = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('a[aria-current="location"]');

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole('navigation', { name: '目次' }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: '基本' })).toHaveAttribute(
      'href',
      '#usage-basic',
    );

    // 見出しが読み取り位置（scroll-margin）に来ると、その項目が今の見出しになる。
    // scrollIntoView はアンカーへ飛ぶときと同じく scroll-margin の位置で止める
    // （テストのページではリンクを押すとページごと移ってしまうので、こちらで飛ぶ）
    document.querySelector('#usage-basic')?.scrollIntoView();
    await waitFor(() => {
      expect(currentLink(canvasElement)).toHaveTextContent('基本');
    });

    document.querySelector('#install')?.scrollIntoView();
    await waitFor(() => {
      expect(currentLink(canvasElement)).toHaveTextContent('インストール');
    });
  },
};

// 最後の節が短くて見出しが読み取り位置まで来なくても、文書の終わりまで
// 来たら最後の見出しを今の見出しにする
export const LastShortSection: Story = {
  render: (args) => <Layout {...args} shortLastSection />,
  play: async ({ canvasElement }) => {
    const root = document.scrollingElement ?? document.documentElement;
    root.scrollTo({ top: root.scrollHeight });

    await waitFor(() => {
      expect(currentLink(canvasElement)).toHaveTextContent('よくある質問');
    });
  },
};

// 縦書きの文書では、右から左へ読み進む向きで今の見出しを決める
export const VerticalDocument: Story = {
  beforeEach: () => {
    const root = document.documentElement;
    const previous = root.style.writingMode;
    root.style.writingMode = 'vertical-rl';
    return () => {
      root.style.writingMode = previous;
    };
  },
  play: async ({ canvasElement }) => {
    document.querySelector('#usage')?.scrollIntoView();
    await waitFor(() => {
      expect(currentLink(canvasElement)).toHaveTextContent('使い方');
    });

    // 日本語の id も、そのままリンクと見出しの検索に使える
    document.querySelector(`#${CSS.escape('よくある質問')}`)?.scrollIntoView();
    await waitFor(() => {
      expect(currentLink(canvasElement)).toHaveTextContent('よくある質問');
    });
  },
};

export const CustomLabel: Story = {
  args: {
    label: 'この記事の内容',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('navigation', { name: 'この記事の内容' }),
    ).toBeInTheDocument();
  },
};
