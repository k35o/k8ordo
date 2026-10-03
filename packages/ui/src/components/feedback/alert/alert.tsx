import type { FC, HTMLAttributes, ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';
import { HIGH_CONTRAST_EDGE } from '../../_internal/high-contrast';
import {
  STATUS_ICON,
  STATUS_MESSAGE_KEY,
  STATUS_SURFACE,
} from '../../_internal/status-tone';
import { IconButton } from '../../buttons/icon-button';
import { AlertIcon, CloseIcon } from '../../icons';
import { cn } from './../../../helpers/cn';
import type { Status } from './../../../types/variables';

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
    <span className="ml-1">{actionNode}</span>
  ) : null;

  let messageContent: ReactNode;
  if (Array.isArray(message) && message.length > 1) {
    const list = (
      <ul className="space-y-1">
        {message.map((msg) => (
          <li key={msg}>{msg}</li>
        ))}
      </ul>
    );
    messageContent = action ? (
      <div>
        {list}
        <div className="mt-1">{actionNode}</div>
      </div>
    ) : (
      list
    );
  } else {
    const text = Array.isArray(message) ? message[0] : message;
    messageContent = (
      <p className="font-bold">
        {text}
        {inlineAction}
      </p>
    );
  }

  return (
    <div
      {...rest}
      className={cn(
        'flex items-center gap-3 rounded-lg p-4',
        HIGH_CONTRAST_EDGE,
        STATUS_SURFACE[tone],
      )}
      role={tone === 'error' || tone === 'warning' ? 'alert' : 'status'}
    >
      <span className={cn('shrink-0', STATUS_ICON[tone])}>
        <AlertIcon size="md" status={tone} />
        <span className="sr-only">{messages[STATUS_MESSAGE_KEY[tone]]}</span>
      </span>
      <div className="min-w-0 flex-1">{messageContent}</div>
      {onClose ? (
        <span className="shrink-0">
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
