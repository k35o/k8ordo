'use client';

import { useEffect } from 'react';
import type { RefObject } from 'react';

type UseIntersectionObserverOptions = {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  once?: boolean;
};

export const useIntersectionObserver = <T extends Element = HTMLElement>(
  ref: RefObject<T | null>,
  callback: (entry: IntersectionObserverEntry) => void,
  options: UseIntersectionObserverOptions = {},
): void => {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    once = false,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          callback(entry);
          if (once && entry.isIntersecting) {
            observer.disconnect();
          }
        }
      },
      { threshold, root, rootMargin },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback, threshold, root, rootMargin, once]);
};
