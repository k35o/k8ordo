'use client';

import { useInterval } from '@k8ordo/ui';
import { useCallback, useState } from 'react';

export function UseIntervalPreview() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  useInterval(increment, 1000);

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm">
        Count: <strong>{count}</strong>
      </span>
    </div>
  );
}
