'use client';

import { useEffect, useEffectEvent, useRef } from 'react';
import type { FC } from 'react';

import { Alert } from '../alert';
import type { Status } from './../../../types/variables';
import type { ToastAction } from './context';

type ToastProps = {
  tone: Status;
  message: string;
  duration: number;
  action?: ToastAction;
  isPaused?: boolean;
  onClose: () => void;
};

export const Toast: FC<ToastProps> = ({
  tone,
  message,
  duration,
  action,
  isPaused = false,
  onClose,
}) => {
  const close = useEffectEvent(onClose);

  // 一時停止をまたいで残り時間を持ち越すため、経過分を都度差し引く
  const remainingRef = useRef(duration);

  useEffect(() => {
    if (isPaused || !Number.isFinite(remainingRef.current)) {
      return undefined;
    }
    // Storybook が Date をモックするため、経過時間は monotonic な performance.now で測る
    const startedAt = performance.now();
    const timeoutId = window.setTimeout(() => {
      close();
    }, remainingRef.current);

    return () => {
      window.clearTimeout(timeoutId);
      remainingRef.current -= performance.now() - startedAt;
    };
  }, [isPaused]);

  return (
    <Alert
      action={action}
      aria-atomic
      message={message}
      onClose={onClose}
      tone={tone}
    />
  );
};
