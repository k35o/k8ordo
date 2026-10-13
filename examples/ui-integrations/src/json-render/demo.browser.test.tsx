import { UIProvider } from '@k8ordo/ui';
import { beforeEach, expect, it, vi } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { JsonRenderDemo } from './demo';

// spec の検証は demo.test.ts が見ている。こちらは registry のビューが
// @json-render/react の provider につながったまま描画できることの担保。
// peer の解決が 2 コピーに割れると、検証は通るのに描画時だけ壊れる。
let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error');
});

it('spec のフォームがエラー無しで描画される', async () => {
  const screen = await render(
    <UIProvider>
      <JsonRenderDemo />
    </UIProvider>,
  );

  await expect
    .element(screen.getByPlaceholder('ニックネーム'))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole('checkbox', { name: '規約に同意する' }))
    .toBeInTheDocument();
  await expect.element(screen.getByRole('combobox')).toHaveValue('pro');

  expect(consoleError).not.toHaveBeenCalled();
});

it('描画されたフィールドが状態を保持する', async () => {
  const screen = await render(
    <UIProvider>
      <JsonRenderDemo />
    </UIProvider>,
  );

  const nickname = screen.getByPlaceholder('ニックネーム');
  await nickname.fill('k8o');

  await expect.element(nickname).toHaveValue('k8o');
  expect(consoleError).not.toHaveBeenCalled();
});
