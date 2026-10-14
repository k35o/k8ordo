'use client';

import { clsx } from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FC, PropsWithChildren, Ref } from 'react';

import type { ModalSide } from '../../../types/variables';
import { ToastProvider } from '../../feedback/toast';
import { PortalRootProvider } from '../../providers';
import { ModalDialogProvider } from '../_internal/modal-dialog-context';
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
      className={clsx(styles.root, highContrast.edge, SIDE[side])}
      onClick={(e) => {
        if (e.target === e.currentTarget && dialogRef.current) {
          dialogRef.current.close();
        }
      }}
      onClose={onClose}
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
