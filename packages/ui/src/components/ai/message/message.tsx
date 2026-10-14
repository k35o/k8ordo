'use client';

import { clsx } from 'clsx';
import { useMemo } from 'react';
import type { FC, HTMLAttributes, ReactNode } from 'react';

import { createSafeContext } from '../../../helpers/create-safe-context';
import { useControllableState } from '../../../hooks/controllable-state';
import { getMessages } from '../../../i18n/current';
import { CopyButton } from '../../buttons/copy-button';
import { IconButton } from '../../buttons/icon-button';
import { BadIcon, GoodIcon, RefreshIcon } from '../../icons';
import { StreamingCursor } from '../_internal/streaming-cursor';
import type { MessageFeedback } from '../types';

import highContrast from '../../_internal/high-contrast.module.css';
import styles from './message.module.css';

type MessageRole = 'user' | 'assistant';

const ROOT = {
  user: styles.rootUser,
  assistant: styles.rootAssistant,
} as const;

const CONTENT = {
  user: clsx(styles.contentUser, highContrast.edge),
  assistant: styles.contentAssistant,
} as const;

const ACTIONS = {
  user: styles.actionsUser,
  assistant: styles.actionsAssistant,
} as const;

const [MessageProvider, useMessageContext] = createSafeContext<{
  from: MessageRole;
}>('Message.* must be used within <Message.Root>');

type RootProps = {
  from: MessageRole;
  avatar?: ReactNode;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

export const Root: FC<RootProps> = ({ from, avatar, children, ...rest }) => {
  const contextValue = useMemo(() => ({ from }), [from]);

  return (
    <MessageProvider value={contextValue}>
      <div {...rest} className={clsx(styles.root, ROOT[from])} data-from={from}>
        {avatar}
        <div className={clsx(styles.body, from === 'user' && styles.bodyUser)}>
          {children}
        </div>
      </div>
    </MessageProvider>
  );
};

type ContentProps = {
  isStreaming?: boolean;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

export const Content: FC<ContentProps> = ({
  isStreaming = false,
  children,
  ...rest
}) => {
  const { from } = useMessageContext();

  return (
    <div {...rest} className={clsx(styles.content, CONTENT[from])}>
      {children}
      {isStreaming ? <StreamingCursor /> : null}
    </div>
  );
};

type ActionsProps = {
  label?: string;
  children: ReactNode;
};

export const Actions: FC<ActionsProps> = ({ label, children }) => {
  const messages = getMessages();
  const { from } = useMessageContext();

  return (
    <div
      aria-label={label ?? messages.messageActions}
      className={clsx(styles.actions, ACTIONS[from])}
      role="group"
    >
      {children}
    </div>
  );
};

type ActionProps = {
  label: string;
  onAction?: () => void | Promise<void>;
  disabled?: boolean;
  children: ReactNode;
};

export const Action: FC<ActionProps> = ({
  label,
  onAction,
  disabled,
  children,
}) => (
  <IconButton disabled={disabled} label={label} onAction={onAction} size="sm">
    {children}
  </IconButton>
);

type CopyProps = {
  value: string;
  label?: string;
};

export const Copy: FC<CopyProps> = ({ value, label }) => (
  <CopyButton iconOnly label={label} size="sm" value={value} />
);

type RegenerateProps = {
  onAction: () => void | Promise<void>;
  label?: string;
  disabled?: boolean;
};

export const Regenerate: FC<RegenerateProps> = ({
  onAction,
  label,
  disabled,
}) => {
  const messages = getMessages();

  return (
    <Action
      disabled={disabled}
      label={label ?? messages.regenerate}
      onAction={onAction}
    >
      <RefreshIcon size="sm" />
    </Action>
  );
};

type FeedbackProps = {
  value?: MessageFeedback | null;
  defaultValue?: MessageFeedback | null;
  onChange?: (value: MessageFeedback | null) => void;
};

export const Feedback: FC<FeedbackProps> = ({
  value,
  defaultValue = null,
  onChange,
}) => {
  const messages = getMessages();
  const [feedback, setFeedback] = useControllableState<MessageFeedback | null>({
    value,
    defaultValue,
    onChange,
  });

  const toggle = (next: MessageFeedback) => {
    setFeedback(feedback === next ? null : next);
  };

  return (
    <>
      <IconButton
        aria-pressed={feedback === 'positive'}
        color={feedback === 'positive' ? 'primary' : 'transparent'}
        label={messages.feedbackPositive}
        onClick={() => {
          toggle('positive');
        }}
        size="sm"
      >
        <span className={clsx(feedback === 'positive' && styles.selected)}>
          <GoodIcon size="sm" />
        </span>
      </IconButton>
      <IconButton
        aria-pressed={feedback === 'negative'}
        color={feedback === 'negative' ? 'primary' : 'transparent'}
        label={messages.feedbackNegative}
        onClick={() => {
          toggle('negative');
        }}
        size="sm"
      >
        <span className={clsx(feedback === 'negative' && styles.selected)}>
          <BadIcon size="sm" />
        </span>
      </IconButton>
    </>
  );
};
