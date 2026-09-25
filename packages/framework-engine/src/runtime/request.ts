/**
 * What a page may read of the request under `@k8ordo/server`: the headers
 * and the cookies, read-only. Nothing that would let a page write to the
 * response — status, `Set-Cookie` — because a page is a render, and a render
 * that answered the request would be the second handler.
 */
export type RouteRequest = {
  readonly headers: Headers;
  readonly cookies: ReadonlyMap<string, string>;
};

export const parseCookies = (
  header: string | null,
): ReadonlyMap<string, string> => {
  const cookies = new Map<string, string>();
  if (header === null) return cookies;
  for (const part of header.split(';')) {
    const at = part.indexOf('=');
    if (at === -1) continue;
    const name = part.slice(0, at).trim();
    if (name === '' || cookies.has(name)) continue;
    let value = part.slice(at + 1).trim();
    if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
      value = value.slice(1, -1);
    }
    try {
      value = decodeURIComponent(value);
    } catch {
      // 復号できない値は書かれたまま渡す
    }
    cookies.set(name, value);
  }
  return cookies;
};

export const routeRequestOf = (request: Request): RouteRequest => ({
  headers: request.headers,
  cookies: parseCookies(request.headers.get('cookie')),
});
