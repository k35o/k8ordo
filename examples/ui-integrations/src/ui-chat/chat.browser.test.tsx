import { UIProvider } from '@k8ordo/ui';
import { createUIMessageStreamResponse, simulateReadableStream } from 'ai';
import type { UIMessage, UIMessageChunk } from 'ai';
import { afterEach, expect, it, vi } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { UiChat } from './chat';

import '../styles.css';

const nickname = {
  id: 'nickname',
  component: 'TextField',
  name: 'nickname',
  placeholder: 'ニックネーム',
  defaultValue: { '@path': '/nickname' },
};

const saveButton = (event: Record<string, unknown>) => ({
  id: 'save',
  component: 'Button',
  label: '保存',
  press: {
    event: {
      name: 'save',
      context: { nickname: { '@path': '/nickname' } },
      ...event,
    },
  },
});

const formOf = (userMessage: string | null = '保存します') => ({
  components: [
    { id: 'root', component: 'Stack', children: ['nickname', 'save'] },
    nickname,
    saveButton(userMessage === null ? {} : { userMessage }),
  ],
  dataModel: { nickname: '' },
});

const step = (chunks: UIMessageChunk[]): UIMessageChunk[] => [
  { type: 'start' },
  { type: 'start-step' },
  ...chunks,
  { type: 'finish-step' },
  { type: 'finish' },
];

const toolCall = (
  toolCallId: string,
  toolName: string,
  input: unknown,
): UIMessageChunk[] => [
  { type: 'tool-input-available', toolCallId, toolName, input },
  { type: 'tool-output-available', toolCallId, output: { screen: 'call-1' } },
];

const showForm = (form = formOf()) => step(toolCall('call-1', 'show_ui', form));

const answer = (text: string): UIMessageChunk[] => [
  { type: 'text-start', id: 'answer' },
  { type: 'text-delta', id: 'answer', delta: text },
  { type: 'text-end', id: 'answer' },
];

type ChatBody = { messages: UIMessage[]; modelContext: string[] };

const live = () => {
  let controller: ReadableStreamDefaultController<UIMessageChunk> | null = null;
  const stream = new ReadableStream<UIMessageChunk>({
    start: (opened) => {
      controller = opened;
    },
  });
  return {
    stream,
    push: (...chunks: UIMessageChunk[]) => {
      for (const chunk of chunks) {
        controller?.enqueue(chunk);
      }
    },
    close: () => {
      controller?.close();
    },
  };
};

type Reply = UIMessageChunk[] | ReadableStream<UIMessageChunk>;

const serve = (replies: Reply[]) => {
  const bodies: ChatBody[] = [];
  const original = window.fetch.bind(window);
  vi.spyOn(window, 'fetch').mockImplementation(async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    if (!url.endsWith('/api/ui-chat')) {
      return original(input, init);
    }
    bodies.push(JSON.parse(init?.body as string) as ChatBody);
    const reply = replies[bodies.length - 1] ?? step(answer('おしまい'));
    return createUIMessageStreamResponse({
      stream: Array.isArray(reply)
        ? simulateReadableStream({ chunks: reply })
        : reply,
    });
  });
  return bodies;
};

const mount = async (prompt = 'フォームを出して') => {
  const screen = await render(
    <UIProvider>
      <UiChat />
    </UIProvider>,
  );
  await screen.getByPlaceholder('例: 会員登録のフォームを出して').fill(prompt);
  await screen.getByRole('button', { name: /送信|Send/ }).click();
  return screen;
};

afterEach(() => {
  vi.restoreAllMocks();
});

it('ツールの入力が届いた分から、画面を描く', async () => {
  const reply = live();
  serve([reply.stream]);
  const screen = await mount();
  const input = JSON.stringify(formOf());
  const cut = input.indexOf('"id":"save"');

  reply.push(
    { type: 'start' },
    { type: 'start-step' },
    { type: 'tool-input-start', toolCallId: 'call-1', toolName: 'show_ui' },
    {
      type: 'tool-input-delta',
      toolCallId: 'call-1',
      inputTextDelta: input.slice(0, cut),
    },
  );

  await expect
    .element(screen.getByPlaceholder('ニックネーム'))
    .toBeInTheDocument();
  expect(screen.getByRole('button', { name: '保存' }).elements()).toHaveLength(
    0,
  );

  reply.push(
    {
      type: 'tool-input-delta',
      toolCallId: 'call-1',
      inputTextDelta: input.slice(cut),
    },
    ...toolCall('call-1', 'show_ui', formOf()),
    { type: 'finish-step' },
    { type: 'finish' },
  );
  reply.close();

  await expect
    .element(screen.getByRole('button', { name: '保存' }))
    .toBeInTheDocument();
});

it('押した操作を、操作の文で利用者の発言にし、操作と画面の状態を添えて送る', async () => {
  const bodies = serve([showForm(), step(answer('受け取りました。'))]);
  const screen = await mount();

  await screen.getByPlaceholder('ニックネーム').fill('ordo');
  await screen.getByRole('button', { name: '保存' }).click();

  await expect
    .element(screen.getByText('受け取りました。'))
    .toBeInTheDocument();
  await expect.element(screen.getByText('保存します')).toBeInTheDocument();
  expect(bodies[1]?.messages.at(-1)).toMatchObject({
    role: 'user',
    parts: [
      {
        type: 'data-action',
        data: {
          screen: 'call-1',
          name: 'save',
          sourceComponentId: 'save',
          context: { nickname: 'ordo' },
          text: '保存します',
          state: { nickname: 'ordo' },
        },
      },
    ],
  });
  expect(bodies[1]?.modelContext).toStrictEqual([
    'Screen call-1: {"nickname":"ordo"}',
  ]);
});

it('操作の文が無ければ、押した部品の label で見せる', async () => {
  serve([showForm(formOf(null))]);
  const screen = await mount();

  await screen.getByRole('button', { name: '保存' }).click();

  await expect
    .element(screen.getByText('「保存」を押しました'))
    .toBeInTheDocument();
});

it('返事の update_ui で、押された画面をその場で変え、入力した値を残す', async () => {
  serve([
    showForm(),
    step([
      ...toolCall('call-2', 'update_ui', {
        screen: 'call-1',
        components: [
          {
            id: 'root',
            component: 'Stack',
            children: ['nickname', 'save', 'done'],
          },
          {
            id: 'done',
            component: 'Alert',
            tone: 'success',
            message: '保存しました',
          },
        ],
      }),
      ...answer('保存しました。ほかに直すところはありますか。'),
    ]),
  ]);
  const screen = await mount();

  await screen.getByPlaceholder('ニックネーム').fill('ordo');
  await screen.getByRole('button', { name: '保存' }).click();

  await expect
    .element(screen.getByText('保存しました', { exact: true }))
    .toBeInTheDocument();
  expect(screen.getByPlaceholder('ニックネーム').elements()).toHaveLength(1);
  await expect
    .element(screen.getByPlaceholder('ニックネーム'))
    .toHaveValue('ordo');
});

it('サーバーが退けた画面は、描きかけの分も消す', async () => {
  const reply = live();
  serve([reply.stream]);
  const screen = await mount();
  const input = JSON.stringify(formOf());

  reply.push(
    { type: 'start' },
    { type: 'start-step' },
    { type: 'tool-input-start', toolCallId: 'call-1', toolName: 'show_ui' },
    {
      type: 'tool-input-delta',
      toolCallId: 'call-1',
      inputTextDelta: input.slice(0, input.indexOf('"id":"save"')),
    },
  );
  await expect
    .element(screen.getByPlaceholder('ニックネーム'))
    .toBeInTheDocument();

  reply.push(
    {
      type: 'tool-input-available',
      toolCallId: 'call-1',
      toolName: 'show_ui',
      input: formOf(),
    },
    {
      type: 'tool-output-error',
      toolCallId: 'call-1',
      errorText: 'The screen breaks the A2UI catalog.',
    },
    { type: 'finish-step' },
    { type: 'finish' },
  );
  reply.close();

  await expect
    .element(screen.getByPlaceholder('ニックネーム'))
    .not.toBeInTheDocument();
});

it('押さずに入力した値も、次の発言に添えて送る', async () => {
  const bodies = serve([showForm()]);
  const screen = await mount();

  await screen.getByPlaceholder('ニックネーム').fill('ordo');
  await screen
    .getByPlaceholder('例: 会員登録のフォームを出して')
    .fill('入力した値は？');
  await screen.getByRole('button', { name: /送信|Send/ }).click();

  await expect.poll(() => bodies.length).toBe(2);
  expect(bodies[1]?.modelContext).toStrictEqual([
    'Screen call-1: {"nickname":"ordo"}',
  ]);
});

it('返事を流している間に押された操作は送らない', async () => {
  const reply = live();
  const bodies = serve([reply.stream]);
  const screen = await mount();

  reply.push(
    { type: 'start' },
    { type: 'start-step' },
    ...toolCall('call-1', 'show_ui', formOf()),
    { type: 'text-start', id: 'answer' },
    { type: 'text-delta', id: 'answer', delta: '入力してください。' },
  );
  await screen.getByRole('button', { name: '保存' }).click();
  reply.push(
    { type: 'text-end', id: 'answer' },
    { type: 'finish-step' },
    { type: 'finish' },
  );
  reply.close();
  await expect
    .element(screen.getByRole('button', { name: /停止|Stop/ }))
    .not.toBeInTheDocument();

  await screen.getByRole('button', { name: '保存' }).click();

  await expect.element(screen.getByText('おしまい')).toBeInTheDocument();
  expect(bodies).toHaveLength(2);
  expect(screen.getByText('保存します').elements()).toHaveLength(1);
});
