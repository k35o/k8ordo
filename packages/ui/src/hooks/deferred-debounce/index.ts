'use client';

import { useDeferredValue } from 'react';

export const useDeferredDebounce = <T>(
  value: T,
  initialValue?: T,
): readonly [T, boolean] => {
  const deferredValue = useDeferredValue(value, initialValue);
  const isPending = !Object.is(deferredValue, value);
  return [deferredValue, isPending] as const;
};
