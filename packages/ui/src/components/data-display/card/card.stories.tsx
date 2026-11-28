import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { afterRenderingUpdate } from '../../../../.storybook/rendering';
import { Button } from '../../buttons/button';
import { Card } from './card';

import styles from './card.stories.module.css';

const topmostAt = (element: Element): Element | null => {
  const { left, top, width, height } = element.getBoundingClientRect();
  return element.ownerDocument.elementFromPoint(
    left + width / 2,
    top + height / 2,
  );
};

const meta: Meta<typeof Card> = {
  title: 'components/data-display/card',
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Primary: Story = {
  render: () => (
    <Card>
      <div className={styles.body}>
        <h3 className={styles.title}>記事タイトル</h3>
        <p className={styles.description}>
          これはカードコンポーネントの説明文です。コンテンツを囲んで視覚的にグループ化します。
        </p>
      </div>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className={styles.list}>
      <Card interactive>
        <a className={styles.link} href="https://example.com">
          <h3 className={styles.compactTitle}>カード全体がリンク</h3>
          <p className={styles.linkDescription}>
            カード全体をクリックして遷移します。
          </p>
        </a>
      </Card>
      <Card interactive>
        <div className={styles.actionsBody}>
          <h3 className={styles.compactTitle}>カード内にボタンとリンク</h3>
          <p className={styles.note}>
            カード内にインタラクティブ要素を配置できます。
          </p>
          <nav className={styles.actions}>
            <Button href="https://example.com" size="sm">
              詳細を見る
            </Button>
            <Button color="base" size="sm" variant="outline">
              保存
            </Button>
          </nav>
        </div>
      </Card>
    </div>
  ),
};

/**
 * `href` で、カード全体が 1 つのリンクになる。リンクの名前はカードの中の文字。
 * 中のリンクはその上に出て、別に押せる。
 */
export const WholeCardLink: Story = {
  render: () => (
    <Card href="https://example.com/articles/1">
      <div className={styles.actionsBody}>
        <h3 className={styles.compactTitle}>記事タイトル</h3>
        <p className={styles.note}>カード全体が記事へのリンクです。</p>
        <nav className={styles.actions}>
          <a className={styles.tag} href="https://example.com/tags/react">
            React
          </a>
        </nav>
      </div>
    </Card>
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('link', { name: /記事タイトル/ });
    const tag = canvas.getByRole('link', { name: 'React' });

    await expect(card).toHaveAttribute(
      'href',
      'https://example.com/articles/1',
    );
    await expect(topmostAt(canvas.getByText('記事タイトル'))).toBe(card);
    await expect(topmostAt(tag)).toBe(tag);
  },
};

/**
 * `openInNewTab` で新しいタブに開くリンクは、`Anchor` と同じ辞書の文言
 * （`opensInNewTab`）をリンクの名前の終わりに添えて、新しいタブで開くことを
 * 読み上げに伝える。文言は画面には出さない。
 */
export const WholeCardLinkNewTab: Story = {
  render: () => (
    <Card href="https://example.com/articles/1" openInNewTab>
      <div className={styles.body}>
        <h3 className={styles.title}>記事タイトル</h3>
      </div>
    </Card>
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('link');

    await expect(card).toHaveAccessibleName(
      '記事タイトル 新しいタブで開きます',
    );
    await expect(card).toHaveAttribute('target', '_blank');
    await expect(card).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(canvas.getByText('新しいタブで開きます')).not.toBeVisible();
  },
};

/**
 * `action` で、カード全体が 1 つのボタンになる。キーボードでも押せ、中の
 * ボタンはその上で別に押せる。
 */
export const WholeCardAction: Story = {
  args: { action: fn() },
  render: ({ action }) => (
    <Card action={action}>
      <div className={styles.actionsBody}>
        <h3 className={styles.compactTitle}>この案で進める</h3>
        <p className={styles.note}>カード全体を押すと選びます。</p>
        <nav className={styles.actions}>
          <Button color="base" size="sm" variant="outline">
            保存
          </Button>
        </nav>
      </div>
    </Card>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const card = canvas.getByRole('button', { name: /この案で進める/ });
    const save = canvas.getByRole('button', { name: '保存' });

    await expect(topmostAt(canvas.getByText('この案で進める'))).toBe(card);
    await expect(topmostAt(save)).toBe(save);

    await userEvent.tab();
    await expect(save).toHaveFocus();
    await userEvent.tab();
    await expect(card).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.action).toHaveBeenCalledOnce();
  },
};

let finishAction = (): void => {};
const actionUntilFinished = (): Promise<void> =>
  new Promise<void>((resolve) => {
    finishAction = resolve;
  });

/**
 * `action` が返した promise が終わるまで、カードは保留中として押されても
 * 何もしない。
 */
export const WholeCardActionPending: Story = {
  args: { action: fn(actionUntilFinished) },
  render: ({ action }) => (
    <Card action={action}>
      <div className={styles.body}>
        <h3 className={styles.title}>この案で進める</h3>
      </div>
    </Card>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const card = canvas.getByRole('button', { name: 'この案で進める' });

    try {
      await userEvent.click(card);
      await waitFor(() => {
        expect(card).toHaveAttribute('aria-busy', 'true');
      });
      await afterRenderingUpdate();
      await userEvent.click(card);
      await expect(args.action).toHaveBeenCalledOnce();
    } finally {
      // 終わらない非同期の transition は、同じ React の後続の transition を
      // すべて待たせる。途中で落ちても後のストーリーを巻き込まないよう片付ける
      finishAction();
    }
    await waitFor(() => {
      expect(card).not.toHaveAttribute('aria-busy');
    });
  },
};

export const Bordered: Story = {
  render: () => (
    <Card variant="outline">
      <div className={styles.body}>
        <h3 className={styles.title}>ボーダースタイル</h3>
        <p className={styles.description}>
          シャドウの代わりにボーダーで区切るスタイルです。
        </p>
      </div>
    </Card>
  ),
};

export const FitWidth: Story = {
  render: () => (
    <Card width="fit">
      <div className={styles.body}>
        <p>幅がコンテンツに合わせて調整されます。</p>
      </div>
    </Card>
  ),
};
