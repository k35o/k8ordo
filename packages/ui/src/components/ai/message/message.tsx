'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { FC, HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../../helpers/cn';
import { createSafeContext } from '../../../helpers/create-safe-context';
import { useControllableState } from '../../../hooks/controllable-state';
import { useMessages } from '../../../i18n/context';
import { HIGH_CONTRAST_EDGE } from '../../_internal/high-contrast';
import { IconButton } from '../../buttons/icon-button';
import {
  BadIcon,
  CheckIcon,
  CopyIcon,
  GoodIcon,
  RefreshIcon,
} from '../../icons';
import { StreamingCursor } from '../_internal/streaming-cursor';
import type { MessageFeedback } from '../types';

type MessageRole = 'user' | 'assistant';

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
      <div
        {...rest}
        className={cn(
          'flex w-full items-start gap-3',
          from === 'user' ? 'flex-row-reverse' : 'flex-row',
        )}
        data-from={from}
      >
        {avatar}
        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col gap-2',
            from === 'user' && 'items-end',
          )}
        >
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
    <div
      {...rest}
      className={cn(
        'min-w-0 wrap-break-word whitespace-pre-wrap text-fg-base',
        from === 'user'
          ? [
              'w-fit max-w-[80%] rounded-2xl bg-bg-subtle px-4 py-2.5',
              HIGH_CONTRAST_EDGE,
            ]
          : 'leading-relaxed',
      )}
    >
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
  const messages = useMessages();
  const { from } = useMessageContext();

  return (
    <div
      aria-label={label ?? messages.messageActions}
      className={cn(
        // ボタンの内側の余白ぶん外へ出し、アイコンの縁を本文の縁に揃える
        'flex items-center gap-0.5 text-fg-mute',
        from === 'user' ? '-me-1' : '-ms-1',
      )}
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

const COPIED_DURATION_MS = 2000;

type CopyProps = {
  value: string;
  label?: string;
};

export const Copy: FC<CopyProps> = ({ value, label }) => {
  const messages = useMessages();
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    [],
  );

  return (
    <>
      <IconButton
        label={isCopied ? messages.copied : (label ?? messages.copy)}
        onAction={async () => {
          try {
            await navigator.clipboard.writeText(value);
          } catch {
            // 権限が無いなどで書けなかったとき。transition の中で投げると
            // エラーバウンダリまで届き、会話ごと描き直されてしまう
            return;
          }
          setIsCopied(true);
          clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            setIsCopied(false);
          }, COPIED_DURATION_MS);
        }}
        size="sm"
      >
        {isCopied ? <CheckIcon size="sm" /> : <CopyIcon size="sm" />}
      </IconButton>
      {/* フォーカス中のボタンの名前が変わっても読み上げられないので、別に知らせる */}
      <span className="sr-only" role="status">
        {isCopied ? messages.copied : ''}
      </span>
    </>
  );
};

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
  const messages = useMessages();

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
  const messages = useMessages();
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
        <span className={cn(feedback === 'positive' && 'text-primary-fg')}>
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
        <span className={cn(feedback === 'negative' && 'text-primary-fg')}>
          <BadIcon size="sm" />
        </span>
      </IconButton>
    </>
  );
};
