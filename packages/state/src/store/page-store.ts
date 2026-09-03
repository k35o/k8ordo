import { internalsOf } from '../page-state';
import type { PageInternals, PageState } from '../page-state';
import { isRecord, sameValue } from '../schema/object';
import type { StateValues } from '../schema/object';
import { createHandle, createStoreCore, resolvePatch } from './core';
import type { Handle, Patch, Store, UpdateHandle } from './core';
import { getOrCreateStore } from './registry';

export type UpdateOptions = {
  /**
   * `replace` by default: an update is a refinement of the current entry.
   * Opt into `push` for the updates the back button should undo.
   */
  history?: 'push' | 'replace';
};

const storedEntryState = (): unknown => navigation.currentEntry?.getState();

const readLive = (def: PageState, page: PageInternals): StateValues => {
  const live: StateValues = {};
  if (page.url !== null) {
    Object.assign(live, page.url.parse(new URL(location.href).searchParams));
  }
  if (page.entry !== null) {
    const stored = storedEntryState();
    Object.assign(
      live,
      page.entry.parse(isRecord(stored) ? stored[def.key] : undefined),
    );
  }
  return live;
};

const createPageStore = (def: PageState): Store => {
  const page = internalsOf(def);
  const core = createStoreCore(page.keys, readLive(def, page));

  let pending: StateValues | null = null;
  let pendingPush = false;
  let handle: Handle | null = null;

  const sync = (): void => {
    const live = readLive(def, page);
    // A concurrent platform event (another store's write landing, a
    // traversal) must not roll back a batch that has not flushed yet: the
    // pending patch stays on top of whatever became true.
    core.applyNext(pending === null ? live : { ...live, ...pending });
  };
  navigation.addEventListener('currententrychange', sync);

  /**
   * The whole navigation state travels with every write we make: the entry
   * state object is shared ground (the router's own state, other page
   * states), and a navigate that dropped it would wipe the neighbours.
   */
  const canonical = (values: StateValues): StateValues => ({
    ...(page.url === null ? {} : page.url.salvage(values)),
    ...(page.entry === null ? {} : page.entry.salvage(values)),
  });

  const carryState = (stored: unknown, target: StateValues): unknown => {
    if (page.entry === null) return stored;
    const base: StateValues = isRecord(stored) ? { ...stored } : {};
    const own: StateValues = {};
    for (const key of page.entry.keys) own[key] = target[key];
    base[def.key] = own;
    return base;
  };

  const flush = (): void => {
    const patch = pending as StateValues;
    const push = pendingPush;
    const current = handle as Handle;
    pending = null;
    pendingPush = false;
    handle = null;

    // The write target is the live values plus this batch's patch — not the
    // snapshot, which an interleaved currententrychange may have reshaped.
    // Parse-level comparison, not string comparison: a batch that ends back
    // where it started must not navigate at all.
    const url = new URL(location.href);
    const stored = storedEntryState();
    const liveUrl = page.url === null ? {} : page.url.parse(url.searchParams);
    const liveEntry =
      page.entry === null
        ? {}
        : page.entry.parse(isRecord(stored) ? stored[def.key] : undefined);
    const target = canonical({ ...liveUrl, ...liveEntry, ...patch });
    const urlChanged =
      page.url?.keys.some((key) => !sameValue(liveUrl[key], target[key])) ??
      false;
    const entryChanged =
      page.entry?.keys.some((key) => !sameValue(liveEntry[key], target[key])) ??
      false;

    if (!urlChanged && !entryChanged) {
      core.applyNext(target);
      current.settle();
      return;
    }

    const state = carryState(stored, target);

    if (!urlChanged) {
      // The hidden face alone moved: no navigation, works under any router.
      try {
        navigation.updateCurrentEntry({ state });
        current.settle();
      } catch (error) {
        current.fail(error);
      }
      return;
    }

    // Only this definition's params are rewritten: the URL is shared ground
    // (other page states, tracking params), not this store's property.
    if (page.url !== null) {
      for (const key of page.url.keys) url.searchParams.delete(key);
      for (const [key, value] of new URLSearchParams(page.url.search(target))) {
        url.searchParams.append(key, value);
      }
    }
    try {
      current.adopt(
        navigation.navigate(url.href, {
          history: push ? 'push' : 'replace',
          state,
        }),
      );
    } catch (error) {
      current.fail(error);
    }
  };

  const update = (patch: Patch, options?: UpdateOptions): UpdateHandle => {
    const resolved = resolvePatch(patch, core.snapshot(), page.keys, def.key);
    if (pending === null) {
      pending = {};
      handle = createHandle();
      // Several updates in one event handler collapse into one navigation;
      // they all share this batch's handle.
      queueMicrotask(flush);
    }
    Object.assign(pending, resolved);
    if (options?.history === 'push') pendingPush = true;
    // The echo is synchronous AND canonical: the merged state goes through
    // the schema right here, with the same salvage as a URL arrival, so the
    // next render never shows a value the schema rejects — update({page: 0})
    // lands where ?page=0 would.
    const echoed = canonical({ ...core.snapshot(), ...pending });
    for (const key of Object.keys(pending)) pending[key] = echoed[key];
    core.applyNext(echoed);
    return (handle as Handle).external;
  };

  return {
    subscribe: core.subscribe,
    getSnapshot: core.getSnapshot,
    update,
    dispose: () => {
      navigation.removeEventListener('currententrychange', sync);
      core.clear();
    },
  };
};

export const pageStoreOf = (def: PageState): Store =>
  getOrCreateStore('page', def.key, () => createPageStore(def));

/**
 * What SSR and the hydration render see: the RSC-parsed url when the caller
 * passed one down; defaults for everything else — the entry slot never
 * reaches the server. Pure on purpose: the server must never touch
 * `navigation` or create a store.
 */
export const pageInitialSnapshot = (
  def: PageState,
  initialUrl: Readonly<StateValues> | undefined,
): StateValues => {
  const page = internalsOf(def);
  const base: StateValues = {};
  for (const codec of [page.url, page.entry]) {
    if (codec !== null) {
      for (const key of codec.keys) base[key] = codec.defaults[key];
    }
  }
  if (page.url !== null && initialUrl !== undefined) {
    for (const key of page.url.keys) {
      if (key in initialUrl) base[key] = initialUrl[key];
    }
  }
  return base;
};
