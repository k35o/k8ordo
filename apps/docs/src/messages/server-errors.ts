import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ページが例外を投げたとき、URLがどこにも当たらなかったとき、URLを移したときの扱い方を説明します。このモードでは、知らないURLに本物の404を返し、リダイレクトにも`307`か`308`のステータスで答えます。',
  en: 'What to do when a page throws, when a URL matches nothing, and when a URL has moved. In this mode an unknown URL gets a real 404, and a redirect is answered with a `307` or `308`.',
});

export const scopeMode = message({
  ja: 'このモードでは、`serve()`がその読み込みに答えます。描けないページなら`500`です。',
  en: 'In this mode `serve()` answers that load — with a `500` when the page cannot render.',
});

export const renderTitle = message({
  ja: 'サーバーで描いている途中に例外が起きたとき',
  en: 'When something throws while the server renders',
});

export const renderDescription = message({
  ja: 'サーバーでの描画は、例外を`error.tsx`で受け止められません。代わりに、Suspenseの境界の中で例外を投げた部分をブラウザに描かせます。`error.tsx`の境界はSuspenseの境界も兼ねているので、HTMLは枠を持ち、ページのあった位置を空けたまま届きます。',
  en: 'A server render cannot catch with `error.tsx`. What it does instead is leave a part that threw inside a Suspense boundary for the browser to render, and an `error.tsx` boundary is one. So the HTML arrives with its frame and a hole where the page was.',
});

export const renderBrowser = message({
  ja: 'ブラウザが同じ位置で例外を投げ直し、hydrationの後に`error.tsx`が出ます。応答のステータスは200のままです。',
  en: 'The browser throws again at the same spot, and `error.tsx` shows after hydration. The status stays 200.',
});

export const renderMessage = message({
  ja: '本番では、ブラウザに届くエラーのメッセージはReactの汎用の文言に置き換わります。投げられたメッセージは、サーバーのログに`k8ordo: rendering /broken failed`として出ます。',
  en: 'In production the error the browser receives carries React’s generic message. The thrown one goes to the server’s log, as `k8ordo: rendering /broken failed`.',
});

export const renderNoBoundary = message({
  ja: '上にSuspenseの境界が1つも無い場所で例外が起きると、空けておく場所が無いのでHTMLを作れません。`serve()`はそのリクエストに`500`で答えます。',
  en: 'A throw with no Suspense boundary above it has nowhere to leave a hole, so no HTML can be made, and `serve()` answers that request with a `500`.',
});

export const notFoundMode = message({
  ja: 'このモードでは、`not-found.tsx`の答えは本物の404ステータスを持ちます。ディレクトリごとに置けるので、`docs/not-found.tsx`は`/docs`の下の知らないURLを、`docs/layout.tsx`の内側に描きます。',
  en: 'In this mode a `not-found.tsx` answers under a real 404 status. Each directory may have its own, so `docs/not-found.tsx` renders an unknown URL under `/docs` inside `docs/layout.tsx`.',
});

export const notFoundNone = message({
  ja: '`not-found.tsx`を1つも置かなければ、フレームワークが用意した最小のページが、ルートレイアウトの内側に404で描かれます。`404`という見出しと1行の説明だけのページですが、サイトの枠と`<html lang>`、スタイルシートは残ります。',
  en: 'With no `not-found.tsx` at all, a minimal page of the framework’s own renders inside the root layout under a 404: a `404` heading and a line. The site’s frame, its `<html lang>` and its stylesheets stay.',
});

export const pageNotFoundMode = message({
  ja: 'このモードでは、ページ自身のコンポーネントが答えを返すまで、文書を送りません。ステータスは本文より先に送るものなので、`notFound()`が来るかもしれない間は待つ必要があるからです。',
  en: 'In this mode a document is not sent until the page’s own component has answered. A status goes out before the body, so it has to wait while `notFound()` may still come.',
});

export const pageNotFoundNavigation = message({
  ja: 'クライアント側の遷移ではステータスを待たないので、ペイロードを最初から流します。そこでページが`notFound()`を投げると、ブラウザが同じURLを文書として読み込み直し、サーバーが404で答えます。',
  en: 'A client navigation has no status to wait for, so its payload streams from the start. A page that throws `notFound()` there sends the browser back for a document load of the same URL, which the server answers with the 404.',
});

export const pageNotFoundDeep = message({
  ja: 'ページが答えを返して応答が始まった後に、`<Suspense>`の下の子から`notFound()`を投げても、404にはなりません。ほかの例外と同じく、いちばん近い`error.tsx`が受け止めます。',
  en: 'Thrown from further down, under a `<Suspense>`, after the page has answered and the response has started, `notFound()` is no 404: like any other error, the nearest `error.tsx` catches it.',
});

export const redirectMode = message({
  ja: 'このモードでは、`GET`と`HEAD`に`307`で答え、`permanent`なら`308`で答えます。ほかのメソッドには`405`です。クライアント側の遷移がリダイレクトに当たると、ブラウザが文書として読み込み直して行き先へ移るので、アドレスバーも正しいURLになります。',
  en: 'In this mode a `GET` or `HEAD` gets a `307`, or a `308` when `permanent`, and any other method a `405`. A client navigation that meets a redirect has the browser load it as a document and follow it, so the address bar ends up right.',
});

export const redirectType = message({
  ja: "default exportの型は、`@k8ordo/server/runtime`の`RedirectTarget`です。`export default '/products' satisfies RedirectTarget`と書けば、書いたその場で形を検査できます。",
  en: "The default export’s type is `RedirectTarget` from `@k8ordo/server/runtime`. Write `export default '/products' satisfies RedirectTarget` to check the shape right where it is written.",
});

export const redirectAction = message({
  ja: 'Server Actionの最後に訪問者を別のページへ送るときは、`redirect()`を使います。使い方は次のページで説明しています。',
  en: 'To send the visitor elsewhere at the end of a Server Action, use `redirect()`, covered here:',
});
