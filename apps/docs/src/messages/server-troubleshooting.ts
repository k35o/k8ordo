import { message } from '@k8ordo/i18n';

export const forbiddenTitle = message({
  ja: 'Server Actionの送信が`403`になる',
  en: 'A Server Action’s submission gets a `403`',
});

export const forbiddenCause = message({
  ja: 'ハンドラは、`Origin`ヘッダーのホストが、答えているURLのホストと一致する`POST`だけを受け付けます。前に置いたプロキシが`Host`を書き換えていると、この2つが一致しなくなります。',
  en: 'The handler accepts a `POST` only when its `Origin` header names the host of the URL it is answering. A proxy in front that rewrites `Host` makes the two disagree.',
});

export const forbiddenFix = message({
  ja: 'プロキシで、元の`Host`をそのまま渡します。ハンドラを自分で呼ぶホストなら、訪問者が求めたURLで`Request`を作ります。',
  en: 'Have the proxy pass the original `Host` on unchanged. A host that calls the handler itself builds the `Request` with the URL the visitor asked for.',
});

export const redirectTitle = message({
  ja: '`redirect()`を呼んでも別のページへ移らない',
  en: '`redirect()` does not take the visitor anywhere',
});

export const redirectCause = message({
  ja: '`redirect()`は例外を投げて終わります。`try`の中で呼ぶと、`catch`がその例外を受け取ってしまいます。',
  en: '`redirect()` ends by throwing, and called inside a `try`, the `catch` receives what it threw.',
});

export const redirectFix = message({
  ja: '`redirect()`は`try`の外で呼びます。',
  en: 'Call `redirect()` outside the `try`.',
});

export const renderApiTitle = message({
  ja: '`… belongs to what answers the request, and a page is a render`というエラーが出る',
  en: 'An error says `… belongs to what answers the request, and a page is a render`',
});

export const renderApiCause = message({
  ja: 'ページの描画の中で、`cookies()`や`responseHeaders()`、`requestHeaders()`を呼んでいます。ページは応答を書けません。',
  en: 'A page calls `cookies()`, `responseHeaders()` or `requestHeaders()` while it renders, and a page cannot write the response.',
});

export const renderApiFix = message({
  ja: 'リクエストのヘッダーやCookieを読むなら、ページが受け取る`request`を使います。書くなら、`guard.ts`かServer Actionに移します。',
  en: 'To read the request’s headers or cookies, use the `request` the page receives. To write, move the code into a `guard.ts` or a Server Action.',
});

export const internalTitle = message({
  ja: 'ページが`internal error`とだけ表示される',
  en: 'A page shows nothing but `internal error`',
});

export const internalCause = message({
  ja: 'ハンドラが答えを作れず、`serve()`が`500`で答えています。上にSuspenseの境界が無い場所でServer Componentが例外を投げると、こうなります。',
  en: 'The handler could not produce an answer, and `serve()` answered with a `500`. That is what a Server Component throwing with no Suspense boundary above it leads to.',
});

export const internalFix = message({
  ja: '投げられた内容は、サーバーのログに`k8ordo: GET /products/1 failed`のような行で出ています。例外を訪問者に伝える表示が要るなら、`error.tsx`を置きます。',
  en: 'What was thrown is in the server’s log, on a line such as `k8ordo: GET /products/1 failed`. If the visitor should see something better, add an `error.tsx`.',
});

export const insecureTitle = message({
  ja: '素のHTTPで配信すると、Cookieが保存されない',
  en: 'Cookies are not kept when served over plain HTTP',
});

export const insecureCause = message({
  ja: '`cookies().set()`の`secure`は、既定で`true`です。ブラウザは、素のHTTPで届いた`Secure`のCookieを保存しません。既定が`false`になるのは、`localhost`、`127.0.0.1`、`[::1]`に素のHTTPで届いたリクエストだけです。',
  en: '`secure` defaults to `true` in `cookies().set()`, and a browser does not keep a `Secure` cookie that arrived over plain HTTP. The default is `false` only for `localhost`, `127.0.0.1` and `[::1]`.',
});

export const insecureFix = message({
  ja: '本番はHTTPSで配信します。それ以外の場所を素のHTTPで動かすなら、`set`に`secure: false`を渡します。',
  en: 'Serve production over HTTPS. Anywhere else you run over plain HTTP, pass `secure: false` to `set`.',
});

export const sameSiteTitle = message({
  ja: '`a cookie with sameSite "none" has to be secure`というエラーが出る',
  en: 'An error says `a cookie with sameSite "none" has to be secure`',
});

export const sameSiteCause = message({
  ja: "`sameSite: 'none'`のCookieに`secure: false`を渡しています。ブラウザは`Secure`の無い`SameSite=None`を捨てるので、黙って消える代わりに書いたところでエラーにしています。",
  en: "A cookie with `sameSite: 'none'` was given `secure: false`. A browser drops `SameSite=None` without `Secure`, so the write fails where it is made instead of the cookie vanishing quietly.",
});

export const sameSiteFix = message({
  ja: "`sameSite: 'none'`のCookieは`secure`のままにして、HTTPSで配信します。",
  en: "Leave a `sameSite: 'none'` cookie `secure`, and serve it over HTTPS.",
});
