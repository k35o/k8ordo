/**
 * The type half of the route table: everything here is derived from the
 * pattern strings by inference alone — no code generation. A pattern like
 * `'/:locale/products/:id'` yields its params (`{ locale, id }`), its
 * concrete-path type (`` `/${string}/products/${string}` ``), and whether a
 * path handed in fits it.
 */

type SegParam<Segment extends string> = Segment extends `:${infer Name}+`
  ? Record<Name, readonly string[]>
  : Segment extends `:${infer Name}`
    ? Record<Name, string>
    : object;

type SegListParams<Rest extends string> =
  Rest extends `${infer Segment}/${infer Tail}`
    ? SegParam<Segment> & SegListParams<Tail>
    : SegParam<Rest>;

/**
 * `'/:locale/products/:id'` → `{ locale: string; id: string }`, and a rest
 * param — `'/files/:path+'` — is every segment it took:
 * `{ path: readonly string[] }`.
 */
export type ParamsOf<Pattern extends string> = Pattern extends `/${infer Rest}`
  ? SegListParams<Rest>
  : object;

/**
 * The shape every validation library agrees on (Standard Schema): a value
 * under `~standard` whose `types` carry the input and output. Only the
 * output is read here — the router itself never runs a schema; the framework
 * does, and this package only has to type what comes out.
 */
export type StandardSchemaLike<Output = unknown> = {
  readonly '~standard': {
    readonly types?: { readonly output: Output } | undefined;
  };
};

/** What a schema produces. */
export type SchemaOutput<Schema> =
  Schema extends StandardSchemaLike<infer Output> ? Output : never;

/**
 * A schema a route file may declare for the params its pattern names: its
 * output is an object whose keys are a subset of those params — a key the
 * pattern does not name has nothing to validate.
 */
export type ParamsSchemaFor<Pattern extends string> = StandardSchemaLike<
  Partial<Record<keyof ParamsOf<Pattern> & string, unknown>>
>;

type MergedOutput<Schemas extends readonly unknown[]> =
  Schemas extends readonly [infer Head, ...infer Tail]
    ? Omit<MergedOutput<Tail>, keyof SchemaOutput<Head>> & SchemaOutput<Head>
    : object;

/**
 * A pattern's params after the schemas along its stack have run — outer
 * layouts first, the page last — each replacing the strings it names with
 * what it produced. Params no schema names stay strings. A union of stacks
 * gives the union of what each one produces.
 */
export type ParsedParams<
  Pattern extends string,
  Schemas extends readonly unknown[],
> = Schemas extends unknown
  ? Omit<ParamsOf<Pattern>, keyof MergedOutput<Schemas>> & MergedOutput<Schemas>
  : never;

/** `{ '/products/:id': [schema, …] }` → `{ '/products/:id': { id: number } }` */
export type ParsedParamsMap<
  Schemas extends Record<string, readonly unknown[]>,
> = {
  [Pattern in keyof Schemas & string]: ParsedParams<Pattern, Schemas[Pattern]>;
};

type SegPath<Segment extends string> = Segment extends `:${string}`
  ? string
  : Segment;

type SegListPath<Rest extends string> =
  Rest extends `${infer Segment}/${infer Tail}`
    ? `${SegPath<Segment>}/${SegListPath<Tail>}`
    : SegPath<Rest>;

/**
 * `'/:locale/products/:id'` → `` `/${string}/products/${string}` ``. A rest
 * param is a `${string}` too — `'/files/:path+'` → `` `/files/${string}` `` —
 * since a template's `${string}` spans the slashes between its segments.
 */
export type PathFor<Pattern extends string> = Pattern extends `/${infer Rest}`
  ? `/${SegListPath<Rest>}`
  : never;

/**
 * One segment of a path against one segment of a pattern, the way URLPattern
 * reads a `:param`: any single segment that is not empty. A `${string}` in
 * the path — a param built into a template literal — counts as one segment.
 * A rest param (`:name+`) is `SegmentsFit`'s to read: it takes more than one.
 */
type SegmentFits<
  Segment extends string,
  PatternSegment extends string,
> = PatternSegment extends `:${string}`
  ? Segment extends ''
    ? false
    : true
  : Segment extends PatternSegment
    ? true
    : false;

/** One segment or more, none of them empty: what a rest param takes. */
type EverySegmentFilled<Rest extends string> =
  Rest extends `${infer Segment}/${infer Tail}`
    ? Segment extends ''
      ? false
      : EverySegmentFilled<Tail>
    : Rest extends ''
      ? false
      : true;

// A rest param (`:name+`) is read only where it ends the pattern, which is
// the one place the framework's grammar puts it.
type SegmentsFit<
  Rest extends string,
  PatternRest extends string,
> = PatternRest extends `${infer PatternSegment}/${infer PatternTail}`
  ? Rest extends `${infer Segment}/${infer Tail}`
    ? SegmentFits<Segment, PatternSegment> extends true
      ? SegmentsFit<Tail, PatternTail>
      : false
    : false
  : PatternRest extends `:${string}+`
    ? EverySegmentFilled<Rest>
    : Rest extends `${string}/${string}`
      ? false
      : SegmentFits<Rest, PatternRest>;

// Pattern を裸の型引数のまま条件に置き、パターンの和集合に 1 つずつ分配する
type FitsAny<
  Path extends string,
  Pattern extends string,
> = Pattern extends `/${infer PatternRest}`
  ? Path extends `/${infer Rest}`
    ? SegmentsFit<Rest, PatternRest>
    : false
  : never;

/**
 * `Path` when one of `Patterns` matches it segment by segment, `never` when
 * none does. A union of paths keeps only the members that match.
 *
 * The path is checked against the patterns, never collected into a union of
 * `PathFor` each pattern: `/:locale` would put `/${string}` in that union,
 * and `/${string}` takes every path there is.
 */
export type PathMatching<
  Path extends string,
  Patterns extends string,
> = Path extends string
  ? true extends FitsAny<Path, Patterns>
    ? Path
    : never
  : never;

/**
 * Keys that address the parent's own place instead of a place below it:
 * `'/'` (the branch's index) and `'/(name)'` (a group, which structures the
 * table — its own layout, its own subtree — without touching the URL).
 */
type Transparent<Key extends string> = Key extends '/'
  ? true
  : Key extends `/(${string})`
    ? true
    : false;

/** Composes a parent prefix with a child key. */
export type Join<Prefix extends string, Key extends string> =
  Transparent<Key> extends true
    ? Prefix extends ''
      ? '/'
      : Prefix
    : `${Prefix}${Key}`;

export const isGroupKey = (key: string): boolean => /^\/\([^)]+\)$/u.test(key);

export const joinPattern = (prefix: string, key: string): string =>
  key === '/' || isGroupKey(key)
    ? prefix === ''
      ? '/'
      : prefix
    : `${prefix}${key}`;

/**
 * URLPattern treats `/products` and `/products/` as different pathnames; the
 * router does not. Everything is matched against the slashless canonical
 * form, root excepted.
 */
export const normalizePathname = (pathname: string): string => {
  // 末尾を走査で落とす。`/\/+$/` は「/」だけの長い pathname に対して
  // 開始位置ごとに末尾まで走るので、URL から来る入力には二乗の穴になる。
  let end = pathname.length;
  while (end > 1 && pathname.charAt(end - 1) === '/') {
    end -= 1;
  }
  return pathname.slice(0, end);
};

/** A URL part decoded, or as written when it does not decode. */
export const decodeOrKeep = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

/** What a param value may be on the way into a link: anything with one spelling. */
export type ParamValue = string | number | bigint | boolean;

/** The name a rest segment (`:name+`) gives its param, or `null` for any other segment. */
const restNameOf = (segment: string): string | null =>
  segment.startsWith(':') && segment.endsWith('+')
    ? segment.slice(1, -1)
    : null;

/**
 * A pattern's params out of what URLPattern captured: a `:param` decoded, a
 * rest param (`:name+`) split into the segments it took, each decoded on its
 * own — so an escaped slash stays inside its segment.
 */
export const readParams = (
  pattern: string,
  groups: Readonly<Record<string, string | undefined>>,
): Record<string, string | readonly string[]> => {
  const rest = new Set(pattern.split('/').map(restNameOf));
  const params: Record<string, string | readonly string[]> = {};
  for (const [name, value] of Object.entries(groups)) {
    // Numeric keys are URLPattern's anonymous wildcard captures — the
    // table only names params, so only named ones surface.
    if (/^\d+$/u.test(name) || value === undefined) continue;
    params[name] = rest.has(name)
      ? value.split('/').map(decodeOrKeep)
      : decodeOrKeep(value);
  }
  return params;
};

const isParamValue = (value: unknown): value is ParamValue =>
  typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'bigint' ||
  typeof value === 'boolean';

const restSegments = (
  pattern: string,
  name: string,
  value: unknown,
): string => {
  if (!Array.isArray(value)) {
    throw new TypeError(
      `"${pattern}" takes an array of segments for ":${name}+"`,
    );
  }
  if (value.length === 0) {
    throw new TypeError(
      `"${pattern}" needs at least one segment for ":${name}+"`,
    );
  }
  return value
    .map((segment: unknown) => {
      if (!isParamValue(segment)) {
        throw new TypeError(
          `"${pattern}" got a segment for ":${name}+" that has no URL spelling`,
        );
      }
      // An empty segment would spell `//`, which the pattern does not match.
      if (segment === '') {
        throw new TypeError(
          `"${pattern}" got an empty segment for ":${name}+"`,
        );
      }
      return encodeURIComponent(String(segment));
    })
    .join('/');
};

export const buildHref = (
  pattern: string,
  params: Readonly<Record<string, unknown>> | undefined,
): string => {
  if (pattern.includes('*')) {
    throw new TypeError(`"${pattern}" is a wildcard — it has no href`);
  }
  return pattern
    .split('/')
    .map((segment) => {
      if (!segment.startsWith(':')) return segment;
      const rest = restNameOf(segment);
      const name = rest ?? segment.slice(1);
      const value = params?.[name];
      if (value === undefined) {
        throw new TypeError(`"${pattern}" needs a value for "${segment}"`);
      }
      if (rest !== null) return restSegments(pattern, name, value);
      // A schema-typed param arrives as what the page received — a number,
      // a boolean — and a segment is its one spelling, which is what the
      // schema will read back.
      if (!isParamValue(value)) {
        throw new TypeError(
          `"${pattern}" got a value for ":${name}" that has no URL spelling`,
        );
      }
      return encodeURIComponent(String(value));
    })
    .join('/');
};
