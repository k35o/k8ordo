'use client';

import { ResizablePanels } from '@k8ordo/ui';
import { useState } from 'react';

export function ResizablePanelsControlledPreview() {
  const [size, setSize] = useState(30);
  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-fg-mute text-sm tabular-nums">
        Sidebar: {Math.round(size)}%
      </p>
      <div className="border-border-base h-48 w-full overflow-hidden rounded-lg border">
        <ResizablePanels.Root onChange={setSize} value={size}>
          <ResizablePanels.Panel>
            <p className="p-4 text-sm">Sidebar</p>
          </ResizablePanels.Panel>
          <ResizablePanels.Handle />
          <ResizablePanels.Panel>
            <p className="p-4 text-sm">Content</p>
          </ResizablePanels.Panel>
        </ResizablePanels.Root>
      </div>
    </div>
  );
}
