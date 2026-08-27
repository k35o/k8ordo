'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { FC, PropsWithChildren, RefObject } from 'react';
import { createPortal } from 'react-dom';

import { cn } from './../../../helpers/cn';
import { useMessages } from './../../../i18n/context';
import type { Status } from './../../../types/variables';
import { ToastStoreContext } from './context';
import type { ToastOptions, ToastType } from './context';
import { Toast } from './toast';

const MAX_TOAST_COUNT = 5;
const DEFAULT_DURATION_MS = 5000;
// base.css の .ao-toast-item の transition と同じ長さ。transitionend には
// 依存しない(reduced motion で transition が無効でも確実に取り除くため)
const EXIT_MS = 200;

const FOCUSABLE_SELECTOR =
  'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])';

type ToastState = {
  toasts: ToastType[];
  // 閉じ演出中(高さ 0 へ畳む transition 中)のトースト。EXIT_MS 後に除去する
  closingIds: string[];
  isHovered: boolean;
  isFocused: boolean;
};

// 上限超過分を最古から追い出す。ホバー/フォーカス中は保留し、一時停止が
// 解けた時点で改めて捌く（読んでいる最中・操作している最中のトーストが
// inert 化されてフォーカスごと消えるのを防ぐため）
const enforceLimit = (state: ToastState): ToastState => {
  if (state.isHovered || state.isFocused) {
    return state;
  }
  const active = state.toasts.filter(
    (toast) => !state.closingIds.includes(toast.id),
  );
  const overflow = active.length - MAX_TOAST_COUNT;
  if (overflow <= 0) {
    return state;
  }
  return {
    ...state,
    closingIds: [
      ...state.closingIds,
      ...active.slice(0, overflow).map((toast) => toast.id),
    ],
  };
};

export const ToastProvider: FC<
  PropsWithChildren<{
    portalRef?: RefObject<HTMLElement | null>;
    position?: 'fixed' | 'absolute';
  }>
> = ({ children, portalRef = null, position = 'fixed' }) => {
  const messages = useMessages();
  const [state, setState] = useState<ToastState>({
    toasts: [],
    closingIds: [],
    isHovered: false,
    isFocused: false,
  });
  // document.body はレンダー中に読めない(SSR)ため、マウント後に state へ移す
  const [defaultContainer, setDefaultContainer] = useState<HTMLElement | null>(
    null,
  );
  const viewportRef = useRef<HTMLElement | null>(null);
  // 閉じ演出中のトーストは祖先が inert になり、ブラウザが強制的に blur するため
  // activeElement からは追えない。focusin の時点でどのトーストにいたかを控える
  const focusedToastIdRef = useRef<string | null>(null);

  useEffect(() => {
    setDefaultContainer(document.body);
  }, []);

  // 閉じ演出を終えたエントリを id ごとの独立したタイマーで取り除く。
  // 全体で 1 本のタイマーだと、EXIT_MS 未満の間隔で閉じ始めが続いたとき
  // 先行エントリの除去が際限なく先送りされてしまう
  const exitTimersRef = useRef(new Map<string, number>());
  useEffect(() => {
    for (const id of state.closingIds) {
      if (exitTimersRef.current.has(id)) {
        continue;
      }
      const timerId = window.setTimeout(() => {
        exitTimersRef.current.delete(id);
        setState((prev) => ({
          ...prev,
          toasts: prev.toasts.filter((toast) => toast.id !== id),
          closingIds: prev.closingIds.filter((closingId) => closingId !== id),
        }));
      }, EXIT_MS);
      exitTimersRef.current.set(id, timerId);
    }
  }, [state.closingIds]);
  useEffect(() => {
    const timers = exitTimersRef.current;
    return () => {
      for (const timerId of timers.values()) {
        window.clearTimeout(timerId);
      }
      timers.clear();
    };
  }, []);

  // フォーカスを持っていたトーストが閉じ始めたら、フォーカスを返す
  useEffect(() => {
    const closedId = focusedToastIdRef.current;
    const viewport = viewportRef.current;
    if (
      closedId === null ||
      viewport === null ||
      !state.closingIds.includes(closedId)
    ) {
      return;
    }
    focusedToastIdRef.current = null;

    const focusIfPossible = (element: HTMLElement | null | undefined) => {
      if (element === null || element === undefined || !element.isConnected) {
        return false;
      }
      element.focus();
      return viewport.ownerDocument.activeElement === element;
    };

    for (const item of viewport.querySelectorAll<HTMLElement>(
      '[data-toast-id]:not([data-closing])',
    )) {
      if (
        focusIfPossible(item.querySelector<HTMLElement>(FOCUSABLE_SELECTOR))
      ) {
        return;
      }
    }
    const opener = state.toasts
      .find((toast) => toast.id === closedId)
      ?.opener?.deref();
    if (focusIfPossible(opener)) {
      return;
    }
    viewport.focus();
  }, [state.closingIds, state.toasts]);

  const store = useMemo(
    () => ({
      open: (tone: Status, message: string, options?: ToastOptions) => {
        // updater は StrictMode で二重実行されうるので、非決定的な ID 生成は外で行う
        const id = crypto.randomUUID();
        const { activeElement } = document;
        const opener =
          activeElement instanceof HTMLElement &&
          activeElement !== document.body
            ? new WeakRef(activeElement)
            : undefined;
        setState((prev) =>
          enforceLimit({
            ...prev,
            toasts: [
              ...prev.toasts,
              {
                id,
                tone,
                message,
                duration: options?.duration ?? DEFAULT_DURATION_MS,
                action: options?.action,
                opener,
              },
            ],
          }),
        );
      },
      close: (id: string) => {
        setState((prev) =>
          prev.closingIds.includes(id)
            ? prev
            : { ...prev, closingIds: [...prev.closingIds, id] },
        );
      },
      closeAll: () => {
        setState((prev) => ({
          ...prev,
          closingIds: prev.toasts.map((toast) => toast.id),
        }));
      },
    }),
    [],
  );

  const setHovered = (isHovered: boolean) => {
    setState((prev) =>
      prev.isHovered === isHovered
        ? prev
        : enforceLimit({ ...prev, isHovered }),
    );
  };
  const setFocused = (isFocused: boolean) => {
    setState((prev) =>
      prev.isFocused === isFocused
        ? prev
        : enforceLimit({ ...prev, isFocused }),
    );
  };

  const container = portalRef?.current ?? defaultContainer;
  const isPaused = state.isHovered || state.isFocused;

  return (
    <ToastStoreContext value={store}>
      {children}
      {container
        ? createPortal(
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- WCAG 2.2.1 のためホバー/フォーカス中は自動クローズのタイマーを止める
            <section
              // 空の間は名前を付けず region ランドマークにしない（複数 Provider の
              // 共存時に同名ランドマークが重複して axe の landmark-unique に反するため）
              aria-label={
                state.toasts.length > 0 ? messages.toastRegion : undefined
              }
              className={cn(
                'bottom-3 z-toast flex w-full flex-col items-center justify-center',
                position === 'fixed' && 'fixed',
                position === 'absolute' && 'absolute',
              )}
              onBlur={(event) => {
                if (event.currentTarget.contains(event.relatedTarget)) {
                  return;
                }
                setFocused(false);
                // 閉じ演出中(inert)の要素からの blur はブラウザによる強制 blur。
                // 返還先を決めるまでフォーカス位置を捨てない
                if (event.target.closest('[data-closing]') === null) {
                  focusedToastIdRef.current = null;
                }
              }}
              onFocus={(event) => {
                const item =
                  event.target.closest<HTMLElement>('[data-toast-id]');
                focusedToastIdRef.current = item?.dataset.toastId ?? null;
                // 返還先の最終手段である viewport 自身へのフォーカスでは止めない
                setFocused(item !== null);
              }}
              onPointerEnter={() => {
                setHovered(true);
              }}
              onPointerLeave={() => {
                setHovered(false);
              }}
              ref={viewportRef}
              tabIndex={-1}
            >
              {state.toasts.map((toast) => {
                const isClosing = state.closingIds.includes(toast.id);
                return (
                  <div
                    className="ao-toast-item w-full justify-items-center"
                    data-closing={isClosing || undefined}
                    data-toast-id={toast.id}
                    // 閉じ演出中は不可視のままフォーカス可能な要素が残らないようにする
                    inert={isClosing || undefined}
                    key={toast.id}
                  >
                    <div className="min-h-0">
                      {/* 読み上げは Alert 自身の role(status / alert)に一本化する */}
                      <div className="ao-toast-enter shadow-lg">
                        <Toast
                          action={toast.action}
                          duration={toast.duration}
                          isPaused={isPaused}
                          message={toast.message}
                          onClose={() => {
                            store.close(toast.id);
                          }}
                          tone={toast.tone}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>,
            container,
          )
        : null}
    </ToastStoreContext>
  );
};
