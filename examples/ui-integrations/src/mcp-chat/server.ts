import type { IncomingMessage, ServerResponse } from 'node:http';

import {
  createMCPClient,
  mcpAppClientCapabilities,
  readMCPAppResource,
  splitMCPAppTools,
} from '@ai-sdk/mcp';
import type { MCPClient } from '@ai-sdk/mcp';

import { answerWithClaude, parseChatRequest } from '../ai-sdk/endpoint';
import { readJson } from '../read-json';
import { parseResourceRequest } from './request';

const INSTRUCTIONS = [
  'You are the assistant of a chat that can show the user screens built with @k8ordo/ui. Answer in the language the user writes in.',
  'When a screen helps the user more than prose, such as a form to fill in, a table to compare, or a choice to make, call show_ui instead of describing the screen. Keep the prose around a screen short.',
  'A user message that begins with "The user acted on the screen." reports what the user did on a screen you showed: the event, its context, and the state of the screen.',
  'What the user enters on a screen also reaches you with their next message, so a screen needs a button only for the user to act, not for you to read a field.',
];

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
    await answerWithClaude({
      response,
      request: parsed,
      instructions: INSTRUCTIONS,
      tools: client.toolsFromDefinitions(modelVisible),
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
