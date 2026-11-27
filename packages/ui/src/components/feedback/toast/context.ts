'use client';

import type { ReactNode } from 'react';

import { createSafeContext } from './../../../helpers/create-safe-context';
import type { Status } from './../../../types/variables';

export type ToastOptions = {
  /**
   * 自動で閉じるまでのミリ秒。`Number.POSITIVE_INFINITY` で自動クローズなし
   * （閉じるボタンでのみ閉じる）。既定は 5000ms。
   */
  duration?: number;
  /** A link or button drawn in the toast, as `Alert`'s `action`. */
  action?: ReactNode;
};

export type ToastType = {
  id: string;
  tone: Status;
  message: string;
  duration: number;
  action?: ReactNode;
  /**
   * 開いた時点のフォーカス位置。閉じたときの返還先候補として使う。
   * 参照を握り続けて DOM のリークを起こさないよう WeakRef で持つ。
   */
  opener?: WeakRef<HTMLElement>;
};

export type ToastStore = {
  open: (tone: Status, message: string, options?: ToastOptions) => string;
  close: (id: string) => void;
  closeAll: () => void;
};

export const [ToastStoreContext, useToastStore] = createSafeContext<ToastStore>(
  'useToast must be used within a ToastProvider',
);

export const useToast = (): ToastStore => useToastStore();
