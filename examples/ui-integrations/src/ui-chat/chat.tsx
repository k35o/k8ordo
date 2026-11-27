import type { ActionPayload } from '@a2ui/web_core';
import { useChat } from '@ai-sdk/react';
import { Alert, Avatar, Spinner, Stack } from '@k8ordo/ui';
import {
  Conversation,
  Message,
  PromptInput,
  ToolInvocation,
} from '@k8ordo/ui/ai';
import { Response } from '@k8ordo/ui/ai/response';
import { BotMessageIcon } from '@k8ordo/ui/icons';
import { DefaultChatTransport } from 'ai';
import { useEffect, useEffectEvent, useState } from 'react';

import { A2uiSurfaceOf } from '../a2ui/renderer';
import { mapMessageParts } from '../ai-sdk/map-parts';
import { createBoard } from './board';
import type { Board } from './board';
import { contextOf, SHOW_UI } from './screens';
import type { ScreenAction, UiChatMessage } from './screens';

const transport = new DefaultChatTransport<UiChatMessage>({
  api: '/api/ui-chat',
});

function ChatMessage({
  message,
  board,
}: {
  message: UiChatMessage;
  board: Board;
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
        switch (part.kind) {
          case 'text':
            return (
              <Message.Content key={key}>
                <Response>{part.text}</Response>
              </Message.Content>
            );
          case 'data':
            return part.name === 'action' ? (
              <Message.Content key={key}>
                {(part.data as ScreenAction).text}
              </Message.Content>
            ) : null;
          case 'tool':
            return part.name === SHOW_UI && part.state !== 'output-error' ? (
              <Stack gap="sm" key={part.toolCallId}>
                <A2uiSurfaceOf
                  processor={board.processor}
                  surfaceId={part.toolCallId}
                />
                {part.state !== 'output-available' && (
                  <Spinner label="画面を作っています" />
                )}
              </Stack>
            ) : (
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
          default:
            return null;
        }
      })}
    </Message.Root>
  );
}

/**
 * The chat whose screens Claude shows with `show_ui` and changes with
 * `update_ui`, drawn in the page. What the user does on a screen goes back as
 * their next message, and what every screen holds goes with each request.
 */
export function UiChat() {
  const chat = useChat<UiChatMessage>({ transport });
  // oxlint-disable-next-line react/hook-use-state -- 会話ごとの A2UI の処理系を最初の描画で 1 度だけ作る。作り直すことは無いので setter を持たない
  const [board] = useState(createBoard);
  const isBusy = chat.status === 'submitted' || chat.status === 'streaming';

  useEffect(() => {
    board.sync(chat.messages);
  }, [board, chat.messages]);

  const send = (message: Parameters<typeof chat.sendMessage>[0]) => {
    void chat.sendMessage(message, {
      body: { modelContext: contextOf(board.dataModels()) },
    });
  };
  // 返事を流している間に押された操作は送らない。続けて送ると、その返事の
  // 途中に割り込む
  const act = useEffectEvent((payload: ActionPayload) => {
    if (!isBusy) {
      send({ parts: [{ type: 'data-action', data: board.actionOf(payload) }] });
    }
  });
  useEffect(() => {
    const subscription = board.processor.model.onAction.subscribe((payload) => {
      act(payload);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [board]);

  return (
    <div className="border-border-mute bg-bg-base flex h-160 flex-col gap-3 rounded-2xl border p-3">
      <Conversation.Root>
        <Conversation.Messages isStreaming={chat.status === 'streaming'}>
          {chat.messages.map((message) => (
            <ChatMessage board={board} key={message.id} message={message} />
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
        onSubmit={(text) => {
          send({ text });
        }}
        status={chat.status}
      >
        <PromptInput.Textarea placeholder="例: 会員登録のフォームを出して" />
        <PromptInput.Submit />
      </PromptInput.Root>
    </div>
  );
}
