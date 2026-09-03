import { localCodecOf } from '../local-state';
import type { LocalState } from '../local-state';
import type { StateValues } from '../schema/object';
import { createHandle, createStoreCore, resolvePatch } from './core';
import type { Handle, Patch, Store, UpdateHandle } from './core';
import { getOrCreateStore } from './registry';

// Namespaced so an app's own localStorage use can never collide with a state
// key; also what makes the rows recognizable in devtools.
const storageKeyOf = (def: LocalState): string => `k8ordo-state:${def.key}`;

const createLocalStore = (def: LocalState): Store => {
  const codec = localCodecOf(def);
  const storageKey = storageKeyOf(def);

  const read = (): StateValues => {
    const text = localStorage.getItem(storageKey);
    if (text === null) return codec.parse(undefined);
    try {
      return codec.parse(JSON.parse(text));
    } catch {
      // Corrupt JSON is stale data like any other: reset, don't crash.
      return codec.parse(undefined);
    }
  };

  const core = createStoreCore(codec.keys, read());

  // The storage event only fires in *other* tabs; same-tab notification runs
  // through applyNext directly in update().
  const onStorage = (event: StorageEvent): void => {
    if (event.key === storageKey || event.key === null) {
      core.applyNext(read());
    }
  };
  window.addEventListener('storage', onStorage);

  let pending: StateValues | null = null;
  let handle: Handle | null = null;

  const flush = (): void => {
    const target = core.snapshot();
    const current = handle as Handle;
    pending = null;
    handle = null;

    const values: StateValues = {};
    for (const key of codec.keys) values[key] = target[key];
    try {
      localStorage.setItem(storageKey, JSON.stringify(values));
      current.settle();
    } catch (error) {
      // Quota or serialization failure: the echo already showed the value,
      // but the caller who awaits learns persistence did not happen.
      current.fail(error);
    }
  };

  const update = (patch: Patch): UpdateHandle => {
    const resolved = resolvePatch(patch, core.snapshot(), codec.keys, def.key);
    if (pending === null) {
      pending = {};
      handle = createHandle();
      queueMicrotask(flush);
    }
    Object.assign(pending, resolved);
    core.applyNext({ ...core.snapshot(), ...pending });
    return (handle as Handle).external;
  };

  return {
    subscribe: core.subscribe,
    getSnapshot: core.getSnapshot,
    update,
    dispose: () => {
      window.removeEventListener('storage', onStorage);
      core.clear();
    },
  };
};

export const localStoreOf = (def: LocalState): Store =>
  getOrCreateStore('local', def.key, () => createLocalStore(def));

/** SSR and hydration see the defaults — the server has no localStorage. */
export const localInitialSnapshot = (def: LocalState): StateValues => ({
  ...localCodecOf(def).defaults,
});
