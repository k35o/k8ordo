import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../buttons/button';
import { Card } from './card';

const meta: Meta<typeof Card> = {
  title: 'components/data-display/card',
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Primary: Story = {
  render: () => (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-bold">記事タイトル</h3>
        <p className="text-fg-mute mt-2">
          これはカードコンポーネントの説明文です。コンテンツを囲んで視覚的にグループ化します。
        </p>
      </div>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Card interactive>
        <a className="block p-4" href="https://example.com">
          <h3 className="font-bold">カード全体がリンク</h3>
          <p className="text-fg-mute mt-2 text-sm">
            カード全体をクリックして遷移します。
          </p>
        </a>
      </Card>
      <Card interactive>
        <div className="flex flex-col gap-3 p-4">
          <h3 className="font-bold">カード内にボタンとリンク</h3>
          <p className="text-fg-mute text-sm">
            カード内にインタラクティブ要素を配置できます。
          </p>
          <nav className="flex gap-2">
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
      <div className="p-4">
        <h3 className="text-lg font-bold">ボーダースタイル</h3>
        <p className="text-fg-mute mt-2">
          シャドウの代わりにボーダーで区切るスタイルです。
        </p>
      </div>
    </Card>
  ),
};

export const FitWidth: Story = {
  render: () => (
    <Card width="fit">
      <div className="p-4">
        <p>幅がコンテンツに合わせて調整されます。</p>
      </div>
    </Card>
  ),
};
