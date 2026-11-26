import { UIProvider } from '@k8ordo/ui';
import { Renderer } from '@openuidev/react-lang';
import type { ActionEvent } from '@openuidev/react-lang';
import { expect, it, vi } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { library } from './library';

const mount = async (program: string) => {
  const onAction = vi.fn<(event: ActionEvent) => void>();
  const screen = await render(
    <UIProvider>
      <Renderer library={library} onAction={onAction} response={program} />
    </UIProvider>,
  );
  return { screen, onAction };
};

it('press に書いた @ToAssistant は、フォームの状態を付けて届く', async () => {
  const { screen, onAction } = await mount(
    [
      'root = Stack("column", "md", null, null, null, [nickname, save])',
      'nickname = TextField("nickname", "ニックネーム")',
      'save = Button("保存", null, null, null, null, null, @ToAssistant("保存した"))',
    ].join('\n'),
  );

  await screen.getByPlaceholder('ニックネーム').fill('ordo');
  await screen.getByRole('button', { name: '保存' }).click();

  await expect.poll(() => onAction.mock.calls.length).toBe(1);
  expect(onAction).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'continue_conversation',
      humanFriendlyMessage: '保存した',
    }),
  );
  expect(JSON.stringify(onAction.mock.lastCall)).toContain('ordo');
});

it('action の無いボタンは、ラベルを Claude に送る', async () => {
  const { screen, onAction } = await mount('root = Button("送信")');

  await screen.getByRole('button', { name: '送信' }).click();

  await expect.poll(() => onAction.mock.calls.length).toBe(1);
  expect(onAction.mock.calls[0]?.[0]).toMatchObject({
    type: 'continue_conversation',
    humanFriendlyMessage: '送信',
  });
});

it('action の無い Card は押せない', async () => {
  const { screen } = await mount(
    [
      'root = Card(null, null, null, null, [title])',
      'title = Heading("プラン", "h3")',
    ].join('\n'),
  );

  await expect
    .element(screen.getByRole('heading', { name: 'プラン' }))
    .toBeInTheDocument();
  expect(screen.getByRole('button').elements()).toHaveLength(0);
});

it('FormControl に入れた値も、フォームの状態に乗って届く', async () => {
  const { screen, onAction } = await mount(
    [
      'root = Form([name, send])',
      'name = FormControl("お名前", "text", "name", "山田 太郎")',
      'send = Button("送信")',
    ].join('\n'),
  );

  await screen.getByPlaceholder('山田 太郎').fill('テスト 花子');
  await screen.getByRole('button', { name: '送信' }).click();

  await expect.poll(() => onAction.mock.calls.length).toBe(1);
  expect(JSON.stringify(onAction.mock.lastCall)).toContain('テスト 花子');
});
