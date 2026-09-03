'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { output } from 'zod/v4/core';

import type { PageState } from './page-state';
import { buildInitialSnapshot, pageStoreOf } from './store/page-store';
import type { UpdateHandle, UpdateOptions } from './store/page-store';
import type { UrlValues } from './url/codec';

type StateOf<Def> = Def extends PageState<infer Url> ? output<Url> : never;

type UpdateFn<State> = (
  patch: Readonly<Partial<State>> | ((current: State) => Partial<State>),
  options?: UpdateOptions,
) => UpdateHandle;

type PageOptions<State> = {
  /**
   * The RSC-parsed url state, passed down as a prop. It seeds SSR and the
   * hydration render; without it those two renders see the defaults, which
   * flashes once the live URL takes over.
   */
  initialUrl?: Readonly<State>;
};

const FULL = '*';

export function useAppState<Def extends PageState>(
  def: Def,
  options?: PageOptions<StateOf<Def>>,
): [StateOf<Def>, UpdateFn<StateOf<Def>>];
export function useAppState<
  Def extends PageState,
  const Key extends Extract<keyof StateOf<Def>, string>,
>(
  def: Def,
  keys: readonly Key[],
  options?: PageOptions<StateOf<Def>>,
): [Pick<StateOf<Def>, Key>, UpdateFn<StateOf<Def>>];
export function useAppState(
  def: PageState,
  keysOrOptions?: readonly string[] | PageOptions<UrlValues>,
  maybeOptions?: PageOptions<UrlValues>,
): [UrlValues, UpdateFn<UrlValues>] {
  const gotKeys = Array.isArray(keysOrOptions);
  const options = gotKeys
    ? maybeOptions
    : (keysOrOptions as PageOptions<UrlValues> | undefined);
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
    (notify: () => void) => pageStoreOf(def).subscribe(keys, notify),
    [def, keys],
  );
  const getSnapshot = useCallback(
    () => pageStoreOf(def).getSnapshot(sig, keys),
    [def, sig, keys],
  );
  const initialUrl = options?.initialUrl;
  const getServerSnapshot = useMemo(() => {
    let cached: UrlValues | undefined;
    return () => {
      cached ??= buildInitialSnapshot(def, initialUrl, keys);
      return cached;
    };
  }, [def, initialUrl, keys]);

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const update = useCallback<UpdateFn<UrlValues>>(
    (patch, updateOptions) => pageStoreOf(def).update(patch, updateOptions),
    [def],
  );
  return [state, update];
}
