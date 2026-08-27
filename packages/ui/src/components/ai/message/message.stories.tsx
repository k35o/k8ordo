import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar } from '../../data-display/avatar';
import { AssistantIcon } from '../../icons';
import { Message } from './message';

const meta: Meta<typeof Message.Root> = {
  title: 'components/ai/message',
  component: Message.Root,
};

export default meta;
type Story = StoryObj<typeof Message.Root>;

export const User: Story = {
  render: () => (
    <Message.Root from="user">
      <Message.Content>k8ordo UI で AI チャットを作りたい。</Message.Content>
    </Message.Root>
  ),
};

export const Assistant: Story = {
  render: () => (
    <Message.Root from="assistant">
      <Avatar color="primary" icon={<AssistantIcon />} name="AI" size="sm" />
      <Message.Content>
        いいですね。まずは会話の器・吹き出し・入力欄から始めましょう。
      </Message.Content>
    </Message.Root>
  ),
};

export const Streaming: Story = {
  parameters: { vrt: { skip: true } },
  render: () => (
    <Message.Root from="assistant">
      <Avatar color="primary" icon={<AssistantIcon />} name="AI" size="sm" />
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
      <Message.Root from="assistant">
        <Avatar color="primary" icon={<AssistantIcon />} name="AI" size="sm" />
        <Message.Content>
          折り返せます。改行も保持します。{'\n'}このように。
        </Message.Content>
      </Message.Root>
    </div>
  ),
};
