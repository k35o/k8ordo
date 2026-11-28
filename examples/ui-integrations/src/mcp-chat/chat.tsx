import { useChat } from '@ai-sdk/react';
import { Alert, Avatar, Spinner, Stack, Switch } from '@k8ordo/ui';
import {
  Conversation,
  Message,
  PromptInput,
  ToolInvocation,
} from '@k8ordo/ui/ai';
import { Response } from '@k8ordo/ui/ai/response';
import { BotMessageIcon } from '@k8ordo/ui/icons';
import type { UIMessage } from 'ai';
import { use, useCallback, useEffect, useRef, useState } from 'react';

import { mapMessageParts } from '../ai-sdk/map-parts';
import { McpAppFrame } from './app-frame';

let sandbox: Promise<string | null> | null = null;
const loadSandboxUrl = (): Promise<string | null> => {
  sandbox ??= fetch('/api/mcp-app/sandbox')
    .then(async (response) =>
      response.ok ? ((await response.json()) as { url: string }).url : null,
    )
    .catch(() => null);
  return sandbox;
};

function ChatMessage({
  message,
  sandboxUrl,
  theme,
  onAppMessage,
  onModelContext,
}: {
  message: UIMessage;
  sandboxUrl: string | null;
  theme: 'light' | 'dark';
  onAppMessage: (text: string) => boolean;
  onModelContext: (toolCallId: string, text: string) => void;
}) {
  const isUser = message.role === 'user';

  return (
    <Message.Root
      avatar={
        isUser ? undefined : (
          <Avatar
            color="primary"
            icon={<BotMessageIcon />}
            name="AI"
            size="sm"
          />
        )
      }
      from={isUser ? 'user' : 'assistant'}
    >
      {mapMessageParts(message).map((part, i) => {
        const key = `${message.id}-${String(i)}`;
        if (part.kind === 'text') {
          return (
            <Message.Content key={key}>
              <Response>{part.text}</Response>
            </Message.Content>
          );
        }
        if (part.kind !== 'tool') {
          return null;
        }
        const invocation = (
          <ToolInvocation
            errorText={part.errorText}
            input={part.input}
            key={part.toolCallId}
            name={part.name}
            output={
              part.output === undefined
                ? undefined
                : JSON.stringify(part.output, null, 2)
            }
            state={part.state}
          />
        );
        return sandboxUrl === null ||
          part.part.toolMetadata?.app === undefined ? (
          invocation
        ) : (
          <McpAppFrame
            fallback={<Spinner label="画面を読み込んでいます" />}
            key={part.toolCallId}
            onMessage={onAppMessage}
            onModelContext={(text) => {
              onModelContext(part.toolCallId, text);
            }}
            part={part.part}
            sandboxUrl={sandboxUrl}
            theme={theme}
          />
        );
      })}
    </Message.Root>
  );
}

export function McpChat() {
  const url = use(loadSandboxUrl());
  const chat = useChat();
  const contexts = useRef(new Map<string, string>());
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [isDark]);

  const keepModelContext = useCallback((toolCallId: string, text: string) => {
    contexts.current.set(toolCallId, text);
  }, []);
  // App がモデルに伝えた状態は、会話には残さず、送るたびにそのときの分を添える
  const send = (text: string) => {
    void chat.sendMessage(
      { text },
      { body: { modelContext: [...contexts.current.values()] } },
    );
  };
  const isBusy = chat.status === 'submitted' || chat.status === 'streaming';

  return (
    <Stack gap="md">
      <Switch checked={isDark} label="暗い配色" onChange={setIsDark} />
      {url === null && (
        <Alert
          message="MCP App を描くサンドボックスは dev サーバーが配ります。pnpm dev で起動してください。"
          tone="warning"
        />
      )}
      <div className="border-border-mute bg-bg-base flex h-160 flex-col gap-3 rounded-2xl border p-3">
        <Conversation.Root>
          <Conversation.Messages isStreaming={chat.status === 'streaming'}>
            {chat.messages.map((message) => (
              <ChatMessage
                onAppMessage={(text) => {
                  if (isBusy) {
                    return false;
                  }
                  send(text);
                  return true;
                }}
                key={message.id}
                message={message}
                onModelContext={keepModelContext}
                sandboxUrl={url}
                theme={isDark ? 'dark' : 'light'}
              />
            ))}
          </Conversation.Messages>
          <Conversation.ScrollButton />
        </Conversation.Root>
        {chat.error !== undefined && (
          <Alert message={chat.error.message} tone="error" />
        )}
        <PromptInput.Root
          onStop={() => {
            void chat.stop();
          }}
          onSubmit={send}
          status={chat.status}
        >
          <PromptInput.Textarea placeholder="例: 会員登録のフォームを出して" />
          <PromptInput.Submit />
        </PromptInput.Root>
      </div>
    </Stack>
  );
}
