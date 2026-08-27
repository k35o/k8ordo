'use client';

import { Avatar, AssistantIcon } from '@k8ordo/ui';
import {
  Conversation,
  Message,
  PromptInput,
  Reasoning,
  Suggestion,
  ToolInvocation,
} from '@k8ordo/ui/ai';
import { useRef, useState } from 'react';
import type { FC, ReactNode } from 'react';

import { useTranslation } from '../../../i18n';

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

export function ChatDemo() {
  const { t } = useTranslation();
  const idRef = useRef(0);
  const [messages, setMessages] = useState<Msg[]>([]);

  const suggestions = [
    t('aiChat.demo.suggestionIme'),
    t('aiChat.demo.suggestionStreaming'),
    t('aiChat.demo.suggestionTool'),
  ];

  const send = (text: string) => {
    const uid = (idRef.current += 1);
    const aid = (idRef.current += 1);
    setMessages((prev) => [
      ...prev,
      { id: `u${uid.toString()}`, role: 'user', text },
      {
        id: `a${aid.toString()}`,
        role: 'assistant',
        text: t('aiChat.demo.reply'),
      },
    ]);
  };

  return (
    <div className="border-border-mute bg-bg-base flex h-120 w-full flex-col gap-3 rounded-2xl border p-3 shadow-sm">
      <Conversation.Root>
        <Conversation.Messages>
          <AssistantRow>
            <Message.Content>{t('aiChat.demo.greeting')}</Message.Content>
          </AssistantRow>

          <UserRow>{t('aiChat.demo.seedQuestion')}</UserRow>

          <AssistantRow>
            <Reasoning>{t('aiChat.demo.seedReasoning')}</Reasoning>
            <ToolInvocation
              input={{ query: 'k8ordo UI ai getting started' }}
              name="search_docs"
              output={t('aiChat.demo.seedToolOutput')}
              state="output-available"
            />
            <Message.Content>{t('aiChat.demo.seedAnswer')}</Message.Content>
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
        <PromptInput.Textarea placeholder={t('aiChat.demo.placeholder')} />
        <PromptInput.Submit />
      </PromptInput.Root>
    </div>
  );
}
