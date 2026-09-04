'use client';

import { mergeProps } from '@k8ordo/ui';
import { useState } from 'react';

export function MergePropsPreview() {
  const [count, setCount] = useState(0);

  const baseProps = {
    className: 'rounded-lg border px-4 py-2 text-sm',
    onClick: () => {
      setCount((c) => c + 1);
    },
  };

  const overrideProps = {
    className: 'border-primary-border bg-primary-bg-subtle text-primary-fg',
    onClick: () => {
      setCount((c) => c + 10);
    },
  };

  const merged = mergeProps(baseProps, overrideProps);

  return (
    <div className="flex flex-col gap-3">
      <button {...merged} type="button">
        Click me (count: {count})
      </button>
      <p className="text-fg-mute text-sm">
        Both onClick handlers run; classNames merged with cn.
      </p>
    </div>
  );
}
