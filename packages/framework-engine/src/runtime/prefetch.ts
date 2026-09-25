import { normalizePathname, withoutBase } from '@k8ordo/router';

/**
 * How long a prefetched page stays usable, from the moment it was asked for.
 * Long enough to cover a pointer resting on a link and then clicking it; short
 * enough that a page hovered and left alone is not shown, much later, as it was
 * then — under `@k8ordo/server` a page is rendered per request, and its data
 * may have moved on.
 */
export const PREFETCH_LIFETIME = 30_000;

/**
 * The attribute that stops prefetching, on the link or on any element around
 * it: `data-k8ordo-prefetch="false"`. The nearest element carrying it decides,
 * so a link can opt back in inside a region that opted out.
 */
export const PREFETCH_ATTRIBUTE = 'data-k8ordo-prefetch';

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

type Entry<T> = {
  readonly value: Promise<T>;
  readonly at: number;
  readonly controller: AbortController;
};

export type PrefetchCache<T> = {
  /** Starts loading `key` unless a usable load of it is already held. */
  readonly prefetch: (key: string) => void;
  /**
   * Hands over a usable load of `key` and forgets it; `undefined` if none.
   * From then on the load is the taker's: `signal` aborting aborts it, as it
   * would a load the taker had started itself.
   */
  readonly take: (key: string, signal: AbortSignal) => Promise<T> | undefined;
  /** Forgets everything held, aborting what is still loading. */
  readonly clear: () => void;
};

/**
 * Loads started ahead of a navigation, each handed to at most one — the next
 * navigation to the same page within `PREFETCH_LIFETIME` of the load starting.
 * Once taken it is gone: coming back to a page later fetches it afresh, as it
 * did before anything was prefetched. A load forgotten before anyone took it
 * is aborted, so a request nobody will read does not run on.
 */
export const createPrefetchCache = <T>(
  load: (key: string, signal: AbortSignal) => Promise<T>,
  now: () => number = () => performance.now(),
): PrefetchCache<T> => {
  const entries = new Map<string, Entry<T>>();
  const usable = (entry: Entry<T>): boolean =>
    now() - entry.at < PREFETCH_LIFETIME;
  const forget = (key: string, entry: Entry<T>): void => {
    entries.delete(key);
    entry.controller.abort();
  };
  const sweep = (): void => {
    for (const [key, entry] of entries) {
      if (!usable(entry)) forget(key, entry);
    }
  };
  return {
    prefetch: (key) => {
      sweep();
      if (entries.has(key)) return;
      const controller = new AbortController();
      const entry: Entry<T> = {
        value: load(key, controller.signal),
        at: now(),
        controller,
      };
      entries.set(key, entry);
      // 失敗した先読みは渡さず、次の遷移に取り直させる。この catch は
      // 誰も受け取らなかった失敗（捨てたときの中断を含む）を、未処理の
      // reject にしない役も兼ねる
      entry.value.catch(() => {
        if (entries.get(key) === entry) entries.delete(key);
      });
    },
    take: (key, signal) => {
      const entry = entries.get(key);
      if (entry === undefined) return undefined;
      if (!usable(entry)) {
        forget(key, entry);
        return undefined;
      }
      entries.delete(key);
      signal.addEventListener(
        'abort',
        () => {
          entry.controller.abort(signal.reason);
        },
        { once: true },
      );
      return entry.value;
    },
    clear: () => {
      for (const [key, entry] of entries) forget(key, entry);
    },
  };
};
