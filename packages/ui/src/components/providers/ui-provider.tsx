'use client';

import type { FC, PropsWithChildren } from 'react';

import { ToastProvider } from '../feedback/toast';

// アニメーションは全て CSS で実装しており、reduced motion は base.css の
// @media (prefers-reduced-motion) が一元処理する。組み込みの文言は
// @k8ordo/i18n のロケールから読むので、Provider の責務はトーストだけ
export const UIProvider: FC<PropsWithChildren> = ({ children }) => (
  <ToastProvider>{children}</ToastProvider>
);
