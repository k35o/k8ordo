import type { Spec } from '@json-render/core';
import { UIProvider } from '@k8ordo/ui';
import { expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { JsonRenderUI } from './registry';

const profileSpec = (state: Record<string, unknown>): Spec => ({
  root: 'nickname',
  elements: {
    nickname: {
      type: 'TextField',
      props: {
        name: 'nickname',
        placeholder: 'ニックネーム',
        defaultValue: { $bindState: '/profile/nickname' },
      },
      children: [],
    },
  },
  state,
});

it('spec の state を、結ばれた欄の最初の値にする', async () => {
  const screen = await render(
    <UIProvider>
      <JsonRenderUI spec={profileSpec({ profile: { nickname: 'k8o' } })} />
    </UIProvider>,
  );

  await expect
    .element(screen.getByPlaceholder('ニックネーム'))
    .toHaveValue('k8o');
});

it('spec が書き足されても、spec が変えていない値は打ち込んだまま残る', async () => {
  const screen = await render(
    <UIProvider>
      <JsonRenderUI spec={profileSpec({ profile: { nickname: 'k8o' } })} />
    </UIProvider>,
  );
  const nickname = screen.getByPlaceholder('ニックネーム');
  await nickname.fill('ordo');

  await screen.rerender(
    <UIProvider>
      <JsonRenderUI
        spec={profileSpec({ profile: { nickname: 'k8o', plan: 'pro' } })}
      />
    </UIProvider>,
  );

  await expect.element(nickname).toHaveValue('ordo');
});
