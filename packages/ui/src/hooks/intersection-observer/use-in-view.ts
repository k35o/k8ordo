'use client';

import { useCallback, useState } from 'react';
import type { RefObject } from 'react';

import { useIntersectionObserver } from './use-intersection-observer';

type UseInViewOptions = {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  once?: boolean;
};

export const useInView = <T extends Element = HTMLElement>(
  ref: RefObject<T | null>,
  options: UseInViewOptions = {},
): boolean => {
  const { once = false, ...observerOptions } = options;
  const [isInView, setIsInView] = useState(false);

  const handleEntry = useCallback((entry: IntersectionObserverEntry) => {
    setIsInView(entry.isIntersecting);
  }, []);

  useIntersectionObserver(ref, handleEntry, { ...observerOptions, once });

  return isInView;
};
