/**
 * Where the current locale is kept, on each side of the network.
 *
 * On a server the request that `paramsSchema` accepted (or `locales.run`)
 * names it, and it is carried by `AsyncLocalStorage` so concurrent renders
 * stay apart. The RSC environment and the SSR environment (where client
 * components run on the server) are separate module graphs in one process,
 * so the storage — and the locale set that registered — live on
 * `globalThis`, not in this module.
 *
 * In the browser the URL is the locale: its first segment, read when asked.
 */

export type LocaleStorage = {
  getStore: () => string | undefined;
  enterWith: (locale: string) => void;
  run: <T>(locale: string, fn: () => T) => T;
};

/** What `message()` needs from the locale set: the default, and membership. */
export type RegisteredSet = {
  readonly default: string;
  readonly is: (value: unknown) => boolean;
};

const STORAGE_KEY = Symbol.for('@k8ordo/i18n/storage');
const SET_KEY = Symbol.for('@k8ordo/i18n/locales');

type Global = {
  [STORAGE_KEY]?: LocaleStorage;
  [SET_KEY]?: RegisteredSet;
  process?: { getBuiltinModule?: (id: string) => unknown };
  document?: unknown;
  location?: { pathname: string };
};

const global = globalThis as Global;

// ブラウザかどうかは 1 度だけ見る。SSR（react-dom/server.edge を Node で
// 走らせる）には document が無いので、そこはサーバー側の経路になる。
export const inBrowser = typeof document !== 'undefined';

/**
 * Reached through `process.getBuiltinModule` rather than an import so the
 * same build runs in the browser, where there is no request to scope to.
 */
export const localeStorage = (): LocaleStorage | null => {
  const existing = global[STORAGE_KEY];
  if (existing !== undefined) return existing;
  const getBuiltinModule = global.process?.getBuiltinModule;
  if (typeof getBuiltinModule !== 'function') return null;
  const { AsyncLocalStorage } = getBuiltinModule('node:async_hooks') as {
    AsyncLocalStorage: new () => LocaleStorage;
  };
  const created = new AsyncLocalStorage();
  global[STORAGE_KEY] = created;
  return created;
};

/**
 * The set messages read is the last one defined; an application has one.
 * Last rather than first so that a dev server re-evaluating the module that
 * defines the set (a locale added under HMR) is what messages see next.
 */
export const register = (set: RegisteredSet): void => {
  global[SET_KEY] = set;
};

/** The first segment of the browser's URL, whatever it spells. */
const browserSegment = (): string =>
  global.location?.pathname.split('/')[1] ?? '';

/** Whether a set has registered in this environment yet. */
export const setRegistered = (): boolean => global[SET_KEY] !== undefined;

/**
 * The current locale as a string, or `null` when nothing names one: no
 * segment in the URL, no request in progress. A registered set makes an
 * unknown segment `null` too, so `/fr/…` does not read as a locale.
 */
export const currentLocale = (): string | null => {
  const set = global[SET_KEY];
  const named = inBrowser ? browserSegment() : localeStorage()?.getStore();
  if (named === undefined || named === '') return null;
  if (set !== undefined && !set.is(named)) return null;
  return named;
};

/** The registered default, when a set registered in this environment. */
export const registeredDefault = (): string | null =>
  global[SET_KEY]?.default ?? null;
