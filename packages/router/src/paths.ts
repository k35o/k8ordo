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
