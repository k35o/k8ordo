'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

type UseScrollLockReturn = {
  lock: () => void;
  unlock: () => void;
};

type LockEntry = {
  count: number;
  originalOverflow: string;
};

const lockRegistry = new WeakMap<HTMLElement, LockEntry>();

const resolveTarget = (target?: RefObject<HTMLElement | null>): HTMLElement =>
  target?.current ?? document.body;

export const useScrollLock = (
  target?: RefObject<HTMLElement | null>,
): UseScrollLockReturn => {
  const isLockedRef = useRef(false);
  const lockedElementRef = useRef<HTMLElement | null>(null);

  const lock = useCallback(() => {
    if (isLockedRef.current) return;
    const element = resolveTarget(target);
    isLockedRef.current = true;
    lockedElementRef.current = element;
    const entry = lockRegistry.get(element);
    if (entry) {
      entry.count++;
    } else {
      lockRegistry.set(element, {
        count: 1,
        originalOverflow: element.style.overflow,
      });
      element.style.overflow = 'hidden';
    }
  }, [target]);

  const unlock = useCallback(() => {
    if (!isLockedRef.current) return;
    const element = lockedElementRef.current;
    if (!element) return;
    isLockedRef.current = false;
    lockedElementRef.current = null;
    const entry = lockRegistry.get(element);
    if (!entry) return;
    entry.count--;
    if (entry.count === 0) {
      element.style.overflow = entry.originalOverflow;
      lockRegistry.delete(element);
    }
  }, []);

  useEffect(
    () => () => {
      if (isLockedRef.current) {
        const element = lockedElementRef.current;
        isLockedRef.current = false;
        lockedElementRef.current = null;
        if (!element) return;
        const entry = lockRegistry.get(element);
        if (!entry) return;
        entry.count--;
        if (entry.count === 0) {
          element.style.overflow = entry.originalOverflow;
          lockRegistry.delete(element);
        }
      }
    },
    [],
  );

  return { lock, unlock };
};
