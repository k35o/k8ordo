import type { StateValues } from '../schema/object';
import { storageCodecOf } from '../storage-state';
import type { LocalState, SessionState } from '../storage-state';
import { createHandle, createStoreCore, resolvePatch } from './core';
import type { Handle, Patch, Store, UpdateHandle } from './core';
import { getOrCreateStore } from './registry';

const createStorageStore = (
  def: LocalState | SessionState,
  storage: Storage,
): Store => {
  const codec = storageCodecOf(def);
  const { storageKey } = def;

  const write = (values: Readonly<StateValues>): void => {
    storage.setItem(storageKey, JSON.stringify(codec.row(values)));
  };

  const readRow = (): { values: StateValues; stale: boolean } => {
    const text = storage.getItem(storageKey);
    let row: unknown;
    try {
      row = text === null ? undefined : JSON.parse(text);
    } catch {
      // Corrupt JSON is stale data like any other: reset, don't crash.
      row = undefined;
    }
    return codec.read(row);
  };

  const read = (): StateValues => readRow().values;

  // 古い版の行は、移行した値を今の版で書き戻す。ストアは描画中に作られるので
  // その場では書かず、マイクロタスクで行を読み直してからまだ古ければ書く。
  // その間に update() が今の版で書いていれば、何もしない
  const upgrade = (): void => {
    queueMicrotask(() => {
      const { values, stale } = readRow();
      if (!stale) return;
      try {
        write(values);
      } catch {
        // 書けなくても読んだ値は正しい。次の読み込みでもう一度移行する
      }
    });
  };

  const first = readRow();
  const core = createStoreCore(codec.keys, first.values);
  if (first.stale) upgrade();

  let pending: StateValues | null = null;
  let handle: Handle | null = null;

  // The storage event only fires in *other* documents sharing the area — other
  // tabs for localStorage, other frames of this tab for sessionStorage;
  // same-document notification runs through applyNext directly in update().
  const onStorage = (event: StorageEvent): void => {
    if (event.storageArea !== storage) return;
    if (event.key !== storageKey && event.key !== null) return;
    const { values: fresh, stale } = readRow();
    if (stale) upgrade();
    // A foreign tab's write must not roll back a batch that has not flushed
    // yet: the pending patch stays on top.
    core.applyNext(pending === null ? fresh : { ...fresh, ...pending });
  };
  window.addEventListener('storage', onStorage);

  const flush = (): void => {
    const patch = pending as StateValues;
    const current = handle as Handle;
    pending = null;
    handle = null;

    // Base the write on what storage holds now, not on the snapshot — a
    // foreign tab may have written between the echo and this flush.
    const target = codec.salvage({ ...read(), ...patch });
    const values: StateValues = {};
    for (const key of codec.keys) values[key] = target[key];
    try {
      write(values);
      core.applyNext(target);
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
    // Canonical echo: the merged state passes the schema right here, so the
    // next render never shows a value the schema rejects.
    const echoed = codec.salvage({ ...core.snapshot(), ...pending });
    for (const key of Object.keys(pending)) pending[key] = echoed[key];
    core.applyNext(echoed);
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
  getOrCreateStore('local', def.key, () =>
    createStorageStore(def, localStorage),
  );

export const sessionStoreOf = (def: SessionState): Store =>
  getOrCreateStore('session', def.key, () =>
    createStorageStore(def, sessionStorage),
  );

/** SSR and hydration see the defaults — the server has no Web Storage. */
export const storageInitialSnapshot = (
  def: LocalState | SessionState,
): StateValues => ({ ...storageCodecOf(def).defaults });
