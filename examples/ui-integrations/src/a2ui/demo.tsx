import { MessageProcessor } from '@a2ui/web_core';
import type { ProcessableMessage } from '@a2ui/web_core';
import { Button, Code, Stack } from '@k8ordo/ui';
import { useCallback, useState, useSyncExternalStore } from 'react';

import { CATALOG_ID } from './catalog';
import { A2uiSurfaces, a2uiCatalog } from './renderer';

export const SURFACE = 'profile';

export const a2uiMessages: ProcessableMessage[] = [
  {
    version: '1.0',
    createSurface: { surfaceId: SURFACE, catalogId: CATALOG_ID },
  },
  {
    version: '1.0',
    updateComponents: {
      surfaceId: SURFACE,
      components: [
        {
          id: 'root',
          component: 'Stack',
          direction: 'column',
          gap: 'md',
          children: ['heading', 'nickname', 'notify', 'plan'],
        },
        {
          id: 'heading',
          component: 'Heading',
          label: 'A2UI のプロフィール',
          level: 'h3',
        },
        {
          id: 'nickname',
          component: 'TextField',
          name: 'nickname',
          label: 'ニックネーム',
          defaultValue: { '@path': '/profile/nickname' },
        },
        {
          id: 'notify',
          component: 'Switch',
          name: 'notify',
          label: '通知を受け取る',
          defaultChecked: { '@path': '/profile/notify' },
        },
        {
          id: 'plan',
          component: 'Select',
          name: 'plan',
          label: 'プラン',
          options: [
            { value: 'free', label: '無料' },
            { value: 'pro', label: 'プロ' },
          ],
          defaultValue: { '@path': '/profile/plan' },
        },
      ],
    },
  },
  {
    version: '1.0',
    updateDataModel: {
      surfaceId: SURFACE,
      path: '/profile',
      value: { nickname: 'k8o', notify: true, plan: 'pro' },
    },
  },
];

const useDataModel = (processor: MessageProcessor, path: string): string => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const subscription = processor.model
        .getSurface(SURFACE)
        ?.dataModel.subscribe(path, onChange);
      return () => subscription?.unsubscribe();
    },
    [processor, path],
  );
  return useSyncExternalStore(subscribe, () =>
    JSON.stringify(
      processor.model.getSurface(SURFACE)?.dataModel.get(path) ?? null,
    ),
  );
};

const replay = (): MessageProcessor => {
  const processor = new MessageProcessor([a2uiCatalog]);
  processor.processMessages(a2uiMessages);
  return processor;
};

export function A2uiDemo() {
  const [processor, setProcessor] = useState(replay);
  const profile = useDataModel(processor, '/profile');

  return (
    <Stack direction="column" gap="md">
      <A2uiSurfaces processor={processor} />
      <Stack align="center" direction="row" gap="sm">
        <Code>{profile}</Code>
        <Button
          onClick={() => {
            setProcessor(replay());
          }}
          size="sm"
          variant="outline"
        >
          台本から描き直す
        </Button>
      </Stack>
    </Stack>
  );
}
