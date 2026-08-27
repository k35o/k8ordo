'use client';

import { useEffect } from 'react';

type Size = {
  width: number;
  height: number;
};

type Options = {
  enabled?: boolean;
};

export const useWindowResize = (
  callback: (size: Size) => void,
  options: Options = {},
): void => {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) return undefined;

    const handleResize = () => {
      callback({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [callback, enabled]);
};
