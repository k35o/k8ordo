import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { FC, ReactNode } from 'react';

import { Avatar } from '../data-display/avatar';
import { AssistantIcon } from '../icons';
import { Conversation } from './conversation';
import { Message } from './message';
import { PromptInput } from './prompt-input';
import { Reasoning } from './reasoning';
import { Suggestion } from './suggestion';
import { ToolInvocation } from './tool-invocation';

const meta: Meta = {
  title: 'components/ai/chat',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const AssistantRow: FC<{ children: ReactNode }> = ({ children }) => (
  <Message.Root from="assistant">
    <Avatar color="primary" icon={<AssistantIcon />} name="AI" size="sm" />
    <div className="flex min-w-0 flex-1 flex-col gap-2">{children}</div>
  </Message.Root>
);

const UserRow: FC<{ children: ReactNode }> = ({ children }) => (
  <Message.Root from="user">
    <Message.Content>{children}</Message.Content>
  </Message.Root>
);

type Msg = { id: string; role: 'user' | 'assistant'; text: string };

const suggestions = [
  'IME 対応について教えて',
  'ストリーミング表示は？',
  'ツール呼び出しの表示例',
];

const ChatDemo: FC = () => {
  const idRef = useRef(0);
  const [messages, setMessages] = useState<Msg[]>([]);

  const send = (text: string) => {
    const uid = (idRef.current += 1);
    const aid = (idRef.current += 1);
    setMessages((prev) => [
      ...prev,
      { id: `u${uid.toString()}`, role: 'user', text },
      {
        id: `a${aid.toString()}`,
        role: 'assistant',
        text: `「${text}」ですね。ドキュメントの該当箇所をまとめますね。`,
      },
    ]);
  };

  return (
    <div className="bg-bg-subtle flex h-svh justify-center p-4 sm:p-8">
      <div className="border-border-base bg-bg-base flex size-full max-w-2xl flex-col gap-3 rounded-2xl border p-3 shadow-md">
        <Conversation.Root>
          <Conversation.Messages>
            <AssistantRow>
              <Message.Content>
                こんにちは。k8ordo UI の AI
                チャットについて、何でも聞いてください。
              </Message.Content>
            </AssistantRow>

            <UserRow>
              React で AI チャットを作るとき、何から始めればいい？
            </UserRow>

            <AssistantRow>
              <Reasoning>
                まず会話の器・吹き出し・入力欄の3つが土台。Markdown
                やツール表示は後段で足せる。
              </Reasoning>
              <ToolInvocation
                input={{ query: 'k8ordo UI ai getting started' }}
                name="search_docs"
                output="Conversation / Message / PromptInput の3つから始めるのが推奨です。"
                state="output-available"
              />
              <Message.Content>
                まずは `Conversation`・`Message`・`PromptInput`
                の3つで会話の骨組みを作り、そのあと `Response`（Markdown）や
                `ToolInvocation` を足していくのがおすすめです。
              </Message.Content>
            </AssistantRow>

            <UserRow>
              日本語入力で、変換確定の Enter で送信されないようにしたい。
            </UserRow>

            <AssistantRow>
              <Message.Content>
                `PromptInput.Textarea` が IME
                の変換確定を検知して送信を抑止します。Enter で送信、Shift+Enter
                で改行です。
              </Message.Content>
            </AssistantRow>

            {messages.map((m) =>
              m.role === 'user' ? (
                <UserRow key={m.id}>{m.text}</UserRow>
              ) : (
                <AssistantRow key={m.id}>
                  <Message.Content>{m.text}</Message.Content>
                </AssistantRow>
              ),
            )}
          </Conversation.Messages>
          <Conversation.ScrollButton />
        </Conversation.Root>

        <Suggestion.List>
          {suggestions.map((s) => (
            <Suggestion.Item key={s} onSelect={send} value={s}>
              {s}
            </Suggestion.Item>
          ))}
        </Suggestion.List>

        <PromptInput.Root onSubmit={send}>
          <PromptInput.Textarea placeholder="メッセージを入力…" />
          <PromptInput.Submit />
        </PromptInput.Root>
      </div>
    </div>
  );
};

export const Playground: Story = {
  parameters: { vrt: { skip: true } },
  render: () => <ChatDemo />,
};
