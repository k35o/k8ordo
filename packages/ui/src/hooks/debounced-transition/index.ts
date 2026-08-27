'use client';

import { useCallback, useEffect, useRef, useTransition } from 'react';

export type DebouncedAction = (signal: AbortSignal) => void | Promise<void>;

export const useDebouncedTransition = (
  delay: number,
): readonly [boolean, (action: DebouncedAction) => void] => {
  const [isPending, startTransition] = useTransition();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  const run = useCallback(
    (action: DebouncedAction) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const { signal } = controller;

      startTransition(async () => {
        try {
          await delayWithSignal(delay, signal);
        } catch {
          return;
        }
        if (signal.aborted) return;
        try {
          await action(signal);
        } catch (error) {
          if (isAbortError(error)) return;
          throw error;
        }
      });
    },
    [delay],
  );

  return [isPending, run] as const;
};

const toAbortError = (reason: unknown): Error =>
  reason instanceof Error ? reason : new DOMException('aborted', 'AbortError');

const delayWithSignal = (ms: number, signal: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(toAbortError(signal.reason));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(toAbortError(signal.reason));
      },
      { once: true },
    );
  });

const isAbortError = (error: unknown): boolean => {
  if (error instanceof DOMException && error.name === 'AbortError') return true;
  if (error instanceof Error && error.name === 'AbortError') return true;
  return false;
};
