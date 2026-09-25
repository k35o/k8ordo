import { cookieCodecOf, encodeCookie, parseCookieText } from '../cookie-state';
import type { CookieState } from '../cookie-state';
import type { StateValues } from '../schema/object';
import { createHandle, createStoreCore, resolvePatch } from './core';
import type { Handle, Patch, Store, UpdateHandle } from './core';
import { getOrCreateStore } from './registry';

// RFC 6265bis がブラウザに許す寿命の上限。書き込むたびに延びるので、使われて
// いる好みが期限で消えることはない
const MAX_AGE = 400 * 24 * 60 * 60;

// useSyncExternalStore のスナップショットは同期で要るが、cookieStore.get() は
// Promise を返す。読むのだけは document.cookie で行う
const rawCookie = (name: string): string | undefined => {
  for (const part of document.cookie.split(';')) {
    const at = part.indexOf('=');
    if (at !== -1 && part.slice(0, at).trim() === name) {
      return part.slice(at + 1).trim();
    }
  }
  return undefined;
};

const decoded = (raw: string | undefined): string | undefined => {
  if (raw === undefined) return undefined;
  try {
    return decodeURIComponent(raw);
  } catch {
    return undefined;
  }
};

const createCookieStore = (def: CookieState): Store => {
  const codec = cookieCodecOf(def);
  const { cookieName } = def;

  const read = (): StateValues =>
    codec.parse(parseCookieText(decoded(rawCookie(cookieName))));

  const core = createStoreCore(codec.keys, read());

  let pending: StateValues | null = null;
  let handle: Handle | null = null;
  let writing = 0;
  let missed = false;

  const sync = (): void => {
    // 書き込みが終わる前に届いた change は、その書き込みより古い値を見せる。
    // ここで読むと echo が一瞬前の値に戻るので、最後の書き込みが終わってから
    // 読み直す
    if (writing > 0) {
      missed = true;
      return;
    }
    missed = false;
    const fresh = read();
    // A foreign tab's write must not roll back a batch that has not flushed
    // yet: the pending patch stays on top.
    core.applyNext(pending === null ? fresh : { ...fresh, ...pending });
  };

  // change は同じオリジンのすべての文書に、スクリプトから見えるすべての
  // Cookie について届く。このタブ自身の書き込みも、応答の Set-Cookie も含む
  const onChange = (event: CookieChangeEvent): void => {
    const touched = [...event.changed, ...event.deleted].some(
      (cookie) => cookie.name === cookieName,
    );
    if (touched) sync();
  };
  cookieStore.addEventListener('change', onChange);

  // 失敗はすべてこのバッチのハンドルに渡し、返す Promise は reject しない。
  // reject すると後ろにつないだ書き込みが二度と走らなくなる
  const write = async (patch: StateValues, current: Handle): Promise<void> => {
    try {
      // Base the write on what the cookie holds now, not on the snapshot — a
      // foreign tab may have written between the echo and this flush.
      const target = codec.salvage({ ...read(), ...patch });
      // lib.dom の CookieInit にはまだ maxAge が無い（Safari 27 で 4 ブラウザ
      // がそろったばかり）ので、型を足してから渡す
      const init: CookieInit & { maxAge: number } = {
        name: cookieName,
        // JSON にできない値（bigint など）はここで throw する
        value: encodeCookie(target),
        path: '/',
        // 既定の strict では、ほかのサイトのリンクから来た最初のリクエストに
        // Cookie が付かず、サーバーが既定値で描いてしまう
        sameSite: 'lax',
        maxAge: MAX_AGE,
      };
      await cookieStore.set(init);
    } catch (error) {
      writing -= 1;
      // 拒まれても（大きすぎるなど）localStorage と同じく echo は残す。
      // その間にほかの書き込みが届いていたら、そちらが今の値
      if (missed) sync();
      current.fail(error);
      return;
    }
    writing -= 1;
    sync();
    current.settle();
  };

  // localStorage と違って書き込みは非同期なので、前のバッチの set() が Cookie
  // に入る前に次のバッチが read() すると、前のバッチのフィールドを古い値で
  // 上書きしてしまう。書き込みを 1 本ずつ流し、前のものが入ってから読む
  let writes: Promise<void> = Promise.resolve();

  const flush = (): void => {
    const patch = pending as StateValues;
    const current = handle as Handle;
    pending = null;
    handle = null;
    writing += 1;
    writes = writes.then(() => write(patch, current));
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
      cookieStore.removeEventListener('change', onChange);
      core.clear();
    },
  };
};

export const cookieStoreOf = (def: CookieState): Store =>
  getOrCreateStore('cookie', def.key, () => createCookieStore(def));

/**
 * What SSR and the hydration render see: the values the server read from the
 * request's cookies when the caller passed them down; the defaults otherwise.
 * Pure on purpose: the server must never touch `document` or create a store.
 */
export const cookieInitialSnapshot = (
  def: CookieState,
  initialCookie: Readonly<StateValues> | undefined,
): StateValues => {
  const codec = cookieCodecOf(def);
  const base: StateValues = { ...codec.defaults };
  if (initialCookie !== undefined) {
    for (const key of codec.keys) {
      if (key in initialCookie) base[key] = initialCookie[key];
    }
  }
  return base;
};
