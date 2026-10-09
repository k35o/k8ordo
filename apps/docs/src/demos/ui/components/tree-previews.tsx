'use client';

import { Tree } from '@k8ordo/ui';
import type { TreeItem } from '@k8ordo/ui';
import { useState } from 'react';

const FILES: TreeItem[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'button.tsx' },
          { id: 'card', label: 'card.tsx' },
        ],
      },
      { id: 'index', label: 'index.ts' },
    ],
  },
  { id: 'package', label: 'package.json' },
  { id: 'readme', label: 'README.md' },
];

export function TreePreview() {
  return (
    <div className="w-64">
      <Tree defaultExpandedIds={['src']} items={FILES} label="Files" />
    </div>
  );
}

export function TreeControlledPreview() {
  const [expandedIds, setExpandedIds] = useState<readonly string[]>([
    'src',
    'components',
  ]);
  const [selectedId, setSelectedId] = useState<string | null>('card');
  return (
    <div className="flex w-64 flex-col gap-4">
      <Tree
        expandedIds={expandedIds}
        items={FILES}
        label="Files"
        onChange={setSelectedId}
        onExpandedChange={setExpandedIds}
        selectedId={selectedId}
      />
      <p className="text-fg-mute text-sm">Selected: {selectedId}</p>
    </div>
  );
}
