'use client';

import { startTransition, useEffect, useRef, useState } from 'react';

import { normalizePathname } from './paths';

export type NavigationHandler<T> = {
  /**
   * Whether this navigation is the application's to handle. Answered
   * synchronously, because that is the only moment the platform lets anyone
   * intercept. Saying no leaves a real document load — and a real 404 — to
   * the server.
   */
  claim: (url: URL) => boolean;
  /** Produces whatever the application renders for this URL. */
  load: (url: URL, signal: AbortSignal) => T | Promise<T>;
  /** Applies it. Called inside a transition. */
  apply: (value: T) => void;
};

/**
 * The navigation half of the router, on its own: intercept, load, apply in a
 * transition, and resolve the platform's handler only once the new tree is on
 * screen — which is what makes `navigation.navigate().finished` mean "the
 * page is showing", and what `@k8ordo/state`'s `update().finished` inherits.
 *
 * What gets loaded is the caller's business: a route table match for a plain
 * client app, an RSC payload under the framework. Neither has to teach this
 * hook anything about the other.
 */
export function useInterceptedNavigation<T>(
  handler: NavigationHandler<T>,
): void {
  // The handler is read at event time, so a re-created object per render
  // costs nothing and needs no memoization at the call site.
  const latest = useRef(handler);
  latest.current = handler;

  const commit = useRef<(() => void) | null>(null);
  const [applied, setApplied] = useState(0);

  useEffect(() => {
    const onNavigate = (event: NavigateEvent): void => {
      if (
        !event.canIntercept ||
        event.hashChange ||
        event.downloadRequest !== null
      ) {
        return;
      }
      const url = new URL(event.destination.url);
      if (
        normalizePathname(url.pathname) === normalizePathname(location.pathname)
      ) {
        // Same place — only the search or the entry state moved. Nothing to
        // load, nothing to remount, and no scroll or focus to disturb.
        event.intercept({ scroll: 'manual', focusReset: 'manual' });
        return;
      }
      if (!latest.current.claim(url)) return;

      event.intercept({
        handler: async () => {
          const value = await latest.current.load(url, event.signal);
          await new Promise<void>((resolve, reject) => {
            commit.current = resolve;
            event.signal.addEventListener(
              'abort',
              () => {
                reject(event.signal.reason as Error);
              },
              { once: true },
            );
            startTransition(() => {
              latest.current.apply(value);
              // Rides the same transition as the caller's own update, so the
              // effect below runs in the commit that puts it on screen.
              setApplied((n) => n + 1);
            });
          });
        },
      });
    };
    navigation.addEventListener('navigate', onNavigate);
    return () => {
      navigation.removeEventListener('navigate', onNavigate);
    };
  }, []);

  useEffect(() => {
    commit.current?.();
    commit.current = null;
  }, [applied]);
}
