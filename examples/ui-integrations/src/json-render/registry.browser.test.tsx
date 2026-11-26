import type { ActionBinding, Spec } from '@json-render/core';
import { UIProvider } from '@k8ordo/ui';
import { expect, it, vi } from 'vite-plus/test';
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

const withButton = (press: ActionBinding): Spec => ({
  root: 'form',
  elements: {
    form: {
      type: 'Stack',
      props: { direction: 'column' },
      children: ['nickname', 'save'],
    },
    nickname: {
      type: 'TextField',
      props: {
        name: 'nickname',
        placeholder: 'ニックネーム',
        defaultValue: { $bindState: '/profile/nickname' },
      },
      children: [],
    },
    save: {
      type: 'Button',
      props: { label: '保存' },
      on: { press },
      children: [],
    },
  },
  state: { profile: { nickname: 'k8o' } },
});

it('press に結んだ toAssistant は、params の $state を今の値にして届く', async () => {
  const toAssistant = vi.fn();
  const screen = await render(
    <UIProvider>
      <JsonRenderUI
        onToAssistant={toAssistant}
        spec={withButton({
          action: 'toAssistant',
          params: { event: 'save', nickname: { $state: '/profile/nickname' } },
        })}
      />
    </UIProvider>,
  );

  await screen.getByPlaceholder('ニックネーム').fill('ordo');
  await screen.getByRole('button', { name: '保存' }).click();

  await expect.poll(() => toAssistant.mock.calls.length).toBe(1);
  expect(toAssistant).toHaveBeenCalledWith({ event: 'save', nickname: 'ordo' });
});

it('json-render の組み込みの setState は、アプリを通らず画面の中で効く', async () => {
  const toAssistant = vi.fn();
  const screen = await render(
    <UIProvider>
      <JsonRenderUI
        onToAssistant={toAssistant}
        spec={withButton({
          action: 'setState',
          params: { statePath: '/profile/nickname', value: '' },
        })}
      />
    </UIProvider>,
  );

  await screen.getByRole('button', { name: '保存' }).click();

  await expect.element(screen.getByPlaceholder('ニックネーム')).toHaveValue('');
  expect(toAssistant).not.toHaveBeenCalled();
});
