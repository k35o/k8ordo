'use client';

import { useInView } from '@k8ordo/ui';
import { useRef } from 'react';

export function UseInViewPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold: 0.5 });

  return (
    <div className="flex flex-col gap-4">
      <div
        className="border-border-mute bg-bg-subtle rounded-lg border p-6 text-center transition-colors"
        ref={ref}
      >
        <p className="text-fg-base font-medium">
          {isInView ? 'Visible' : 'Not visible'}
        </p>
      </div>
    </div>
  );
}
