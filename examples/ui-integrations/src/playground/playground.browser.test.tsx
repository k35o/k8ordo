import { UIProvider } from '@k8ordo/ui';
import { afterEach, expect, it, vi } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { a2uiMessages } from '../a2ui/demo';
import { Playground } from './playground';
import type { GenerateEvent } from './request';

const respondWith = (chunks: string[], init?: ResponseInit) => {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(body, init)),
  );
};

const ndjson = (events: GenerateEvent[]): string =>
  events.map((event) => `${JSON.stringify(event)}\n`).join('');

afterEach(() => {
  vi.unstubAllGlobals();
});

it('途中で切れて届いた A2UI のメッセージを組み立てて描画する', async () => {
  const jsonl = a2uiMessages
    .map((message) => JSON.stringify(message))
    .join('\n');
  const stream = ndjson([
    { type: 'text', text: jsonl.slice(0, 40) },
    { type: 'text', text: jsonl.slice(40) },
    { type: 'done' },
  ]);
  respondWith([stream.slice(0, 25), stream.slice(25)]);
  const screen = await render(
    <UIProvider>
      <Playground />
    </UIProvider>,
  );

  await screen.getByRole('button', { name: 'Claude に作らせる' }).click();

  await expect
    .element(screen.getByRole('heading', { name: 'A2UI のプロフィール' }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByPlaceholder('ニックネーム'))
    .toHaveValue('k8o');
});

it('dev サーバーの外では口が無いことを伝える', async () => {
  respondWith([], { status: 404 });
  const screen = await render(
    <UIProvider>
      <Playground />
    </UIProvider>,
  );

  await screen.getByRole('button', { name: 'Claude に作らせる' }).click();

  await expect
    .element(
      screen.getByText('本物のモデルを呼ぶ口は pnpm dev のときだけあります。'),
    )
    .toBeInTheDocument();
});
