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

import * as m from '../../../../../messages';

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
  const idRef = useRef(0);
  const [messages, setMessages] = useState<Msg[]>([]);

  const suggestions = [
    m.aiChat.demo.suggestionIme(),
    m.aiChat.demo.suggestionStreaming(),
    m.aiChat.demo.suggestionTool(),
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
        text: m.aiChat.demo.reply(),
      },
    ]);
  };

  return (
    <div className="border-border-mute bg-bg-base flex h-120 w-full flex-col gap-3 rounded-2xl border p-3 shadow-sm">
      <Conversation.Root>
        <Conversation.Messages>
          <AssistantRow>
            <Message.Content>{m.aiChat.demo.greeting()}</Message.Content>
          </AssistantRow>

          <UserRow>{m.aiChat.demo.seedQuestion()}</UserRow>

          <AssistantRow>
            <Reasoning>{m.aiChat.demo.seedReasoning()}</Reasoning>
            <ToolInvocation
              input={{ query: 'k8ordo UI ai getting started' }}
              name="search_docs"
              output={m.aiChat.demo.seedToolOutput()}
              state="output-available"
            />
            <Message.Content>{m.aiChat.demo.seedAnswer()}</Message.Content>
          </AssistantRow>

          {messages.map((entry) =>
            entry.role === 'user' ? (
              <UserRow key={entry.id}>{entry.text}</UserRow>
            ) : (
              <AssistantRow key={entry.id}>
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

      <PromptInput.Root onSubmit={send}>
        <PromptInput.Textarea placeholder={m.aiChat.demo.placeholder()} />
        <PromptInput.Submit />
      </PromptInput.Root>
    </div>
  );
}
