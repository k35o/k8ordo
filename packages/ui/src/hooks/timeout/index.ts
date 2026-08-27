'use client';

import { useEffect, useRef } from 'react';

export const useTimeout = (callback: () => void, delay: number): void => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      callbackRef.current();
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delay]);
};
