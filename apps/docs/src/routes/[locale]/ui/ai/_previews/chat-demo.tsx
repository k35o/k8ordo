'use client';

import { Avatar, AssistantIcon } from '@k8ordo/ui';
import {
  Attachment,
  Conversation,
  Message,
  PromptInput,
  Reasoning,
  Source,
  Suggestion,
  ToolInvocation,
} from '@k8ordo/ui/ai';
import type { ToolState } from '@k8ordo/ui/ai';
import { useRef, useState } from 'react';
import type { FC, ReactNode } from 'react';

import * as m from '../../../../../messages';

const AssistantRow: FC<{ answer?: string; children: ReactNode }> = ({
  answer,
  children,
}) => (
  <Message.Root
    avatar={
      <Avatar color="primary" icon={<AssistantIcon />} name="AI" size="sm" />
    }
    from="assistant"
  >
    {children}
    {answer !== undefined && (
      <Message.Actions>
        <Message.Copy value={answer} />
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

export function ChatDemo() {
  const idRef = useRef(0);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [toolState, setToolState] = useState<ToolState>('approval-requested');

  const suggestions = [
    m.aiChat.demo.suggestionIme(),
    m.aiChat.demo.suggestionStreaming(),
    m.aiChat.demo.suggestionTool(),
  ];
  const seedAnswer = m.aiChat.demo.seedAnswer();
  const isAnswered = toolState !== 'approval-requested';

  const send = (text: string, files?: FileList) => {
    const uid = (idRef.current += 1);
    const aid = (idRef.current += 1);
    const sent = Array.from(files ?? [], (file) => ({
      // デモなので revoke しない。実際のアプリでは AI SDK が data URL にする
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
        text: m.aiChat.demo.reply(),
        files: [],
      },
    ]);
  };

  return (
    <div className="border-border-mute bg-bg-base flex h-140 w-full flex-col gap-3 rounded-2xl border p-3 shadow-sm">
      <Conversation.Root>
        <Conversation.Messages>
          <AssistantRow>
            <Message.Content>{m.aiChat.demo.greeting()}</Message.Content>
          </AssistantRow>

          <Message.Root from="user">
            <Message.Content>{m.aiChat.demo.seedQuestion()}</Message.Content>
          </Message.Root>

          <AssistantRow answer={isAnswered ? seedAnswer : undefined}>
            <Reasoning>{m.aiChat.demo.seedReasoning()}</Reasoning>
            <ToolInvocation
              approval={{
                id: 'search-docs',
                requestReason: m.aiChat.demo.seedApprovalReason(),
              }}
              input={{ query: 'k8ordo UI ai getting started' }}
              name="search_docs"
              onApprovalResponse={({ approved }) => {
                setToolState(approved ? 'output-available' : 'output-denied');
              }}
              output={m.aiChat.demo.seedToolOutput()}
              state={toolState}
            />
            {isAnswered && (
              <>
                <Message.Content>{seedAnswer}</Message.Content>
                {toolState === 'output-available' && (
                  <Source.List>
                    <Source.Item
                      href="https://ordo.k8o.me/ui/ai/chat"
                      title={m.aiChat.demo.seedSourceTitle()}
                    />
                  </Source.List>
                )}
              </>
            )}
          </AssistantRow>

          {messages.map((entry) =>
            entry.role === 'user' ? (
              <Message.Root from="user" key={entry.id}>
                {entry.files.length > 0 && (
                  <Attachment.List>
                    {entry.files.map((file) => (
                      <Attachment.Item key={file.url} {...file} />
                    ))}
                  </Attachment.List>
                )}
                {entry.text !== '' && (
                  <Message.Content>{entry.text}</Message.Content>
                )}
              </Message.Root>
            ) : (
              <AssistantRow answer={entry.text} key={entry.id}>
                <Message.Content>{entry.text}</Message.Content>
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
        <PromptInput.Textarea placeholder={m.aiChat.demo.placeholder()} />
        <PromptInput.Submit />
      </PromptInput.Root>
    </div>
  );
}
