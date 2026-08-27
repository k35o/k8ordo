'use client';

import { useSyncExternalStore } from 'react';

type Size = {
  width: number;
  height: number;
};

let cachedSnapshot: Size = { width: 0, height: 0 };

const getSnapshot = (): Size => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (cachedSnapshot.width === w && cachedSnapshot.height === h) {
    return cachedSnapshot;
  }
  cachedSnapshot = { width: w, height: h };
  return cachedSnapshot;
};

const SERVER_SNAPSHOT: Size = { width: 0, height: 0 };
const getServerSnapshot = (): Size => SERVER_SNAPSHOT;

const subscribe = (callback: () => void): (() => void) => {
  window.addEventListener('resize', callback);
  return () => {
    window.removeEventListener('resize', callback);
  };
};

export const useWindowSize = (): Size =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
