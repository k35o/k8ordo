'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FC, PropsWithChildren, Ref } from 'react';

import type { ModalSide } from '../../../types/variables';
import { ToastProvider } from '../../feedback/toast';
import { PortalRootProvider } from '../../providers';
import { ModalDialogProvider } from '../_internal/modal-dialog-context';
import { cn } from './../../../helpers/cn';
import { mergeRefs } from './../../../helpers/merge-refs';

export const Modal: FC<
  PropsWithChildren<{
    ref?: Ref<HTMLDialogElement>;
    side?: ModalSide;
    defaultOpen?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
  }>
> = ({
  ref,
  side = 'center',
  defaultOpen,
  isOpen,
  onClose,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  children,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mergedRef = useMemo(() => mergeRefs(dialogRef, ref), [ref]);
  const [dialogOpen, setDialogOpen] = useState(defaultOpen ?? false);
  const [registeredLabelledBy, setRegisteredLabelledBy] = useState<
    string | undefined
  >(undefined);
  const [registeredDescribedBy, setRegisteredDescribedBy] = useState<
    string | undefined
  >(undefined);

  const realDialogOpen =
    isOpen === true || isOpen === false ? isOpen : dialogOpen;
  const realOnClose = useCallback(() => {
    onClose?.();
    if (isOpen === undefined) {
      return;
    }
    setDialogOpen(false);
  }, [isOpen, onClose]);
  const modalDialogContext = useMemo(
    () => ({
      registerLabelledBy: setRegisteredLabelledBy,
      registerDescribedBy: setRegisteredDescribedBy,
    }),
    [],
  );

  const labelledBy =
    ariaLabelledBy ??
    (ariaLabel === undefined ? registeredLabelledBy : undefined);
  const describedBy = ariaDescribedBy ?? registeredDescribedBy;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || realDialogOpen === dialog.open) {
      return;
    }
    if (realDialogOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [realDialogOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || isOpen !== undefined) return undefined;

    const observer = new MutationObserver(() => {
      setDialogOpen(dialog.open);
    });
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
    return () => {
      observer.disconnect();
    };
  }, [isOpen]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- onClick は枠外(backdrop)クリックで閉じるためのもの。キーボード等価操作はネイティブ modal dialog の Escape が担う
    <dialog
      aria-describedby={describedBy}
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      className={cn(
        'ao-modal bg-bg-raised text-fg-base z-modal shadow-md backdrop:bg-back-drop',
        side === 'center' &&
          'ao-modal-center m-auto max-h-128 w-5/6 max-w-2xl rounded-lg vertical:h-5/6 vertical:max-h-168 vertical:w-auto vertical:max-w-lg',
        side === 'bottom' &&
          'ao-modal-bottom mt-auto w-screen max-w-screen rounded-t-lg',
        side === 'right' &&
          'ao-modal-right ml-auto h-svh max-h-none w-screen max-w-sm rounded-l-lg',
        side === 'left' &&
          'ao-modal-left mr-auto h-svh max-h-none w-screen max-w-sm rounded-r-lg',
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          dialogRef.current?.close();
        }
      }}
      onClose={realOnClose}
      ref={mergedRef}
    >
      <ModalDialogProvider value={modalDialogContext}>
        <PortalRootProvider value={dialogRef}>
          <ToastProvider portalRef={dialogRef} position="absolute">
            {children}
          </ToastProvider>
        </PortalRootProvider>
      </ModalDialogProvider>
    </dialog>
  );
};
