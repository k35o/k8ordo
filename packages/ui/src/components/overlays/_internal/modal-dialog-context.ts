'use client';

import { createContext, use } from 'react';

export type ModalDialogContextValue = {
  registerLabelledBy: (id: string | undefined) => void;
  registerDescribedBy: (id: string | undefined) => void;
};

const ModalDialogContext = createContext<ModalDialogContextValue | null>(null);

export const ModalDialogProvider = ModalDialogContext;

/**
 * Modal（ネイティブ `<dialog>`）配下かどうか。配下なら値が返り、単体利用では null。
 * createSafeContext を使わないのは、Popover 内・単体でも動く Dialog.Root から
 * 「Modal 配下ではない」を例外なしで判定するため。
 */
export const useModalDialogContext = (): ModalDialogContextValue | null =>
  use(ModalDialogContext);
