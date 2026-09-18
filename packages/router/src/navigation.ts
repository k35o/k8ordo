'use client';

import {
  addTransitionType,
  createContext,
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

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
  /**
   * Applies it, as an ordinary update and not inside a transition. Render
   * what it sets through `useDeferredValue`: the new page then renders in the
   * background, the previous one stays on screen while it suspends, and a
   * `<ViewTransition>` animates the swap.
   */
  apply: (value: T) => void;
};

/**
 * Where the viewport goes once the new page is on screen. A traversal is the
 * browser's to restore, so it carries no instruction; a fragment scrolls to
 * its target; anything else starts at the top, the way a document load does.
 */
export type ScrollPlan = { kind: 'top' } | { kind: 'fragment'; id: string };

export const scrollPlanFor = (
  navigationType: NavigationType,
  hash: string,
): ScrollPlan | null => {
  if (navigationType === 'traverse') return null;
  if (hash.length > 1) {
    let id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      // 復号できない fragment は書かれたままの綴りで探す
    }
    return { kind: 'fragment', id };
  }
  return { kind: 'top' };
};

/**
 * What a `<ViewTransition>` in the application learns about the navigation
 * that changed the tree: `navigation` names any page change, and the second
 * tag carries the kind the platform reported — `push`, `replace` or
 * `traverse` — so a back button can animate the other way from a link. The
 * router is the one place these can be said, because it is the one holding
 * the event when the tree is applied.
 */
export const transitionTypesFor = (
  navigationType: NavigationType,
): readonly string[] => ['navigation', `navigation-${navigationType}`];

const applyScroll = (plan: ScrollPlan): void => {
  if (plan.kind === 'fragment') {
    // fragment は id か、古い綴りの <a name> のどちらかを指す
    const selector = `#${CSS.escape(plan.id)}, [name=${JSON.stringify(plan.id)}]`;
    const target = document.querySelector(selector);
    if (target !== null) {
      target.scrollIntoView();
      return;
    }
  }
  // 現在位置と同じ座標へのスクロールは最適化で無視されることがあるので、
  // クランプされる負の値を渡して必ず発火させる
  window.scrollTo({ left: 0, top: -1 });
};

type Pending = {
  resolve: () => void;
  scroll: ScrollPlan | null;
  types: readonly string[];
};

/**
 * Which navigation put the tree on screen — a number that changes exactly
 * when a new tree is applied, and not when only the URL moved. It is the
 * identity an error boundary keys on: leaving the page that failed is what
 * should clear the failure, and the URL commits before the tree arrives, so
 * the pathname would clear it one render too early and let the old tree
 * fail again under the new key.
 */
export const NavigationGeneration = createContext(-1);

/**
 * The navigation half of the router, on its own: intercept, load, apply, and
 * resolve the platform's handler only once the new tree is on screen — which
 * is what makes `navigation.navigate().finished` mean "the page is showing",
 * and what `@k8ordo/state`'s `update().finished` inherits.
 *
 * The new tree renders at the lane `useDeferredValue` gives it, not in a
 * transition. While any async action is pending, React holds every
 * transition until that action ends — so an action awaiting `finished` would
 * be waiting on itself, and a page change started beside an unrelated action
 * would wait for it. A deferred render keeps what a transition gave (the old
 * page stays while the new one suspends, and `<ViewTransition>` animates it)
 * without joining the action.
 *
 * What gets loaded is the caller's business: a route table match for a plain
 * client app, an RSC payload under the framework. Neither has to teach this
 * hook anything about the other.
 */
export function useInterceptedNavigation<T>(handler: NavigationHandler<T>): {
  readonly generation: number;
} {
  // The handler is read at event time, not at render time, so a re-created
  // object per render costs nothing and needs no memoization at the call
  // site: each method is wrapped in an effect event, which always sees the
  // latest one without making the listener below reactive to it.
  const claim = useEffectEvent((url: URL) => handler.claim(url));
  const load = useEffectEvent((url: URL, signal: AbortSignal) =>
    handler.load(url, signal),
  );
  const apply = useEffectEvent((value: T) => {
    handler.apply(value);
  });

  // One resolver per navigation, keyed by which one it belongs to. A single
  // slot loses the race a rapid second navigation creates: the first one's
  // commit would resolve whatever resolver happened to be sitting there, and
  // `finished` would mean "some page is on screen" instead of "this one is".
  const pending = useRef(new Map<number, Pending>());
  const count = useRef(0);
  const [applied, setApplied] = useState(-1);
  // Moves in the background render that puts the host's deferred value on
  // screen, and not in the urgent one that `apply` starts.
  const onScreen = useDeferredValue(applied);

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
      if (!claim(url)) return;

      const id = count.current++;
      const scroll = scrollPlanFor(event.navigationType, url.hash);
      event.intercept({
        // The platform would scroll "after transition" — after the handler
        // settles — but the handler settles only once the tree is on screen,
        // which is exactly when this hook scrolls itself. Doing it here keeps
        // the two from disagreeing, and keeps the behaviour where a browser
        // has not implemented the platform's half. A traversal keeps the
        // default: restoring a position is the browser's, not ours.
        scroll: scroll === null ? 'after-transition' : 'manual',
        handler: async () => {
          const value = await load(url, event.signal);
          // A load that ignores the signal can come back after a second
          // navigation has already taken over. Applying it then would put the
          // page the visitor left back on screen, and the listener below would
          // never fire — an abort that already happened does not fire again.
          if (event.signal.aborted) throw event.signal.reason as Error;
          await new Promise<void>((resolve, reject) => {
            pending.current.set(id, {
              resolve,
              scroll,
              types: transitionTypesFor(event.navigationType),
            });
            event.signal.addEventListener(
              'abort',
              () => {
                pending.current.delete(id);
                reject(event.signal.reason as Error);
              },
              { once: true },
            );
            // Recorded at apply rather than at commit: a navigation that
            // arrives in between must see this page as the one showing.
            shown.current = pathname;
            apply(value);
            // Batched with the caller's own update, so its deferred copy
            // moves in the same background commit as the host's — and names
            // which navigation that commit belongs to.
            setApplied(id);
          });
        },
      });
    };
    navigation.addEventListener('navigate', onNavigate);
    return () => {
      navigation.removeEventListener('navigate', onNavigate);
    };
  }, []);

  // A layout effect, not a passive one: the tree is committed and not yet
  // painted, which is when a document load places the viewport — so the new
  // page never shows at the old position for a frame. It is also the only
  // effect that can settle the handler at all once a `<ViewTransition>` is
  // in the tree: React holds the new snapshot until the platform's pending
  // navigation has finished, and runs passive effects only after the
  // animation — a passive resolver would be waiting on itself.
  useLayoutEffect(() => {
    const entry = pending.current.get(onScreen);
    if (entry === undefined) return;
    pending.current.delete(onScreen);
    if (entry.scroll !== null) applyScroll(entry.scroll);
    entry.resolve();
  }, [onScreen]);

  // The types a `<ViewTransition>` animates by cannot ride the update itself:
  // said inside `startTransition` together with it, they would bring back the
  // wait on a pending action. React keeps types for the root's next
  // transition-class commit only while such a render is pending, and the
  // background render is pending from the commit of the urgent one — so they
  // are said here, and the background commit is the one that claims them.
  useLayoutEffect(() => {
    if (applied === onScreen) return;
    const types = pending.current.get(applied)?.types ?? [];
    startTransition(() => {
      for (const type of types) addTransitionType(type);
    });
  }, [applied, onScreen]);

  return { generation: onScreen };
}
