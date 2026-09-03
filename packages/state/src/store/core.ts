import { sameValue } from '../schema/object';
import type { StateValues } from '../schema/object';

/**
 * Mirrors `navigation.navigate()`'s own return shape: an object holding the
 * promises rather than a promise, so fire-and-forget callers ignore it
 * without tripping no-floating-promises, and the 5% that await pick a stage.
 * Slots with no navigation behind them return both promises pre-settled —
 * the type stays uniform across every kind of state.
 */
export type UpdateHandle = {
  /** The write is in its home (history entry, storage, memory). */
  committed: Promise<void>;
  /** All downstream work (a router's intercept fetch/render) is done. */
  finished: Promise<void>;
};

export type Patch = StateValues | ((current: StateValues) => StateValues);

export type Store = {
  subscribe: (keys: readonly string[] | null, notify: () => void) => () => void;
  getSnapshot: (sig: string, keys: readonly string[] | null) => StateValues;
  update: (
    patch: Patch,
    options?: { history?: 'push' | 'replace' },
  ) => UpdateHandle;
  dispose: () => void;
};

export type Handle = {
  external: UpdateHandle;
  settle: () => void;
  fail: (error: unknown) => void;
  adopt: (result: {
    committed?: Promise<unknown> | undefined;
    finished?: Promise<unknown> | undefined;
  }) => void;
};

export const createHandle = (): Handle => {
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

export type StoreCore = {
  snapshot: () => StateValues;
  applyNext: (next: StateValues) => void;
  subscribe: Store['subscribe'];
  getSnapshot: Store['getSnapshot'];
  clear: () => void;
};

/**
 * The shared half of every store: an immutable snapshot over a fixed key set,
 * exact per-key change detection, and notification only to the listeners
 * whose subscribed keys actually changed.
 */
export const createStoreCore = (
  keys: readonly string[],
  initial: StateValues,
): StoreCore => {
  type Listener = { keys: ReadonlySet<string> | null; notify: () => void };
  const listeners = new Set<Listener>();
  const picks = new Map<
    string,
    { keys: readonly string[]; value: StateValues }
  >();
  let snapshot = initial;

  return {
    snapshot: () => snapshot,
    applyNext: (next) => {
      const changed: string[] = [];
      const merged: StateValues = {};
      for (const key of keys) {
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
    },
    subscribe: (subscribedKeys, notify) => {
      const listener: Listener = {
        keys: subscribedKeys === null ? null : new Set(subscribedKeys),
        notify,
      };
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: (sig, pickKeys) => {
      if (pickKeys === null) return snapshot;
      let pick = picks.get(sig);
      if (pick === undefined) {
        const value: StateValues = {};
        for (const key of pickKeys) value[key] = snapshot[key];
        pick = { keys: pickKeys, value };
        picks.set(sig, pick);
      }
      return pick.value;
    },
    clear: () => {
      listeners.clear();
      picks.clear();
    },
  };
};

/**
 * The unknown-field guard every store shares: the typed API already prevents
 * this, so reaching it means an untyped caller — fail loudly, not silently.
 */
export const resolvePatch = (
  patch: Patch,
  current: StateValues,
  keys: readonly string[],
  label: string,
): StateValues => {
  const resolved = typeof patch === 'function' ? patch({ ...current }) : patch;
  for (const key of Object.keys(resolved)) {
    if (!keys.includes(key)) {
      throw new TypeError(`"${label}" has no field "${key}"`);
    }
  }
  return resolved;
};
