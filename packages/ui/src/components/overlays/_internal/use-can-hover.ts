'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * hover 系メディアクエリの現在値を購読する。
 * SSR ではサーバースナップショットとして true を返し、hover 前提の
 * props を初期レンダーに含めてもハイドレーション差分にならないようにする。
 */
export const useCanHover = (query = '(hover: hover)'): boolean => {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', cb);
      return () => {
        mql.removeEventListener('change', cb);
      };
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => true,
  );
};
