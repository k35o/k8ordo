'use client';

import { createContext, use, useMemo } from 'react';
import type { FC, PropsWithChildren } from 'react';

import { ja } from './ja';
import type { Messages } from './messages';

// Provider 未設置でも既定辞書で描画できるよう、createSafeContext(未設定で throw)
// ではなく素の context にする
const MessagesContext = createContext<Messages | undefined>(undefined);

export const useMessages = (): Messages => use(MessagesContext) ?? ja;

export const MessagesProvider: FC<
  PropsWithChildren<{ messages?: Partial<Messages> | undefined }>
> = ({ messages, children }) => {
  const value = useMemo(
    () => (messages === undefined ? ja : { ...ja, ...messages }),
    [messages],
  );

  return <MessagesContext value={value}>{children}</MessagesContext>;
};
