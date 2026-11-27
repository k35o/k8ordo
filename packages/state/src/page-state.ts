import type { $ZodType, output } from 'zod/v4/core';

import { createStoredCodec } from './entry/codec';
import type { StoredCodec } from './entry/codec';
import { createHashCodec } from './hash/codec';
import type { HashCodec } from './hash/codec';
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
   * Puts this state on a URL: the destination as the router built it —
   * `@k8ordo/router`'s `href()`, a Next.js `Route` — or `''` for the page
   * itself. Only this definition's url params are rewritten, in their
   * canonical form: unspecified fields mean their default, and defaults are
   * omitted. The URL's other params stay. With a hash slot the fragment is
   * the value's (none at the default); without one the URL's own fragment
   * stays. Nothing is added to the path — a `base` is the router's, and its
   * `href()` has put it there — and the URL literal survives in the type,
   * which is what typed-route checks read. When the URL handed in already
   * carries this definition's params or a fragment, the type is an
   * approximation: those params are rewritten, and the query goes in before
   * the fragment.
   */
  href: <U extends string>(
    url: U,
    values?: Readonly<Partial<OutputOf<Url> & HashOf<Hash>>>,
  ) =>
    | U
    | `${U}?${string}`
    | (Hash extends $ZodType ? `${U}#${string}` : never);
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

const keyOf = (pair: string): string =>
  new URLSearchParams(pair).keys().next().value ?? '';

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

  const ownKeys = new Set(url?.keys);

  const def: PageState = {
    kind: 'page',
    key,
    url: config.url,
    entry: config.entry,
    hash: config.hash,
    parseUrl: (input) => (url === null ? {} : url.parse(input)),
    href: <U extends string>(
      destination: U,
      values: Readonly<Partial<Record<string, unknown>>> = {},
    ) => {
      const hashAt = destination.indexOf('#');
      const beforeHash =
        hashAt === -1 ? destination : destination.slice(0, hashAt);
      const queryAt = beforeHash.indexOf('?');
      const path = queryAt === -1 ? beforeHash : beforeHash.slice(0, queryAt);
      const kept = (queryAt === -1 ? '' : beforeHash.slice(queryAt + 1))
        .split('&')
        .filter((pair) => pair !== '' && !ownKeys.has(keyOf(pair)));
      const own = url === null ? '' : url.search(values);
      const query = [...kept, ...(own === '' ? [] : [own])].join('&');
      // 型付きルートの検査が読む U のリテラルを残すための近似。U が自分の
      // パラメーターやフラグメントを持てば、値はそこが書き換わる
      const located = (query === '' ? path : `${path}?${query}`) as U;
      if (hash === null) {
        return hashAt === -1
          ? located
          : (`${located}${destination.slice(hashAt)}` as U);
      }
      const fragment = hash.fragment(values.hash);
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
