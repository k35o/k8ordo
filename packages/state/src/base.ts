/**
 * A path as the URL spells it: Vite's `base` in front, so `/products` is
 * `/docs/products` under `base: '/docs/'` and `/` is `/docs/`. The same rule
 * as `@k8ordo/router`'s `withBase` — not borrowed, because the router is an
 * optional peer this package only reads types from.
 */
export const withBase = (path: string): string => {
  // Vite の外（Next.js など）では import.meta.env が、型（Vite のもの）に反して
  // undefined になる。base は無いものとして読み、basePath はそのフレームワークの
  // <Link> に任せる
  // oxlint-disable-next-line typescript/no-unnecessary-condition -- 上のとおり型に反して undefined になりうる
  const base = import.meta.env === undefined ? '/' : import.meta.env.BASE_URL;
  if (!base.startsWith('/') || base === '/') return path;
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
  return path === '/' ? `${prefix}/` : `${prefix}${path}`;
};
