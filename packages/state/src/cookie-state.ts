import type { output } from 'zod/v4/core';

import { createRowCodec } from './row/codec';
import type { RowRead, Versioning } from './row/codec';
import type { StateSchema } from './schema/object';
import {
  COOKIE_ATTRIBUTES,
  cookieInitialSnapshot,
  cookieStoreOf,
  parseCookieText,
} from './store/cookie-store';
import { resolvePatch } from './store/core';
import { setKind } from './store/kind';

type CookieReader = {
  readonly get: (name: string) => string | undefined;
};

/**
 * App-scope state that lives in a cookie: device-persistent and shared across
 * tabs like local state, and — unlike it — sent with every request, so a
 * server that reads the request's cookies renders the real values instead of
 * the defaults. The browser writes it, so it can never be `HttpOnly`: a
 * preference, never a secret.
 */
export type CookieState<Schema extends StateSchema = StateSchema> = {
  kind: 'cookie';
  /** Identity of this state: the cookie name and the store registry slot. */
  key: string;
  /** The schema as passed. */
  schema: Schema;
  /** The cookie the values are written under: `k8ordo-state.<key>`. */
  cookieName: string;
  /**
   * Reads the values out of a request's cookies on the server — anything
   * whose `get(name)` gives a cookie's percent-decoded value:
   * `request.cookies` in a page and `cookies()` in a guard, a route.ts or a
   * Server Action under `@k8ordo/framework`'s server mode,
   * `{ get: (name) => store.get(name)?.value }` over Next.js's
   * `cookies()`. Absent, corrupt, or rejected fields get their defaults.
   */
  parseCookies: (cookies: CookieReader) => output<Schema>;
  /**
   * The same cookie written from a server, as the arguments of its cookie
   * API: `cookies().set(...density.cookie({ density: 'compact' }, cookies()))`
   * under `@k8ordo/framework`'s server mode. `patch` goes over the values
   * `current` holds — read as `parseCookies` reads them — as `update()` lays
   * it over the cookie in the browser, so the fields it leaves out keep what
   * the visitor saved; the result passes the schema. The value is the JSON
   * left for that API to percent-encode, and the options are the browser
   * store's own attributes with `httpOnly: false`, which keeps the cookie
   * readable to the browser store. A cookie whose `migrate` throws is never
   * written over: this throws instead, the error as its `cause`.
   */
  cookie: (
    patch: Readonly<Partial<output<Schema>>>,
    current: CookieReader,
  ) => readonly [name: string, value: string, options: CookieAttributes];
};

type CookieAttributes = {
  readonly path: '/';
  readonly sameSite: 'lax';
  readonly maxAge: number;
  readonly httpOnly: false;
};

// localStorage の行と同じ名前空間だが、区切りは `.`。Cookie の名前は HTTP の
// token で、`:` は token に入らない
const COOKIE_NAME_PREFIX = 'k8ordo-state.';

const TOKEN = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/u;

export const defineCookieState = <Schema extends StateSchema>(
  key: string,
  schema: Schema,
  versioning?: Versioning<Schema>,
): CookieState<Schema> => {
  const cookieName = `${COOKIE_NAME_PREFIX}${key}`;
  if (!TOKEN.test(cookieName)) {
    throw new TypeError(
      `"${key}" cannot name a cookie — use letters, digits and !#$%&'*+-.^_\`|~`,
    );
  }
  const codec = createRowCodec(schema, 'cookie', key, versioning);
  const readRow = (cookies: CookieReader): RowRead =>
    codec.read(parseCookieText(cookies.get(cookieName)));
  const def: CookieState<Schema> = {
    kind: 'cookie',
    key,
    schema,
    cookieName,
    // サーバーは応答に Cookie を書けないので、古い版の Cookie は移行して読む
    // だけにする。書き戻すのは hydration の後のブラウザのストア
    parseCookies: (cookies) => {
      const row = readRow(cookies);
      if (row.failed) {
        console.error(
          `parseCookies: the migrate of "${key}" threw on the cookie ${cookieName}, which reads as nothing stored and is left as it is`,
          row.error,
        );
      }
      return row.values as output<Schema>;
    },
    cookie: (patch, current) => {
      const row = readRow(current);
      if (row.failed) {
        throw new Error(
          `cookie: the migrate of "${key}" threw on the cookie ${cookieName}, which is left as it is rather than written over`,
          { cause: row.error },
        );
      }
      const resolved = resolvePatch(patch, row.values, codec.keys, key);
      const values = codec.salvage({ ...row.values, ...resolved });
      return [
        cookieName,
        JSON.stringify(codec.row(values)),
        { ...COOKIE_ATTRIBUTES, httpOnly: false },
      ];
    },
  };
  setKind(def, {
    store: () => cookieStoreOf(def, codec),
    initial: ({ initialCookie }) => cookieInitialSnapshot(codec, initialCookie),
  });
  return def;
};
