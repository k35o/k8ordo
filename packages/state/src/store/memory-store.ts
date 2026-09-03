import type { MemoryState } from '../memory-state';
import type { StateValues } from '../schema/object';
import { createHandle, createStoreCore, resolvePatch } from './core';
import type { Patch, Store, UpdateHandle } from './core';
import { getOrCreateStore } from './registry';

const createMemoryStore = (def: MemoryState): Store => {
  const keys = Object.keys(def.initial);
  const core = createStoreCore(keys, { ...def.initial });

  // Nothing external to write to and nothing to coalesce: the write is the
  // snapshot swap itself, so the handle settles on the spot.
  const update = (patch: Patch): UpdateHandle => {
    const resolved = resolvePatch(patch, core.snapshot(), keys, def.key);
    core.applyNext({ ...core.snapshot(), ...resolved });
    const handle = createHandle();
    handle.settle();
    return handle.external;
  };

  return {
    subscribe: core.subscribe,
    getSnapshot: core.getSnapshot,
    update,
    dispose: core.clear,
  };
};

export const memoryStoreOf = (def: MemoryState): Store =>
  getOrCreateStore('memory', def.key, () => createMemoryStore(def));

/** SSR renders the initial values — static, so no cross-request concern. */
export const memoryInitialSnapshot = (def: MemoryState): StateValues => ({
  ...def.initial,
});
