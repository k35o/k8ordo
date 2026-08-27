'use client';

import { useMemo } from 'react';
import type { FC, HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../../helpers/cn';
import { createSafeContext } from '../../../helpers/create-safe-context';
import { StreamingCursor } from '../_internal/streaming-cursor';

type MessageRole = 'user' | 'assistant';

const [MessageProvider, useMessageContext] = createSafeContext<{
  from: MessageRole;
}>('Message.Content must be used within <Message.Root>');

type RootProps = {
  from: MessageRole;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

const Root: FC<RootProps> = ({ from, children, ...rest }) => {
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
        {children}
      </div>
    </MessageProvider>
  );
};

type ContentProps = {
  isStreaming?: boolean;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

const Content: FC<ContentProps> = ({
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
          ? 'w-fit max-w-[80%] rounded-2xl bg-bg-subtle px-4 py-2.5'
          : 'flex-1 leading-relaxed',
      )}
    >
      {children}
      {isStreaming ? <StreamingCursor /> : null}
    </div>
  );
};

export const Message = { Root, Content } as const;
