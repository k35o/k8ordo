'use client';

import { useEffect } from 'react';
import type { RefObject } from 'react';

export const useClickAway = <T extends Element = HTMLElement>(
  ref: RefObject<T | null>,
  callback: (e: Event) => void,
  enabled = true,
): void => {
  useEffect(() => {
    if (!enabled) return undefined;

    const handler: EventListener = (e) => {
      const element = ref.current;
      if (element && e.target instanceof Node && !element.contains(e.target)) {
        callback(e);
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [ref, callback, enabled]);
};
