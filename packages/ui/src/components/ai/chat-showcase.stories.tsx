import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { expect } from 'storybook/test';

import { Avatar } from '../data-display/avatar';
import { AssistantIcon } from '../icons';
import { Attachment } from './attachment';
import { Conversation } from './conversation';
import { Message } from './message';
import { PromptInput } from './prompt-input';
import { Reasoning } from './reasoning';
import { Source } from './source';
import { Suggestion } from './suggestion';
import { ToolInvocation } from './tool-invocation';
import type { ToolState } from './types';

const meta: Meta = {
  title: 'components/ai/chat',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const AssistantRow: FC<{ text?: string; children: ReactNode }> = ({
  text,
  children,
}) => (
  <Message.Root
    avatar={
      <Avatar color="primary" icon={<AssistantIcon />} name="AI" size="sm" />
    }
    from="assistant"
  >
    {children}
    {text !== undefined && (
      <Message.Actions>
        <Message.Copy value={text} />
        <Message.Feedback />
      </Message.Actions>
    )}
  </Message.Root>
);

type SentFile = { url: string; mediaType: string; filename: string };

type Msg = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  files: SentFile[];
};

const suggestions = [
  'IME 対応について教えて',
  'ストリーミング表示は？',
  'ツール呼び出しの表示例',
];

const ANSWER =
  'まずは `Conversation`・`Message`・`PromptInput` の3つで会話の骨組みを作り、そのあと `Response`（Markdown）や `ToolInvocation` を足していくのがおすすめです。';

const ChatDemo: FC = () => {
  const idRef = useRef(0);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [toolState, setToolState] = useState<ToolState>('approval-requested');

  const send = (text: string, files?: FileList) => {
    const uid = (idRef.current += 1);
    const aid = (idRef.current += 1);
    const sent = Array.from(files ?? [], (file) => ({
      // 見本なので revoke しない。実際のアプリでは AI SDK が data URL にする
      url: URL.createObjectURL(file),
      mediaType: file.type,
      filename: file.name,
    }));
    setMessages((prev) => [
      ...prev,
      { id: `u${uid.toString()}`, role: 'user', text, files: sent },
      {
        id: `a${aid.toString()}`,
        role: 'assistant',
        text: `「${text === '' ? '添付ファイル' : text}」ですね。ドキュメントの該当箇所をまとめますね。`,
        files: [],
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

            <Message.Root from="user">
              <Attachment.List>
                <Attachment.Item
                  filename="architecture.pdf"
                  mediaType="application/pdf"
                  url="https://example.com/architecture.pdf"
                />
              </Attachment.List>
              <Message.Content>
                React で AI チャットを作るとき、何から始めればいい？
              </Message.Content>
            </Message.Root>

            <AssistantRow
              text={toolState === 'approval-requested' ? undefined : ANSWER}
            >
              <Reasoning>
                まず会話の器・吹き出し・入力欄の3つが土台。Markdown
                やツール表示は後段で足せる。
              </Reasoning>
              <ToolInvocation
                approval={{ id: 'approval-1' }}
                input={{ query: 'k8ordo UI ai getting started' }}
                name="search_docs"
                onApprovalResponse={({ approved }) => {
                  setToolState(approved ? 'output-available' : 'output-denied');
                }}
                output="Conversation / Message / PromptInput の3つから始めるのが推奨です。"
                state={toolState}
              />
              {toolState === 'approval-requested' ? null : (
                <>
                  <Message.Content>{ANSWER}</Message.Content>
                  <Source.List>
                    <Source.Item
                      href="https://ordo.k8o.me/ui/ai/chat"
                      title="AI チャット — k8ordo"
                    />
                  </Source.List>
                </>
              )}
            </AssistantRow>

            {messages.map((m) =>
              m.role === 'user' ? (
                <Message.Root from="user" key={m.id}>
                  {m.files.length > 0 && (
                    <Attachment.List>
                      {m.files.map((file) => (
                        <Attachment.Item key={file.url} {...file} />
                      ))}
                    </Attachment.List>
                  )}
                  {m.text !== '' && <Message.Content>{m.text}</Message.Content>}
                </Message.Root>
              ) : (
                <AssistantRow key={m.id} text={m.text}>
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

        <PromptInput.Root accept="image/*,application/pdf" onSubmit={send}>
          <PromptInput.Attachments />
          <PromptInput.Attach />
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

export const ApproveThenAnswer: Story = {
  parameters: { vrt: { skip: true } },
  render: () => <ChatDemo />,
  play: async ({ canvas, userEvent }) => {
    // 承認されるまで、ツールの結果に基づく回答は出さない
    await expect(canvas.queryByRole('list', { name: '出典' })).toBeNull();

    await userEvent.click(canvas.getByRole('button', { name: '許可' }));

    await expect(canvas.getByRole('list', { name: '出典' })).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: '許可' }),
    ).not.toBeInTheDocument();
  },
};
