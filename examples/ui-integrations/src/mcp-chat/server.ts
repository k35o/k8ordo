import type { IncomingMessage, ServerResponse } from 'node:http';

import { anthropic } from '@ai-sdk/anthropic';
import {
  createMCPClient,
  mcpAppClientCapabilities,
  readMCPAppResource,
  splitMCPAppTools,
} from '@ai-sdk/mcp';
import type { MCPClient } from '@ai-sdk/mcp';
import {
  APICallError,
  convertToModelMessages,
  LoadAPIKeyError,
  pipeUIMessageStreamToResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
} from 'ai';

import { readJson } from '../read-json';
import { parseChatRequest, parseResourceRequest } from './request';

const MODEL = 'claude-opus-5-5';

const instructionsOf = (modelContext: readonly string[]): string =>
  [
    'You are the assistant of a chat that can show the user screens built with @k8ordo/ui. Answer in the language the user writes in.',
    'When a screen helps the user more than prose, such as a form to fill in, a table to compare, or a choice to make, call show_ui instead of describing the screen. Keep the prose around a screen short.',
    'A user message that begins with "The user acted on the screen." reports what the user did on a screen you showed: the event, its context, and the state of the screen.',
    'What the user enters on a screen also reaches you with their next message, so a screen needs a button only for the user to act, not for you to read a field.',
    ...(modelContext.length === 0
      ? []
      : [
          '',
          'What the screens in the chat hold now. The user may have changed them since your last answer:',
          ...modelContext,
        ]),
  ].join('\n');

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

// MCP サーバーは同じ dev サーバーの /mcp にいる。別のホストのサーバーを
// つなぐときと同じく、HTTP でつなぐ
const connect = (request: IncomingMessage): Promise<MCPClient> =>
  createMCPClient({
    transport: {
      type: 'http',
      url: `http://${request.headers.host ?? 'localhost'}/mcp`,
    },
    capabilities: mcpAppClientCapabilities,
  });

/**
 * `POST /api/chat` on the dev server: answers an AI SDK chat with Claude,
 * which can call the tools of the MCP server at `/mcp`. A tool part of a tool
 * with an App carries it in `toolMetadata.app`, for `MCPAppRenderer`.
 */
export const handleChat = async (
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> => {
  const parsed = parseChatRequest(request.headers, await readJson(request));
  if ('status' in parsed) {
    response.statusCode = parsed.status;
    response.end(parsed.message);
    return;
  }

  const client = await connect(request);
  try {
    const { modelVisible } = splitMCPAppTools(await client.listTools());
    const tools = client.toolsFromDefinitions(modelVisible);
    const result = streamText({
      model: anthropic(MODEL),
      instructions: instructionsOf(parsed.modelContext),
      messages: await convertToModelMessages(parsed.messages),
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
  } finally {
    await client.close();
  }
};

export const handleResource = async (
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> => {
  const parsed = parseResourceRequest(request.headers, await readJson(request));
  if ('status' in parsed) {
    response.statusCode = parsed.status;
    response.end(parsed.message);
    return;
  }

  const client = await connect(request);
  try {
    const resource = await readMCPAppResource({ client, uri: parsed.uri });
    response.setHeader('content-type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(resource));
  } finally {
    await client.close();
  }
};
