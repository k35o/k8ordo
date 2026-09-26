import { useChat } from '@ai-sdk/react';
import { AssistantIcon, Avatar } from '@k8ordo/ui';
import {
  Attachment,
  Conversation,
  Message,
  PromptInput,
  Reasoning,
  Source,
  ToolInvocation,
} from '@k8ordo/ui/ai';
import { mapMessageParts } from '@k8ordo/ui/ai-sdk';
import { validateGeneratedSpec } from '@k8ordo/ui/json-render';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai';
import type { UIMessage } from 'ai';

import { scriptedTransport } from './scripted-transport';

type Chat = ReturnType<typeof useChat>;

const stringify = (value: unknown) =>
  typeof value === 'string' ? value : JSON.stringify(value, null, 2);

function ChatMessage({ message, chat }: { message: UIMessage; chat: Chat }) {
  const parts = mapMessageParts(message);
  const files = parts.filter((part) => part.kind === 'file');
  const sources = parts.filter((part) => part.kind === 'source');
  const text = parts
    .map((part) => (part.kind === 'text' ? part.text : ''))
    .join('');
  const isUser = message.role === 'user';
  const isBusy = chat.status === 'submitted' || chat.status === 'streaming';

  return (
    <Message.Root
      avatar={
        isUser ? undefined : (
          <Avatar
            color="primary"
            icon={<AssistantIcon />}
            name="AI"
            size="sm"
          />
        )
      }
      from={isUser ? 'user' : 'assistant'}
    >
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
        const key = `${message.id}-${i.toString()}`;
        if (part.kind === 'text') {
          return <Message.Content key={key}>{part.text}</Message.Content>;
        }
        if (part.kind === 'reasoning') {
          return <Reasoning key={key}>{part.text}</Reasoning>;
        }
        if (part.kind === 'tool') {
          return (
            <ToolInvocation
              approval={part.approval}
              errorText={part.errorText}
              input={part.input}
              key={part.toolCallId}
              name={part.name}
              onApprovalResponse={chat.addToolApprovalResponse}
              output={
                part.output === undefined ? undefined : stringify(part.output)
              }
              state={part.state}
            />
          );
        }
        if (part.kind === 'data' && part.name === 'ui') {
          // data パーツの中身はモデルが作ったもの。描く前に検証する
          const result = validateGeneratedSpec(part.data);
          return result.ok ? (
            <JsonRenderUI key={key} spec={result.spec} />
          ) : null;
        }
        // 添付と出典は、それぞれ 1 つのリストにまとめて上下に置く
        return null;
      })}
      {sources.length > 0 && (
        <Source.List>
          {sources.map((source) => (
            <Source.Item
              href={source.url}
              key={source.id}
              title={source.title}
            />
          ))}
        </Source.List>
      )}
      {!isUser && text !== '' && (
        <Message.Actions>
          <Message.Copy value={text} />
          <Message.Regenerate
            disabled={isBusy}
            onAction={() => chat.regenerate({ messageId: message.id })}
          />
          <Message.Feedback />
        </Message.Actions>
      )}
    </Message.Root>
  );
}

export function AiSdkChatDemo() {
  const chat = useChat({
    transport: scriptedTransport,
    // 許可・拒否の答えがそろったら、続きを取りに行く
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  });

  return (
    <div className="border-border-mute bg-bg-base flex h-160 flex-col gap-3 rounded-2xl border p-3">
      <Conversation.Root>
        <Conversation.Messages isStreaming={chat.status === 'streaming'}>
          {chat.messages.map((message) => (
            <ChatMessage chat={chat} key={message.id} message={message} />
          ))}
        </Conversation.Messages>
        <Conversation.ScrollButton />
      </Conversation.Root>
      <PromptInput.Root
        accept="image/*,application/pdf"
        onStop={() => {
          void chat.stop();
        }}
        onSubmit={(text, files) => {
          // 添付だけのときに text: '' を渡すと、空のテキストパートがモデルまで届く
          void chat.sendMessage(text === '' ? { files } : { text, files });
        }}
        status={chat.status}
      >
        <PromptInput.Attachments />
        <PromptInput.Attach />
        <PromptInput.Textarea placeholder="k8ordo UI について聞く" />
        <PromptInput.Submit />
      </PromptInput.Root>
    </div>
  );
}
