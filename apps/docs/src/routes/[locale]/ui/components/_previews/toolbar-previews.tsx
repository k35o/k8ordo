'use client';

import {
  Button,
  CopyIcon,
  IconButton,
  LinkIcon,
  ListIcon,
  TableIcon,
  Toolbar,
} from '@k8ordo/ui';
import type { ComponentProps } from 'react';
import { useState } from 'react';

export function ToolbarPreview({
  orientation,
}: Pick<ComponentProps<typeof Toolbar.Root>, 'orientation'>) {
  const [isList, setIsList] = useState(false);
  return (
    <Toolbar.Root aria-label="Formatting" orientation={orientation}>
      <Toolbar.Item
        renderItem={(props) => (
          <IconButton {...props} label="Copy">
            <CopyIcon size="sm" />
          </IconButton>
        )}
      />
      <Toolbar.Item
        renderItem={(props) => (
          <IconButton {...props} label="Link">
            <LinkIcon size="sm" />
          </IconButton>
        )}
      />
      <Toolbar.Item
        renderItem={(props) => (
          <IconButton
            {...props}
            aria-pressed={isList}
            label="Bulleted list"
            onClick={() => {
              setIsList((current) => !current);
            }}
          >
            <ListIcon size="sm" />
          </IconButton>
        )}
      />
      <Toolbar.Item
        renderItem={(props) => (
          <IconButton {...props} disabled label="Table">
            <TableIcon size="sm" />
          </IconButton>
        )}
      />
      <Toolbar.Separator />
      <Toolbar.Item
        renderItem={(props) => (
          <Button {...props} size="sm">
            Save
          </Button>
        )}
      />
    </Toolbar.Root>
  );
}
