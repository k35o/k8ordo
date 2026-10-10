import { Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../../components/callout';
import { ComponentPreview } from '../../../../../components/component-preview';
import {
  InstallCommand,
  peerVersionOf,
} from '../../../../../components/install';
import { LocaleAnchor } from '../../../../../components/locale-anchor';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import { ChatDemo } from '../../../../../demos/ui/ai/chat-demo';
import * as m from '../../../../../messages';

const t = m.aiChat;

const DEMO = `'use client';
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
}`;

const SKELETON = `'use client';
import { Avatar, AssistantIcon } from '@k8ordo/ui';
import { Conversation, Message, PromptInput } from '@k8ordo/ui/ai';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';

const textOf = (m: UIMessage) =>
  m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('');

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
                  <Avatar
                    color="primary"
                    icon={<AssistantIcon />}
                    name="AI"
                    size="sm"
                  />
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
}`;

const INPUT = `<PromptInput.Root status={status} onSubmit={send} onStop={stop}>
  <PromptInput.Textarea placeholder="Type a message" />
  <PromptInput.Submit />
</PromptInput.Root>`;

const ATTACHMENTS = `<PromptInput.Root
  accept="image/*,application/pdf"
  maxFiles={4}
  onSubmit={(text, files) =>
    sendMessage(text === '' ? { files } : { text, files })
  }
  status={status}
>
  <PromptInput.Attachments />
  <PromptInput.Attach />
  <PromptInput.Textarea placeholder="Type a message" />
  <PromptInput.Submit />
</PromptInput.Root>`;

const SUGGESTION = `import { Suggestion } from '@k8ordo/ui/ai';

<Suggestion.List>
  {suggestions.map((s) => (
    <Suggestion.Item key={s} onSelect={send} value={s} />
  ))}
</Suggestion.List>`;

const RESPONSE = `import { Response } from '@k8ordo/ui/ai/response';
import 'streamdown/styles.css';

<Message.Content>
  <Response isStreaming={isStreaming}>{markdown}</Response>
</Message.Content>`;

const TOOL = `import { Reasoning, ToolInvocation } from '@k8ordo/ui/ai';

<Reasoning isStreaming={isThinking}>{reasoningText}</Reasoning>

<ToolInvocation
  name="search_web"
  state="output-available"
  input={{ query: 'k8ordo UI' }}
  output="…"
/>`;

const APPROVAL = `import { useChat } from '@ai-sdk/react';
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
/>`;

const PARTS = `import { Attachment, Source } from '@k8ordo/ui/ai';

<Message.Root from="user">
  <Attachment.List>
    <Attachment.Item filename="diagram.png" mediaType="image/png" url={url} />
  </Attachment.List>
  <Message.Content>{text}</Message.Content>
</Message.Root>

<Source.List>
  <Source.Item href="https://ordo.k8o.me/ui/ai/chat" title="AI chat" />
  <Source.Item title="Internal design doc" />
</Source.List>`;

const ACTIONS = `<Message.Root avatar={avatar} from="assistant">
  <Message.Content>{text}</Message.Content>
  <Message.Actions>
    <Message.Copy value={text} />
    <Message.Regenerate onAction={() => regenerate({ messageId: message.id })} />
    <Message.Feedback onChange={(value) => saveFeedback(message.id, value)} />
  </Message.Actions>
</Message.Root>`;

const AI_SDK = `import { mapMessageParts } from '@k8ordo/ui/ai-sdk';
import { Attachment, Reasoning, Source, ToolInvocation } from '@k8ordo/ui/ai';
import { Response } from '@k8ordo/ui/ai/response';
import { validateGeneratedSpec } from '@k8ordo/ui/json-render';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

const parts = mapMessageParts(message);
const files = parts.filter((part) => part.kind === 'file');
const sources = parts.filter((part) => part.kind === 'source');

<Message.Root from="assistant">
  {files.length > 0 && (
    <Attachment.List>
      {files.map((file) => (
        <Attachment.Item
          filename={file.filename}
          key={file.url}
          mediaType={file.mediaType}
          url={file.url}
        />
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
          output={
            part.output === undefined
              ? undefined
              : JSON.stringify(part.output, null, 2)
          }
          errorText={part.errorText}
          approval={part.approval}
          onApprovalResponse={addToolApprovalResponse}
        />
      );
    }
    if (part.kind === 'data' && part.name === 'ui') {
      const result = validateGeneratedSpec(part.data);
      return result.ok ? <JsonRenderUI key={i} spec={result.spec} /> : null;
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
</Message.Root>`;

const JSON_RENDER = `'use client';
import { Message } from '@k8ordo/ui/ai';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

<Message.Root from="assistant">
  <Message.Content>
    <JsonRenderUI spec={spec} />
  </Message.Content>
</Message.Root>`;

export default function AiChat() {
  return (
    <div className="flex flex-col gap-8 py-12">
      <PageTitle title={m.nav.aiChat} />
      <div className="flex flex-col gap-4">
        <Heading level="h1">
          <Rich>{m.nav.aiChat()}</Rich>
        </Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{t.introduction()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.demoTitle()}</Rich>
        </Heading>
        <ComponentPreview code={DEMO}>
          <ChatDemo />
        </ComponentPreview>
        <p className="text-fg-mute">
          <Rich>{t.demoDescription()}</Rich>
        </p>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.overviewTitle()}</Rich>
        </Heading>
        <CodeBlock
          code={SKELETON}
          lang="tsx"
          marks={{ 15: 'highlight', 18: 'highlight', 39: 'highlight' }}
        />
        <p className="text-fg-mute">
          <Rich>{t.overviewConversation()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.overviewMessage()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.overviewInput()}</Rich>
        </p>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.inputTitle()}</Rich>
        </Heading>
        <CodeBlock code={INPUT} lang="tsx" />
        <p className="text-fg-mute">
          <Rich>{t.inputKeys()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.inputStatus()}</Rich>
        </p>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.attachmentsTitle()}</Rich>
        </Heading>
        <CodeBlock
          code={ATTACHMENTS}
          lang="tsx"
          marks={{ 2: 'highlight', 4: 'highlight', 5: 'highlight' }}
        />
        <p className="text-fg-mute">
          <Rich>{t.attachmentsAccept()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.attachmentsList()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.attachmentsSubmit()}</Rich>
        </p>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.suggestionTitle()}</Rich>
        </Heading>
        <CodeBlock code={SUGGESTION} lang="tsx" />
        <p className="text-fg-mute">
          <Rich>{t.suggestionDescription()}</Rich>
        </p>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.responseTitle()}</Rich>
        </Heading>
        <CodeBlock code={RESPONSE} lang="tsx" />
        <p className="text-fg-mute">
          <Rich>{t.responseDescription()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>
            {t.responseInstall(peerVersionOf('@k8ordo/ui', 'streamdown'))}
          </Rich>
        </p>
        <InstallCommand packages="streamdown" />
        <Note>
          <p>
            <Rich>{t.responseTailwind()}</Rich>
          </p>
        </Note>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.toolTitle()}</Rich>
        </Heading>
        <CodeBlock code={TOOL} lang="tsx" />
        <p className="text-fg-mute">
          <Rich>{t.toolInvocation()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.toolIo()}</Rich>
        </p>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.approvalTitle()}</Rich>
        </Heading>
        <CodeBlock
          code={APPROVAL}
          lang="tsx"
          marks={{ 5: 'highlight', 12: 'highlight', 13: 'highlight' }}
        />
        <p className="text-fg-mute">
          <Rich>{t.approvalButtons()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.approvalSdk()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.approvalCases()}</Rich>
        </p>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.partsTitle()}</Rich>
        </Heading>
        <CodeBlock code={PARTS} lang="tsx" />
        <p className="text-fg-mute">
          <Rich>{t.partsAttachment()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.partsSource()}</Rich>
        </p>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.actionsTitle()}</Rich>
        </Heading>
        <CodeBlock code={ACTIONS} lang="tsx" />
        <p className="text-fg-mute">
          <Rich>{t.actionsRow()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.actionsBehavior()}</Rich>
        </p>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.aiSdkTitle()}</Rich>
        </Heading>
        <CodeBlock
          code={AI_SDK}
          lang="tsx"
          marks={{ 7: 'highlight', 8: 'highlight', 9: 'highlight' }}
        />
        <p className="text-fg-mute">
          <Rich>{t.aiSdkMap()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.aiSdkRender()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.aiSdkVersion(peerVersionOf('@k8ordo/ui', 'ai'))}</Rich>
        </p>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{t.jsonRenderTitle()}</Rich>
        </Heading>
        <CodeBlock code={JSON_RENDER} lang="tsx" />
        <p className="text-fg-mute">
          <Rich>{t.jsonRenderDescription()}</Rich>
        </p>
        <p className="text-fg-mute">
          <Rich>{t.jsonRenderAdapter()}</Rich>
          <LocaleAnchor path="/:locale/ui/ai/generative-ui">
            Generative UI
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{t.propsDescription()}</Rich>
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
