import type { output } from 'zod/v4/core';

import { createStoredCodec } from './entry/codec';
import type { StoredCodec } from './entry/codec';
import type { RegisteredPath } from './register';
import type { StateSchema } from './schema/object';
import { createUrlCodec } from './url/codec';
import type { UrlCodec, UrlInput } from './url/codec';

export type OutputOf<Schema> = Schema extends StateSchema
  ? output<Schema>
  : Record<never, never>;

export type PageState<
  Url extends StateSchema | undefined = StateSchema | undefined,
  Entry extends StateSchema | undefined = StateSchema | undefined,
> = {
  kind: 'page';
  /** Identity of this state: store registry slot, entry-state namespace. */
  key: string;
  /** The url schema as passed — feed it to `@k8ordo/form` for GET forms. */
  url: Url;
  /** The entry schema as passed. */
  entry: Entry;
  /** Reads the url slot on the server. Absent params get their defaults. */
  parseUrl: (input: UrlInput) => OutputOf<Url>;
  /**
   * Builds a link. Unspecified fields mean their default and defaults are
   * omitted from the query, so canonical URLs stay short. The path literal
   * survives in the type, which is what lets typed-route checks pass.
   */
  href: <Path extends RegisteredPath>(
    base: Path,
    values?: Readonly<Partial<OutputOf<Url>>>,
  ) => Path | `${Path}?${string}`;
  /** The query string alone (no `?`), for handrolled URL composition. */
  search: (values?: Readonly<Partial<OutputOf<Url>>>) => string;
};

type SharedKeys<Url, Entry> = Extract<
  keyof OutputOf<Url>,
  keyof OutputOf<Entry>
> &
  string;

/**
 * The flat merged state cannot host one name twice; when it would, the error
 * carries the offending field name instead of a bare "not assignable".
 */
type DisjointGuard<Url, Entry> =
  SharedKeys<Url, Entry> extends never
    ? unknown
    : {
        entry: `field declared in both url and entry: ${SharedKeys<Url, Entry>}`;
      };

export type PageInternals = {
  url: UrlCodec | null;
  entry: StoredCodec | null;
  /** url keys first, then entry keys — the flat snapshot's full key set. */
  keys: readonly string[];
};

// The codecs stay reachable from the definition without being part of its
// public shape — the definition is the readable API that crosses the RSC
// boundary, the codecs are package internals.
const internals = new WeakMap<PageState, PageInternals>();

export const internalsOf = (def: PageState): PageInternals => {
  const found = internals.get(def);
  if (found === undefined) {
    throw new TypeError(
      `"${def.key}" was not created by definePageState of this module instance`,
    );
  }
  return found;
};

export function definePageState<Url extends StateSchema>(
  key: string,
  config: { url: Url },
): PageState<Url, undefined>;
export function definePageState<Entry extends StateSchema>(
  key: string,
  config: { entry: Entry },
): PageState<undefined, Entry>;
export function definePageState<
  Url extends StateSchema,
  Entry extends StateSchema,
>(
  key: string,
  config: { url: Url; entry: Entry } & DisjointGuard<Url, Entry>,
): PageState<Url, Entry>;
export function definePageState(
  key: string,
  config: { url?: StateSchema; entry?: StateSchema },
): PageState {
  const url = config.url === undefined ? null : createUrlCodec(config.url);
  const entry =
    config.entry === undefined
      ? null
      : createStoredCodec(config.entry, 'entry');
  if (url === null && entry === null) {
    throw new TypeError(`"${key}" declares neither url nor entry`);
  }
  const shared =
    url === null || entry === null
      ? []
      : url.keys.filter((field) => entry.keys.includes(field));
  if (shared.length > 0) {
    throw new TypeError(
      `"${key}" declares in both url and entry: ${shared.join(', ')}`,
    );
  }

  const search = (
    values?: Readonly<Partial<Record<string, unknown>>>,
  ): string => (url === null ? '' : url.search(values ?? {}));

  const def: PageState = {
    kind: 'page',
    key,
    url: config.url,
    entry: config.entry,
    parseUrl: (input) => (url === null ? {} : url.parse(input)),
    search,
    href: <Path extends RegisteredPath>(
      base: Path,
      values?: Readonly<Partial<Record<string, unknown>>>,
    ) => {
      const query = search(values);
      return query === '' ? base : `${base}?${query}`;
    },
  };
  internals.set(def, {
    url,
    entry,
    keys: [...(url?.keys ?? []), ...(entry?.keys ?? [])],
  });
  return def;
}
