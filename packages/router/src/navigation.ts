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
  useSyncExternalStore,
} from 'react';

import { withoutBase } from './base';
import { leftAt, rememberLeftAt, restoreLeftAt } from './left-at';
import type { Position } from './left-at';
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
  /**
   * Whether a navigation that keeps the pathname on screen still has to
   * load — the page showing reads the search, and the search moved. Without
   * one, such a navigation is a state change: nothing loads. With one, it
   * loads and applies like a page change, but as a state change otherwise:
   * no focus reset and no transition types, and the viewport stays where it
   * is — except going back or forward, where it goes back to where that entry
   * was left once the page loaded again is on screen.
   */
  refresh?: (url: URL) => boolean;
};

/**
 * Where the viewport goes once the new page is on screen. Going back or
 * forward, it is where the visitor left that entry; otherwise a fragment
 * scrolls to its target, and anything else starts at the top, the way a
 * document load does — as does a traversal to an entry no page was ever
 * left from, one called off while it loaded.
 */
export type ScrollPlan =
  | { kind: 'top' }
  | { kind: 'fragment'; id: string }
  | ({ kind: 'position' } & Position);

export const scrollPlanFor = (
  navigationType: NavigationType,
  hash: string,
  left: Position | undefined,
): ScrollPlan => {
  if (navigationType === 'traverse' && left !== undefined) {
    return { kind: 'position', ...left };
  }
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
  if (plan.kind === 'position') {
    // ブラウザの戻しと同じく、ルートの scroll-behavior によらず一度に置く
    window.scrollTo({ left: plan.left, top: plan.top, behavior: 'instant' });
    return;
  }
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
  // 同じページの戻る・進むは持たない。画面の entry は navigate のときに決まり、
  // ページの切り替えではないので型も付けない
  change?: { types: readonly string[]; keyless: boolean };
};

// Firefox は intercept した traverse でも scroll の指定を見ず、popstate を
// 出したのと同じタスクの中で保存した位置へ戻す。読み込み中に画面のページの
// entry へ戻る（取り消す）ときは位置を動かさないので、次のタスクで訪問者が
// いた位置に置き直す。requestAnimationFrame は隠れたタブで走らない
const keepPosition = (entry: string): void => {
  const left = window.scrollX;
  const top = window.scrollY;
  setTimeout(() => {
    if (navigation.currentEntry?.key !== entry) return;
    if (window.scrollX !== left || window.scrollY !== top) {
      window.scrollTo({ left, top });
    }
  }, 0);
};

// WebKit は、別のサイトを挟んで読み直した文書からそれより前の entry へ戻ると、
// navigate を出さずに popstate だけを出し、currentEntry を null にする。URL だけが
// 動いて画面は残り、この文書ではもう navigation.navigate() が AbortError になる。
// その文書の中で移ってから、文書の最初の entry へ戻るときも navigate を出さない。
// currentEntry は null にならないが、URL だけが動いて画面は残る。次のページの
// 読み込みの途中なら、その読み込みも止まらず、戻った URL の下に着く
const reloadOnUnannouncedSteps = (
  followsInPlace: (url: URL) => boolean,
): {
  heard: (destination: string) => void;
  reloading: () => boolean;
  stop: () => void;
} => {
  let reloading = false;
  const reload = (): void => {
    reloading = true;
    location.reload();
  };
  // 最後の navigate の行き先。popstate がそれを指していなければ、その一歩は知らされていない。
  // popstate では消さない。Firefox は iframe の中で横取りした traverse を 2 回 commit し、
  // 行き先を指す popstate を 2 回出す
  let announced: string | null = null;
  // WebKit で popstate を聞く前（hydrate の前や、描いてから effect までの間）に戻るが
  // 届くと、currentEntry は null のまま残る。entries() が空なのは Navigation API を持たない
  // 文書（opaque な origin）で、読み直しても同じなので読み直さない
  if (navigation.currentEntry === null && navigation.entries().length > 0) {
    reload();
  }
  const onPopState = (): void => {
    // 読み直しの途中の一歩は、頼んだ読み直しが前の URL のまま着いて消すので、頼み直す
    if (reloading || navigation.currentEntry === null) {
      reload();
      return;
    }
    if (announced === location.href) return;
    // 画面のページが自分で URL を読み直せるなら、読み直さない
    if (!followsInPlace(new URL(location.href))) reload();
  };
  window.addEventListener('popstate', onPopState);
  return {
    heard: (destination) => {
      announced = destination;
    },
    reloading: () => reloading,
    stop: () => {
      window.removeEventListener('popstate', onPopState);
    },
  };
};

/**
 * The pathname a page change is loading, in the table's terms — `null` when
 * none is. One per document, like the navigation it follows: there is one
 * intercepting host, and a pending indicator anywhere reads the same answer.
 */
let pendingPathname: string | null = null;
const pendingListeners = new Set<() => void>();

const setPendingPathname = (value: string | null): void => {
  if (pendingPathname === value) return;
  pendingPathname = value;
  for (const listener of pendingListeners) listener();
};

const subscribePending = (onChange: () => void): (() => void) => {
  pendingListeners.add(onChange);
  return () => {
    pendingListeners.delete(onChange);
  };
};

/**
 * Where a page change in progress is going, as a pathname in the table's
 * terms, or `null` when none is. The URL commits before the new page
 * arrives — `usePathname` already names the destination — and the previous
 * page stays on screen while the next one loads; this is what tells the two
 * apart, for a link that marks itself as loading or a bar across the top. It
 * clears when the new page is on screen, and when the navigation is given up.
 * A state change (the search, the entry) is not a page change and sets
 * nothing. A server render has no navigation in progress: `null`.
 */
export function usePendingPathname(): string | null {
  return useSyncExternalStore(
    subscribePending,
    () => pendingPathname,
    () => null,
  );
}

/**
 * Which navigation put the tree on screen — a number that changes exactly
 * when a new tree is applied, and not when only the URL moved. It is what an
 * error boundary clears its failure on: leaving the page that failed is what
 * should clear it, and the URL commits before the tree arrives, so the
 * pathname would clear it one render too early and let the old tree fail
 * again.
 */
export const NavigationGeneration = createContext(-1);

/**
 * The navigation half of the router, on its own: intercept, load, apply, and
 * resolve the platform's handler only once the new tree is on screen — which
 * is what makes `navigation.navigate().finished` mean "the page is showing".
 * A navigation that keeps the pathname on screen — `@k8ordo/state`'s
 * `update()` — is intercepted with no handler, so its `finished` settles as
 * soon as the navigation commits. Going back or forward between two entries
 * of that page is the exception: it settles with the render the entry change
 * starts in the background, and the position that entry was left at comes
 * back onto what it renders.
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
  const refresh = useEffectEvent((url: URL) => handler.refresh?.(url) ?? false);
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
  // A traversal between two entries of the page on screen applies no tree,
  // but the page renders the entry it arrived at, and what it renders through
  // `useDeferredValue` lands one commit after the urgent one. Restored before
  // that commit, the position would land on the previous entry's layout, and
  // scroll anchoring would move it as the content grew or shrank. Deferred
  // here as well, it moves in the commit that puts the page's own deferred
  // values on screen.
  const [traversed, setTraversed] = useState(-1);
  const traversedOnScreen = useDeferredValue(traversed);

  // The pathname whose tree is on screen — not `location.pathname`. Under
  // interception the URL commits before the tree arrives, so while a page is
  // loading the two differ, and a state update aimed at the new URL is still
  // a navigation to a page that is not showing yet. Taking the shortcut then
  // would abort the load and leave the old page under the new URL.
  const shown = useRef<string | null>(null);
  // The navigation `usePendingPathname` names: the last one to start.
  const latest = useRef(-1);
  // The entry whose page is on screen while a page change loads — the URL's
  // entry otherwise. Going back to it is calling the change off, not going
  // back to a place the visitor left; and it is the entry a navigation in the
  // meantime leaves, at the position the visitor has it scrolled to. An empty
  // key names the entry a keyless traversal arrived at: WebKit leaves
  // `currentEntry` where it was, so that entry is not the URL's as far as
  // anything can read, and there is no key to record a position under.
  const onScreenEntry = useRef<string | null>(null);

  useEffect(() => {
    shown.current = normalizePathname(location.pathname);
    restoreLeftAt();
    const steps = reloadOnUnannouncedSteps(
      (url) =>
        normalizePathname(url.pathname) === shown.current &&
        pendingPathname === null &&
        !refresh(url),
    );
    const track = (
      id: number,
      entry: Omit<Pending, 'resolve'>,
      signal: AbortSignal,
    ): Promise<undefined> => {
      const { promise, resolve, reject } = Promise.withResolvers<undefined>();
      pending.current.set(id, {
        ...entry,
        resolve: () => {
          resolve(undefined);
        },
      });
      signal.addEventListener(
        'abort',
        () => {
          pending.current.delete(id);
          reject(signal.reason as Error);
        },
        { once: true },
      );
      return promise;
    };
    const onNavigate = (event: NavigateEvent): void => {
      steps.heard(event.destination.url);
      // 読み直しを頼んだ文書は去るところ。そのあとの遷移は横取りせずブラウザに任せる。
      // 横取りすると読み直しが止まり、currentEntry が null の文書では遷移も AbortError になる
      if (steps.reloading()) return;
      const traverse = event.navigationType === 'traverse';
      // WebKit は bfcache から戻した文書に、位置を戻す前の traverse を出す。行き先は
      // 今の entry で、画面のページは離れていない。位置はこのあとブラウザが戻す
      if (
        traverse &&
        isOurs(event) &&
        onScreenEntry.current === null &&
        event.destination.key === navigation.currentEntry?.key
      ) {
        event.intercept({ scroll: 'manual', focusReset: 'manual' });
        return;
      }
      // ページの読み込み中に離れるのは、URL の entry でなく画面に残るページの
      // entry。URL の entry はまだ画面に出ていない
      const leaving = onScreenEntry.current ?? navigation.currentEntry?.key;
      if (leaving !== undefined && leaving !== '') rememberLeftAt(leaving);
      // WebKit は、戻るで読み直した文書の entries() に、同じ文書のまま戻れる
      // それより前の entry を並べず、そこへの traverse の行き先に key を付けない。
      // 離れた位置を引けないので、そのときだけ戻すのをブラウザに任せる
      const keyless = traverse && event.destination.key === '';
      if (!isOurs(event)) {
        if (keyless) onScreenEntry.current = '';
        else if (onScreenEntry.current === '') onScreenEntry.current = null;
        return;
      }
      const url = new URL(event.destination.url);
      const pathname = normalizePathname(url.pathname);
      // Same place — only the search or the entry state moved. Nothing to
      // remount, and no focus to disturb; nothing to load either, unless the
      // page showing reads what moved. Only going back or forward moves the
      // viewport, to where that entry was left.
      const inPlace = pathname === shown.current;
      const plan =
        keyless || (inPlace && !traverse)
          ? null
          : scrollPlanFor(
              event.navigationType,
              url.hash,
              leftAt(event.destination.key),
            );
      // The platform would scroll "after transition" — after the handler
      // settles — but the handler settles only once the tree is on screen,
      // which is exactly when this hook scrolls itself. Doing it here keeps
      // the two from disagreeing, and keeps the behaviour where a browser
      // has not implemented the platform's half. A traversal included: the
      // hook puts back where it saw that entry left — a load in place too.
      const scroll = keyless ? 'after-transition' : 'manual';
      if (inPlace && !refresh(url)) {
        const calledOff =
          event.destination.key !== '' &&
          event.destination.key === onScreenEntry.current;
        onScreenEntry.current = keyless ? '' : null;
        if (!traverse || calledOff) {
          event.intercept({ scroll: 'manual', focusReset: 'manual' });
          if (calledOff) keepPosition(event.destination.key);
          return;
        }
        // 表に置くのも描き直しを頼むのも、handler でなくここで。currententrychange
        // より前なので、ページが同じタスクで出す更新と同じ描画にまとまり、遅らせた
        // 描画の lane も 1 本を分け合う。handler の走る時機はエンジンで違う
        const id = count.current++;
        const arrived = track(id, { scroll: plan }, event.signal);
        // handler が走る前に中止されると、誰も待たない reject になる
        arrived.catch(() => undefined);
        setTraversed(id);
        event.intercept({
          scroll,
          focusReset: 'manual',
          handler: () => arrived,
        });
        return;
      }
      if (!claim(url)) return;
      onScreenEntry.current ??= navigation.currentEntry?.key ?? null;

      const id = count.current++;
      latest.current = id;
      setPendingPathname(
        normalizePathname(withoutBase(url.pathname) ?? url.pathname),
      );
      const settled = (): void => {
        if (latest.current === id) setPendingPathname(null);
      };
      event.intercept({
        // A load in place moves neither the viewport nor focus.
        ...(inPlace ? { focusReset: 'manual' as const } : {}),
        scroll,
        handler: async () => {
          // 失敗も中止も、名指していた遷移が終わったということ。新しい遷移が
          // 始まっていれば、それがもう自分の行き先を名指している
          event.signal.addEventListener('abort', settled, { once: true });
          let value: T;
          try {
            value = await load(url, event.signal);
          } catch (error) {
            settled();
            throw error;
          }
          // A load that ignores the signal can come back after a second
          // navigation has already taken over. Applying it then would put the
          // page the visitor left back on screen, and the listener below would
          // never fire — an abort that already happened does not fire again.
          if (event.signal.aborted) throw event.signal.reason as Error;
          const committed = track(
            id,
            {
              scroll: plan,
              change: {
                // 同じページの読み直しはページの切り替えではない。
                // ViewTransition が切り替えとして動かさないよう、型を付けない
                types: inPlace ? [] : transitionTypesFor(event.navigationType),
                keyless,
              },
            },
            event.signal,
          );
          // Recorded at apply rather than at commit: a navigation that
          // arrives in between must see this page as the one showing.
          shown.current = pathname;
          apply(value);
          // Batched with the caller's own update, so its deferred copy
          // moves in the same background commit as the host's — and names
          // which navigation that commit belongs to.
          setApplied(id);
          await committed;
        },
      });
    };
    navigation.addEventListener('navigate', onNavigate);
    return () => {
      navigation.removeEventListener('navigate', onNavigate);
      steps.stop();
    };
  }, []);

  // A layout effect, not a passive one: the tree is committed and not yet
  // painted, which is when a document load places the viewport — so the new
  // page never shows at the old position for a frame. It is also the only
  // effect that can settle the handler at all once a `<ViewTransition>` is
  // in the tree: React holds the new snapshot until the platform's pending
  // navigation has finished, and runs passive effects only after the
  // animation — a passive resolver would be waiting on itself.
  const settle = useEffectEvent((id: number) => {
    const entry = pending.current.get(id);
    if (entry === undefined) return;
    pending.current.delete(id);
    if (entry.change !== undefined) {
      onScreenEntry.current = entry.change.keyless ? '' : null;
    }
    if (entry.scroll !== null) applyScroll(entry.scroll);
    if (latest.current === id) setPendingPathname(null);
    entry.resolve();
  });
  useLayoutEffect(() => {
    settle(onScreen);
  }, [onScreen]);
  useLayoutEffect(() => {
    settle(traversedOnScreen);
  }, [traversedOnScreen]);

  // The types a `<ViewTransition>` animates by cannot ride the update itself:
  // said inside `startTransition` together with it, they would bring back the
  // wait on a pending action. React keeps types for the root's next
  // transition-class commit only while such a render is pending, and the
  // background render is pending from the commit of the urgent one — so they
  // are said here, and the background commit is the one that claims them.
  useLayoutEffect(() => {
    if (applied === onScreen) return;
    const types = pending.current.get(applied)?.change?.types ?? [];
    startTransition(() => {
      for (const type of types) addTransitionType(type);
    });
  }, [applied, onScreen]);

  return { generation: onScreen };
}
