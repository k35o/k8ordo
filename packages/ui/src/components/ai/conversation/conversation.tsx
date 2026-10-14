'use client';

import { clsx } from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FC, ReactNode } from 'react';

import { createSafeContext } from '../../../helpers/create-safe-context';
import { getMessages } from '../../../i18n/current';
import { ChevronIcon } from '../../icons';
import { InView } from '../../observers/in-view';
import { Resize } from '../../observers/resize';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './conversation.module.css';

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
      <div className={styles.root}>{children}</div>
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
  const messages = getMessages();
  const { viewport, setViewport, updateAtBottom, followContent } =
    useConversationContext();

  return (
    <div
      aria-busy={isStreaming}
      aria-label={label ?? messages.chat}
      aria-live="polite"
      className={clsx(styles.messages, focusRing.ringNoBorder)}
      ref={setViewport}
      role="log"
      // スクロール領域をキーボードでも操作できるようフォーカスを許可する
      // oxlint-disable-next-line eslint-plugin-jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      <Resize onChange={followContent}>
        <div className={styles.list}>
          {children}
          <InView
            onChange={updateAtBottom}
            root={viewport}
            rootMargin="0px 0px 24px 0px"
          >
            <div aria-hidden className={styles.sentinel} />
          </InView>
        </div>
      </Resize>
    </div>
  );
};

export const ScrollButton: FC<{ label?: string }> = ({ label }) => {
  const messages = getMessages();
  const { isAtBottom, scrollToBottom } = useConversationContext();

  if (isAtBottom) {
    return null;
  }

  return (
    <button
      aria-label={label ?? messages.scrollToLatest}
      className={styles.scrollButton}
      onClick={() => {
        scrollToBottom('smooth');
      }}
      type="button"
    >
      <ChevronIcon direction="down" size="sm" />
    </button>
  );
};
