'use client';

import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, timeout: number): void => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      callbackRef.current();
    }, timeout);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [timeout]);
};
