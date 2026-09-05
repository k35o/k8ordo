'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { output } from 'zod/v4/core';

import type { LocalState } from './local-state';
import type { MemoryState } from './memory-state';
import type { OutputOf, PageState } from './page-state';
import type { StateSchema, StateValues } from './schema/object';
import type { Patch, Store, UpdateHandle } from './store/core';
import { localInitialSnapshot, localStoreOf } from './store/local-store';
import { memoryInitialSnapshot, memoryStoreOf } from './store/memory-store';
import { pageInitialSnapshot, pageStoreOf } from './store/page-store';
import type { UpdateOptions } from './store/page-store';

export type AnyState = PageState | LocalState | MemoryState;

type StateOf<Def> =
  Def extends PageState<infer Url, infer Entry>
    ? OutputOf<Url> & OutputOf<Entry>
    : Def extends LocalState<infer Schema>
      ? output<Schema>
      : Def extends MemoryState<infer Values>
        ? Values
        : never;

type UrlStateOf<Def> = Def extends PageState<infer Url> ? OutputOf<Url> : never;

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
  : never;

const storeOf = (def: AnyState): Store =>
  def.kind === 'page'
    ? pageStoreOf(def)
    : def.kind === 'local'
      ? localStoreOf(def)
      : memoryStoreOf(def);

const initialOf = (
  def: AnyState,
  initialUrl: Readonly<StateValues> | undefined,
): StateValues =>
  def.kind === 'page'
    ? pageInitialSnapshot(def, initialUrl)
    : def.kind === 'local'
      ? localInitialSnapshot(def)
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
  keysOrOptions?: readonly string[] | { initialUrl?: Readonly<StateValues> },
  maybeOptions?: { initialUrl?: Readonly<StateValues> },
): [StateValues, (patch: Patch, options?: UpdateOptions) => UpdateHandle] {
  const gotKeys = Array.isArray(keysOrOptions);
  const options = gotKeys
    ? maybeOptions
    : (keysOrOptions as { initialUrl?: Readonly<StateValues> } | undefined);
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
  const getServerSnapshot = useMemo(() => {
    let cached: StateValues | undefined;
    return () => {
      if (cached === undefined) {
        const base = initialOf(def, initialUrl);
        if (keys === null) {
          cached = base;
        } else {
          const pick: StateValues = {};
          for (const key of keys) pick[key] = base[key];
          cached = pick;
        }
      }
      return cached;
    };
  }, [def, initialUrl, keys]);

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const update = useCallback(
    (patch: Patch, updateOptions?: UpdateOptions) =>
      storeOf(def).update(patch, updateOptions),
    [def],
  );
  return [state, update];
}
