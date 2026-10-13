import { UIProvider } from '@k8ordo/ui';
import { beforeEach, expect, it, vi } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { OpenUiDemo } from './demo';

// パーサを通ることと描画できることは別問題。フォーム系のビューは
// `<Renderer>` が張る React context を `useStateField` で読むので、example と
// @k8ordo/ui が別コピーの @openuidev/react-lang を解決していると、DSL の検証が
// 全部通ったうえで描画時にだけ「must be used within a <Renderer />」で落ちる。
// context は本物のツリーの中でしか成立しないため、実際にマウントして確かめる。
let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error');
});

it('DSL のフォームがエラー無しで描画される', async () => {
  const screen = await render(
    <UIProvider>
      <OpenUiDemo />
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
  // 表示されるだけなら context 無しでも成立しうる書き方がある。値の往復まで
  // 見て初めて、ビューが本物の <Renderer> の状態につながっていると言える。
  const screen = await render(
    <UIProvider>
      <OpenUiDemo />
    </UIProvider>,
  );

  const nickname = screen.getByPlaceholder('ニックネーム');
  await nickname.fill('k8o');

  await expect.element(nickname).toHaveValue('k8o');
  expect(consoleError).not.toHaveBeenCalled();
});
