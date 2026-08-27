'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

export type HoverIntent = {
  hoverStart: () => void;
  hoverEnd: () => void;
  cancel: () => void;
};

/**
 * hover の出入りに開閉の猶予（delay）を与えるタイマー制御。
 *
 * trigger と content が同じインスタンスを共有することで、trigger を離れて
 * content へポインタを移す間に予約された close をキャンセルできる。
 * open と close の意図は同時に成立しないため、タイマーは 1 本を使い回す。
 *
 * タッチデバイス（hover 不能環境）では enabled=false を渡すとハンドラが
 * 何もしなくなるため、呼び出し側で handler を差し替える必要はない。
 */
export const useHoverIntent = ({
  onOpen,
  onClose,
  openDelay = 0,
  closeDelay = 0,
  enabled = true,
}: {
  onOpen: () => void;
  onClose: () => void;
  openDelay?: number;
  closeDelay?: number;
  enabled?: boolean;
}): HoverIntent => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // アンマウント後にタイマーが発火して閉じた状態の popover を再度開かないようにする。
  useEffect(() => cancel, [cancel]);

  const hoverStart = useCallback(() => {
    if (!enabled) {
      return;
    }
    cancel();
    if (openDelay > 0) {
      timerRef.current = setTimeout(onOpen, openDelay);
    } else {
      onOpen();
    }
  }, [cancel, onOpen, openDelay, enabled]);

  const hoverEnd = useCallback(() => {
    if (!enabled) {
      return;
    }
    cancel();
    if (closeDelay > 0) {
      timerRef.current = setTimeout(onClose, closeDelay);
    } else {
      onClose();
    }
  }, [cancel, onClose, closeDelay, enabled]);

  return useMemo(
    () => ({ hoverStart, hoverEnd, cancel }),
    [hoverStart, hoverEnd, cancel],
  );
};
