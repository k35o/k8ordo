/**
 * Where a page's RSC payload lives. It has to be a plain path, not a header
 * or a query, because static hosting varies on neither — the same convention
 * then works for a directory of files and for a running server.
 *
 * `/` → `/index.rsc`, `/products/42` → `/products/42/index.rsc`.
 */
const SUFFIX = '/index.rsc';

export const payloadPathFor = (pathname: string): string => {
  const trimmed = pathname.replace(/\/+$/u, '');
  return `${trimmed}${SUFFIX}`;
};

export const isPayloadPath = (pathname: string): boolean =>
  pathname.endsWith(SUFFIX);

export const pagePathFor = (payloadPath: string): string => {
  const page = payloadPath.slice(0, -SUFFIX.length);
  return page === '' ? '/' : page;
};
