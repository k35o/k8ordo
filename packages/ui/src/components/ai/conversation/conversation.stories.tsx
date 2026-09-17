import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { FC } from 'react';
import { expect, waitFor } from 'storybook/test';

import { Conversation } from '.';
import { Message } from '../message';

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

// IntersectionObserver / ResizeObserver の通知はレンダリング更新のあとのタスクで届く。
// 「動かないこと」を確かめる前に 2 フレーム待ち、届くはずの通知を出し切らせる。
const settle = async (): Promise<void> => {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
};

const isAtBottom = (log: HTMLElement): boolean =>
  log.scrollHeight - log.scrollTop - log.clientHeight < 1;

const Growing: FC = () => {
  const [count, setCount] = useState(items.length);
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => {
          setCount((current) => current + 1);
        }}
        type="button"
      >
        追加する
      </button>
      <div className="border-border-base h-100 w-96 rounded-xl border">
        <Conversation.Root>
          <Conversation.Messages>
            {Array.from({ length: count }, (_, i) => (
              <Message.Root from={i % 2 === 0 ? 'assistant' : 'user'} key={i}>
                <Message.Content>メッセージ {i + 1}</Message.Content>
              </Message.Root>
            ))}
          </Conversation.Messages>
          <Conversation.ScrollButton />
        </Conversation.Root>
      </div>
    </div>
  );
};

// 最下部から離れると ScrollButton が出て、押すと最下部へ戻って消える。
export const ScrollButtonWhenScrolledUp: Story = {
  parameters: { vrt: { skip: true } },
  render: () => <Growing />,
  play: async ({ canvas, userEvent }) => {
    const log = canvas.getByRole('log');
    await waitFor(() => {
      expect(isAtBottom(log)).toBe(true);
    });

    // マウント直後は Resize の初回通知が残っていて、最下部にいる前提のまま
    // 引き戻されてしまう。通知が出し切られてから上へスクロールする。
    await settle();
    log.scrollTop = 0;
    const button = await canvas.findByRole('button', {
      name: '最新のメッセージへ移動',
    });

    await userEvent.click(button);
    await waitFor(() => {
      expect(isAtBottom(log)).toBe(true);
      expect(
        canvas.queryByRole('button', { name: '最新のメッセージへ移動' }),
      ).toBeNull();
    });
  },
};

// 最下部にいる間は、メッセージが増えても最下部に追従する。
export const FollowNewMessagesAtBottom: Story = {
  parameters: { vrt: { skip: true } },
  render: () => <Growing />,
  play: async ({ canvas, userEvent }) => {
    const log = canvas.getByRole('log');
    await waitFor(() => {
      expect(isAtBottom(log)).toBe(true);
    });

    await userEvent.click(canvas.getByRole('button', { name: '追加する' }));
    await canvas.findByText(`メッセージ ${String(items.length + 1)}`);
    await waitFor(() => {
      expect(isAtBottom(log)).toBe(true);
    });
  },
};

// 読み返している最中は、メッセージが増えても位置を奪わない。
export const KeepPositionWhenScrolledUp: Story = {
  parameters: { vrt: { skip: true } },
  render: () => <Growing />,
  play: async ({ canvas, userEvent }) => {
    const log = canvas.getByRole('log');
    await waitFor(() => {
      expect(isAtBottom(log)).toBe(true);
    });

    // マウント直後は Resize の初回通知が残っていて、最下部にいる前提のまま
    // 引き戻されてしまう。通知が出し切られてから上へスクロールする。
    await settle();
    log.scrollTop = 0;
    await canvas.findByRole('button', { name: '最新のメッセージへ移動' });

    await userEvent.click(canvas.getByRole('button', { name: '追加する' }));
    await canvas.findByText(`メッセージ ${String(items.length + 1)}`);
    await settle();
    await expect(log.scrollTop).toBe(0);
  },
};
