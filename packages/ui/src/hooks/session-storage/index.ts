'use client';

import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react';

const dispatchStorageEvent = (key: string, newValue: string | null) =>
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }));

const getSessionStorageItem = (key: string) =>
  window.sessionStorage.getItem(key);

const sessionStorageSubscribe = (cb: () => void) => {
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener('storage', cb);
  };
};

export const useSessionStorage = <T>(key: string, initialValue: T) => {
  const initialValueRef = useRef(initialValue);
  const getSnapshot = () => getSessionStorageItem(key);
  const store = useSyncExternalStore(
    sessionStorageSubscribe,
    getSnapshot,
    () => null,
  );

  const current = useMemo(() => {
    try {
      if (store === null) {
        return initialValueRef.current;
      }
      return JSON.parse(store) as T;
    } catch (e) {
      console.error(e);
      return initialValueRef.current;
    }
  }, [store]);

  const handleRemove = useCallback(() => {
    window.sessionStorage.removeItem(key);
    dispatchStorageEvent(key, null);
  }, [key]);

  const setState = useCallback(
    (value: T) => {
      if (value === undefined || value === null) {
        handleRemove();
      } else {
        const stringifiedValue = JSON.stringify(value);
        window.sessionStorage.setItem(key, stringifiedValue);
        dispatchStorageEvent(key, stringifiedValue);
      }
    },
    [key, handleRemove],
  );

  return [current, setState, handleRemove] as const;
};
