import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'serverモードだけで使えます。ページでリクエストのヘッダーとCookieを読み、`guard.ts`と`route.ts`、Server ActionでCookieを書けるようになります。',
  en: 'Server mode only. Read the request’s headers and cookies from a page, and write cookies from a `guard.ts`, a `route.ts` or a Server Action.',
});

export const readTitle = message({
  ja: '`request`の読み取り',
  en: 'Reading `request`',
});

export const readCookieCallout = message({
  ja: 'Cookieを名前で読む',
  en: 'Reads a cookie by name',
});

export const readReceives = message({
  ja: 'ページとレイアウト、`not-found.tsx`は、`params`と`pathname`に加えて`request`を受け取ります。',
  en: 'A page, a layout and a `not-found.tsx` receive `request` alongside `params` and `pathname`.',
});

export const readFields = [
  message({
    ja: '`request.headers`：リクエストのヘッダーを持つ`Headers`です。',
    en: '`request.headers`: the request’s headers, as `Headers`.',
  }),
  message({
    ja: '`request.cookies`：`Cookie`ヘッダーをCookieの名前で引ける`ReadonlyMap`です。同じ名前が2つあれば最初の値を使います。値は、囲む引用符を外してパーセントデコードした文字列です。',
    en: '`request.cookies`: the `Cookie` header read by name into a `ReadonlyMap`. The first of a repeated name wins. Surrounding quotes are removed and the value is percent-decoded.',
  }),
] as const;

export const readProp = message({
  ja: '子のServer Componentへ`request`を渡すときは、`@k8ordo/framework/server`の`RouteRequest`を型に使います。`Headers`はClient Componentに渡せないので、Client Componentには要る値だけを取り出して渡します。',
  en: 'To pass `request` to a child Server Component, type the prop with `RouteRequest` from `@k8ordo/framework/server`. `Headers` cannot be passed to a Client Component, so give a Client Component only the values it needs.',
});

export const readSearch = message({
  ja: '`request`にクエリは入りません。ページが読むクエリは`search`のexportで宣言します。宣言の仕方は',
  en: 'The query is not part of `request`. A page declares the query it reads by exporting `search`, as described on ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const cookiesTitle = message({
  ja: '`cookies()`での読み書き',
  en: 'Reading and writing with `cookies()`',
});

export const cookiesSetCallout = message({
  ja: '`Set-Cookie`として応答に付く',
  en: 'Sent as `Set-Cookie` on the response',
});

export const cookiesWhere = message({
  ja: '`guard.ts`と`route.ts`、Server Actionの中では、`@k8ordo/framework/server`の`cookies()`でCookieを読み書きします。上の例は、ログインに成功したらセッションのCookieを書き、`/account`へリダイレクトするServer Actionです。',
  en: 'Inside a `guard.ts`, a `route.ts` or a Server Action, `cookies()` from `@k8ordo/framework/server` reads and writes cookies. The action above writes a session cookie after a successful sign-in, then redirects to `/account`.',
});

export const cookiesRead = message({
  ja: '`get`は、同じリクエストの中で先に`set`や`delete`した結果を反映した値を返します。`guard.ts`が書いた値を、そのあとに動くServer Actionが読めます。`set`した値は、どの応答にも`Set-Cookie`として付きます。アクションのあとに再描画したページと`redirect()`の`303`、クライアントのランタイムが受け取るペイロードです。',
  en: 'A `get` reflects whatever was `set` or deleted earlier in the same request, so a Server Action reads what a `guard.ts` before it wrote. Every `set` goes out as a `Set-Cookie` on whichever response answers: the page re-rendered after an action, the `303` of a `redirect()`, or the payload the client runtime applies.',
});

export const cookiesEncode = message({
  ja: '値は`Set-Cookie`に書くときにパーセントエンコードされ、次のリクエストで読むときにデコードされます。`set`にはエンコードしていない文字列を渡します。エンコード済みの値を渡すと、二重にエンコードされます。',
  en: 'A value is percent-encoded when written to `Set-Cookie` and decoded when the next request brings it back. Pass `set` the raw string. An already encoded value is encoded twice.',
});

export const cookiesAfter = message({
  ja: 'アクションのあとに再描画したページの`request.cookies`には、リクエストのCookieだけが入ります。アクションが書いた値は入りません。',
  en: 'In the page re-rendered after an action, `request.cookies` holds only the request’s cookies. What the action wrote is not in it.',
});

export const optionsTitle = message({
  ja: 'Cookieの属性',
  en: 'Cookie attributes',
});

export const optionsArgument = message({
  ja: '`set`の3つ目の引数でCookieの属性を渡します。省略した属性は、ログインのセッションを保つCookieに合った既定値になります。',
  en: 'Pass the cookie’s attributes as the third argument of `set`. An attribute left out takes a default suited to a sign-in session cookie.',
});

export const optionsList = [
  message({
    ja: '`path`：既定は`/`です。',
    en: '`path`: `/` by default.',
  }),
  message({
    ja: '`domain`：既定では付きません。',
    en: '`domain`: not set by default.',
  }),
  message({
    ja: '`maxAge`：有効期間を秒で渡します。`0`を渡すとすぐに切れます。',
    en: '`maxAge`: the lifetime in seconds. `0` expires the cookie at once.',
  }),
  message({
    ja: '`expires`：期限を`Date`で渡します。',
    en: '`expires`: the expiry, as a `Date`.',
  }),
  message({
    ja: '`httpOnly`：既定は`true`です。ページのスクリプトからは読めません。',
    en: '`httpOnly`: `true` by default, so page scripts cannot read the cookie.',
  }),
  message({
    ja: '`secure`：既定は`true`です。HTTPSでしか送られません。',
    en: '`secure`: `true` by default, so the cookie is sent over HTTPS only.',
  }),
  message({
    ja: "`sameSite`：`'strict'`か`'lax'`、`'none'`のどれかです。既定は`'lax'`です。`'none'`では`localhost`でも`secure`の既定が`true`になり、`secure: false`と組み合わせると`a cookie with sameSite \"none\" has to be secure`のエラーになります。",
    en: "`sameSite`: `'strict'`, `'lax'` or `'none'`, `'lax'` by default. With `'none'`, `secure` defaults to `true` even on `localhost`. Combining it with `secure: false` fails with `a cookie with sameSite \"none\" has to be secure`.",
  }),
] as const;

export const optionsLocal = message({
  ja: '`localhost`と`127.0.0.1`、`[::1]`へのHTTPのリクエストだけは、`secure`の既定が`false`です。ChromiumとFirefoxはそこでも`Secure`のCookieを保存しますが、Safariは保存しないためです。ほかのホストをHTTPで配信するなら、`secure: false`を渡します。',
  en: 'Only for a request over plain HTTP to `localhost`, `127.0.0.1` or `[::1]` does `secure` default to `false`: Chromium and Firefox keep a `Secure` cookie there, but Safari does not. To serve any other host over plain HTTP, pass `secure: false`.',
});

export const optionsDelete = message({
  ja: '`delete`には、書いたときの`path`と`domain`を渡します。ブラウザはこの2つでCookieを区別します。',
  en: 'Pass `delete` the `path` and `domain` the cookie was written with. A browser tells cookies apart by those two.',
});

export const stateTitle = message({
  ja: 'stateのCookie',
  en: 'Cookie state from `@k8ordo/state`',
});

export const stateReadCallout = message({
  ja: 'スキーマを通した値を1回だけ読む',
  en: 'Reads the values through the schema, once',
});

export const stateRead = message({
  ja: '`@k8ordo/state`のCookieの状態は、定義の`parseCookies`に`request.cookies`を渡して読みます。`useAppState`に`initialCookie`として渡すと、サーバーでの描画からその値を使います。',
  en: 'Cookie state from `@k8ordo/state` is read by passing `request.cookies` to the definition’s `parseCookies`. Pass the result to `useAppState` as `initialCookie`, and the server render already uses them.',
});

export const stateOnce = message({
  ja: '`initialCookie`が効くのは、渡した`useAppState`だけです。レイアウトで1回読み、Client Componentへpropsで渡します。定義の仕方は',
  en: '`initialCookie` seeds only the `useAppState` call it is passed to. Read the cookie once in a layout, and pass the result down to the Client Component as a prop. Defining the state is described on ',
});

export const stateWriteCallout = message({
  ja: 'ブラウザが書くときと同じ属性',
  en: 'The attributes the browser writes',
});

export const stateWrite = message({
  ja: '同じCookieを`cookies()`で書くときは、名前に`cookieName`を、値に`cookieValue()`の返り値を渡します。`cookieValue()`は値をスキーマに通し、渡さなかったフィールドを既定値で埋めます。`maxAge`は、ブラウザが書くときと同じ400日（`34_560_000`秒）にします。',
  en: 'To write the same cookie with `cookies()`, pass `cookieName` as the name and the return value of `cookieValue()` as the value. `cookieValue()` runs the values through the schema and fills the fields you left out with their defaults. Set `maxAge` to 400 days (`34_560_000` seconds), the same the browser writes.',
});

export const stateHttpOnly = message({
  ja: '`httpOnly: false`は外さないでください。`HttpOnly`のCookieはスクリプトから読めないので、ブラウザの`useAppState`がその値を読めなくなります。',
  en: 'Keep `httpOnly: false`. A script cannot read an `HttpOnly` cookie, so `useAppState` in the browser would no longer see the value.',
});

export const headersTitle = message({
  ja: '`requestHeaders()`',
  en: '`requestHeaders()`',
});

export const headersCallout = message({
  ja: 'リクエストのヘッダーを読む',
  en: 'Reads the request’s headers',
});

export const headersArguments = message({
  ja: 'Server Actionが受け取るのは引数だけで、リクエストは受け取りません。ヘッダーは`requestHeaders()`で読みます。',
  en: 'A Server Action receives only its arguments, not the request. Read the headers with `requestHeaders()`.',
});

export const headersWhere = message({
  ja: '`requestHeaders()`も`cookies()`と同じく、`guard.ts`と`route.ts`、Server Actionの中でだけ使えます。`guard.ts`と`route.ts`は引数でリクエストの`Request`を受け取るので、ヘッダーはふつう`request.headers`で読みます。',
  en: 'Like `cookies()`, `requestHeaders()` works only inside a `guard.ts`, a `route.ts` or a Server Action. A `guard.ts` and a `route.ts` receive the `Request` itself, so they usually read `request.headers` instead.',
});

export const pageTitle = message({
  ja: '応答への書き込み',
  en: 'Writing to the response',
});

export const pageInstead = message({
  ja: 'ページには、ステータスや`Set-Cookie`を書く手段がありません。書けるのは`guard.ts`と、`POST`で呼ばれたServer Actionです。どちらもページの描画より前に動きます。ページの描画中に`cookies()`や`responseHeaders()`を呼ぶと、`belongs to what answers the request`を含むエラーになります。',
  en: 'A page has no way to write a status or a `Set-Cookie`. Only a `guard.ts`, or the Server Action a `POST` called, can write them, and both run before the page renders. Calling `cookies()` or `responseHeaders()` while a page renders fails with an error containing `belongs to what answers the request`.',
});

export const pageStatic = message({
  ja: '生成される`register.gen.ts`は、serverモードのときだけ`PageProps`と`LayoutProps`に`request`を足します。staticモードで`request`を読むページは、型エラーになります。',
  en: 'The generated `register.gen.ts` adds `request` to `PageProps` and `LayoutProps` under server mode only. Under static mode, a page that reads `request` is a type error.',
});

// 2つの文を1つの段落に並べるときの区切り。英語だけ空白が要る。
export const sentenceGap = message({
  ja: '',
  en: ' ',
});
