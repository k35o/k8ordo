'use client';

import { ContextMenu } from '@k8ordo/ui';

import styles from './context-menu-previews.module.css';

export function ContextMenuPreview() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        renderItem={(props) => (
          <div
            {...props}
            className={styles.trigger}
            // oxlint-disable-next-line eslint-plugin-jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
          >
            report.pdf
          </div>
        )}
      />
      <ContextMenu.Content>
        <ContextMenu.Item label="Rename" onAction={() => undefined} />
        <ContextMenu.SubMenu label="Move to">
          <ContextMenu.Item label="Archive" onAction={() => undefined} />
          <ContextMenu.Item label="Drafts" onAction={() => undefined} />
        </ContextMenu.SubMenu>
        <ContextMenu.Item label="Delete" onAction={() => undefined} />
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
