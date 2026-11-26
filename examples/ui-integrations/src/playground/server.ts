import type { IncomingMessage, ServerResponse } from 'node:http';

import Anthropic from '@anthropic-ai/sdk';
import { catalogRules } from '@k8ordo/ui/catalog';

import { prompt as a2uiPrompt } from '../a2ui/prompt';
import { catalog as jsonRenderCatalog } from '../json-render/catalog';
import { prompt as openuiPrompt } from '../openui/prompt';
import { parseGenerateRequest } from './request';
import type { Format, GenerateEvent } from './request';

const MODEL = 'claude-opus-5-5';

const systemPromptOf = (format: Format): string => {
  switch (format) {
    case 'a2ui':
      return a2uiPrompt();
    case 'json-render':
      return jsonRenderCatalog.prompt({ customRules: [...catalogRules] });
    case 'openui':
      return openuiPrompt({ additionalRules: [...catalogRules] });
  }
};

const readJson = async (request: IncomingMessage): Promise<unknown> => {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(chunk as Buffer);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return undefined;
  }
};

const messageOf = (error: unknown): string => {
  if (error instanceof Anthropic.AuthenticationError) {
    return 'Claude API の認証に失敗しました。fnox exec -P anthropic -- pnpm dev で起動してください。';
  }
  if (error instanceof Anthropic.RateLimitError) {
    return 'Claude API の流量制限に当たりました。少し待ってからやり直してください。';
  }
  if (error instanceof Anthropic.APIError) {
    return `Claude API のエラー（${String(error.status)}）: ${error.message}`;
  }
  if (error instanceof Anthropic.AnthropicError) {
    return `${error.message} fnox exec -P anthropic -- pnpm dev で起動してください。`;
  }
  return String(error);
};

/**
 * `POST /api/generate` on the dev server: streams Claude's answer for the
 * format asked for as NDJSON `GenerateEvent`s. The key is read the way the
 * Anthropic SDK reads it (`ANTHROPIC_API_KEY`, or an `ant auth login` profile).
 */
export const handleGenerate = async (
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> => {
  const parsed = parseGenerateRequest(request.headers, await readJson(request));
  if ('status' in parsed) {
    response.statusCode = parsed.status;
    response.end(parsed.message);
    return;
  }

  response.setHeader('content-type', 'application/x-ndjson; charset=utf-8');
  const send = (event: GenerateEvent): void => {
    response.write(`${JSON.stringify(event)}\n`);
  };

  try {
    const stream = new Anthropic().beta.messages.stream({
      model: MODEL,
      max_tokens: 64_000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'medium' },
      system: [
        {
          type: 'text',
          text: systemPromptOf(parsed.format),
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: parsed.prompt }],
    });
    for await (const event of stream) {
      if (
        event.type === 'content_block_start' &&
        event.content_block.type === 'fallback'
      ) {
        send({ type: 'restart', model: event.content_block.to.model });
      } else if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        send({ type: 'text', text: event.delta.text });
      }
    }
    const message = await stream.finalMessage();
    if (message.stop_reason === 'refusal') {
      send({
        type: 'error',
        message: `Claude が生成を断りました。${message.stop_details?.explanation ?? ''}`,
      });
    } else if (message.stop_reason === 'max_tokens') {
      send({
        type: 'error',
        message: '出力が max_tokens に達して途中で切れました。',
      });
    } else {
      send({ type: 'done' });
    }
  } catch (error) {
    send({ type: 'error', message: messageOf(error) });
  }
  response.end();
};
