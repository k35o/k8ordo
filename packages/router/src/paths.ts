/**
 * The type half of the route table: everything here is derived from the
 * pattern strings by inference alone — no code generation. A pattern like
 * `'/:locale/products/:id'` yields its params (`{ locale, id }`), its
 * concrete-path type (`` `/${string}/products/${string}` ``), and its place
 * in the app-wide route union.
 */

type SegParam<Segment extends string> = Segment extends `:${infer Name}`
  ? Record<Name, string>
  : Record<never, never>;

type SegListParams<Rest extends string> =
  Rest extends `${infer Segment}/${infer Tail}`
    ? SegParam<Segment> & SegListParams<Tail>
    : SegParam<Rest>;

/** `'/:locale/products/:id'` → `{ locale: string; id: string }` */
export type ParamsOf<Pattern extends string> = Pattern extends `/${infer Rest}`
  ? SegListParams<Rest>
  : Record<never, never>;

type SegPath<Segment extends string> = Segment extends `:${string}`
  ? string
  : Segment;

type SegListPath<Rest extends string> =
  Rest extends `${infer Segment}/${infer Tail}`
    ? `${SegPath<Segment>}/${SegListPath<Tail>}`
    : SegPath<Rest>;

/** `'/:locale/products/:id'` → `` `/${string}/products/${string}` `` */
export type PathFor<Pattern extends string> = Pattern extends `/${infer Rest}`
  ? `/${SegListPath<Rest>}`
  : never;

/**
 * Composes a parent prefix with a child key. A child of `'/'` is the parent
 * itself, which is what lets a branch declare its own index page.
 */
export type Join<Prefix extends string, Key extends string> = Key extends '/'
  ? Prefix extends ''
    ? '/'
    : Prefix
  : `${Prefix}${Key}`;

export const joinPattern = (prefix: string, key: string): string =>
  key === '/' ? (prefix === '' ? '/' : prefix) : `${prefix}${key}`;

/**
 * URLPattern treats `/products` and `/products/` as different pathnames; the
 * router does not. Everything is matched against the slashless canonical
 * form, root excepted.
 */
export const normalizePathname = (pathname: string): string => {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const stripped = pathname.replace(/\/+$/u, '');
    return stripped === '' ? '/' : stripped;
  }
  return pathname;
};

export const buildHref = (
  pattern: string,
  params: Readonly<Record<string, string>> | undefined,
): string => {
  if (pattern.includes('*')) {
    throw new TypeError(`"${pattern}" is a wildcard — it has no href`);
  }
  return pattern
    .split('/')
    .map((segment) => {
      if (!segment.startsWith(':')) return segment;
      const name = segment.slice(1);
      const value = params?.[name];
      if (value === undefined) {
        throw new TypeError(`"${pattern}" needs a value for ":${name}"`);
      }
      return encodeURIComponent(value);
    })
    .join('/');
};
