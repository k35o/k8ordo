'use client';

import { useWindowSize } from '@k8ordo/ui';

export function UseWindowSizePreview() {
  const { width, height } = useWindowSize();

  return (
    <div className="flex items-center gap-4 text-sm">
      <span>
        Width: <strong>{width}px</strong>
      </span>
      <span>
        Height: <strong>{height}px</strong>
      </span>
    </div>
  );
}
