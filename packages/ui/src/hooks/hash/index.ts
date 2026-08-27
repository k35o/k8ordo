'use client';

import { useSyncExternalStore } from 'react';

const getHash = () =>
  typeof window === 'undefined'
    ? null
    : decodeURIComponent(window.location.hash.replace('#', ''));

const subscribe = (callback: () => void) => {
  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = (...args) => {
    originalPushState(...args);
    setTimeout(callback);
  };
  window.history.replaceState = (...args) => {
    originalReplaceState(...args);
    setTimeout(callback);
  };

  window.addEventListener('hashchange', callback);
  return () => {
    window.removeEventListener('hashchange', callback);
  };
};

export const useHash = (): string | null => {
  const hash = useSyncExternalStore<string | null>(
    subscribe,
    () => getHash(),
    () => null,
  );

  return hash;
};
