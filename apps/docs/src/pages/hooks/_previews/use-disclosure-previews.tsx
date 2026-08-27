'use client';

import { Button, useDisclosure } from '@k8ordo/ui';

export function UseDisclosurePreview() {
  const { isOpen, open, close, toggle } = useDisclosure();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button onClick={toggle} size="sm">
          Toggle
        </Button>
        <Button color="base" onClick={open} size="sm">
          Open
        </Button>
        <Button color="base" onClick={close} size="sm">
          Close
        </Button>
      </div>
      <p className="text-fg-base">
        State: <span className="font-medium">{isOpen ? 'Open' : 'Closed'}</span>
      </p>
      {isOpen ? (
        <div className="border-border-mute bg-bg-subtle rounded-lg border p-4">
          <p className="text-fg-base">Content is visible</p>
        </div>
      ) : null}
    </div>
  );
}
