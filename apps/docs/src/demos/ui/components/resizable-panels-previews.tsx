'use client';

import { ResizablePanels } from '@k8ordo/ui';
import { useState } from 'react';

import styles from './resizable-panels-previews.module.css';

export function ResizablePanelsControlledPreview() {
  const [size, setSize] = useState(30);
  return (
    <div className={styles.root}>
      <p className={styles.value}>Sidebar: {Math.round(size)}%</p>
      <div className={styles.frame}>
        <ResizablePanels.Root onChange={setSize} value={size}>
          <ResizablePanels.Panel>
            <p className={styles.panelText}>Sidebar</p>
          </ResizablePanels.Panel>
          <ResizablePanels.Handle />
          <ResizablePanels.Panel>
            <p className={styles.panelText}>Content</p>
          </ResizablePanels.Panel>
        </ResizablePanels.Root>
      </div>
    </div>
  );
}
