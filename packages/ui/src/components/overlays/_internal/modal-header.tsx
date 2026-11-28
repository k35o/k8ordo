'use client';

import { clsx } from 'clsx';
import type { FC, ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';
import { IconButton } from '../../buttons/icon-button';
import { XIcon } from '../../icons/x';

import styles from './modal-header.module.css';

const CLOSE_SIDE = {
  left: styles.closeLeft,
  right: styles.closeRight,
} as const;

export const ModalHeader: FC<{
  titleId: string;
  title: ReactNode;
  closeSide: 'left' | 'right';
  onClose: () => void;
}> = ({ titleId, title, closeSide, onClose }) => {
  const messages = getMessages();
  return (
    <div className={styles.header}>
      <h2 className={styles.title} id={titleId}>
        {title}
      </h2>
      <div className={clsx(styles.close, CLOSE_SIDE[closeSide])}>
        <IconButton label={messages.close} onClick={onClose} tooltipDisabled>
          <XIcon size="sm" />
        </IconButton>
      </div>
    </div>
  );
};
