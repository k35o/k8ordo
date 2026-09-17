'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FC, ReactNode } from 'react';

import { cn } from '../../../helpers/cn';
import { createSafeContext } from '../../../helpers/create-safe-context';
import { useMessages } from '../../../i18n/context';
import { FOCUS_RING, FOCUS_RING_NO_BORDER } from '../../_internal/focus-ring';
import { ChevronIcon } from '../../icons';
import { InView } from '../../observers/in-view';
import { Resize } from '../../observers/resize';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const [ConversationProvider, useConversationContext] = createSafeContext<{
  isAtBottom: boolean;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  viewport: HTMLDivElement | null;
  setViewport: (el: HTMLDivElement | null) => void;
  updateAtBottom: (next: boolean) => void;
  followContent: () => void;
}>('Conversation.* must be used within <Conversation.Root>');

export const Root: FC<{ children: ReactNode }> = ({ children }) => {
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const isAtBottomRef = useRef(true);

  const updateAtBottom = useCallback((next: boolean) => {
    isAtBottomRef.current = next;
    setIsAtBottom(next);
  }, []);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      if (!viewport) {
        return;
      }
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: prefersReducedMotion() ? 'instant' : behavior,
      });
    },
    [viewport],
  );

  const followContent = useCallback(() => {
    if (isAtBottomRef.current && viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'instant' });
    }
  }, [viewport]);

  useEffect(() => {
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'instant' });
    }
  }, [viewport]);

  const contextValue = useMemo(
    () => ({
      isAtBottom,
      scrollToBottom,
      viewport,
      setViewport,
      updateAtBottom,
      followContent,
    }),
    [isAtBottom, scrollToBottom, viewport, updateAtBottom, followContent],
  );

  return (
    <ConversationProvider value={contextValue}>
      <div className="relative flex h-full min-h-0 flex-col">{children}</div>
    </ConversationProvider>
  );
};

type MessagesProps = {
  label?: string;
  isStreaming?: boolean;
  children: ReactNode;
};

export const Messages: FC<MessagesProps> = ({
  label,
  isStreaming = false,
  children,
}) => {
  const messages = useMessages();
  const { viewport, setViewport, updateAtBottom, followContent } =
    useConversationContext();

  return (
    <div
      aria-busy={isStreaming}
      aria-label={label ?? messages.chat}
      aria-live="polite"
      className={cn(
        'min-h-0 flex-1 overflow-y-auto overscroll-contain',
        FOCUS_RING_NO_BORDER,
      )}
      ref={setViewport}
      role="log"
      // スクロール領域をキーボードでも操作できるようフォーカスを許可する
      // oxlint-disable-next-line eslint-plugin-jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      <Resize onChange={followContent}>
        <div className="flex flex-col gap-6 p-4">
          {children}
          <InView
            onChange={updateAtBottom}
            root={viewport}
            rootMargin="0px 0px 24px 0px"
          >
            <div aria-hidden className="h-px w-full shrink-0" />
          </InView>
        </div>
      </Resize>
    </div>
  );
};

export const ScrollButton: FC<{ label?: string }> = ({ label }) => {
  const messages = useMessages();
  const { isAtBottom, scrollToBottom } = useConversationContext();

  if (isAtBottom) {
    return null;
  }

  return (
    <button
      aria-label={label ?? messages.scrollToLatest}
      className={cn(
        'absolute bottom-4 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-border-base bg-bg-base text-fg-mute shadow-md transition-colors duration-150 ease-out hover:bg-bg-subtle',
        FOCUS_RING,
      )}
      onClick={() => {
        scrollToBottom('smooth');
      }}
      type="button"
    >
      <ChevronIcon direction="down" size="sm" />
    </button>
  );
};
