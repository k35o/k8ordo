import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { Message } from '../message';
import { Conversation } from './conversation';

const meta: Meta<typeof Conversation.Root> = {
  title: 'components/ai/conversation',
  component: Conversation.Root,
};

export default meta;
type Story = StoryObj<typeof Conversation.Root>;

const items = Array.from({ length: 20 }, (_, i) => i);

export const Default: Story = {
  render: () => (
    <div className="border-border-base h-100 w-96 rounded-xl border">
      <Conversation.Root>
        <Conversation.Messages>
          <Message.Root from="assistant">
            <Message.Content>
              こんにちは。何かお手伝いできますか？
            </Message.Content>
          </Message.Root>
          <Message.Root from="user">
            <Message.Content>
              チャット UI の設計を手伝ってほしい。
            </Message.Content>
          </Message.Root>
        </Conversation.Messages>
        <Conversation.ScrollButton />
      </Conversation.Root>
    </div>
  ),
};

// マウント時に最新（最下部）へ自動スクロールすることを検証する。
// スクロールアップで出る ScrollButton は IntersectionObserver 駆動で、
// ヘッドレス環境ではプログラム的スクロールに反応しないため目視で確認する。
export const StickToBottom: Story = {
  parameters: { vrt: { skip: true } },
  render: () => (
    <div className="border-border-base h-100 w-96 rounded-xl border">
      <Conversation.Root>
        <Conversation.Messages>
          {items.map((i) => (
            <Message.Root from={i % 2 === 0 ? 'assistant' : 'user'} key={i}>
              <Message.Content>メッセージ {i + 1}</Message.Content>
            </Message.Root>
          ))}
        </Conversation.Messages>
        <Conversation.ScrollButton />
      </Conversation.Root>
    </div>
  ),
  play: async ({ canvas }) => {
    const log = canvas.getByRole('log');
    await waitFor(() => {
      expect(log.scrollTop).toBeGreaterThan(0);
    });
    expect(
      canvas.queryByRole('button', { name: '最新のメッセージへ移動' }),
    ).toBeNull();
  },
};
