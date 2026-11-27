import { ToastProvider } from '@k8ordo/ui';
import { afterEach, expect, it, vi } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { CATALOG_ID } from '../a2ui/catalog';
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

// 呼ばれるたびに、次の返事を 1 つずつ返す
const replyInTurns = (...replies: string[]) => {
  const fetch = vi.fn(async (_url: string, _init?: RequestInit) => {
    const reply = replies.shift() ?? '';
    return new Response(
      ndjson([{ type: 'text', text: reply }, { type: 'done' }]),
    );
  });
  vi.stubGlobal('fetch', fetch);
  return fetch;
};

const sentTurns = (
  fetch: ReturnType<typeof replyInTurns>,
  call: number,
): Array<{ role: string; content: string }> =>
  (
    JSON.parse(fetch.mock.calls[call]?.[1]?.body as string) as {
      messages: Array<{ role: string; content: string }>;
    }
  ).messages;

const startIn = async (format: Format) => {
  const screen = await render(
    <ToastProvider>
      <Playground />
    </ToastProvider>,
  );
  await screen.getByRole('combobox', { name: '形式' }).selectOptions(format);
  await screen.getByRole('button', { name: 'Claude に作らせる' }).click();
  return screen;
};

const jsonLines = (values: object[]): string =>
  values.map((value) => JSON.stringify(value)).join('\n');

const generateIn = async (format: Format, text: string) => {
  respondWith([ndjson([{ type: 'text', text }, { type: 'done' }])]);
  const screen = await render(
    <ToastProvider>
      <Playground />
    </ToastProvider>,
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
    <ToastProvider>
      <Playground />
    </ToastProvider>,
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
    <ToastProvider>
      <Playground />
    </ToastProvider>,
  );

  await screen.getByRole('button', { name: 'Claude に作らせる' }).click();

  await expect
    .element(
      screen.getByText('本物のモデルを呼ぶ口は pnpm dev のときだけあります。'),
    )
    .toBeInTheDocument();
});

it('A2UI: 押した操作をデータモデルと一緒に返し、返事を同じ surface に重ねる', async () => {
  const fetch = replyInTurns(
    jsonLines([
      {
        version: '1.0',
        createSurface: { surfaceId: 'main', catalogId: CATALOG_ID },
      },
      {
        version: '1.0',
        updateDataModel: {
          surfaceId: 'main',
          path: '/',
          value: { name: 'k8o' },
        },
      },
      {
        version: '1.0',
        updateComponents: {
          surfaceId: 'main',
          components: [
            { id: 'root', component: 'Stack', children: ['submit'] },
            {
              id: 'submit',
              component: 'Button',
              label: '登録する',
              press: {
                event: {
                  name: 'submit',
                  context: { name: { '@path': '/name' } },
                },
              },
            },
          ],
        },
      },
    ]),
    jsonLines([
      {
        version: '1.0',
        updateComponents: {
          surfaceId: 'main',
          components: [
            { id: 'root', component: 'Stack', children: ['submit', 'done'] },
            {
              id: 'done',
              component: 'Heading',
              label: '登録しました',
              level: 'h3',
            },
          ],
        },
      },
    ]),
  );
  const screen = await startIn('a2ui');

  await screen.getByRole('button', { name: '登録する' }).click();

  await expect
    .element(screen.getByRole('heading', { name: '登録しました' }))
    .toBeInTheDocument();
  const turns = sentTurns(fetch, 1);
  expect(turns.map((turn) => turn.role)).toStrictEqual([
    'user',
    'assistant',
    'user',
  ]);
  expect(turns[2]?.content).toContain('"name":"submit"');
  expect(turns[2]?.content).toContain('"name":"k8o"');
});

it('json-render: toAssistant を state と一緒に返し、返事のパッチを今の spec に重ねる', async () => {
  const fetch = replyInTurns(
    jsonLines([
      { op: 'add', path: '/root', value: 'form' },
      { op: 'add', path: '/state/profile', value: { nickname: 'k8o' } },
      {
        op: 'add',
        path: '/elements/form',
        value: { type: 'Stack', props: {}, children: ['save'] },
      },
      {
        op: 'add',
        path: '/elements/save',
        value: {
          type: 'Button',
          props: { label: '保存' },
          on: { press: { action: 'toAssistant', params: { event: 'save' } } },
          children: [],
        },
      },
    ]),
    jsonLines([
      {
        op: 'add',
        path: '/elements/done',
        value: {
          type: 'Heading',
          props: { label: '保存しました', level: 'h3' },
          children: [],
        },
      },
      {
        op: 'replace',
        path: '/elements/form/children',
        value: ['save', 'done'],
      },
    ]),
  );
  const screen = await startIn('json-render');

  await screen.getByRole('button', { name: '保存' }).click();

  await expect
    .element(screen.getByRole('heading', { name: '保存しました' }))
    .toBeInTheDocument();
  const content = sentTurns(fetch, 1)[2]?.content;
  expect(content).toContain('"action":"toAssistant"');
  expect(content).toContain('"nickname":"k8o"');
});

it('OpenUI: 押した操作をフォームの状態と一緒に返し、返事の文で置き換える', async () => {
  const fetch = replyInTurns(
    [
      'root = Stack("column", "md", null, null, null, [save])',
      'save = Button("保存", null, null, null, null, null, @ToAssistant("保存した"))',
    ].join('\n'),
    [
      'root = Stack("column", "md", null, null, null, [save, done])',
      'done = Heading("保存しました", "h3")',
    ].join('\n'),
  );
  const screen = await startIn('openui');

  await screen.getByRole('button', { name: '保存' }).click();

  await expect
    .element(screen.getByRole('heading', { name: '保存しました' }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole('button', { name: '保存' }))
    .toBeInTheDocument();
  expect(sentTurns(fetch, 1)[2]?.content).toContain('保存した');
});
