import type { ServerResponse } from 'node:http';

import { anthropic } from '@ai-sdk/anthropic';
import {
  APICallError,
  convertToModelMessages,
  LoadAPIKeyError,
  pipeUIMessageStreamToResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
} from 'ai';
import type { DataUIPart, TextPart, ToolSet, UIDataTypes, UIMessage } from 'ai';

export type ChatRequest = {
  messages: UIMessage[];
  /** What the screens in the chat hold now, one text for each. */
  modelContext: string[];
};

export type Refusal = { status: number; message: string };

type Headers = { origin?: string | undefined; host?: string | undefined };

// チャットの口は手元の鍵で有料の API を呼ぶ。ほかのサイトのページから
// 投げられた要求で鍵を使わせないよう、同じオリジンからのものだけ通す
export const refuseOtherOrigins = (headers: Headers): Refusal | null =>
  headers.origin !== undefined &&
  URL.parse(headers.origin)?.host !== headers.host
    ? { status: 403, message: 'Requests from another origin are refused.' }
    : null;

const isStrings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

export const parseChatRequest = (
  headers: Headers,
  body: unknown,
): ChatRequest | Refusal => {
  const refusal = refuseOtherOrigins(headers);
  if (refusal !== null) {
    return refusal;
  }
  if (typeof body !== 'object' || body === null) {
    return { status: 400, message: 'The body must be a JSON object.' };
  }
  const { messages, modelContext = [] } = body as Record<string, unknown>;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { status: 400, message: 'messages must be a non-empty array.' };
  }
  if (!isStrings(modelContext)) {
    return { status: 400, message: 'modelContext must be an array of text.' };
  }
  return { messages: messages as UIMessage[], modelContext };
};

const MODEL = 'claude-opus-5-5';

const messageOf = (error: unknown): string => {
  if (LoadAPIKeyError.isInstance(error)) {
    return 'ANTHROPIC_API_KEY がありません。fnox exec -P anthropic -- pnpm dev で起動してください。';
  }
  if (APICallError.isInstance(error)) {
    return error.statusCode === 401
      ? 'Claude API の認証に失敗しました。fnox exec -P anthropic -- pnpm dev で起動してください。'
      : `Claude API のエラー（${String(error.statusCode)}）: ${error.message}`;
  }
  return error instanceof Error ? error.message : String(error);
};

/**
 * Answers an AI SDK chat with Claude and streams the reply to `response` as
 * UI message chunks. The request's `modelContext` goes into the instructions
 * rather than into the conversation, so only what the screens hold now
 * reaches the model. `convertDataPart` turns the chat's data parts into text
 * for the model; without it, they are left out.
 */
export const answerWithClaude = async ({
  response,
  request: { messages, modelContext },
  instructions,
  tools,
  convertDataPart,
}: {
  response: ServerResponse;
  request: ChatRequest;
  instructions: readonly string[];
  tools: ToolSet;
  convertDataPart?: (part: DataUIPart<UIDataTypes>) => TextPart | undefined;
}): Promise<void> => {
  const result = streamText({
    model: anthropic(MODEL),
    instructions: [
      ...instructions,
      ...(modelContext.length === 0
        ? []
        : [
            '',
            'What the screens in the chat hold now. The user may have changed them since your last answer:',
            ...modelContext,
          ]),
    ].join('\n'),
    messages: await convertToModelMessages(messages, {
      tools,
      convertDataPart,
    }),
    tools,
    stopWhen: stepCountIs(4),
    providerOptions: { anthropic: { effort: 'medium' } },
  });
  await pipeUIMessageStreamToResponse({
    response,
    stream: toUIMessageStream({
      stream: result.stream,
      tools,
      onError: messageOf,
    }),
  });
};
