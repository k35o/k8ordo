'use client';

import { Button, Resize } from '@k8ordo/ui';
import { useState } from 'react';

export function ResizeBasicPreview() {
  const [isWide, setIsWide] = useState(false);
  const [count, setCount] = useState(0);
  return (
    <div className="flex w-full flex-col items-start gap-3">
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
        <div
          className={
            isWide
              ? 'bg-primary-bg-subtle w-full rounded-lg p-4 whitespace-nowrap'
              : 'bg-primary-bg-subtle w-1/2 rounded-lg p-4 whitespace-nowrap'
          }
        >
          Notified {count} times
        </div>
      </Resize>
    </div>
  );
}
