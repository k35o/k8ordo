'use client';

import { useScrollDirection } from '@k8ordo/ui';
import { useRef } from 'react';

export function UseScrollDirectionPreview() {
  const { x, y } = useScrollDirection();

  return (
    <div className="flex items-center gap-4 text-sm">
      <span>
        Vertical: <strong>{y}</strong>
      </span>
      <span>
        Horizontal: <strong>{x}</strong>
      </span>
    </div>
  );
}

export function UseScrollDirectionTargetPreview() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { y } = useScrollDirection({ target: scrollRef, threshold: 20 });

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="text-sm">
        Vertical: <strong>{y}</strong>
      </div>
      <div
        className="border-border-mute bg-bg-base h-32 w-full overflow-auto rounded-md border p-3"
        ref={scrollRef}
      >
        <div className="from-primary-bg-subtle to-bg-base text-fg-mute h-96 bg-linear-to-b p-3 text-sm">
          Scroll this area to see its scroll direction being detected.
        </div>
      </div>
    </div>
  );
}
