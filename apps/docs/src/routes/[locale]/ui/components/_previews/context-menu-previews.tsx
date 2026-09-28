'use client';

import { ContextMenu } from '@k8ordo/ui';

export function ContextMenuPreview() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        renderItem={(props) => (
          <div
            {...props}
            className="border-border-base text-fg-mute grid h-40 w-full place-items-center rounded-xl border border-dashed"
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
