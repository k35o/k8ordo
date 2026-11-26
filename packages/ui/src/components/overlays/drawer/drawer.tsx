'use client';

import { useId, useMemo, useRef } from 'react';
import type { FC, PropsWithChildren, ReactNode, Ref } from 'react';

import { mergeRefs } from '../../../helpers/merge-refs';
import type { DrawerSide } from '../../../types/variables';
import { ModalHeader } from '../_internal/modal-header';
import { Modal } from '../modal';

import styles from './drawer.module.css';

export const Drawer: FC<
  PropsWithChildren<{
    /** The heading (`h2`) drawn with a close button. It names the drawer. */
    title: ReactNode;
    side?: DrawerSide;
    /** Drawn above the children; the only text the drawer is described by. */
    description?: ReactNode;
    isOpen?: boolean;
    defaultOpen?: boolean;
    /** Called when the drawer closes while it is meant to be open, never when `isOpen` turns false. */
    onClose?: () => void;
    ref?: Ref<HTMLDialogElement>;
  }>
> = ({
  title,
  side = 'right',
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
      aria-labelledby={titleId}
      defaultOpen={defaultOpen}
      isOpen={isOpen}
      onClose={onClose}
      ref={mergedRef}
      side={side}
    >
      <div className={styles.root}>
        <ModalHeader
          closeSide={side}
          onClose={() => {
            dialogRef.current?.close();
          }}
          title={title}
          titleId={titleId}
        />
        <div className={styles.content}>
          {description === undefined ? null : (
            <div className={styles.description} id={descriptionId}>
              {description}
            </div>
          )}
          {children}
        </div>
      </div>
    </Modal>
  );
};
