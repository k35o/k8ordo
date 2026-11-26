import { MessageProcessor } from '@a2ui/web_core';
import type { ActionPayload, ProcessableMessage } from '@a2ui/web_core';
import { UIProvider } from '@k8ordo/ui';
import { expect, it, vi } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { CATALOG_ID } from './catalog';
import { A2uiSurfaces, a2uiCatalog } from './renderer';

const SURFACE = 'main';

const surfaceOf = (components: object[]): ProcessableMessage[] => [
  {
    version: '1.0',
    createSurface: { surfaceId: SURFACE, catalogId: CATALOG_ID },
  },
  {
    version: '1.0',
    updateDataModel: {
      surfaceId: SURFACE,
      path: '/',
      value: { nickname: 'k8o' },
    },
  },
  {
    version: '1.0',
    updateComponents: {
      surfaceId: SURFACE,
      components: components as never,
    },
  },
];

const mount = async (components: object[]) => {
  const actions = vi.fn<(action: ActionPayload) => void>();
  const processor = new MessageProcessor([a2uiCatalog], actions);
  processor.processMessages(surfaceOf(components));
  const screen = await render(
    <UIProvider>
      <A2uiSurfaces processor={processor} />
    </UIProvider>,
  );
  return { screen, actions };
};

it('press に結んだ event は、context をデータモデルの値にしてアプリに届く', async () => {
  const { screen, actions } = await mount([
    {
      id: 'root',
      component: 'Button',
      label: '保存',
      press: {
        event: {
          name: 'save',
          context: { nickname: { '@path': '/nickname' } },
        },
      },
    },
  ]);

  await screen.getByRole('button', { name: '保存' }).click();

  await expect.poll(() => actions.mock.calls.length).toBe(1);
  expect(actions.mock.calls[0]?.[0]).toMatchObject({
    name: 'save',
    sourceComponentId: 'root',
    context: { nickname: 'k8o' },
  });
});

it('press を結んでいない Card はボタンにならない', async () => {
  const { screen } = await mount([
    { id: 'root', component: 'Card', children: ['title'] },
    { id: 'title', component: 'Heading', label: 'プラン', level: 'h3' },
  ]);

  await expect
    .element(screen.getByRole('heading', { name: 'プラン' }))
    .toBeInTheDocument();
  expect(screen.getByRole('button').elements()).toHaveLength(0);
});

it('メニューの項目を選ぶと、その項目の event が届く', async () => {
  const { screen, actions } = await mount([
    {
      id: 'root',
      component: 'DropdownMenu',
      triggerLabel: '操作',
      children: ['copy', 'remove'],
    },
    {
      id: 'copy',
      component: 'DropdownMenuItem',
      label: '複製',
      press: { event: { name: 'copy' } },
    },
    {
      id: 'remove',
      component: 'DropdownMenuItem',
      label: '削除',
      press: { event: { name: 'remove' } },
    },
  ]);

  await screen.getByRole('button', { name: '操作' }).click();
  await screen.getByRole('menuitem', { name: '削除' }).click();

  await expect.poll(() => actions.mock.calls.length).toBe(1);
  expect(actions.mock.calls[0]?.[0]).toMatchObject({
    name: 'remove',
    sourceComponentId: 'remove',
  });
});
