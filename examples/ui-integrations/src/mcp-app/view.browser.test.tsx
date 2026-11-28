import { ToastProvider } from '@k8ordo/ui';
import { InMemoryTransport } from '@modelcontextprotocol/client';
import { App } from '@modelcontextprotocol/ext-apps';
import type { McpUiHostContext } from '@modelcontextprotocol/ext-apps';
import { AppBridge } from '@modelcontextprotocol/ext-apps/app-bridge';
import { afterEach, expect, it, vi } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import type { ScreenInput } from '../a2ui/screen';
import { watchToolCall } from './tool-call';
import { McpAppView } from './view';

const form: ScreenInput = {
  components: [
    { id: 'root', component: 'Stack', children: ['nickname', 'save'] },
    {
      id: 'nickname',
      component: 'TextField',
      name: 'nickname',
      label: 'ニックネーム',
      defaultValue: { '@path': '/nickname' },
    },
    {
      id: 'save',
      component: 'Button',
      label: '保存',
      press: {
        event: {
          name: 'save',
          context: { nickname: { '@path': '/nickname' } },
        },
      },
    },
  ],
  dataModel: { nickname: '' },
};

const bridges: AppBridge[] = [];

const open = async (hostContext: McpUiHostContext = {}) => {
  const bridge = new AppBridge(
    null,
    { name: 'test-host', version: '1.0.0' },
    { message: {}, updateModelContext: {} },
    { hostContext },
  );
  bridges.push(bridge);
  const messages = vi.fn(async () => ({}));
  const modelContexts = vi.fn(async () => ({}));
  const displayModes = vi.fn(async ({ mode }: { mode: string }) => ({
    mode: mode as 'inline' | 'fullscreen',
  }));
  // oxlint-disable-next-line unicorn/prefer-add-event-listener -- AppBridge の onmessage は ui/message の要求に答える口で、addEventListener では受けられない
  bridge.onmessage = messages;
  bridge.onupdatemodelcontext = modelContexts;
  bridge.onrequestdisplaymode = displayModes;

  const [appTransport, hostTransport] = InMemoryTransport.createLinkedPair();
  await bridge.connect(hostTransport);
  const app = new App(
    { name: 'test-app', version: '1.0.0' },
    { availableDisplayModes: ['inline', 'fullscreen'] },
    { autoResize: false },
  );
  const toolCall = watchToolCall(app);
  await app.connect(appTransport);

  const screen = await render(
    <ToastProvider>
      <McpAppView app={app} toolCall={toolCall} />
    </ToastProvider>,
  );
  return { bridge, screen, messages, modelContexts, displayModes };
};

afterEach(async () => {
  document.documentElement.classList.remove('dark');
  await Promise.all(bridges.splice(0).map((bridge) => bridge.close()));
});

it('ツールの入力の画面を、@k8ordo/ui の部品で描く', async () => {
  const { bridge, screen } = await open();

  await bridge.sendToolInput({ arguments: form });

  await expect
    .element(screen.getByLabelText('ニックネーム'))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole('button', { name: '保存' }))
    .toBeInTheDocument();
});

it('押した操作を、画面の状態と一緒に会話へ送る', async () => {
  const { bridge, screen, messages } = await open();
  await bridge.sendToolInput({ arguments: form });

  await screen.getByLabelText('ニックネーム').fill('ordo');
  await screen.getByRole('button', { name: '保存' }).click();

  await expect.poll(() => messages.mock.calls.length).toBe(1);
  expect(messages).toHaveBeenLastCalledWith(
    expect.objectContaining({ role: 'user' }),
    expect.anything(),
  );
  expect(JSON.stringify(messages.mock.lastCall)).toContain(
    String.raw`\"context\":{\"nickname\":\"ordo\"}`,
  );
});

it('入力が変わるたびに、今の状態をモデルの文脈に置く', async () => {
  const { bridge, screen, modelContexts } = await open();
  await bridge.sendToolInput({ arguments: form });

  await screen.getByLabelText('ニックネーム').fill('ordo');

  await expect
    .poll(() => JSON.stringify(modelContexts.mock.lastCall))
    .toContain(String.raw`\"nickname\":\"ordo\"`);
});

it('ホストの暗い配色に合わせて、ui の dark を付ける', async () => {
  const { bridge } = await open({ theme: 'light' });
  expect(document.documentElement).not.toHaveClass('dark');

  bridge.setHostContext({ theme: 'dark' });

  await expect.poll(() => document.documentElement).toHaveClass('dark');
});

it('ホストが全画面を持つときだけ、全画面への切り替えを出す', async () => {
  const inline = await open({ availableDisplayModes: ['inline'] });
  await inline.bridge.sendToolInput({ arguments: form });
  await expect
    .element(inline.screen.getByLabelText('ニックネーム'))
    .toBeInTheDocument();
  expect(
    inline.screen.getByRole('button', { name: '全画面で開く' }).elements(),
  ).toHaveLength(0);
  await inline.screen.unmount();

  const { screen, displayModes } = await open({
    availableDisplayModes: ['inline', 'fullscreen'],
    displayMode: 'inline',
  });
  await screen.getByRole('button', { name: '全画面で開く' }).click();

  await expect
    .poll(() => displayModes.mock.lastCall?.[0])
    .toStrictEqual({ mode: 'fullscreen' });
});

it('サーバーが画面を退けたら、その理由を出す', async () => {
  const { bridge, screen } = await open();

  await bridge.sendToolInput({
    arguments: { components: [{ id: 'root', component: 'PieChart' }] },
  });
  await bridge.sendToolResult({
    isError: true,
    content: [{ type: 'text', text: '[root] PieChart is not in the catalog.' }],
  });

  await expect
    .element(screen.getByRole('alert'))
    .toMatchTextContent(/\[root\] PieChart is not in the catalog\./);
});
