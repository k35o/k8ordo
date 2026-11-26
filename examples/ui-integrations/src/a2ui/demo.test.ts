import { MessageProcessor } from '@a2ui/web_core';
import { expect, test } from 'vite-plus/test';

import { CATALOG_ID } from './catalog';
import { SURFACE, a2uiMessages } from './demo';
import { a2uiCatalog } from './renderer';

test('台本のメッセージがカタログの検証をエラー無しで通る', () => {
  const processor = new MessageProcessor([a2uiCatalog]);

  expect(processor.processMessagesWithErrors(a2uiMessages)).toStrictEqual([]);
});

test('値を @path で結ばない入力欄は検証で弾かれる', () => {
  const processor = new MessageProcessor([a2uiCatalog]);

  const errors = processor.processMessagesWithErrors([
    {
      version: '1.0',
      createSurface: { surfaceId: SURFACE, catalogId: CATALOG_ID },
    },
    {
      version: '1.0',
      updateComponents: {
        surfaceId: SURFACE,
        components: [{ id: 'root', component: 'TextField', name: 'nickname' }],
      },
    },
  ]);

  expect(errors).toHaveLength(1);
});
