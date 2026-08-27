'use client';

import type { FC, PropsWithChildren } from 'react';

import { MessagesProvider } from '../../i18n/context';
import type { Messages } from '../../i18n/messages';
import { ToastProvider } from '../feedback/toast';

// アニメーションは全て CSS で実装しており、reduced motion は base.css の
// @media (prefers-reduced-motion) が一元処理するため、Provider の責務は
// トーストと文言辞書のみ
export const UIProvider: FC<
  PropsWithChildren<{ messages?: Partial<Messages> | undefined }>
> = ({ messages, children }) => (
  <MessagesProvider messages={messages}>
    <ToastProvider>{children}</ToastProvider>
  </MessagesProvider>
);
