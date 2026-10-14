'use client';

import { Tree } from '@k8ordo/ui';
import type { TreeItem } from '@k8ordo/ui';
import { useState } from 'react';

import styles from './tree-previews.module.css';

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
    <div className={styles.frame}>
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
    <div className={styles.root}>
      <Tree
        expandedIds={expandedIds}
        items={FILES}
        label="Files"
        onChange={setSelectedId}
        onExpandedChange={setExpandedIds}
        selectedId={selectedId}
      />
      <p className={styles.selection}>Selected: {selectedId}</p>
    </div>
  );
}
