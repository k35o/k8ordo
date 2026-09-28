/**
 * How a cookie is kept. The defaults are the ones a session wants: sent on
 * every path, never readable from a page's script, only over HTTPS, and not
 * on another site's POST.
 */
export type CookieOptions = {
  /** Default `/`. */
  readonly path?: string;
  readonly domain?: string;
  /** Seconds until it expires; `0` expires it now. */
  readonly maxAge?: number;
  readonly expires?: Date;
  /** Default `true`: a page's script cannot read it. */
  readonly httpOnly?: boolean;
  /**
   * Default `true`: sent only over HTTPS. On plain HTTP to this machine —
   * `localhost`, `127.0.0.1` or `[::1]` — the default is `false`, because
   * Safari drops a `Secure` cookie there. Say `false` for plain HTTP
   * anywhere else.
   */
  readonly secure?: boolean;
  /** Default `'lax'`. `'none'` needs `secure`, and defaults to it. */
  readonly sameSite?: 'strict' | 'lax' | 'none';
};

/** Where a cookie lives, which is what deleting one has to name again. */
export type CookieScope = Pick<CookieOptions, 'path' | 'domain'>;

/**
 * The request's cookies, and what this answer does to them. A read sees the
 * writes made earlier in the same request; the browser sees them as
 * `Set-Cookie` on the answer.
 */
export type Cookies = {
  readonly get: (name: string) => string | undefined;
  readonly has: (name: string) => boolean;
  readonly set: (name: string, value: string, options?: CookieOptions) => void;
  readonly delete: (name: string, scope?: CookieScope) => void;
};

/** RFC 6265's token: what a cookie name may be spelled with. */
const TOKEN = /^[!#$%&'*+\-.^`|~\w]+$/u;

/**
 * What an attribute's value may not hold: a `;` ends the attribute and a
 * control character (a line break above all) ends the header, so either
 * would let the value write attributes — or headers — of its own.
 */
// oxlint-disable-next-line no-control-regex -- 制御文字こそが探しているもの
const BREAKS_OUT = /[;\u0000-\u001F\u007F]/u;

const checkAttribute = (name: string, value: string): void => {
  if (BREAKS_OUT.test(value)) {
    throw new TypeError(
      `${JSON.stringify(value)} cannot be a cookie's ${name} — it holds a ";" or a control character`,
    );
  }
};

const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * Whether a cookie the request's answer writes is `Secure` unless it says
 * otherwise. Chromium and Firefox keep a `Secure` cookie from plain HTTP to
 * this machine and Safari does not, so a default that held there would lose
 * every cookie written while developing in Safari.
 */
const securesByDefault = (url: URL): boolean =>
  !(url.protocol === 'http:' && LOOPBACK.has(url.hostname));

const attributes = (
  options: CookieOptions,
  secureByDefault: boolean,
): string[] => {
  const path = options.path ?? '/';
  checkAttribute('path', path);
  if (options.domain !== undefined) checkAttribute('domain', options.domain);
  const sameSite = options.sameSite ?? 'lax';
  const secure = options.secure ?? (sameSite === 'none' || secureByDefault);
  if (sameSite === 'none' && !secure) {
    // ブラウザは Secure の無い SameSite=None を捨てる。黙って消えるより、
    // 書いたところで知らせる
    throw new TypeError('a cookie with sameSite "none" has to be secure');
  }
  return [
    `Path=${path}`,
    ...(options.domain === undefined ? [] : [`Domain=${options.domain}`]),
    ...(options.maxAge === undefined
      ? []
      : [`Max-Age=${String(Math.trunc(options.maxAge))}`]),
    ...(options.expires === undefined
      ? []
      : [`Expires=${options.expires.toUTCString()}`]),
    ...((options.httpOnly ?? true) ? ['HttpOnly'] : []),
    ...(secure ? ['Secure'] : []),
    `SameSite=${sameSite.charAt(0).toUpperCase()}${sameSite.slice(1)}`,
  ];
};

const checkName = (name: string): void => {
  if (!TOKEN.test(name)) {
    throw new TypeError(
      `"${name}" cannot be a cookie name — use letters, digits and !#$%&'*+-.^_\`|~`,
    );
  }
};

/**
 * The jar a request's answer writes through: the cookies the request
 * carried, overlaid with what was set or deleted since, and the
 * `Set-Cookie` lines that say so. A cookie set twice at the same path and
 * domain is said once, the last way. `url` is the request's, which decides
 * whether a cookie is `Secure` by default.
 */
export const createCookies = (
  incoming: ReadonlyMap<string, string>,
  url: URL,
): { readonly cookies: Cookies; readonly lines: () => string[] } => {
  const secureByDefault = securesByDefault(url);
  const values = new Map(incoming);
  const lines = new Map<string, string>();
  const say = (name: string, scope: CookieScope, line: string): void => {
    const key = `${name};${scope.path ?? '/'};${scope.domain ?? ''}`;
    lines.delete(key);
    lines.set(key, line);
  };
  const cookies: Cookies = {
    get: (name) => values.get(name),
    has: (name) => values.has(name),
    set: (name, value, options = {}) => {
      checkName(name);
      const line = [
        `${name}=${encodeURIComponent(value)}`,
        ...attributes(options, secureByDefault),
      ].join('; ');
      values.set(name, value);
      say(name, options, line);
    },
    delete: (name, scope = {}) => {
      checkName(name);
      values.delete(name);
      const expired = { ...scope, maxAge: 0, expires: new Date(0) };
      say(
        name,
        scope,
        [`${name}=`, ...attributes(expired, secureByDefault)].join('; '),
      );
    },
  };
  return { cookies, lines: () => [...lines.values()] };
};
