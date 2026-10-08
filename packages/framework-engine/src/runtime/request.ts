/**
 * What a page may read of the request under mode: 'server': the headers
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

const unreadable = (name: keyof RouteRequest) => ({
  get: (): never => {
    throw new Error(
      `a page read request.${name}, and under mode: 'static' a page is a file written once for every visitor, with no request to read\nthis application wants mode: 'server'`,
    );
  },
});

/**
 * The `request` a page is handed under mode: 'static', whose generated types
 * have none. An object rather than `undefined`, so that reading it names the
 * mode instead of failing on `undefined` a line later, or rendering the
 * fallback of a `request?.` the build then writes for everyone. Its getters
 * are not enumerable: React, handing the props on, sees an empty object.
 */
export const fileRequest: RouteRequest = Object.defineProperties(
  {},
  { headers: unreadable('headers'), cookies: unreadable('cookies') },
) as RouteRequest;
