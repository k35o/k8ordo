'use client';

import { clsx } from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FC, PropsWithChildren, Ref } from 'react';

import type { ModalSide } from '../../../types/variables';
import { ToastProvider } from '../../feedback/toast';
import { PortalRootProvider } from '../../providers';
import { mergeRefs } from './../../../helpers/merge-refs';

import highContrast from '../../_internal/high-contrast.module.css';
import styles from './modal.module.css';

const SIDE = {
  center: styles.center,
  bottom: styles.bottom,
  right: styles.right,
  left: styles.left,
} as const;

export const Modal: FC<
  PropsWithChildren<{
    ref?: Ref<HTMLDialogElement> | undefined;
    side?: ModalSide;
    role?: 'dialog' | 'alertdialog' | undefined;
    defaultOpen?: boolean | undefined;
    isOpen?: boolean | undefined;
    onClose?: (() => void) | undefined;
    label?: string | undefined;
    'aria-labelledby'?: string | undefined;
    'aria-describedby'?: string | undefined;
  }>
> = ({
  ref,
  side = 'center',
  role,
  defaultOpen,
  isOpen,
  onClose,
  label,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  children,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mergedRef = useMemo(() => mergeRefs(dialogRef, ref), [ref]);
  const [dialogOpen, setDialogOpen] = useState(defaultOpen ?? false);
  const open = isOpen ?? dialogOpen;

  // 閉じるのは後始末に任せる。依存が変わったときも、Activity で隠れて effect が
  // 外れたときも、showModal した <dialog> が文書を inert にしたまま残らない
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || dialog === null) {
      return undefined;
    }
    if (!dialog.open) {
      dialog.showModal();
    }
    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [open]);

  // ref の showModal() で開かれたときに、非制御の state を開いた側へそろえる。
  // 閉じた側は close イベントで受ける
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || isOpen !== undefined) return undefined;

    const observer = new MutationObserver(() => {
      if (dialog.open) {
        setDialogOpen(true);
      }
    });
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
    return () => {
      observer.disconnect();
    };
  }, [isOpen]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- onClick は枠外(backdrop)クリックで閉じるためのもの。キーボード等価操作はネイティブ modal dialog の Escape が担う
    <dialog
      aria-describedby={ariaDescribedBy}
      aria-label={label}
      aria-labelledby={ariaLabelledBy}
      className={clsx(styles.root, highContrast.edge, SIDE[side])}
      onClick={(e) => {
        if (e.target === e.currentTarget && dialogRef.current) {
          dialogRef.current.close();
        }
      }}
      onClose={(event) => {
        // 呼び出し側が閉じたとき（state がもう閉じている）は知らせない。StrictMode
        // が effect を付け直すと、後始末の close のイベントは開き直した後に届く
        if (!open || event.currentTarget.open) {
          return;
        }
        setDialogOpen(false);
        onClose?.();
      }}
      ref={mergedRef}
      role={role === 'alertdialog' ? role : undefined}
    >
      <PortalRootProvider value={dialogRef}>
        <ToastProvider portalRef={dialogRef} position="absolute">
          {children}
        </ToastProvider>
      </PortalRootProvider>
    </dialog>
  );
};
