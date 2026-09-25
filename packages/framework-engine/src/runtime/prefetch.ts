import { normalizePathname } from '@k8ordo/router';

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
 * click would not load in place: another origin, another browsing context
 * (`target="_blank"`), a download, and the page already on screen, where only
 * the search or the fragment would change.
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
  if (
    normalizePathname(url.pathname) === normalizePathname(location.pathname)
  ) {
    return null;
  }
  return url;
};

type Entry<T> = { readonly value: Promise<T>; readonly at: number };

export type PrefetchCache<T> = {
  /** Starts loading `key` unless a usable load of it is already held. */
  readonly prefetch: (key: string) => void;
  /** Hands over a usable load of `key` and forgets it; `undefined` if none. */
  readonly take: (key: string) => Promise<T> | undefined;
  /** Forgets everything held. */
  readonly clear: () => void;
};

/**
 * Loads started ahead of a navigation, each handed to at most one — the next
 * navigation to the same page within `PREFETCH_LIFETIME` of the load starting.
 * Once taken it is gone: coming back to a page later fetches it afresh, as it
 * did before anything was prefetched.
 */
export const createPrefetchCache = <T>(
  load: (key: string) => Promise<T>,
  now: () => number = () => performance.now(),
): PrefetchCache<T> => {
  const entries = new Map<string, Entry<T>>();
  const usable = (entry: Entry<T>): boolean =>
    now() - entry.at < PREFETCH_LIFETIME;
  const sweep = (): void => {
    for (const [key, entry] of entries) {
      if (!usable(entry)) entries.delete(key);
    }
  };
  return {
    prefetch: (key) => {
      sweep();
      if (entries.has(key)) return;
      const entry: Entry<T> = { value: load(key), at: now() };
      entries.set(key, entry);
      // 失敗した先読みは渡さず、次の遷移に取り直させる。この catch は
      // 誰も受け取らなかった失敗を未処理の reject にしない役も兼ねる
      entry.value.catch(() => {
        if (entries.get(key) === entry) entries.delete(key);
      });
    },
    take: (key) => {
      const entry = entries.get(key);
      if (entry === undefined) return undefined;
      entries.delete(key);
      return usable(entry) ? entry.value : undefined;
    },
    clear: () => {
      entries.clear();
    },
  };
};
