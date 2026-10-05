import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'このモードでは、ページがリクエストのヘッダーとCookieを読めます。一方でCookieを書くのはページではなく、リクエストに答える側の`guard.ts`や`route.ts`、Server Actionです。このページでは、読む方法と書く方法を順に説明します。',
  en: 'In this mode a page can read the request’s headers and cookies. Writing a cookie is not the page’s job, though: it belongs to what answers the request, a `guard.ts`, a `route.ts` or a Server Action. This page covers reading first, then writing.',
});

export const readTitle = message({
  ja: 'ページからリクエストを読む',
  en: 'Read the request from a page',
});

export const readDescription = message({
  ja: 'ページとレイアウト、`not-found.tsx`は、`params`と`pathname`の横に`request`を受け取ります。中身はリクエストのヘッダーと、名前ごとに読み取ったCookieです。',
  en: 'A page, a layout and a `not-found.tsx` receive `request` beside `params` and `pathname`: the request’s headers, and its cookies read by name.',
});

export const readFields = [
  message({
    ja: '`request.headers`：リクエストのヘッダーです。型は`Headers`です。',
    en: '`request.headers`: the request’s headers, as `Headers`.',
  }),
  message({
    ja: '`request.cookies`：`Cookie`ヘッダーを名前ごとに読み取った`ReadonlyMap`です。同じ名前が2回あれば最初のものを使い、値を囲む引用符を外してURLデコードします。',
    en: '`request.cookies`: the `Cookie` header read by name into a `ReadonlyMap`. The first of a repeated name wins, and surrounding quotes are removed before the value is URL-decoded.',
  }),
] as const;

export const readType = message({
  ja: '`PageProps`と`LayoutProps`が`request`を持つのは、生成された`register.gen.ts`に、このモードにはリクエストがあると書かれているからです。下のコンポーネントにpropとして渡すときは、`@k8ordo/server/runtime`の`RouteRequest`を型に使います。',
  en: '`PageProps` and `LayoutProps` carry `request` because the generated `register.gen.ts` says this mode has one. To hand it to a component further down as a prop, type it with `RouteRequest` from `@k8ordo/server/runtime`.',
});

export const readClient = message({
  ja: 'クライアントコンポーネントには`request`を丸ごと渡さず、要る値だけを取り出して渡します。`Headers`は、境界を越えられないからです。',
  en: 'Do not hand `request` whole to a client component; take out the values it needs. `Headers` cannot cross the boundary.',
});

export const readSearch = message({
  ja: '`request`にsearchは入りません。`?`から後ろは`@k8ordo/state`のもので、ブラウザで読みます。',
  en: 'The search is not in `request`. Everything after the `?` belongs to `@k8ordo/state`, and is read in the browser.',
});

export const cookiesTitle = message({
  ja: '`cookies()`でCookieを読み書きする',
  en: 'Read and write cookies with `cookies()`',
});

export const cookiesDescription = message({
  ja: '`guard.ts`や`route.ts`、Server Actionの中では、`@k8ordo/server/runtime`の`cookies()`でCookieを読み書きできます。次の例は、ログインに成功したらセッションのCookieを書いて、アカウントのページへ送るアクションです。',
  en: 'Inside a `guard.ts`, a `route.ts` or a Server Action, `cookies()` from `@k8ordo/server/runtime` reads and writes cookies. Below, an action that writes a session cookie on a successful sign-in, then sends the visitor to their account.',
});

export const cookiesRead = message({
  ja: '読むと、リクエストが運んできたCookieに、同じリクエストの中で先に書いたものが重なって見えます。guardが書いた値は、その後に走るServer Actionが読めます。',
  en: 'A read sees the cookies the request carried, with what was written earlier in the same request on top, so a Server Action reads what a guard before it wrote.',
});

export const cookiesWrite = message({
  ja: '書いたものは、答えが何であっても、その答えの`Set-Cookie`としてブラウザに届きます。アクションが描き直したページでも、`redirect()`の`303`でも同じです。',
  en: 'Every write reaches the browser as a `Set-Cookie` on the answer, whatever the answer is: the page an action re-rendered, or the `303` of a `redirect()`.',
});

export const cookiesEncode = message({
  ja: '値は`Set-Cookie`に載せるときにパーセントエンコードされ、リクエストで戻ってくるときにデコードされます。そのため`set`にはどんな文字列もそのまま渡せます。エンコード済みの値を渡すと、二重にエンコードされます。',
  en: 'A value is percent-encoded on its way into `Set-Cookie` and decoded when a request brings it back, so `set` takes any string as it is. An already encoded value would be encoded twice.',
});

export const cookiesAfter = message({
  ja: 'アクションの後に描き直すページが`request.cookies`で見るのは、リクエストが運んできたCookieです。アクションが書いた値ではありません。',
  en: 'The page re-rendered after an action sees, in `request.cookies`, the cookies the request carried — not what the action wrote.',
});

export const optionsTitle = message({
  ja: 'Cookieの属性を決める',
  en: 'Choose the cookie’s attributes',
});

export const optionsDescription = message({
  ja: '`set`の3つ目の引数で、Cookieの属性を渡します。何も渡さなければ、セッションに合った値になります。',
  en: 'Pass the cookie’s attributes as the third argument of `set`. Left out, they are what a session wants.',
});

export const optionsList = [
  message({
    ja: '`path`：既定は`/`です。',
    en: '`path`: `/` by default.',
  }),
  message({
    ja: '`domain`：既定では付けません。',
    en: '`domain`: not set by default.',
  }),
  message({
    ja: '`maxAge`：有効期間を秒で渡します。`0`を渡すと、すぐに切れます。',
    en: '`maxAge`: how long it lasts, in seconds. `0` expires it at once.',
  }),
  message({
    ja: '`expires`：期限を`Date`で渡します。',
    en: '`expires`: when it expires, as a `Date`.',
  }),
  message({
    ja: '`httpOnly`：既定は`true`で、ページのスクリプトからは読めません。',
    en: '`httpOnly`: `true` by default, so a page’s script cannot read it.',
  }),
  message({
    ja: '`secure`：既定は`true`で、HTTPSでしか送られません。',
    en: '`secure`: `true` by default, so it is sent over HTTPS only.',
  }),
  message({
    ja: "`sameSite`：`'strict'`か`'lax'`、`'none'`のどれかで、既定は`'lax'`です。`'none'`は`secure`のときだけ使えます。",
    en: "`sameSite`: `'strict'`, `'lax'` or `'none'`, `'lax'` by default. `'none'` only goes with `secure`.",
  }),
] as const;

export const optionsLocal = message({
  ja: 'ただし、`localhost`と`127.0.0.1`、`[::1]`に素のHTTPで届いたリクエストだけは、`secure`の既定が`false`になります。ChromiumとFirefoxはそこでも`Secure`のCookieを残しますが、Safariは捨ててしまうからです。',
  en: 'Over plain HTTP to this machine (`localhost`, `127.0.0.1`, `[::1]`), though, `secure` defaults to `false`: Chromium and Firefox keep a `Secure` cookie there, but Safari drops it.',
});

export const optionsPlain = message({
  ja: 'それ以外の場所を素のHTTPで配信するなら、`secure: false`を渡します。',
  en: 'Anywhere else served over plain HTTP, pass `secure: false`.',
});

export const optionsDelete = message({
  ja: '`delete`には、書いたときの`path`と`domain`を渡します。ブラウザはCookieを、この2つで見分けるからです。',
  en: 'Pass `delete` the `path` and `domain` the cookie was written with, since a browser tells cookies apart by those.',
});

export const headersTitle = message({
  ja: 'Server Actionでリクエストのヘッダーを読む',
  en: 'Read the request’s headers in a Server Action',
});

export const headersDescription = message({
  ja: 'Server Actionが受け取るのは引数で、リクエストではありません。アクションの中でヘッダーを読むときは、`requestHeaders()`を使います。',
  en: 'A Server Action receives its arguments, not the request. Inside one, read the headers with `requestHeaders()`.',
});

export const headersWhere = message({
  ja: '`requestHeaders()`も`cookies()`と同じく、`guard.ts`や`route.ts`、Server Actionの中でだけ使えます。`guard.ts`と`route.ts`は`request`を受け取るので、ふつうはそちらを読みます。',
  en: 'Like `cookies()`, `requestHeaders()` works only inside a `guard.ts`, a `route.ts` or a Server Action. A guard and a `route.ts` receive `request`, so they usually read that instead.',
});

export const pageTitle = message({
  ja: 'ページが応答を書かない理由',
  en: 'Why a page does not write the response',
});

export const pageDescription = message({
  ja: 'ページには、ステータスや`Set-Cookie`を書く手段がありません。ページは描画であり、応答を書く描画は2つ目のハンドラになってしまうからです。',
  en: 'A page has no way to write a status or a `Set-Cookie`. A page is a render, and a render that wrote the response would be a second handler.',
});

export const pageInstead = message({
  ja: '応答にページ以外の何を付けるかは、ページより前に`guard.ts`が決めるか、`POST`が運んできたServer Actionが決めます。ページの中で`cookies()`や`responseHeaders()`を呼ぶと、例外を投げます。',
  en: 'What the answer carries beyond the page is decided before it, by a `guard.ts`, or by the Server Action a `POST` carries. Calling `cookies()` or `responseHeaders()` while a page renders throws.',
});

export const pageStatic = message({
  ja: '`request`はこのモードにしかありません。`@k8ordo/static`では生成される型に`request`が無いので、それを読むページは型の検査で落ちます。',
  en: '`request` exists only in this mode. Under `@k8ordo/static` the generated types do not carry it, so a page that reads it fails to type-check.',
});
