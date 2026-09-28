import { normalizePathname } from './paths';

/**
 * Where Vite serves the application — its `base`, as `import.meta.env.BASE_URL`
 * spells it (`/`, `/docs/`). Read when a caller does not pass a base: code
 * Node loads without Vite (the static build, `serve`) has no `import.meta.env`
 * and passes the configured base instead.
 */
const viteBase = (): string => import.meta.env.BASE_URL;

/**
 * The base as a prefix of the URL's pathname: `''` at the root, `/docs` under
 * `/docs/`. Only a path names one — Vite's relative `./` does not say where
 * the pages are, so it adds nothing.
 */
const prefixOf = (base: string): string => {
  if (!base.startsWith('/')) return '';
  const prefix = normalizePathname(base);
  return prefix === '/' ? '' : prefix;
};

/**
 * A pathname in the table's terms, as the URL spells it: the base in front.
 * Under `base: '/docs/'`, `/products` → `/docs/products` and `/` → `/docs/`.
 * `href` and `navigateTo` build every link through it, so a table written
 * from the root works wherever the application is served.
 */
export const withBase = (
  pathname: string,
  base: string = viteBase(),
): string => {
  const prefix = prefixOf(base);
  if (prefix === '') return pathname;
  return pathname === '/' ? `${prefix}/` : `${prefix}${pathname}`;
};

/**
 * The inverse: a URL's pathname in the table's terms, or `null` when it is
 * not under the base — a URL the application does not serve. Under
 * `base: '/docs/'`, `/docs/products` → `/products`, and `/docs` and `/docs/`
 * → `/`.
 */
export const withoutBase = (
  pathname: string,
  base: string = viteBase(),
): string | null => {
  const prefix = prefixOf(base);
  if (prefix === '') return pathname;
  if (pathname === prefix) return '/';
  if (!pathname.startsWith(`${prefix}/`)) return null;
  return pathname.slice(prefix.length);
};
