import { codecOf } from '../page-state';
import type { PageState } from '../page-state';
import { sameValue } from '../url/codec';
import type { UrlValues } from '../url/codec';
import { getOrCreateStore } from './registry';

/**
 * Mirrors `navigation.navigate()`'s own return shape: an object holding the
 * promises rather than a promise, so fire-and-forget callers ignore it
 * without tripping no-floating-promises, and the 5% that await pick a stage.
 */
export type UpdateHandle = {
  /** The URL is in the history. */
  committed: Promise<void>;
  /** The router's intercept work (fetch, render) is done. */
  finished: Promise<void>;
};

export type UpdateOptions = {
  /**
   * `replace` by default: an update is a refinement of the current entry.
   * Opt into `push` for the updates the back button should undo.
   */
  history?: 'push' | 'replace';
};

export type Patch = UrlValues | ((current: UrlValues) => UrlValues);

export type PageStore = {
  subscribe: (keys: readonly string[] | null, notify: () => void) => () => void;
  getSnapshot: (sig: string, keys: readonly string[] | null) => UrlValues;
  update: (patch: Patch, options?: UpdateOptions) => UpdateHandle;
  dispose: () => void;
};

type Handle = {
  external: UpdateHandle;
  settle: () => void;
  fail: (error: unknown) => void;
  adopt: (result: {
    committed?: Promise<unknown> | undefined;
    finished?: Promise<unknown> | undefined;
  }) => void;
};

const createHandle = (): Handle => {
  let resolveCommitted!: () => void;
  let rejectCommitted!: (error: unknown) => void;
  let resolveFinished!: () => void;
  let rejectFinished!: (error: unknown) => void;
  const committed = new Promise<void>((resolve, reject) => {
    resolveCommitted = resolve;
    rejectCommitted = reject;
  });
  const finished = new Promise<void>((resolve, reject) => {
    resolveFinished = resolve;
    rejectFinished = reject;
  });
  // A superseded navigation rejects these; for a fire-and-forget caller that
  // is the normal course of events, not an unhandled rejection.
  committed.catch(() => undefined);
  finished.catch(() => undefined);
  return {
    external: { committed, finished },
    settle: () => {
      resolveCommitted();
      resolveFinished();
    },
    fail: (error) => {
      rejectCommitted(error);
      rejectFinished(error);
    },
    adopt: (result) => {
      // lib.dom marks the pair optional; the spec always returns both, so a
      // missing promise can only mean "nothing to wait for".
      if (result.committed === undefined) resolveCommitted();
      else result.committed.then(() => resolveCommitted(), rejectCommitted);
      if (result.finished === undefined) resolveFinished();
      else result.finished.then(() => resolveFinished(), rejectFinished);
    },
  };
};

const createPageStore = (def: PageState): PageStore => {
  const codec = codecOf(def);

  type Listener = { keys: ReadonlySet<string> | null; notify: () => void };
  const listeners = new Set<Listener>();
  const picks = new Map<
    string,
    { keys: readonly string[]; value: UrlValues }
  >();

  let snapshot = codec.parse(new URL(location.href).searchParams);

  const applyNext = (next: UrlValues): void => {
    const changed: string[] = [];
    const merged: UrlValues = {};
    for (const key of codec.keys) {
      // Unchanged fields keep their previous reference so key-subscribed
      // picks and downstream memoization stay stable under Object.is.
      if (sameValue(snapshot[key], next[key])) {
        merged[key] = snapshot[key];
      } else {
        merged[key] = next[key];
        changed.push(key);
      }
    }
    if (changed.length === 0) return;
    snapshot = merged;
    for (const [sig, pick] of picks) {
      if (changed.some((key) => pick.keys.includes(key))) picks.delete(sig);
    }
    for (const listener of listeners) {
      const subscribed = listener.keys;
      if (subscribed === null || changed.some((key) => subscribed.has(key))) {
        listener.notify();
      }
    }
  };

  const sync = (): void => {
    applyNext(codec.parse(new URL(location.href).searchParams));
  };
  navigation.addEventListener('currententrychange', sync);

  let pending: UrlValues | null = null;
  let pendingPush = false;
  let handle: Handle | null = null;

  const flush = (): void => {
    const target = snapshot;
    const push = pendingPush;
    const current = handle as Handle;
    pending = null;
    pendingPush = false;
    handle = null;

    const url = new URL(location.href);
    // Parse-level comparison, not string comparison: a batch that ends back
    // where it started must not navigate at all.
    const live = codec.parse(url.searchParams);
    if (codec.keys.every((key) => sameValue(live[key], target[key]))) {
      current.settle();
      return;
    }
    // Only this definition's params are rewritten: the URL is shared ground
    // (other page states, tracking params), not this store's property.
    for (const key of codec.keys) url.searchParams.delete(key);
    for (const [key, value] of new URLSearchParams(codec.search(target))) {
      url.searchParams.append(key, value);
    }
    try {
      current.adopt(
        navigation.navigate(url.href, { history: push ? 'push' : 'replace' }),
      );
    } catch (error) {
      current.fail(error);
    }
  };

  const update = (patch: Patch, options?: UpdateOptions): UpdateHandle => {
    const resolved =
      typeof patch === 'function' ? patch({ ...snapshot }) : patch;
    for (const key of Object.keys(resolved)) {
      if (!codec.keys.includes(key)) {
        throw new TypeError(`"${def.key}" has no url field "${key}"`);
      }
    }
    if (pending === null) {
      pending = {};
      handle = createHandle();
      // Several updates in one event handler collapse into one navigation;
      // they all share this batch's handle.
      queueMicrotask(flush);
    }
    Object.assign(pending, resolved);
    if (options?.history === 'push') pendingPush = true;
    // Synchronous echo: the next render sees the new value. The
    // currententrychange after the navigation re-parses the URL and settles
    // any value the schema normalizes differently.
    applyNext({ ...snapshot, ...pending });
    return (handle as Handle).external;
  };

  return {
    subscribe: (keys, notify) => {
      const listener: Listener = {
        keys: keys === null ? null : new Set(keys),
        notify,
      };
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: (sig, keys) => {
      if (keys === null) return snapshot;
      let pick = picks.get(sig);
      if (pick === undefined) {
        const value: UrlValues = {};
        for (const key of keys) value[key] = snapshot[key];
        pick = { keys, value };
        picks.set(sig, pick);
      }
      return pick.value;
    },
    update,
    dispose: () => {
      navigation.removeEventListener('currententrychange', sync);
      listeners.clear();
      picks.clear();
    },
  };
};

export const pageStoreOf = (def: PageState): PageStore =>
  getOrCreateStore('page', def.key, () => createPageStore(def));

/**
 * What SSR and the hydration render see: the RSC-parsed url when the caller
 * passed one down, defaults otherwise. Pure on purpose — the server must
 * never touch `navigation` or create a store.
 */
export const buildInitialSnapshot = (
  def: PageState,
  initialUrl: Readonly<UrlValues> | undefined,
  keys: readonly string[] | null,
): UrlValues => {
  const codec = codecOf(def);
  const base: UrlValues = {};
  for (const key of codec.keys) {
    base[key] =
      initialUrl !== undefined && key in initialUrl
        ? initialUrl[key]
        : codec.defaults[key];
  }
  if (keys === null) return base;
  const pick: UrlValues = {};
  for (const key of keys) pick[key] = base[key];
  return pick;
};
