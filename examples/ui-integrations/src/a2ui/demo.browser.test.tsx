import { UIProvider } from '@k8ordo/ui';
import { beforeEach, expect, it, vi } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { A2uiDemo } from './demo';

let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error');
});

it('データモデルの値で入力欄が描画される', async () => {
  const screen = await render(
    <UIProvider>
      <A2uiDemo />
    </UIProvider>,
  );

  await expect
    .element(screen.getByRole('heading', { name: 'A2UI のプロフィール' }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByPlaceholder('ニックネーム'))
    .toHaveValue('k8o');
  await expect
    .element(screen.getByRole('switch', { name: '通知を受け取る' }))
    .toBeChecked();
  await expect.element(screen.getByRole('combobox')).toHaveValue('pro');
  expect(consoleError).not.toHaveBeenCalled();
});

it('入力した値がデータモデルに書き込まれる', async () => {
  const screen = await render(
    <UIProvider>
      <A2uiDemo />
    </UIProvider>,
  );

  const nickname = screen.getByPlaceholder('ニックネーム');
  await nickname.fill('ordo');
  await screen.getByText('通知を受け取る').click();

  await expect.element(nickname).toHaveValue('ordo');
  await expect
    .element(
      screen.getByText('{"nickname":"ordo","notify":false,"plan":"pro"}'),
    )
    .toBeInTheDocument();
  expect(consoleError).not.toHaveBeenCalled();
});
