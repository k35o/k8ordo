'use client';

import { mergeRefs } from '@k8ordo/ui';
import { useEffect, useRef, useState } from 'react';

export function MergeRefsPreview() {
  const internalRef = useRef<HTMLInputElement>(null);
  const externalRef = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (internalRef.current) {
      setWidth(internalRef.current.offsetWidth);
    }
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <input
        aria-label="Sample input"
        className="border-border-mute rounded-lg border px-3 py-2 text-sm"
        placeholder="Type something..."
        ref={mergeRefs(internalRef, externalRef)}
      />
      <p className="text-fg-mute text-sm">
        Both refs point to the same input. Measured width:{' '}
        {width === null ? '...' : `${width.toString()}px`}
      </p>
    </div>
  );
}
