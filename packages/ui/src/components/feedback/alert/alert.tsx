import { clsx } from 'clsx';
import type { FC, HTMLAttributes, ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';
import {
  STATUS_ICON,
  STATUS_MESSAGE_KEY,
  STATUS_SURFACE,
} from '../../_internal/status-tone';
import { IconButton } from '../../buttons/icon-button';
import { AlertIcon } from '../../icons/alert';
import { XIcon } from '../../icons/x';
import type { Status } from './../../../types/variables';

import highContrast from '../../_internal/high-contrast.module.css';
import srOnly from '../../_internal/sr-only.module.css';
import styles from './alert.module.css';

type Props = {
  tone: Status;
  message: string | string[];
  /** A link or button, placed after a one-line message or below a list. */
  action?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
} & Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'role' | 'className' | 'style'
>;

export const Alert: FC<Props> = ({
  tone,
  message,
  action,
  onClose,
  closeLabel,
  ...rest
}) => {
  const messages = getMessages();
  const hasAction =
    action !== undefined && action !== null && typeof action !== 'boolean';
  const inlineAction = hasAction ? (
    <span className={styles.inlineAction}>{action}</span>
  ) : null;

  let messageContent: ReactNode;
  if (Array.isArray(message) && message.length > 1) {
    const list = (
      <ul>
        {message.map((msg, index) => (
          // eslint-disable-next-line react/no-array-index-key -- 同じ文が並びうる、並べ替えのない静的な列
          <li className={styles.listItem} key={`${msg}-${index}`}>
            {msg}
          </li>
        ))}
      </ul>
    );
    messageContent = hasAction ? (
      <div>
        {list}
        <div className={styles.listAction}>{action}</div>
      </div>
    ) : (
      list
    );
  } else {
    const text = Array.isArray(message) ? message[0] : message;
    messageContent = (
      <p className={styles.message}>
        {text}
        {inlineAction}
      </p>
    );
  }

  return (
    <div
      {...rest}
      className={clsx(styles.root, highContrast.edge, STATUS_SURFACE[tone])}
      role={tone === 'error' || tone === 'warning' ? 'alert' : 'status'}
    >
      <span className={clsx(styles.icon, STATUS_ICON[tone])}>
        <AlertIcon size="md" status={tone} />
        <span className={srOnly.srOnly}>
          {messages[STATUS_MESSAGE_KEY[tone]]}
        </span>
      </span>
      <div className={styles.body}>{messageContent}</div>
      {onClose ? (
        <span className={styles.close}>
          <IconButton
            label={closeLabel ?? messages.close}
            onClick={onClose}
            size="sm"
            tooltipDisabled
          >
            <XIcon size="sm" />
          </IconButton>
        </span>
      ) : null}
    </div>
  );
};
