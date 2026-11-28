'use client';

import { useId, useMemo, useRef } from 'react';
import type { FC, PropsWithChildren, ReactNode, Ref } from 'react';

import { mergeRefs } from '../../../helpers/merge-refs';
import type { DialogSide } from '../../../types/variables';
import { ModalHeader } from '../_internal/modal-header';
import { Modal } from '../modal';

import styles from './dialog.module.css';

type Props = PropsWithChildren<
  (
    | {
        /** The heading (`h2`) drawn with a close button. It names the dialog. */
        title: ReactNode;
        label?: never;
      }
    | {
        /** The dialog's name when it draws no heading. */
        label: string;
        title?: never;
      }
  ) & {
    side?: DialogSide;
    role?: 'dialog' | 'alertdialog';
    /** Drawn above the children; the only text the dialog is described by. */
    description?: ReactNode;
    isOpen?: boolean;
    defaultOpen?: boolean;
    /** Called when the dialog closes while it is meant to be open, never when `isOpen` turns false. */
    onClose?: () => void;
    ref?: Ref<HTMLDialogElement>;
  }
>;

export const Dialog: FC<Props> = ({
  title,
  label,
  side = 'center',
  role,
  description,
  isOpen,
  defaultOpen,
  onClose,
  ref,
  children,
}) => {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mergedRef = useMemo(() => mergeRefs(dialogRef, ref), [ref]);

  return (
    <Modal
      aria-describedby={description === undefined ? undefined : descriptionId}
      aria-labelledby={title === undefined ? undefined : titleId}
      defaultOpen={defaultOpen}
      isOpen={isOpen}
      label={label}
      onClose={onClose}
      ref={mergedRef}
      role={role}
      side={side}
    >
      {title === undefined ? null : (
        <ModalHeader
          closeSide="right"
          onClose={() => {
            dialogRef.current?.close();
          }}
          title={title}
          titleId={titleId}
        />
      )}
      <div className={styles.content}>
        {description === undefined ? null : (
          <div className={styles.description} id={descriptionId}>
            {description}
          </div>
        )}
        {children}
      </div>
    </Modal>
  );
};
