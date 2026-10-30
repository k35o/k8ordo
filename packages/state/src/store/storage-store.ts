import type { RowCodec } from '../row/codec';
import type { StateValues } from '../schema/object';
import type { LocalState, SessionState } from '../storage-state';
import { createHandle, createStoreCore, resolvePatch } from './core';
import type { Handle, Patch, Store, UpdateHandle } from './core';
import { getOrCreateStore } from './registry';

/** What a store reads off a local or a session definition. */
type Stored = Pick<LocalState | SessionState, 'kind' | 'key' | 'storageKey'>;

type Area = Pick<Storage, 'getItem' | 'setItem'>;

type Row = ReturnType<RowCodec['read']>;

// サイトのデータを止めたブラウザでは、置き場所を読むだけで投げる。ストアには
// getItem や setItem が投げるときと同じに見せ、失敗の扱いを 1 か所にまとめる
const areaOf = (kind: Stored['kind']): Area => {
  try {
    return kind === 'local' ? localStorage : sessionStorage;
  } catch (error) {
    const refuse = (): never => {
      throw error;
    };
    return { getItem: refuse, setItem: refuse };
  }
};

const createStorageStore = (
  def: Stored,
  codec: RowCodec,
  storage: Area,
): Store => {
  const { storageKey } = def;

  const write = (values: Readonly<StateValues>): void => {
    storage.setItem(storageKey, JSON.stringify(codec.row(values)));
  };

  const readRow = (): Row => {
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
      try {
        const { values, stale } = readRow();
        if (stale) write(values);
      } catch {
        // 読めなくても書けなくても、先に読んだ値は正しい。次の読み込みでもう一度移行する
      }
    });
  };

  let first: Row;
  try {
    first = readRow();
  } catch {
    // ストアは描画の中で作られるので、ここで投げるとページごとエラーの境界に落ちる
    first = codec.read(undefined);
  }
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
    let row: Row;
    try {
      row = readRow();
    } catch {
      // 読めない行を既定値と読むと、画面の値まで巻き戻してしまう
      return;
    }
    const { values: fresh, stale } = row;
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

    try {
      // Base the write on what storage holds now, not on the snapshot — a
      // foreign tab may have written between the echo and this flush.
      const target = codec.salvage({ ...read(), ...patch });
      const values: StateValues = {};
      for (const key of codec.keys) values[key] = target[key];
      write(values);
      core.applyNext(target);
      current.settle();
    } catch (error) {
      // Quota or serialization failure, or a schema that throws on its own
      // output: the echo already showed the value, but the caller who awaits
      // learns persistence did not happen.
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

export const storageStoreOf = (def: Stored, codec: RowCodec): Store =>
  getOrCreateStore(def.kind, def.key, () =>
    createStorageStore(def, codec, areaOf(def.kind)),
  );

/** SSR and hydration see the defaults — the server has no Web Storage. */
export const storageInitialSnapshot = (codec: RowCodec): StateValues => ({
  ...codec.defaults,
});
