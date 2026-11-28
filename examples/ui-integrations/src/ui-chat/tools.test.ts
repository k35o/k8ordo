import { describe, expect, it } from 'vite-plus/test';

import type { ScreenInput, ScreenStep } from '../a2ui/screen';
import { SHOW_UI, UPDATE_UI } from './screens';
import { screenTools } from './tools';

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
      press: { event: { name: 'save' } },
    },
  ],
  dataModel: { nickname: '' },
};

const done = {
  components: [
    { id: 'root', component: 'Stack', children: ['nickname', 'save', 'done'] },
    {
      id: 'done',
      component: 'Alert',
      tone: 'success',
      message: '保存しました',
    },
  ],
};

const call = async (
  tools: ReturnType<typeof screenTools>,
  name: typeof SHOW_UI | typeof UPDATE_UI,
  input: unknown,
  toolCallId: string,
) => {
  const { execute } = tools[name] as {
    execute: (input: unknown, options: unknown) => unknown;
  };
  return execute(input, { toolCallId, messages: [], context: {} });
};

const shown: ScreenStep = { kind: 'show', screen: 'call-1', input: form };

describe('show_ui', () => {
  it('画面を出し、その呼び出しの ID を画面の ID として返す', async () => {
    await expect(
      call(screenTools([]), SHOW_UI, form, 'call-1'),
    ).resolves.toStrictEqual({ screen: 'call-1' });
  });

  it('カタログに合わない画面は、直すところを挙げて退ける', async () => {
    await expect(
      call(
        screenTools([]),
        SHOW_UI,
        { components: [{ id: 'root', component: 'PieChart' }] },
        'call-1',
      ),
    ).rejects.toThrow('[root] PieChart is not in the catalog.');
  });
});

describe('update_ui', () => {
  it('前の発言までに出した画面を、その場で変える', async () => {
    await expect(
      call(
        screenTools([shown]),
        UPDATE_UI,
        { screen: 'call-1', ...done },
        'call-2',
      ),
    ).resolves.toStrictEqual({ screen: 'call-1' });
  });

  it('同じ返事の中で出した画面も変えられる', async () => {
    const tools = screenTools([]);
    await call(tools, SHOW_UI, form, 'call-1');

    await expect(
      call(tools, UPDATE_UI, { screen: 'call-1', ...done }, 'call-2'),
    ).resolves.toStrictEqual({ screen: 'call-1' });
  });

  it('出していない画面への変更を退ける', async () => {
    await expect(
      call(
        screenTools([shown]),
        UPDATE_UI,
        { screen: 'call-9', ...done },
        'call-2',
      ),
    ).rejects.toThrow('There is no screen "call-9".');
  });

  it('退けた画面は、後の変更の相手にならない', async () => {
    const tools = screenTools([]);
    await call(
      tools,
      SHOW_UI,
      { components: [{ id: 'root', component: 'PieChart' }] },
      'call-1',
    ).catch(() => null);

    await expect(
      call(tools, UPDATE_UI, { screen: 'call-1', ...done }, 'call-2'),
    ).rejects.toThrow('There is no screen "call-1".');
  });
});
