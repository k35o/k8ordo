'use client';

import { Code, DropdownMenu, IconButton, MailIcon } from '@k8ordo/ui';
import { useState } from 'react';

import * as m from '../../../../messages';

export function OverlayDemo() {
  const [last, setLast] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger label={m.ui.demoMenu()} />
          <DropdownMenu.Content>
            <DropdownMenu.Item
              label={m.ui.demoRename()}
              onAction={() => {
                setLast(m.ui.demoRename());
              }}
            />
            <DropdownMenu.Item
              label={m.ui.demoDuplicate()}
              onAction={() => {
                setLast(m.ui.demoDuplicate());
              }}
            />
            <DropdownMenu.Item
              label={m.ui.demoArchive()}
              onAction={() => {
                setLast(m.ui.demoArchive());
              }}
            />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <IconButton
          color="base"
          label={m.ui.demoShare()}
          onAction={() => {
            setLast(m.ui.demoShare());
          }}
        >
          <MailIcon />
        </IconButton>
      </div>
      <dl className="bg-bg-surface grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 rounded-lg px-4 py-3 text-sm">
        <dt className="text-fg-mute">{m.ui.demoLast()}</dt>
        <dd>
          <Code>{last ?? '—'}</Code>
        </dd>
      </dl>
    </div>
  );
}
