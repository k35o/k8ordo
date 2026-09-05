'use client';

import { startTransition, useEffect, useRef, useState } from 'react';

import { normalizePathname } from './paths';

/**
 * What the decision below reads. Spelled out rather than taking the event,
 * because a `NavigateEvent` cannot be constructed in a test — its destination
 * is not constructible — and this decision is the whole contract with the
 * platform.
 */
export type NavigationFacts = Pick<
  NavigateEvent,
  'canIntercept' | 'hashChange' | 'downloadRequest' | 'navigationType'
> & { readonly formData: FormData | null };

/**
 * Whether this navigation is the application's to handle at all.
 *
 * A reload is a request for a fresh document, and a POST submission carries a
 * body only the server can act on: intercepting either means silently doing
 * nothing where the platform would have done the obvious thing. A GET form
 * has no `formData`, so the search-shaped navigations `@k8ordo/state` builds
 * still come through here.
 */
export const isOurs = (event: NavigationFacts): boolean =>
  event.canIntercept &&
  !event.hashChange &&
  event.downloadRequest === null &&
  event.navigationType !== 'reload' &&
  event.formData === null;

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

  // One resolver per navigation, keyed by which one it belongs to. A single
  // slot loses the race a rapid second navigation creates: the first one's
  // commit would resolve whatever resolver happened to be sitting there, and
  // `finished` would mean "some page is on screen" instead of "this one is".
  const pending = useRef(new Map<number, () => void>());
  const count = useRef(0);
  const [applied, setApplied] = useState(-1);

  // The pathname whose tree is on screen — not `location.pathname`. Under
  // interception the URL commits before the tree arrives, so while a page is
  // loading the two differ, and a state update aimed at the new URL is still
  // a navigation to a page that is not showing yet. Taking the shortcut then
  // would abort the load and leave the old page under the new URL.
  const shown = useRef<string | null>(null);

  useEffect(() => {
    shown.current = normalizePathname(location.pathname);
    const onNavigate = (event: NavigateEvent): void => {
      if (!isOurs(event)) return;
      const url = new URL(event.destination.url);
      const pathname = normalizePathname(url.pathname);
      if (pathname === shown.current) {
        // Same place — only the search or the entry state moved. Nothing to
        // load, nothing to remount, and no scroll or focus to disturb.
        event.intercept({ scroll: 'manual', focusReset: 'manual' });
        return;
      }
      if (!latest.current.claim(url)) return;

      const id = count.current++;
      event.intercept({
        handler: async () => {
          const value = await latest.current.load(url, event.signal);
          // A load that ignores the signal can come back after a second
          // navigation has already taken over. Applying it then would put the
          // page the visitor left back on screen, and the listener below would
          // never fire — an abort that already happened does not fire again.
          if (event.signal.aborted) throw event.signal.reason as Error;
          await new Promise<void>((resolve, reject) => {
            pending.current.set(id, resolve);
            event.signal.addEventListener(
              'abort',
              () => {
                pending.current.delete(id);
                reject(event.signal.reason as Error);
              },
              { once: true },
            );
            startTransition(() => {
              // Recorded at apply rather than at commit: an update inside a
              // transition is never dropped, and a navigation that arrives in
              // between must see this page as the one showing.
              shown.current = pathname;
              latest.current.apply(value);
              // Rides the same transition as the caller's own update, so the
              // effect below runs in the commit that puts it on screen — and
              // names which navigation that commit belongs to.
              setApplied(id);
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
    const resolve = pending.current.get(applied);
    if (resolve === undefined) return;
    pending.current.delete(applied);
    resolve();
  }, [applied]);
}
