import { normalizePathname, withoutBase } from '@k8ordo/router';

/**
 * How long a page rendered per request stays usable once prefetched, from the
 * moment it was asked for. Long enough to cover a pointer resting on a link
 * and then clicking it; short enough that a page hovered and left alone is not
 * shown, much later, as it was then — under mode: 'server' a page is rendered
 * per request, and its data may have moved on.
 */
export const PREFETCH_LIFETIME = 30_000;

/**
 * How many pages a cache of files holds — the pages prefetched and the pages
 * visited, the least recently used given up first. A bound on memory alone: a
 * file is the same page however long it is held.
 */
export const KEPT_PAGES = 50;

/**
 * The attribute that stops prefetching, on the link or on any element around
 * it: `data-k8ordo-prefetch="false"`. The nearest element carrying it decides,
 * so a link can opt back in inside a region that opted out.
 */
const PREFETCH_ATTRIBUTE = 'data-k8ordo-prefetch';

/** What starts a prefetch: a pointer onto a link, focus on one, a press. */
const INTENTS = ['pointerover', 'focusin', 'pointerdown'] as const;

/**
 * The URL a pointer, a focus or a press is about to follow, when following it
 * would fetch a page's payload — `null` otherwise. What is left out is what a
 * click would not load in place: another origin or a URL outside Vite's
 * `base`, another browsing context (`target="_blank"`), a download, and the
 * page already on screen, where only the search or the fragment would change.
 */
export const prefetchTargetOf = (target: EventTarget | null): URL | null => {
  if (!(target instanceof Element)) return null;
  const link = target.closest('a[href]');
  if (!(link instanceof HTMLAnchorElement)) return null;
  if (link.hasAttribute('download')) return null;
  if (link.target !== '' && link.target !== '_self') return null;
  const decided = link.closest(`[${PREFETCH_ATTRIBUTE}]`);
  if (decided?.getAttribute(PREFETCH_ATTRIBUTE) === 'false') return null;
  const url = new URL(link.href);
  if (url.origin !== location.origin) return null;
  if (withoutBase(url.pathname) === null) return null;
  if (
    normalizePathname(url.pathname) === normalizePathname(location.pathname)
  ) {
    return null;
  }
  return url;
};

/**
 * Prefetches the link a pointer, a focus or a press is about to follow, and
 * returns what stops it.
 */
export const prefetchOnIntent = (
  prefetch: (url: URL) => Promise<unknown>,
): (() => void) => {
  const onIntent = (event: Event): void => {
    const url = prefetchTargetOf(event.target);
    if (url !== null) void prefetch(url);
  };
  // 捕捉段で聞く。途中の要素が伝播を止めても、押し始めは見逃さない
  for (const type of INTENTS) {
    document.addEventListener(type, onIntent, { capture: true, passive: true });
  }
  return () => {
    for (const type of INTENTS) {
      document.removeEventListener(type, onIntent, { capture: true });
    }
  };
};

/**
 * Prefetches the links on screen (`prefetchInView`) while the primary pointer
 * is coarse, and returns what stops it.
 */
export const prefetchInViewUnderTouch = (
  prefetch: (url: URL) => Promise<unknown>,
): (() => void) => {
  // 粗いポインタにはホバーが無く、タップは押し始めとクリックがほぼ同時に
  // 来るので、先に取る間が無い。代わりに画面のリンクを取る
  const coarse = matchMedia('(pointer: coarse)');
  let stop: (() => void) | undefined;
  const follow = (): void => {
    stop?.();
    stop = coarse.matches ? prefetchInView(prefetch) : undefined;
  };
  follow();
  coarse.addEventListener('change', follow);
  return () => {
    coarse.removeEventListener('change', follow);
    stop?.();
  };
};

/**
 * Prefetches the links on screen, one at a time, in the order they came into
 * view, and returns what stops it. A link that leaves before its turn is
 * passed over, so a fast scroll fetches little; one at a time, so a page
 * visited while they load shares the connection with one prefetch at most.
 */
export const prefetchInView = (
  prefetch: (url: URL) => Promise<unknown>,
): (() => void) => {
  // 画面に入って、まだ番の来ていないリンク。Set は入れた順に回る
  const waiting = new Set<Element>();
  let draining = false;
  let stopped = false;
  const drain = async (): Promise<void> => {
    if (draining) return;
    draining = true;
    for (const link of waiting) {
      waiting.delete(link);
      const url = prefetchTargetOf(link);
      if (url !== null) {
        // 失敗した先読みは置き場が忘れ、遷移が取り直す。ここは次へ進むだけ
        await prefetch(url).catch(() => undefined);
      }
      if (stopped) break;
    }
    draining = false;
  };
  const view = new IntersectionObserver((entries) => {
    for (const { isIntersecting, target } of entries) {
      if (isIntersecting) waiting.add(target);
      else waiting.delete(target);
    }
    void drain();
  });
  const linksIn = (node: Node): Element[] =>
    node instanceof Element
      ? [
          ...(node.matches('a[href]') ? [node] : []),
          ...node.querySelectorAll('a[href]'),
        ]
      : [];
  // リンクは React が描くたびに入れ替わる。外れたものも見張り続けると、
  // IntersectionObserver が文書から外れた要素を離さない
  const tree = new MutationObserver((records) => {
    for (const { addedNodes, removedNodes } of records) {
      for (const node of removedNodes) {
        for (const link of linksIn(node)) {
          view.unobserve(link);
          waiting.delete(link);
        }
      }
      for (const node of addedNodes) {
        for (const link of linksIn(node)) view.observe(link);
      }
    }
  });
  tree.observe(document.documentElement, { childList: true, subtree: true });
  for (const link of document.querySelectorAll('a[href]')) view.observe(link);
  return () => {
    stopped = true;
    tree.disconnect();
    view.disconnect();
    waiting.clear();
  };
};

type Entry<T> = {
  readonly value: Promise<T>;
  readonly at: number;
  readonly controller: AbortController;
  /** Whether `value` has settled. */
  settled: boolean;
  /** How many navigations wait for it, while it is on its way. */
  waiting: number;
};

/**
 * Where a page's load is handed to navigations from. Two kinds, by what a
 * page's payload is:
 *
 * - **renders** (`files: false`): a page rendered per request. A load is
 *   started ahead of a navigation and handed to at most one — the next
 *   navigation to the same page within `PREFETCH_LIFETIME` of the load
 *   starting. Once taken it is gone: coming back to a page later fetches it
 *   afresh, as it did before anything was prefetched.
 * - **files** (`files: true`): a page written into a file, the same until
 *   the next deploy. Every load is held — a prefetch's, a navigation's own,
 *   the document's page — and handed to every navigation to that page, going
 *   back and forward included, up to `KEPT_PAGES`.
 *
 * A load forgotten while nobody waits for it is aborted, so a request nobody
 * will read does not run on; a navigation that took one and was overtaken
 * aborts it, unless another navigation still waits for it.
 */
export type PageCache<T> = {
  /**
   * Starts loading `key` unless a usable load of it is held, and returns the
   * held load.
   */
  readonly prefetch: (key: string, priority: RequestPriority) => Promise<T>;
  /**
   * What a navigation to `key` renders: a usable load held, or one started
   * for it. While it is on its way, `signal` aborting aborts it, as it would
   * a load the navigation had started itself.
   */
  readonly load: (key: string, signal: AbortSignal) => Promise<T>;
  /** Holds a page already in hand: the document's own, among files. */
  readonly keep: (key: string, value: T) => void;
  /** Forgets everything held, aborting what nobody waits for yet. */
  readonly clear: () => void;
};

export const createPageCache = <T>(
  load: (
    key: string,
    signal: AbortSignal,
    priority: RequestPriority,
  ) => Promise<T>,
  { files }: { readonly files: boolean },
  now: () => number = () => performance.now(),
): PageCache<T> => {
  // Map は入れた順に回るので、使うたびに入れ直せば、先頭がいちばん古い
  const entries = new Map<string, Entry<T>>();
  const usable = (entry: Entry<T>): boolean =>
    files || now() - entry.at < PREFETCH_LIFETIME;
  const forget = (key: string, entry: Entry<T>): void => {
    entries.delete(key);
    // ファイルの届いたページは、遷移が当てて描いている途中かもしれない。
    // 残りの読み込みはそのページのものなので止めない
    if (!files || !entry.settled) entry.controller.abort();
  };
  const hold = (key: string, entry: Entry<T>): void => {
    entries.delete(key);
    entries.set(key, entry);
    if (entries.size <= KEPT_PAGES || !files) return;
    // 遷移が待っている読み込みは、その遷移のものなので手放さない。いま置いた
    // ものも、これから遷移が待つかもしれない
    for (const [oldest, held] of entries) {
      if (oldest !== key && (held.settled || held.waiting === 0)) {
        forget(oldest, held);
        return;
      }
    }
  };
  const start = (key: string, priority: RequestPriority): Entry<T> => {
    const controller = new AbortController();
    const entry: Entry<T> = {
      value: load(key, controller.signal, priority),
      at: now(),
      controller,
      settled: false,
      waiting: 0,
    };
    // 失敗した読み込みは渡さず、次の遷移に取り直させる。この catch は
    // 誰も受け取らなかった失敗（捨てたときの中断を含む）を、未処理の
    // reject にしない役も兼ねる
    entry.value.then(
      () => {
        entry.settled = true;
      },
      () => {
        entry.settled = true;
        if (entries.get(key) === entry) entries.delete(key);
      },
    );
    return entry;
  };
  const held = (key: string): Entry<T> | undefined => {
    const entry = entries.get(key);
    if (entry === undefined || usable(entry)) return entry;
    forget(key, entry);
    return undefined;
  };
  const sweep = (): void => {
    for (const [key, entry] of entries) {
      if (!usable(entry)) forget(key, entry);
    }
  };
  return {
    prefetch: (key, priority) => {
      sweep();
      const entry = held(key) ?? start(key, priority);
      hold(key, entry);
      return entry.value;
    },
    load: (key, signal) => {
      let entry = held(key);
      if (entry === undefined) {
        if (!files) return load(key, signal, 'auto');
        entry = start(key, 'auto');
      }
      if (files) hold(key, entry);
      else entries.delete(key);
      if (!entry.settled) {
        const taken = entry;
        taken.waiting += 1;
        signal.addEventListener(
          'abort',
          () => {
            taken.waiting -= 1;
            if (taken.settled || taken.waiting > 0) return;
            if (entries.get(key) === taken) entries.delete(key);
            taken.controller.abort(signal.reason);
          },
          { once: true },
        );
      }
      return entry.value;
    },
    keep: (key, value) => {
      hold(key, {
        value: Promise.resolve(value),
        at: now(),
        controller: new AbortController(),
        settled: true,
        waiting: 0,
      });
    },
    clear: () => {
      for (const [key, entry] of entries) {
        if (entry.waiting === 0) forget(key, entry);
        else entries.delete(key);
      }
    },
  };
};
