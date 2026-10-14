import { clsx } from 'clsx';
import type { FC, HTMLAttributes, ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';
import {
  STATUS_ICON,
  STATUS_MESSAGE_KEY,
  STATUS_SURFACE,
} from '../../_internal/status-tone';
import { IconButton } from '../../buttons/icon-button';
import { AlertIcon, CloseIcon } from '../../icons';
import type { Status } from './../../../types/variables';

import highContrast from '../../_internal/high-contrast.module.css';
import srOnly from '../../_internal/sr-only.module.css';
import styles from './alert.module.css';

export type AlertAction = {
  label: string;
  renderItem: (props: { children: ReactNode }) => ReactNode;
};

type Props = {
  tone: Status;
  message: string | string[];
  action?: AlertAction;
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
  const actionNode = action
    ? action.renderItem({ children: action.label })
    : null;
  const inlineAction = action ? (
    <span className={styles.inlineAction}>{actionNode}</span>
  ) : null;

  let messageContent: ReactNode;
  if (Array.isArray(message) && message.length > 1) {
    const list = (
      <ul>
        {message.map((msg) => (
          <li className={styles.listItem} key={msg}>
            {msg}
          </li>
        ))}
      </ul>
    );
    messageContent = action ? (
      <div>
        {list}
        <div className={styles.listAction}>{actionNode}</div>
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
            <CloseIcon size="sm" />
          </IconButton>
        </span>
      ) : null}
    </div>
  );
};
