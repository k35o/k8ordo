import type { output } from 'zod/v4/core';

import type { RegisteredPath } from './register';
import { createCodec } from './url/codec';
import type { UrlCodec, UrlInput, UrlSchema } from './url/codec';

export type PageStateConfig<Url extends UrlSchema> = {
  /** The shareable face of the page: typed searchParams. */
  url: Url;
};

export type PageState<Url extends UrlSchema = UrlSchema> = {
  kind: 'page';
  /** Identity of this state: store registry slot, entry-state namespace. */
  key: string;
  /** The schema as passed — feed it to `@k8ordo/form` for GET forms. */
  url: Url;
  /** Reads the url slot on the server. Absent params get their defaults. */
  parseUrl: (input: UrlInput) => output<Url>;
  /**
   * Builds a link. Unspecified fields mean their default and defaults are
   * omitted from the query, so canonical URLs stay short. The path literal
   * survives in the type, which is what lets typed-route checks pass.
   */
  href: <Path extends RegisteredPath>(
    base: Path,
    values?: Readonly<Partial<output<Url>>>,
  ) => Path | `${Path}?${string}`;
  /** The query string alone (no `?`), for handrolled URL composition. */
  search: (values?: Readonly<Partial<output<Url>>>) => string;
};

// The codec stays reachable from the definition without being part of its
// public shape — the definition crosses the RSC boundary of readable API,
// the codec is package internals.
const codecs = new WeakMap<PageState, UrlCodec>();

export const codecOf = (def: PageState): UrlCodec => {
  const codec = codecs.get(def);
  if (codec === undefined) {
    throw new TypeError(
      `"${def.key}" was not created by definePageState of this module instance`,
    );
  }
  return codec;
};

export const definePageState = <Url extends UrlSchema>(
  key: string,
  config: PageStateConfig<Url>,
): PageState<Url> => {
  const codec = createCodec(config.url);

  const search = (values?: Readonly<Partial<output<Url>>>): string =>
    codec.search(values ?? {});

  const def: PageState<Url> = {
    kind: 'page',
    key,
    url: config.url,
    parseUrl: (input) => codec.parse(input) as output<Url>,
    search,
    href: <Path extends RegisteredPath>(
      base: Path,
      values?: Readonly<Partial<output<Url>>>,
    ) => {
      const query = search(values);
      return query === '' ? base : `${base}?${query}`;
    },
  };
  codecs.set(def, codec);
  return def;
};
