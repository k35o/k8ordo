'use client';

import { ScrollLinked } from '@k8ordo/ui';
import { useRef } from 'react';

export function ScrollLinkedBasicPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="w-full">
      <section
        aria-label="Scroll demo container"
        className="border-border-mute relative h-64 overflow-y-scroll rounded-lg border"
        ref={containerRef}
        // キーボードでもスクロールできるよう section にフォーカスを許可
        // oxlint-disable-next-line eslint-plugin-jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <ScrollLinked container={containerRef} />
        <div className="h-200 p-4">
          <p className="mb-4 text-lg font-bold">Scroll this container</p>
          <p className="text-fg-mute mb-4">
            The progress bar at the top tracks your scroll position.
          </p>
          <div className="space-y-4">
            {Array.from({ length: 15 }, (_, i) => (
              <p className="bg-bg-mute rounded-lg p-4" key={`block-${i}`}>
                Content block {i + 1}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
