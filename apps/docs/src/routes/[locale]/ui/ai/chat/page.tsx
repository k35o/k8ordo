import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import { ChatDemo } from '../_previews/chat-demo';

export default function AiChat() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">
          <T k="nav.aiChat" />
        </Heading>
        <p className="text-fg-mute text-lg">
          <T k="aiChat.introduction" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="aiChat.demoTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="aiChat.demoDescription" />
        </p>
        <ComponentPreview
          code={`'use client';
import { Avatar, AssistantIcon } from '@k8ordo/ui';
import {
  Conversation,
  Message,
  PromptInput,
  Suggestion,
} from '@k8ordo/ui/ai';

export function Chat({ messages, send }: Props) {
  return (
    <div className="flex h-full flex-col gap-3">
      <Conversation.Root>
        <Conversation.Messages>
          {messages.map((m) => (
            <Message.Root from={m.role} key={m.id}>
              {m.role === 'assistant' && (
                <Avatar color="primary" icon={<AssistantIcon />} name="AI" size="sm" />
              )}
              <Message.Content>{m.text}</Message.Content>
            </Message.Root>
          ))}
        </Conversation.Messages>
        <Conversation.ScrollButton />
      </Conversation.Root>

      <Suggestion.List>
        <Suggestion.Item onSelect={send} value="Tell me about IME support" />
      </Suggestion.List>

      <PromptInput.Root onSubmit={send}>
        <PromptInput.Textarea placeholder="Type a message…" />
        <PromptInput.Submit />
      </PromptInput.Root>
    </div>
  );
}`}
        >
          <ChatDemo />
        </ComponentPreview>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="aiChat.overviewTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="aiChat.overviewDescription" />
        </p>
        <CodeBlock
          code={`'use client';
import { Avatar, AssistantIcon } from '@k8ordo/ui';
import { Conversation, Message, PromptInput } from '@k8ordo/ui/ai';
import { useChat } from '@ai-sdk/react';

export function Chat() {
  const { messages, sendMessage, status, stop } = useChat();

  return (
    <div className="flex h-full flex-col gap-3">
      <Conversation.Root>
        <Conversation.Messages isStreaming={status === 'streaming'}>
          {messages.map((m) => (
            <Message.Root from={m.role === 'user' ? 'user' : 'assistant'} key={m.id}>
              {m.role !== 'user' && (
                <Avatar color="primary" icon={<AssistantIcon />} name="AI" size="sm" />
              )}
              <Message.Content>{textOf(m)}</Message.Content>
            </Message.Root>
          ))}
        </Conversation.Messages>
        <Conversation.ScrollButton />
      </Conversation.Root>

      <PromptInput.Root
        onStop={stop}
        onSubmit={(text) => sendMessage({ text })}
        status={status}
      >
        <PromptInput.Textarea placeholder="Type a message" />
        <PromptInput.Submit />
      </PromptInput.Root>
    </div>
  );
}`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="aiChat.inputTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="aiChat.inputDescription" />
        </p>
        <CodeBlock
          code={`// Enter to send, Shift+Enter for a newline, IME-confirm Enter never submits.
// status: 'ready' | 'submitted' | 'streaming' | 'error' (matches AI SDK).
<PromptInput.Root status={status} onSubmit={send} onStop={stop}>
  <PromptInput.Textarea placeholder="Type a message" />
  <PromptInput.Submit /> {/* send when ready, stop while streaming */}
</PromptInput.Root>`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="aiChat.suggestionTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="aiChat.suggestionDescription" />
        </p>
        <CodeBlock
          code={`import { Suggestion } from '@k8ordo/ui/ai';

<Suggestion.List>
  {suggestions.map((s) => (
    <Suggestion.Item key={s} onSelect={send} value={s} />
  ))}
</Suggestion.List>`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="aiChat.responseTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="aiChat.responseDescription" />
        </p>
        <CodeBlock
          code={`// pnpm add streamdown
import { Response } from '@k8ordo/ui/ai/response';
import 'streamdown/styles.css';

<Message.Content>
  <Response isStreaming={isStreaming}>{markdown}</Response>
</Message.Content>`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="aiChat.toolTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="aiChat.toolDescription" />
        </p>
        <CodeBlock
          code={`import { Reasoning, ToolInvocation } from '@k8ordo/ui/ai';

<Reasoning isStreaming={isThinking}>{reasoningText}</Reasoning>

<ToolInvocation
  name="search_web"
  state="output-available" // 'input-streaming' | 'input-available' | 'output-available' | 'output-error'
  input={{ query: 'k8ordo UI' }}
  output="…"
/>`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="aiChat.aiSdkTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="aiChat.aiSdkDescription" />
        </p>
        <CodeBlock
          code={`import { mapMessageParts } from '@k8ordo/ui/ai-sdk';
import { Reasoning, ToolInvocation } from '@k8ordo/ui/ai';
import { Response } from '@k8ordo/ui/ai/response';

<Message.Content>
  {mapMessageParts(message).map((part, i) => {
    if (part.kind === 'reasoning') return <Reasoning key={i}>{part.text}</Reasoning>;
    if (part.kind === 'tool') return <ToolInvocation key={i} {...part} />;
    return <Response key={i}>{part.text}</Response>;
  })}
</Message.Content>`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="aiChat.jsonRenderTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="aiChat.jsonRenderDescription" />
        </p>
        <CodeBlock
          code={`'use client';
import { Message } from '@k8ordo/ui/ai';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

// An LLM returned a UI spec as a tool result — render it inside the bubble.
<Message.Root from="assistant">
  <Message.Content>
    <JsonRenderUI spec={spec} />
  </Message.Content>
</Message.Root>`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="aiChat.propsDescription" />
        </p>
        {(
          [
            'Conversation.Root',
            'Conversation.Messages',
            'Conversation.ScrollButton',
            'Message.Root',
            'Message.Content',
            'PromptInput.Root',
            'PromptInput.Textarea',
            'PromptInput.Submit',
            'Suggestion.List',
            'Suggestion.Item',
            'Response',
            'Reasoning',
            'ToolInvocation',
          ] as const
        ).map((name) => (
          <div className="flex flex-col gap-4" key={name}>
            <Heading level="h3">{name}</Heading>
            <PropsTable inherits={inheritsOf(name)} items={propsOf(name)} />
          </div>
        ))}
      </section>
    </div>
  );
}
