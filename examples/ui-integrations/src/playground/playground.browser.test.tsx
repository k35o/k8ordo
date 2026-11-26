import { UIProvider } from '@k8ordo/ui';
import { afterEach, expect, it, vi } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { a2uiMessages } from '../a2ui/demo';
import { Playground } from './playground';
import type { Format, GenerateEvent } from './request';

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

const generateIn = async (format: Format, text: string) => {
  respondWith([ndjson([{ type: 'text', text }, { type: 'done' }])]);
  const screen = await render(
    <UIProvider>
      <Playground />
    </UIProvider>,
  );
  await screen.getByRole('combobox', { name: '形式' }).selectOptions(format);
  await screen.getByRole('button', { name: 'Claude に作らせる' }).click();
  return screen;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

it('A2UI: 途中で切れて届いたメッセージを組み立てて描き、触った値をデータモデルに出す', async () => {
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
  const state = screen.getByRole('region', { name: '状態' });
  await expect.element(state).toMatchTextContent(/"nickname": "k8o"/);
  await expect
    .element(screen.getByRole('region', { name: '検査' }))
    .toMatchTextContent(/カタログどおり/);

  await screen.getByPlaceholder('ニックネーム').fill('ordo');

  await expect.element(state).toMatchTextContent(/"nickname": "ordo"/);
});

it('json-render: spec の state を最初の値にして描き、触った値を state に出す', async () => {
  const patches = [
    { op: 'add', path: '/root', value: 'nickname' },
    { op: 'add', path: '/state/profile', value: { nickname: 'k8o' } },
    {
      op: 'add',
      path: '/elements/nickname',
      value: {
        type: 'TextField',
        props: {
          name: 'nickname',
          placeholder: 'ニックネーム',
          defaultValue: { $bindState: '/profile/nickname' },
        },
        children: [],
      },
    },
  ];
  const screen = await generateIn(
    'json-render',
    patches.map((patch) => JSON.stringify(patch)).join('\n'),
  );

  const nickname = screen.getByPlaceholder('ニックネーム');
  await expect.element(nickname).toHaveValue('k8o');
  await expect
    .element(screen.getByRole('region', { name: '検査' }))
    .toMatchTextContent(/カタログどおり/);

  await nickname.fill('ordo');

  await expect
    .element(screen.getByRole('region', { name: '状態' }))
    .toMatchTextContent(/"nickname": "ordo"/);
});

it('OpenUI: カタログに無い部品を食い違いとして出し、描けた欄の値はフォームの状態に出す', async () => {
  const screen = await generateIn(
    'openui',
    [
      'root = Card("full", "outline", null, null, [main])',
      'main = Stack("column", "md", null, null, null, [nickname, mystery])',
      'nickname = TextField("nickname", "ニックネーム")',
      'mystery = Sparkle("x")',
    ].join('\n'),
  );

  await expect
    .element(screen.getByRole('region', { name: '検査' }))
    .toMatchTextContent(/食い違い.*Sparkle/);

  await screen.getByPlaceholder('ニックネーム').fill('ordo');

  await expect
    .element(screen.getByRole('region', { name: '状態' }))
    .toMatchTextContent(/ordo/);
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
