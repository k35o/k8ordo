import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import { ChatDemo } from '../_previews/chat-demo';

export default function AiChat() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle title={m.nav.aiChat} />
      <div className="flex flex-col gap-4">
        <Heading level="h1">
          <Rich>{m.nav.aiChat()}</Rich>
        </Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.aiChat.introduction()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.aiChat.demoTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiChat.demoDescription()}</Rich>
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

const avatar = (
  <Avatar color="primary" icon={<AssistantIcon />} name="AI" size="sm" />
);

export function Chat({ messages, send }: Props) {
  return (
    <div className="flex h-full flex-col gap-3">
      <Conversation.Root>
        <Conversation.Messages>
          {messages.map((m) => (
            <Message.Root
              avatar={m.role === 'assistant' ? avatar : undefined}
              from={m.role}
              key={m.id}
            >
              <Message.Content>{m.text}</Message.Content>
              {m.role === 'assistant' && (
                <Message.Actions>
                  <Message.Copy value={m.text} />
                  <Message.Feedback />
                </Message.Actions>
              )}
            </Message.Root>
          ))}
        </Conversation.Messages>
        <Conversation.ScrollButton />
      </Conversation.Root>

      <Suggestion.List>
        <Suggestion.Item onSelect={send} value="Tell me about IME support" />
      </Suggestion.List>

      <PromptInput.Root accept="image/*,application/pdf" onSubmit={send}>
        <PromptInput.Attachments />
        <PromptInput.Attach />
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
          <Rich>{m.aiChat.overviewTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiChat.overviewDescription()}</Rich>
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
            <Message.Root
              avatar={
                m.role === 'user' ? undefined : (
                  <Avatar color="primary" icon={<AssistantIcon />} name="AI" size="sm" />
                )
              }
              from={m.role === 'user' ? 'user' : 'assistant'}
              key={m.id}
            >
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
          <Rich>{m.aiChat.inputTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiChat.inputDescription()}</Rich>
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
          <Rich>{m.aiChat.attachmentsTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiChat.attachmentsDescription()}</Rich>
        </p>
        <CodeBlock
          code={`<PromptInput.Root
  accept="image/*,application/pdf"
  onSubmit={(text, files) =>
    sendMessage(text === '' ? { files } : { text, files })
  }
  status={status}
>
  <PromptInput.Attachments />
  <PromptInput.Attach />
  <PromptInput.Textarea placeholder="Type a message" />
  <PromptInput.Submit />
</PromptInput.Root>`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.aiChat.suggestionTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiChat.suggestionDescription()}</Rich>
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
          <Rich>{m.aiChat.responseTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiChat.responseDescription()}</Rich>
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
          <Rich>{m.aiChat.toolTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiChat.toolDescription()}</Rich>
        </p>
        <CodeBlock
          code={`import { Reasoning, ToolInvocation } from '@k8ordo/ui/ai';

<Reasoning isStreaming={isThinking}>{reasoningText}</Reasoning>

<ToolInvocation
  name="search_web"
  // 'input-streaming' | 'input-available' | 'approval-requested' | 'approval-responded'
  // | 'output-available' | 'output-error' | 'output-denied'
  state="output-available"
  input={{ query: 'k8ordo UI' }}
  output="…"
/>`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.aiChat.approvalTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiChat.approvalDescription()}</Rich>
        </p>
        <CodeBlock
          code={`import { useChat } from '@ai-sdk/react';
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai';

const { addToolApprovalResponse } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
});

<ToolInvocation
  name={part.name}
  state={part.state}
  input={part.input}
  approval={part.approval}
  onApprovalResponse={addToolApprovalResponse}
/>`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.aiChat.partsTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiChat.partsDescription()}</Rich>
        </p>
        <CodeBlock
          code={`import { Attachment, Source } from '@k8ordo/ui/ai';

<Message.Root from="user">
  <Attachment.List>
    <Attachment.Item filename="diagram.png" mediaType="image/png" url={url} />
  </Attachment.List>
  <Message.Content>{text}</Message.Content>
</Message.Root>

<Source.List>
  <Source.Item href="https://ordo.k8o.me/ui/ai/chat" title="AI chat" />
  <Source.Item title="Internal design doc" />
</Source.List>`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.aiChat.actionsTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiChat.actionsDescription()}</Rich>
        </p>
        <CodeBlock
          code={`<Message.Root avatar={avatar} from="assistant">
  <Message.Content>{text}</Message.Content>
  <Message.Actions>
    <Message.Copy value={text} />
    <Message.Regenerate onAction={() => regenerate({ messageId: message.id })} />
    <Message.Feedback onChange={(value) => saveFeedback(message.id, value)} />
  </Message.Actions>
</Message.Root>`}
          lang="tsx"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.aiChat.aiSdkTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiChat.aiSdkDescription()}</Rich>
        </p>
        <CodeBlock
          code={`import { mapMessageParts } from '@k8ordo/ui/ai-sdk';
import { Attachment, Reasoning, Source, ToolInvocation } from '@k8ordo/ui/ai';
import { Response } from '@k8ordo/ui/ai/response';

const parts = mapMessageParts(message);
const files = parts.filter((part) => part.kind === 'file');
const sources = parts.filter((part) => part.kind === 'source');

<Message.Root from="assistant">
  {files.length > 0 && (
    <Attachment.List>
      {files.map((file) => (
        <Attachment.Item key={file.url} {...file} />
      ))}
    </Attachment.List>
  )}
  {parts.map((part, i) => {
    if (part.kind === 'text') {
      return (
        <Message.Content key={i}>
          <Response>{part.text}</Response>
        </Message.Content>
      );
    }
    if (part.kind === 'reasoning') return <Reasoning key={i}>{part.text}</Reasoning>;
    if (part.kind === 'tool') {
      return (
        <ToolInvocation
          key={part.toolCallId}
          name={part.name}
          state={part.state}
          input={part.input}
          output={JSON.stringify(part.output, null, 2)}
          errorText={part.errorText}
          approval={part.approval}
          onApprovalResponse={addToolApprovalResponse}
        />
      );
    }
    return null;
  })}
  {sources.length > 0 && (
    <Source.List>
      {sources.map((source) => (
        <Source.Item href={source.url} key={source.id} title={source.title} />
      ))}
    </Source.List>
  )}
</Message.Root>`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.aiChat.jsonRenderTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiChat.jsonRenderDescription()}</Rich>
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
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiChat.propsDescription()}</Rich>
        </p>
        {(
          [
            'Conversation.Root',
            'Conversation.Messages',
            'Conversation.ScrollButton',
            'Message.Root',
            'Message.Content',
            'Message.Actions',
            'Message.Action',
            'Message.Copy',
            'Message.Regenerate',
            'Message.Feedback',
            'PromptInput.Root',
            'PromptInput.Attachments',
            'PromptInput.Attach',
            'PromptInput.Textarea',
            'PromptInput.Submit',
            'Suggestion.List',
            'Suggestion.Item',
            'Response',
            'Reasoning',
            'ToolInvocation',
            'Attachment.List',
            'Attachment.Item',
            'Source.List',
            'Source.Item',
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
