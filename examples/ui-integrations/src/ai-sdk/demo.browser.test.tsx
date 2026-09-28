import { UIProvider } from '@k8ordo/ui';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

import { AiSdkChatDemo } from './demo';
import { SEARCH_TOOL, SOURCES } from './scripted-transport';

// 部品が AI SDK の useChat と噛み合うかは、本物の useChat を回さないと
// 分からない。承認の答えが addToolApprovalResponse に届き、
// sendAutomaticallyWhen が続きを取りに行くところまで通す。
const renderDemo = () =>
  render(
    <UIProvider>
      <AiSdkChatDemo />
    </UIProvider>,
  );

const fileInputOf = (container: HTMLElement): HTMLInputElement => {
  const input = container.querySelector<HTMLInputElement>('input[type="file"]');
  if (input === null) {
    throw new Error('PromptInput.Attach did not render its file input');
  }
  return input;
};

const ask = async (
  screen: Awaited<ReturnType<typeof renderDemo>>,
  text: string,
) => {
  await screen.getByRole('textbox').fill(text);
  await screen.getByRole('button', { name: 'Send' }).click();
};

it('許可すると検索が走り、出典と生成 UI 付きで答える', async () => {
  const screen = await renderDemo();
  await ask(screen, '何から始めればいい？');

  const decision = screen.getByRole('group', { name: SEARCH_TOOL });
  await expect
    .element(decision.getByText('ordo.k8o.me と ai-sdk.dev を検索します。'))
    .toBeVisible();

  await screen.getByRole('button', { name: 'Allow' }).click();

  await expect
    .element(screen.getByRole('link', { name: SOURCES[0].title }))
    .toHaveAttribute('href', SOURCES[0].url);
  await expect
    .element(screen.getByRole('table', { name: 'AI チャットの部品' }))
    .toBeVisible();
  await expect.element(decision).not.toBeInTheDocument();
});

it('拒否すると検索せずに答える', async () => {
  const screen = await renderDemo();
  await ask(screen, '何から始めればいい？');

  await screen.getByRole('button', { name: 'Deny' }).click();

  await expect
    .element(screen.getByText(/^検索せずに答えます。/u))
    .toBeVisible();
  await expect
    .element(screen.getByRole('list', { name: 'Sources' }))
    .not.toBeInTheDocument();
});

it('添付したファイルが吹き出しに出て、モデルにも届く', async () => {
  const screen = await renderDemo();
  await userEvent.upload(
    fileInputOf(screen.container),
    new File(['<svg xmlns="http://www.w3.org/2000/svg"/>'], 'diagram.svg', {
      type: 'image/svg+xml',
    }),
  );
  await expect
    .element(screen.getByRole('list', { name: 'Attachments' }))
    .toBeVisible();

  // 本文なしで、添付だけを送る
  await screen.getByRole('button', { name: 'Send' }).click();

  await expect
    .element(screen.getByRole('img', { name: 'diagram.svg' }))
    .toHaveAttribute('src', expect.stringMatching(/^data:image\/svg\+xml/u));
  await expect
    .element(screen.getByText('添付を 1 件受け取りました（diagram.svg）。'))
    .toBeVisible();
});

it('再生成すると同じ質問にもう一度答え直す', async () => {
  const screen = await renderDemo();
  await ask(screen, '何から始めればいい？');
  await screen.getByRole('button', { name: 'Allow' }).click();
  await expect
    .element(screen.getByRole('list', { name: 'Sources' }))
    .toBeVisible();

  await screen.getByRole('button', { name: 'Good response' }).click();
  await expect
    .element(screen.getByRole('button', { name: 'Good response' }))
    .toHaveAttribute('aria-pressed', 'true');

  await screen.getByRole('button', { name: 'Regenerate' }).click();

  // 答え直しは最初の返事からやり直すので、また許可を求める
  await expect
    .element(screen.getByRole('group', { name: SEARCH_TOOL }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('list', { name: 'Sources' }))
    .not.toBeInTheDocument();
});
