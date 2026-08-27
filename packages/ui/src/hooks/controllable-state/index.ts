'use client';

import { useCallback, useRef, useState } from 'react';

type UseControllableStateProps<T> = {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
};

export const useControllableState = <T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateProps<T>): [T, (next: T | ((prev: T) => T)) => void] => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  const currentValueRef = useRef(currentValue);
  currentValueRef.current = currentValue;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const isControlledRef = useRef(isControlled);
  isControlledRef.current = isControlled;

  const setValue = useCallback((next: T | ((prev: T) => T)) => {
    const nextValue =
      typeof next === 'function'
        ? (next as (prev: T) => T)(currentValueRef.current)
        : next;

    if (!isControlledRef.current) {
      setInternalValue(nextValue);
    }
    onChangeRef.current?.(nextValue);
  }, []);

  return [currentValue, setValue];
};
