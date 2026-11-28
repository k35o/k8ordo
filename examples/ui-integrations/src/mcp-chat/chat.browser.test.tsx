import { ToastProvider } from '@k8ordo/ui';
import { createUIMessageStreamResponse, simulateReadableStream } from 'ai';
import type { UIMessage, UIMessageChunk } from 'ai';
import { Suspense } from 'react';
import { afterEach, expect, it, vi } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { McpChat } from './chat';

import '../styles.css';

// チャットが返事を流している間、ホストは ui/message を断る。ツールの結果が
// 届く頃はまだ流れていることがあるので、断られたら少し待って送り直す
const FAKE_APP = `<!doctype html>
<html><head></head><body><p>偽の App</p><script>
  const post = (message) => window.parent.postMessage(message, '*');
  const sent = new Map();
  const send = (message) => { sent.set(message.id, message); post({ jsonrpc: '2.0', ...message }); };
  window.addEventListener('message', ({ data }) => {
    if (data.id === 0 && data.result !== undefined) {
      post({ jsonrpc: '2.0', method: 'ui/notifications/initialized', params: {} });
    } else if (data.method === 'ui/notifications/tool-input') {
      for (const message of data.params.arguments.send) send(message);
    } else if (data.result?.isError === true && sent.has(data.id)) {
      setTimeout(() => send(sent.get(data.id)), 50);
    }
  });
  post({ jsonrpc: '2.0', id: 0, method: 'ui/initialize', params: {
    appInfo: { name: 'fake', version: '1.0.0' }, appCapabilities: {}, protocolVersion: '2026-01-26' } });
</script></body></html>`;

const APP = {
  resourceUri: 'ui://test/app.html',
  mimeType: 'text/html;profile=mcp-app',
};

const showScreen = (send: unknown[]): UIMessageChunk[] => [
  { type: 'start' },
  { type: 'start-step' },
  {
    type: 'tool-input-available',
    toolCallId: 'call-1',
    toolName: 'show_ui',
    dynamic: true,
    input: { send },
    toolMetadata: { app: APP },
  },
  {
    type: 'tool-output-available',
    toolCallId: 'call-1',
    dynamic: true,
    output: { content: [{ type: 'text', text: 'shown' }] },
  },
  { type: 'finish-step' },
  { type: 'finish' },
];

const answer = (text: string): UIMessageChunk[] => [
  { type: 'start' },
  { type: 'start-step' },
  { type: 'text-start', id: 'answer' },
  { type: 'text-delta', id: 'answer', delta: text },
  { type: 'text-end', id: 'answer' },
  { type: 'finish-step' },
  { type: 'finish' },
];

type ChatBody = { messages: UIMessage[]; modelContext: string[] };

const serve = (replies: UIMessageChunk[][]) => {
  const bodies: ChatBody[] = [];
  const original = window.fetch.bind(window);
  vi.spyOn(window, 'fetch').mockImplementation(async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    if (url.endsWith('/api/chat')) {
      bodies.push(JSON.parse(init?.body as string) as ChatBody);
      return createUIMessageStreamResponse({
        stream: simulateReadableStream({
          chunks: replies[bodies.length - 1] ?? answer('おしまい'),
        }),
      });
    }
    if (url.endsWith('/api/mcp-app/resource')) {
      return Response.json({ ...APP, uri: APP.resourceUri, html: FAKE_APP });
    }
    return original(input, init);
  });
  return bodies;
};

const mount = async () => {
  const screen = await render(
    <ToastProvider>
      <Suspense>
        <McpChat />
      </Suspense>
    </ToastProvider>,
  );
  await screen
    .getByPlaceholder('例: 会員登録のフォームを出して')
    .fill('フォームを出して');
  await screen.getByRole('button', { name: /送信|Send/ }).click();
  return screen;
};

afterEach(() => {
  vi.restoreAllMocks();
});

it('App が送った操作を次の発言にし、App がモデルに伝えた状態を添えて送る', async () => {
  const bodies = serve([
    showScreen([
      {
        id: 1,
        method: 'ui/update-model-context',
        params: {
          content: [
            {
              type: 'text',
              text: 'State of the screen now: {"nickname":"ordo"}',
            },
          ],
        },
      },
      {
        id: 2,
        method: 'ui/message',
        params: {
          role: 'user',
          content: [{ type: 'text', text: 'The user acted on the screen.' }],
        },
      },
    ]),
    answer('保存しました。'),
  ]);

  const screen = await mount();

  await expect.element(screen.getByText('保存しました。')).toBeInTheDocument();
  expect(bodies).toHaveLength(2);
  expect(bodies[1]?.messages.at(-1)).toMatchObject({
    role: 'user',
    parts: [{ type: 'text', text: 'The user acted on the screen.' }],
  });
  expect(bodies[1]?.modelContext).toStrictEqual([
    'State of the screen now: {"nickname":"ordo"}',
  ]);
});

it('App は別のオリジンのサンドボックスの中で動く', async () => {
  serve([showScreen([])]);

  const screen = await mount();

  const frame = screen.getByTitle('MCP App');
  await expect.element(frame).toBeInTheDocument();
  const sandbox = new URL((frame.element() as HTMLIFrameElement).src);
  expect(sandbox.origin).not.toBe(window.location.origin);
});

it('App の高さに合わせ、頼まれたら全画面に広げる', async () => {
  serve([
    showScreen([
      { method: 'ui/notifications/size-changed', params: { height: 321 } },
      {
        id: 1,
        method: 'ui/request-display-mode',
        params: { mode: 'fullscreen' },
      },
    ]),
  ]);

  const screen = await mount();

  const frame = screen.getByTitle('MCP App');
  await expect
    .poll(
      () =>
        (frame.element() as HTMLIFrameElement).getBoundingClientRect().height,
    )
    .toBe(window.innerHeight);
});
