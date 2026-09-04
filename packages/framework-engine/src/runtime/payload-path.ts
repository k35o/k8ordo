/**
 * Where a page's RSC payload lives. It has to be a plain path, not a header
 * or a query, because static hosting varies on neither — the same convention
 * then works for a directory of files and for a running server.
 *
 * `/` → `/index.rsc`, `/products/42` → `/products/42/index.rsc`.
 */
const SUFFIX = '/index.rsc';

export const payloadPathFor = (pathname: string): string => {
  // 末尾を走査で落とす。`/\/+$/` は「/」だけの長い pathname に対して開始位置
  // ごとに末尾まで走るので、リクエストから来る入力には二乗の穴になる。
  let end = pathname.length;
  while (end > 0 && pathname.charAt(end - 1) === '/') {
    end -= 1;
  }
  return `${pathname.slice(0, end)}${SUFFIX}`;
};

export const isPayloadPath = (pathname: string): boolean =>
  pathname.endsWith(SUFFIX);

export const pagePathFor = (payloadPath: string): string => {
  const page = payloadPath.slice(0, -SUFFIX.length);
  return page === '' ? '/' : page;
};
