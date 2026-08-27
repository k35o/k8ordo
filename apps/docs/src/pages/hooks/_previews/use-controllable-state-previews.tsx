'use client';

import { Button, useControllableState } from '@k8ordo/ui';

export function UseControllableStatePreview() {
  const [count, setCount] = useControllableState({ defaultValue: 0 });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button
          onClick={() => {
            setCount((prev) => prev + 1);
          }}
          size="sm"
        >
          Increment
        </Button>
        <Button
          color="base"
          onClick={() => {
            setCount(0);
          }}
          size="sm"
        >
          Reset
        </Button>
      </div>
      <p className="text-fg-base">
        Count: <span className="font-medium">{count}</span>
      </p>
    </div>
  );
}
