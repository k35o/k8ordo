import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, spyOn, waitFor } from 'storybook/test';

import { Message } from '.';
import { Avatar } from '../../data-display/avatar';
import { AssistantIcon } from '../../icons';
import { Attachment } from '../attachment';
import { Source } from '../source';

const meta: Meta<typeof Message.Root> = {
  title: 'components/ai/message',
  component: Message.Root,
};

export default meta;
type Story = StoryObj<typeof Message.Root>;

const assistantAvatar = (
  <Avatar color="primary" icon={<AssistantIcon />} name="AI" size="sm" />
);

const ANSWER = 'いいですね。まずは会話の器・吹き出し・入力欄から始めましょう。';

const onRegenerate = fn();
const onFeedback = fn();

export const User: Story = {
  render: () => (
    <Message.Root from="user">
      <Message.Content>k8ordo UI で AI チャットを作りたい。</Message.Content>
    </Message.Root>
  ),
};

export const Assistant: Story = {
  render: () => (
    <Message.Root avatar={assistantAvatar} from="assistant">
      <Message.Content>{ANSWER}</Message.Content>
    </Message.Root>
  ),
};

export const Streaming: Story = {
  parameters: { vrt: { skip: true } },
  render: () => (
    <Message.Root avatar={assistantAvatar} from="assistant">
      <Message.Content isStreaming>回答を生成しています</Message.Content>
    </Message.Root>
  ),
};

export const Conversation: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Message.Root from="user">
        <Message.Content>
          長い URL も折り返せる？
          https://example.com/very/long/path/that/should/wrap/nicely/without/overflowing
        </Message.Content>
      </Message.Root>
      <Message.Root avatar={assistantAvatar} from="assistant">
        <Message.Content>
          折り返せます。改行も保持します。{'\n'}このように。
        </Message.Content>
      </Message.Root>
    </div>
  ),
};

const PIXEL =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"%3E%3Crect width="4" height="3" fill="%2399d5c9"/%3E%3C/svg%3E';

export const UserWithAttachments: Story = {
  render: () => (
    <Message.Root from="user">
      <Attachment.List>
        <Attachment.Item
          filename="screenshot.svg"
          mediaType="image/svg+xml"
          url={PIXEL}
        />
        <Attachment.Item
          filename="spec.pdf"
          mediaType="application/pdf"
          url="https://example.com/spec.pdf"
        />
      </Attachment.List>
      <Message.Content>この 2 つを見て、差分をまとめて。</Message.Content>
    </Message.Root>
  ),
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list', { name: '添付ファイル' });
    await expect(list.children).toHaveLength(2);
    await expect(
      canvas.getByRole('img', { name: 'screenshot.svg' }),
    ).toBeVisible();
    await expect(canvas.getByText('spec.pdf')).toBeVisible();
  },
};

export const WithSourcesAndActions: Story = {
  render: () => (
    <Message.Root avatar={assistantAvatar} from="assistant">
      <Message.Content>{ANSWER}</Message.Content>
      <Source.List>
        <Source.Item
          href="https://ordo.k8o.me/ui/ai/chat"
          title="AI チャット — k8ordo"
        />
        <Source.Item href="https://example.com/guide" />
      </Source.List>
      <Message.Actions>
        <Message.Copy value={ANSWER} />
        <Message.Regenerate onAction={onRegenerate} />
        <Message.Feedback />
      </Message.Actions>
    </Message.Root>
  ),
};

export const Copy: Story = {
  render: () => (
    <Message.Root avatar={assistantAvatar} from="assistant">
      <Message.Content>{ANSWER}</Message.Content>
      <Message.Actions>
        <Message.Copy value={ANSWER} />
      </Message.Actions>
    </Message.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    // クリップボードは外部の境界。書き込み口だけ差し替えて、渡した値を見る
    const written: ClipboardItem[] = [];
    spyOn(navigator.clipboard, 'write').mockImplementation((items) => {
      written.push(...items);
      return Promise.resolve();
    });

    await userEvent.click(canvas.getByRole('button', { name: 'コピー' }));

    const text = await written.at(-1)?.getType('text/plain');
    await expect(await text?.text()).toBe(ANSWER);
    await waitFor(() => {
      expect(canvas.getByRole('status')).toHaveTextContent('コピーしました');
    });
  },
};

export const CopyFailed: Story = {
  render: Copy.render,
  play: async ({ canvas, userEvent }) => {
    spyOn(navigator.clipboard, 'write').mockRejectedValue(
      new DOMException('denied', 'NotAllowedError'),
    );

    await userEvent.click(canvas.getByRole('button', { name: 'コピー' }));

    // 書けなかったことを伝え、会話はそのまま残る
    await waitFor(() => {
      expect(canvas.getByRole('status')).toHaveTextContent(
        'コピーできませんでした',
      );
    });
    await expect(canvas.getByText(ANSWER)).toBeVisible();
  },
};

export const Regenerate: Story = {
  render: () => (
    <Message.Root avatar={assistantAvatar} from="assistant">
      <Message.Content>{ANSWER}</Message.Content>
      <Message.Actions>
        <Message.Regenerate onAction={onRegenerate} />
      </Message.Actions>
    </Message.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    onRegenerate.mockClear();

    await userEvent.click(canvas.getByRole('button', { name: '再生成' }));

    await expect(onRegenerate).toHaveBeenCalledOnce();
  },
};

export const Feedback: Story = {
  render: () => (
    <Message.Root avatar={assistantAvatar} from="assistant">
      <Message.Content>{ANSWER}</Message.Content>
      <Message.Actions>
        <Message.Feedback onChange={onFeedback} />
      </Message.Actions>
    </Message.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    onFeedback.mockClear();
    const good = canvas.getByRole('button', { name: '良い回答' });
    const bad = canvas.getByRole('button', { name: '良くない回答' });

    await userEvent.click(good);
    await expect(good).toHaveAttribute('aria-pressed', 'true');
    await expect(bad).toHaveAttribute('aria-pressed', 'false');
    await expect(onFeedback).toHaveBeenLastCalledWith('positive');

    await userEvent.click(bad);
    await expect(good).toHaveAttribute('aria-pressed', 'false');
    await expect(bad).toHaveAttribute('aria-pressed', 'true');
    await expect(onFeedback).toHaveBeenLastCalledWith('negative');

    // 押されている方をもう一度押すと取り消せる
    await userEvent.click(bad);
    await expect(bad).toHaveAttribute('aria-pressed', 'false');
    await expect(onFeedback).toHaveBeenLastCalledWith(null);
  },
};

export const ActionsGroup: Story = {
  render: WithSourcesAndActions.render,
  play: async ({ canvas }) => {
    const actions = canvas.getByRole('group', { name: 'メッセージの操作' });
    await expect(actions).toContainElement(
      canvas.getByRole('button', { name: 'コピー' }),
    );
    await expect(actions).toContainElement(
      canvas.getByRole('button', { name: '再生成' }),
    );
  },
};
