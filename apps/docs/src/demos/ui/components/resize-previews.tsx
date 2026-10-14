'use client';

import { Button, Resize } from '@k8ordo/ui';
import { useState } from 'react';

import styles from './resize-previews.module.css';

export function ResizeBasicPreview() {
  const [isWide, setIsWide] = useState(false);
  const [count, setCount] = useState(0);
  return (
    <div className={styles.root}>
      <Button
        onAction={() => {
          setIsWide((current) => !current);
        }}
        size="sm"
      >
        Toggle width
      </Button>
      <Resize
        onChange={() => {
          setCount((current) => current + 1);
        }}
      >
        <div className={isWide ? styles.wide : styles.narrow}>
          Notified {count} times
        </div>
      </Resize>
    </div>
  );
}
