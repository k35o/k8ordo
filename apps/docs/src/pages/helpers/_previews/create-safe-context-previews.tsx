'use client';

import { createSafeContext } from '@k8ordo/ui';
import { useState } from 'react';
import type { FC, PropsWithChildren } from 'react';

type CounterValue = {
  count: number;
  increment: () => void;
};

const [CounterContext, useCounter] = createSafeContext<CounterValue>(
  'useCounter must be used within CounterProvider',
);

const CounterProvider: FC<PropsWithChildren> = ({ children }) => {
  const [count, setCount] = useState(0);

  return (
    <CounterContext
      value={{
        count,
        increment: () => {
          setCount((c) => c + 1);
        },
      }}
    >
      {children}
    </CounterContext>
  );
};

const CounterDisplay: FC = () => {
  const { count, increment } = useCounter();

  return (
    <div className="flex items-center gap-3">
      <span className="text-fg-base text-sm">count: {count}</span>
      <button
        className="bg-primary-bg text-primary-fg rounded-lg px-3 py-1 text-sm"
        onClick={increment}
        type="button"
      >
        +1
      </button>
    </div>
  );
};

export function CreateSafeContextPreview() {
  return (
    <CounterProvider>
      <CounterDisplay />
    </CounterProvider>
  );
}
