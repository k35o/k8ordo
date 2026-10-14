import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../buttons/button';
import { Card } from './card';

import styles from './card.stories.module.css';

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
            <Button
              renderItem={({ className, children }) => (
                <a className={className} href="https://example.com">
                  {children}
                </a>
              )}
              size="sm"
            >
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
