'use client';

import { Button, useScrollLock } from '@k8ordo/ui';
import { useRef } from 'react';

export function UseScrollLockPreview() {
  const { lock, unlock } = useScrollLock();

  return (
    <div className="flex gap-2">
      <Button onClick={lock} size="sm">
        Lock body
      </Button>
      <Button color="base" onClick={unlock} size="sm">
        Unlock body
      </Button>
    </div>
  );
}

export function UseScrollLockTargetPreview() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { lock, unlock } = useScrollLock(scrollRef);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex gap-2">
        <Button onClick={lock} size="sm">
          Lock area
        </Button>
        <Button color="base" onClick={unlock} size="sm">
          Unlock area
        </Button>
      </div>
      <div
        className="border-border-mute bg-bg-base h-32 w-full overflow-auto rounded-md border p-3"
        ref={scrollRef}
      >
        <div className="from-primary-bg-subtle to-bg-base text-fg-mute h-96 bg-linear-to-b p-3 text-sm">
          Try scrolling this area. Pressing Lock area stops scrolling for this
          element only.
        </div>
      </div>
    </div>
  );
}
