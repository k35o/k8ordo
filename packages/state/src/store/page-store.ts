import type { PageInternals, PageState } from '../page-state';
import { isRecord, sameValue } from '../schema/object';
import type { StateValues } from '../schema/object';
import { createHandle, createStoreCore, resolvePatch } from './core';
import type { Frozen, Handle, Patch, Store, UpdateHandle } from './core';
import { getOrCreateStore } from './registry';

export type UpdateOptions = {
  /**
   * `replace` by default: an update is a refinement of the current entry.
   * Opt into `push` for the updates the back button should undo. It applies
   * only when a url value changes; an entry-only write rewrites the current
   * entry in place.
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

/**
 * The URL's pathname as the router compares a tree's: a trailing slash is
 * not another page. `@k8ordo/router`'s `normalizePathname`, spelled again —
 * the router is a peer this package only reads types from.
 */
const livePathname = (): string => {
  const { pathname } = location;
  let end = pathname.length;
  while (end > 1 && pathname.charAt(end - 1) === '/') end -= 1;
  return pathname.slice(0, end);
};

const createPageStore = (def: PageState, page: PageInternals): Store => {
  const core = createStoreCore(page.keys, readLive(def, page));

  // An intercepting router commits the URL before the next tree arrives, and
  // the tree on screen meanwhile reads the values the URL had as it was left:
  // what the URL holds is the next page's. Kept per tree pathname, only for
  // trees something reads from, and dropped when the URL comes back.
  let at = livePathname();
  const left = new Map<string, Frozen>();
  const bound = new Map<string, number>();

  let pending: StateValues | null = null;
  let pendingPush = false;
  let handle: Handle | null = null;

  const sync = (): void => {
    const pathname = livePathname();
    let returned = false;
    if (pathname !== at) {
      if ((bound.get(at) ?? 0) > 0) left.set(at, core.freeze());
      returned = left.delete(pathname);
      at = pathname;
      // 購読が外れた時点では捨てない。部品が購読を付け直すと 0 を通り、
      // 画面に残る木が取っておいた値を失う
      for (const tree of left.keys()) {
        if (!bound.has(tree)) left.delete(tree);
      }
    }
    const live = readLive(def, page);
    // A concurrent platform event (another store's write landing, a
    // traversal) must not roll back a batch that has not flushed yet: the
    // pending patch stays on top of whatever became true.
    core.applyNext(pending === null ? live : { ...live, ...pending });
    // 戻った木は取っておいた値を読んでいた。URL の値が行き先のものと同じなら
    // applyNext は誰にも知らせないので、ここで読み直させる
    if (returned) core.touch();
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

    // 目標の組み立てから書き込みまでを 1 つの try に入れる。ここから先の
    // 失敗はこのバッチのもので、マイクロタスクの外に投げても誰も受け取れない
    try {
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
        page.entry?.keys.some(
          (key) => !sameValue(liveEntry[key], target[key]),
        ) ?? false;

      if (!urlChanged && !entryChanged) {
        core.applyNext(target);
        current.settle();
        return;
      }

      const state = carryState(stored, target);

      if (!urlChanged) {
        // The hidden face alone moved: no navigation, works under any router.
        navigation.updateCurrentEntry({ state });
        current.settle();
        return;
      }

      // Only this definition's params are rewritten: the URL is shared ground
      // (other page states, tracking params), not this store's property.
      if (page.url !== null) {
        for (const key of page.url.keys) url.searchParams.delete(key);
        for (const [key, value] of new URLSearchParams(
          page.url.search(target),
        )) {
          url.searchParams.append(key, value);
        }
      }
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

  const update = (
    patch: Patch,
    options?: UpdateOptions,
    tree?: string | null,
  ): UpdateHandle => {
    // A tree being left shows the values it was left with, not the URL's:
    // written, they would land on the next page's URL, which never showed
    // them, and load it again. A batch that ends where it started settles
    // the same way.
    if (tree !== undefined && tree !== null && tree !== at) {
      const dropped = createHandle();
      dropped.settle();
      return dropped.external;
    }
    const resolved = resolvePatch(patch, core.snapshot(), page.keys, def.key);
    // The echo is synchronous AND canonical: the merged state goes through
    // the schema right here, by the same road a URL arrival takes, so the
    // next render never shows a value the schema rejects — update({page: 0})
    // lands where ?page=0 would.
    //
    // バッチに載せる前に組み立てる。載せてから拒まれると、同じ値で次の flush
    // がもう一度失敗し、呼び出し側は理由を受け取れないまま書き込みだけが消える
    const echoed = canonical({
      ...core.snapshot(),
      ...pending,
      ...resolved,
    });
    if (pending === null) {
      pending = {};
      handle = createHandle();
      // Several updates in one event handler collapse into one navigation;
      // they all share this batch's handle.
      queueMicrotask(flush);
    }
    Object.assign(pending, resolved);
    if (options?.history === 'push') pendingPush = true;
    for (const key of Object.keys(pending)) pending[key] = echoed[key];
    core.applyNext(echoed);
    return (handle as Handle).external;
  };

  const subscribe: Store['subscribe'] = (keys, notify, tree) => {
    const unsubscribe = core.subscribe(keys, notify);
    if (tree === undefined || tree === null) return unsubscribe;
    bound.set(tree, (bound.get(tree) ?? 0) + 1);
    return () => {
      unsubscribe();
      const rest = (bound.get(tree) ?? 1) - 1;
      if (rest > 0) bound.set(tree, rest);
      else bound.delete(tree);
    };
  };

  const getSnapshot: Store['getSnapshot'] = (sig, keys, tree) => {
    const held =
      tree === undefined || tree === null || tree === at
        ? undefined
        : left.get(tree);
    if (held === undefined) return core.getSnapshot(sig, keys);
    if (keys === null) return held.values;
    let pick = held.picks.get(sig);
    if (pick === undefined) {
      pick = {};
      for (const key of keys) pick[key] = held.values[key];
      held.picks.set(sig, pick);
    }
    return pick;
  };

  return {
    subscribe,
    getSnapshot,
    update,
    dispose: () => {
      navigation.removeEventListener('currententrychange', sync);
      left.clear();
      bound.clear();
      core.clear();
    },
  };
};

export const pageStoreOf = (def: PageState, page: PageInternals): Store =>
  getOrCreateStore('page', def.key, () => createPageStore(def, page));

/**
 * What SSR and the hydration render see: the RSC-parsed url when the caller
 * passed one down; defaults for everything else — the entry slot never
 * reaches the server. Pure on purpose: the server must never touch
 * `navigation` or create a store.
 */
export const pageInitialSnapshot = (
  page: PageInternals,
  initialUrl: Readonly<StateValues> | undefined,
): StateValues => {
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
