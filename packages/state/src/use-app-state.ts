'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { output } from 'zod/v4/core';

import type { CookieState } from './cookie-state';
import type { MemoryState } from './memory-state';
import type { OutputOf, PageState } from './page-state';
import type { StateSchema, StateValues } from './schema/object';
import type { LocalState, SessionState } from './storage-state';
import { cookieInitialSnapshot, cookieStoreOf } from './store/cookie-store';
import type { Patch, Store, UpdateHandle } from './store/core';
import { memoryInitialSnapshot, memoryStoreOf } from './store/memory-store';
import { pageInitialSnapshot, pageStoreOf } from './store/page-store';
import type { UpdateOptions } from './store/page-store';
import {
  localStoreOf,
  sessionStoreOf,
  storageInitialSnapshot,
} from './store/storage-store';

export type AnyState =
  | PageState
  | LocalState
  | SessionState
  | CookieState
  | MemoryState;

type StateOf<Def> =
  Def extends PageState<infer Url, infer Entry>
    ? OutputOf<Url> & OutputOf<Entry>
    : Def extends LocalState<infer Schema>
      ? output<Schema>
      : Def extends SessionState<infer Schema>
        ? output<Schema>
        : Def extends CookieState<infer Schema>
          ? output<Schema>
          : Def extends MemoryState<infer Values>
            ? Values
            : never;

type UrlStateOf<Def> = Def extends PageState<infer Url> ? OutputOf<Url> : never;

type Options = {
  initialUrl?: Readonly<StateValues>;
  initialCookie?: Readonly<StateValues>;
};

type UpdateFn<Def> = (
  patch:
    | Readonly<Partial<StateOf<Def>>>
    | ((current: StateOf<Def>) => Partial<StateOf<Def>>),
  // history:'push'/'replace' is a navigation concept; only the page kind has
  // a navigation behind it, so only there does the parameter exist at all.
  ...rest: Def extends PageState ? [options?: UpdateOptions] : []
) => UpdateHandle;

// `Record<never, never>` would admit any object literal, so a memory or
// local state would silently accept `{ initialUrl }`. `never` is what says
// "this kind takes no options".
type OptionsFor<Def> = Def extends { kind: 'page'; url: StateSchema }
  ? {
      /**
       * The RSC-parsed url state, passed down as a prop. It seeds SSR and
       * the hydration render; without it those two renders see the defaults,
       * which flashes once the live URL takes over. The entry slot has no
       * server-side source, so it always starts from defaults there.
       */
      initialUrl?: Readonly<UrlStateOf<Def>>;
    }
  : Def extends CookieState<infer Schema>
    ? {
        /**
         * What `parseCookies(request.cookies)` returned on the server, passed
         * down as a prop. It seeds SSR and the hydration render; without it
         * those two renders see the defaults, which flashes once the cookie
         * is read in the browser.
         */
        initialCookie?: Readonly<output<Schema>>;
      }
    : never;

const storeOf = (def: AnyState): Store =>
  def.kind === 'page'
    ? pageStoreOf(def)
    : def.kind === 'local'
      ? localStoreOf(def)
      : def.kind === 'session'
        ? sessionStoreOf(def)
        : def.kind === 'cookie'
          ? cookieStoreOf(def)
          : memoryStoreOf(def);

const initialOf = (def: AnyState, options: Options | undefined): StateValues =>
  def.kind === 'page'
    ? pageInitialSnapshot(def, options?.initialUrl)
    : def.kind === 'local' || def.kind === 'session'
      ? storageInitialSnapshot(def)
      : def.kind === 'cookie'
        ? cookieInitialSnapshot(def, options?.initialCookie)
        : memoryInitialSnapshot(def);

const FULL = '*';

export function useAppState<Def extends AnyState>(
  def: Def,
  options?: OptionsFor<Def>,
): [StateOf<Def>, UpdateFn<Def>];
export function useAppState<
  Def extends AnyState,
  const Key extends Extract<keyof StateOf<Def>, string>,
>(
  def: Def,
  keys: readonly Key[],
  options?: OptionsFor<Def>,
): [Pick<StateOf<Def>, Key>, UpdateFn<Def>];
export function useAppState(
  def: AnyState,
  keysOrOptions?: readonly string[] | Options,
  maybeOptions?: Options,
): [StateValues, (patch: Patch, options?: UpdateOptions) => UpdateHandle] {
  const gotKeys = Array.isArray(keysOrOptions);
  const options = gotKeys
    ? maybeOptions
    : (keysOrOptions as Options | undefined);
  // The signature both normalizes an inline key array (no useMemo required
  // at the call site) and serves as the pick-cache slot in the store.
  const sig = gotKeys
    ? JSON.stringify((keysOrOptions as readonly string[]).toSorted())
    : FULL;
  const keys = useMemo(
    () => (sig === FULL ? null : (JSON.parse(sig) as readonly string[])),
    [sig],
  );

  const subscribe = useCallback(
    (notify: () => void) => storeOf(def).subscribe(keys, notify),
    [def, keys],
  );
  const getSnapshot = useCallback(
    () => storeOf(def).getSnapshot(sig, keys),
    [def, sig, keys],
  );
  const initialUrl = options?.initialUrl;
  const initialCookie = options?.initialCookie;
  // useSyncExternalStore compares snapshots by identity, so the hydration one
  // has to be the same object on every call. It is built with the render
  // rather than memoized inside the getter, which would be a render-phase
  // write to a value the next render still reads.
  const serverSnapshot = useMemo(() => {
    const base = initialOf(def, { initialUrl, initialCookie });
    if (keys === null) {
      return base;
    }
    const pick: StateValues = {};
    for (const key of keys) pick[key] = base[key];
    return pick;
  }, [def, initialUrl, initialCookie, keys]);
  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot]);

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const update = useCallback(
    (patch: Patch, updateOptions?: UpdateOptions) =>
      storeOf(def).update(patch, updateOptions),
    [def],
  );
  return [state, update];
}
