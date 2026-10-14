'use client';

import { Code, DropdownMenu, IconButton, MailIcon } from '@k8ordo/ui';
import { useState } from 'react';

import * as m from '../../messages';

import page from '../../styles/page.module.css';
import styles from './overlay-demo.module.css';

export function OverlayDemo() {
  const [last, setLast] = useState<string | null>(null);

  return (
    <div className={styles.root}>
      <div className={styles.actions}>
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
      <dl className={styles.result}>
        <dt className={page.mute}>{m.ui.demoLast()}</dt>
        <dd>
          <Code>{last ?? '—'}</Code>
        </dd>
      </dl>
    </div>
  );
}
