import type { $ZodType, output } from 'zod/v4/core';

import { withBase } from './base';
import { createStoredCodec } from './entry/codec';
import type { StoredCodec } from './entry/codec';
import { createHashCodec } from './hash/codec';
import type { HashCodec } from './hash/codec';
import type { RegisteredPath } from './register';
import type { StateSchema } from './schema/object';
import { setKind } from './store/kind';
import { pageInitialSnapshot, pageStoreOf } from './store/page-store';
import { createUrlCodec } from './url/codec';
import type { UrlCodec, UrlInput } from './url/codec';

export type OutputOf<Schema> = Schema extends StateSchema
  ? output<Schema>
  : // oxlint-disable-next-line typescript/no-generated-empty-object-type -- スキーマの無い側は交差で消え、Record<string, unknown> を受ける実装にも渡せるキーの無い型が要る。object では後者が通らない
    Record<never, never>;

/** The one field the hash slot adds to the flat state. */
export type HashOf<Hash> = Hash extends $ZodType
  ? { hash: output<Hash> }
  : // oxlint-disable-next-line typescript/no-generated-empty-object-type -- OutputOf と同じく、スキーマの無い側は交差で消える
    Record<never, never>;

export type PageState<
  Url extends StateSchema | undefined = StateSchema | undefined,
  Entry extends StateSchema | undefined = StateSchema | undefined,
  Hash extends $ZodType | undefined = $ZodType | undefined,
> = {
  kind: 'page';
  /** Identity of this state: store registry slot, entry-state namespace. */
  key: string;
  /** The url schema as passed — feed it to `@k8ordo/form` for GET forms. */
  url: Url;
  /** The entry schema as passed. */
  entry: Entry;
  /** The hash schema as passed. */
  hash: Hash;
  /** Reads the url slot on the server. Absent params get their defaults. */
  parseUrl: (input: UrlInput) => OutputOf<Url>;
  /**
   * Builds a link. Unspecified fields mean their default and defaults are
   * omitted from the query and the fragment, so canonical URLs stay short.
   * The path is in the table's terms and the URL carries Vite's `base` in
   * front of it; the path literal survives in the type, which is what lets
   * typed-route checks pass.
   */
  href: <Path extends string>(
    path: RegisteredPath<Path>,
    values?: Readonly<Partial<OutputOf<Url> & HashOf<Hash>>>,
  ) =>
    | Path
    | `${Path}?${string}`
    | (Hash extends $ZodType ? `${Path}#${string}` : never);
  /** The query string alone (no `?`), for handrolled URL composition. */
  search: (values?: Readonly<Partial<OutputOf<Url>>>) => string;
};

type SharedKeys<Url, Entry> = Extract<
  keyof OutputOf<Url>,
  keyof OutputOf<Entry>
> &
  string;

type NamedHash<Url, Entry> = Extract<
  keyof OutputOf<Url> | keyof OutputOf<Entry>,
  'hash'
>;

/**
 * The flat merged state cannot host one name twice; when it would, the error
 * carries the offending field name instead of a bare "not assignable".
 */
type DisjointGuard<Url, Entry, Hash> = [Url, Entry, Hash] extends [
  undefined,
  undefined,
  undefined,
]
  ? { url: 'declare at least one of url, entry and hash' }
  : [SharedKeys<Url, Entry>] extends [never]
    ? [Hash] extends [undefined]
      ? unknown
      : [NamedHash<Url, Entry>] extends [never]
        ? unknown
        : {
            hash: 'a url or entry field is named hash, the name the hash value takes in the state';
          }
    : {
        entry: `field declared in both url and entry: ${SharedKeys<Url, Entry>}`;
      };

export type PageInternals = {
  url: UrlCodec | null;
  entry: StoredCodec | null;
  hash: HashCodec | null;
  /** url keys first, then entry keys, then `hash` — the flat snapshot's full key set. */
  keys: readonly string[];
};

export function definePageState<
  Url extends StateSchema | undefined = undefined,
  Entry extends StateSchema | undefined = undefined,
  Hash extends $ZodType | undefined = undefined,
>(
  key: string,
  config: { url?: Url; entry?: Entry; hash?: Hash } & DisjointGuard<
    Url,
    Entry,
    Hash
  >,
): PageState<Url, Entry, Hash>;
export function definePageState(
  key: string,
  config: { url?: StateSchema; entry?: StateSchema; hash?: $ZodType },
): PageState {
  const url = config.url === undefined ? null : createUrlCodec(config.url);
  const entry =
    config.entry === undefined
      ? null
      : createStoredCodec(config.entry, 'entry');
  const hash = config.hash === undefined ? null : createHashCodec(config.hash);
  if (url === null && entry === null && hash === null) {
    throw new TypeError(`"${key}" declares neither url, entry nor hash`);
  }
  if (
    hash !== null &&
    (url?.keys.includes('hash') === true ||
      entry?.keys.includes('hash') === true)
  ) {
    throw new TypeError(
      `"${key}" declares hash beside a url or entry field named hash — the hash value takes that name in the state`,
    );
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
    hash: config.hash,
    parseUrl: (input) => (url === null ? {} : url.parse(input)),
    search,
    href: <Path extends string>(
      path: RegisteredPath<Path>,
      values?: Readonly<Partial<Record<string, unknown>>>,
    ) => {
      const query = search(values);
      // 型は渡されたパスのまま。URL にだけ Vite の base が付く
      const link = withBase(path) as Path;
      const located = query === '' ? link : (`${link}?${query}` as const);
      const fragment = hash === null ? '' : hash.fragment(values?.hash);
      return fragment === '' ? located : `${located}#${fragment}`;
    },
  };
  // The codecs stay reachable from the definition without being part of its
  // public shape — the definition is the readable API that crosses the RSC
  // boundary, the codecs are package internals.
  const page: PageInternals = {
    url,
    entry,
    hash,
    keys: [
      ...(url?.keys ?? []),
      ...(entry?.keys ?? []),
      ...(hash === null ? [] : ['hash']),
    ],
  };
  setKind(def, {
    store: () => pageStoreOf(def, page),
    initial: ({ initialUrl }) => pageInitialSnapshot(page, initialUrl),
  });
  return def;
}

/**
 * Reads the url slot a schema describes out of a URL's search, the way
 * `parseUrl` reads it for the definition the schema came from — defaults
 * applied, repeated params gathered, a rejected field salvaged to its
 * default. For code handed the schema alone: `@k8ordo/framework` reads the
 * search of a page that exports `search = listState.url` through it. The
 * codec is built once, when this is called.
 */
export const urlReader = <Url extends StateSchema>(
  schema: Url,
): ((input: UrlInput) => output<Url>) => {
  const codec = createUrlCodec(schema);
  return (input) => codec.parse(input) as output<Url>;
};
