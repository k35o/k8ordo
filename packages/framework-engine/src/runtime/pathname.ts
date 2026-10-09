/**
 * A pathname as the URL carries it, decoded for the filesystem — the one
 * thing the static writer and the server's file lookup both have to do
 * before deciding whether the result may name a file. `null` for an escape
 * that cannot be decoded or a NUL byte, neither of which is a name.
 */
export const decodePathname = (pathname: string): string | null => {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  return decoded.includes('\0') ? null : decoded;
};

/**
 * A segment no route declares: a pathname that only a catch-all answers is
 * built with it — the static build's `404.html`, and the handler's search
 * for the not-found nearest a page that said `notFound()`.
 */
export const NOT_FOUND_SEGMENT = '__k8ordo-not-found__';

/**
 * The segment a shell is written under, in place of each value it leaves to
 * the browser: `/ja/posts/!fallback`. No route directory can be named it (`!`
 * is outside the grammar's literal segments), and neither
 * `encodeURIComponent` nor the URL parser rewrites `!`, so a host that
 * re-encodes a rewrite target finds the directory under the same spelling.
 */
export const FALLBACK_SEGMENT = '!fallback';
