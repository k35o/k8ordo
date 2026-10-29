import type { StateValues } from '../schema/object';
import type { Store } from './core';

/** What `useAppState` needs of a definition beyond its public shape. */
export type Kind = {
  /** The definition's store in the browser, made the first time it is read. */
  readonly store: () => Store;
  /** What the server render and the hydration render show. */
  readonly initial: (options: {
    readonly initialUrl?: Readonly<StateValues> | undefined;
    readonly initialCookie?: Readonly<StateValues> | undefined;
  }) => StateValues;
};

const DEFINERS = {
  page: 'definePageState',
  local: 'defineLocalState',
  session: 'defineSessionState',
  cookie: 'defineCookieState',
  memory: 'defineMemoryState',
} as const;

// 定義を作る関数が、自分の種類の store をここに結ぶ。useAppState が種類ごとの
// store を自分で import すると、1 つの種類しか使わないモジュールにも、全部の
// store と、definePageState と URL のコーデックまで載る
const kinds = new WeakMap<object, Kind>();

export const setKind = (def: object, kind: Kind): void => {
  kinds.set(def, kind);
};

export const kindOf = (def: {
  readonly kind: keyof typeof DEFINERS;
  readonly key: string;
}): Kind => {
  const found = kinds.get(def);
  if (found === undefined) {
    throw new TypeError(
      `"${def.key}" was not created by ${DEFINERS[def.kind]} of this module instance`,
    );
  }
  return found;
};
