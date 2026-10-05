import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Code } from '../../data-display/code';
import { Anchor } from '../../navigation/anchor';
import { Callout } from './callout';

const meta: Meta<typeof Callout> = {
  title: 'components/feedback/callout',
  component: Callout,
};

export default meta;
type Story = StoryObj<typeof Callout>;

export const Info: Story = {
  args: {
    tone: 'info',
    label: 'メモ',
    children: <p>送信の前に、ブラウザが入力を確かめます。</p>,
  },
  play: async ({ canvas }) => {
    // クライアント側の遷移で差し込まれても警告として読み上げられないよう、
    // ライブリージョン（alert / status）にはしない
    await expect(canvas.getByRole('note')).toHaveTextContent(
      '情報メモ送信の前に、ブラウザが入力を確かめます。',
    );
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
  },
};

export const Warning: Story = {
  args: {
    tone: 'warning',
    label: '落とし穴',
    children: (
      <p>
        <Code>value</Code> を渡すと、フォームのリセットで値が戻らなくなります。
      </p>
    ),
  },
};

export const Success: Story = {
  args: {
    tone: 'success',
    label: '対応済み',
    children: <p>すべてのブラウザで動きます。</p>,
  },
};

export const Error: Story = {
  args: {
    tone: 'error',
    label: '非推奨',
    children: <p>次のメジャーで削除します。</p>,
  },
};

export const WithoutLabel: Story = {
  args: {
    tone: 'info',
    children: <p>この記事は 2023 年 7 月時点の内容です。</p>,
  },
};

export const RichContent: Story = {
  args: {
    tone: 'warning',
    label: '落とし穴',
    children: (
      <>
        <p>
          <Code>cloneElement</Code> と <Code>isValidElement</Code> は React
          のレガシー API です。
        </p>
        <p>
          新しく書くときは{' '}
          <Anchor href="https://react.dev/reference/react/cloneElement">
            render props
          </Anchor>{' '}
          を使ってください。
        </p>
      </>
    ),
  },
};
