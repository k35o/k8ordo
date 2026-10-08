import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'serverモードだけで使えます。`guard.ts`で、ページを描画する前にリクエストを止めてログインのページへ送ったり、応答にヘッダーを足したりできます。',
  en: 'Server mode only. A `guard.ts` can stop a request before the page renders, send the visitor to the sign-in page, or add headers to the response.',
});

export const placeTitle = message({
  ja: '置き場所',
  en: 'Placement',
});

export const placeAnywhere = message({
  ja: '`guard.ts`はどの階層のディレクトリにも置けます。そのディレクトリより下のURLへのリクエストを処理する前に実行されます。URLに沿って複数あれば、外側から1つずつ順に実行されます。',
  en: 'A `guard.ts` can sit in a directory at any level. It runs before a request for any URL below that directory is handled. When several lie along a URL, they run outer first, one at a time.',
});

export const placeTree = message({
  ja: 'この構成で`/admin/42`を開くと、ルートの`guard.ts`、`admin/guard.ts`の順に実行されます。どちらも通したときだけ、ページが描画されます。',
  en: 'Opening `/admin/42` with this layout runs the root `guard.ts`, then `admin/guard.ts`. The page renders only when both let the request through.',
});

export const endTitle = message({
  ja: '戻り値',
  en: 'Return value',
});

export const endPassCallout = message({
  ja: '何も返さないと、リクエストを通す',
  en: 'Returning nothing lets the request through',
});

export const endStopCallout = message({
  ja: '`Response`を返すと、リクエストを打ち切る',
  en: 'A `Response` ends the request',
});

export const endLocationCallout = message({
  ja: '`href()`で作るとViteの`base`が付く',
  en: '`href()` adds Vite’s `base`',
});

export const endResponse = message({
  ja: '`Response`を返すと、それがそのまま応答になります。リダイレクトでも`401`でも`403`でも構いません。内側のguardもページも実行されません。',
  en: 'A returned `Response` is sent as the response, whether a redirect, a `401` or a `403`. Guards further in and the page do not run.',
});

export const endContext = message({
  ja: 'guardは`{ request, params }`を受け取ります。`request`は受け取ったままの`Request`です。`params`はそのディレクトリのパターンのパラメータで、値はスキーマで変換される前のURLの文字列です。',
  en: 'A guard receives `{ request, params }`. `request` is the `Request` as it arrived. `params` are the parameters of the directory’s pattern, still the raw strings from the URL.',
});

export const endType = message({
  ja: '型は`@k8ordo/framework/server`の`Guard`です。型引数には、そのディレクトリのパターンを渡します。生成されたルート表も、それぞれの`guard.ts`をディレクトリのパターンで検査します。',
  en: 'The type is `Guard` from `@k8ordo/framework/server`, with the directory’s pattern as its type argument. The generated route table checks every `guard.ts` against that pattern as well.',
});

export const endOther = message({
  ja: '`Response`でも`undefined`でもない値を返すと、エラーになります。エラー文は`a guard.ts returns a Response to end the request, or nothing to let it through`です。',
  en: 'Returning anything but a `Response` or `undefined` is an error: `a guard.ts returns a Response to end the request, or nothing to let it through`.',
});

export const headersTitle = message({
  ja: '応答のヘッダー',
  en: 'Response headers',
});

export const headersAnswer = message({
  ja: '`responseHeaders()`は、最終的な応答に付く`Headers`を返します。リクエストを通したときも、この`Headers`に足したヘッダーは応答に付きます。ページでもペイロードでも、not-foundでも、内側のguardが返した`Response`でも同じです。同じ名前のヘッダーがすでにあれば、この値に置き換わります。',
  en: '`responseHeaders()` returns the `Headers` of the final response. Headers set on it are added even when the guard lets the request through, whether the response is the page, its payload, the not-found, or a `Response` a guard further in returned. A header with the same name is replaced.',
});

export const headersWhere = message({
  ja: '`responseHeaders()`を呼べるのは、`guard.ts`と`route.ts`とServer Actionの中だけです。ページの描画中に呼ぶと、`responseHeaders() belongs to what answers the request`で始まるエラーになります。リクエストの外で呼ぶと、`responseHeaders() needs a request`で始まるエラーになります。',
  en: '`responseHeaders()` can be called only inside a `guard.ts`, a `route.ts` or a Server Action. Called in a page render, it fails with an error that starts `responseHeaders() belongs to what answers the request`. Called outside a request, the error starts `responseHeaders() needs a request`.',
});

export const headersCspBefore = message({
  ja: '`Content-Security-Policy`のヘッダーも、ルートの`guard.ts`で書きます。書き方は',
  en: 'The `Content-Security-Policy` header is written in the root `guard.ts` too. See ',
});

export const headersCspAfter = message({
  ja: 'を見てください。',
  en: '.',
});

export const noNextTitle = message({
  ja: '描画後の書き換え',
  en: 'Rewriting after the render',
});

export const noNextStreams = message({
  ja: 'ページを実行して応答を受け取り、書き換えてから返す`next()`はありません。ページはストリーミングで返るので、本文を書き終える前にヘッダーが送られます。guardが決められるのは、ページの描画が始まる前だけです。',
  en: 'There is no `next()` that runs the page and hands its answer back to be rewritten. A page streams, and its headers are sent before its body is finished. A guard decides before the page starts rendering.',
});

export const coversTitle = message({
  ja: '対象のリクエスト',
  en: 'Covered requests',
});

export const coversLead = message({
  ja: 'そのディレクトリより下にある、次のリクエストが対象です。',
  en: 'These requests below its directory are covered:',
});

export const coversList = [
  message({
    ja: 'ページと、クライアント側の遷移で取得するそのペイロード',
    en: 'a page, and its payload fetched by a client navigation',
  }),
  message({
    ja: 'そのページへの`HEAD`',
    en: 'a `HEAD` for that page',
  }),
  message({
    ja: 'そのページへ送られたServer Action',
    en: 'a Server Action posted to that page',
  }),
  message({
    ja: '下にある`route.ts`と`not-found.tsx`',
    en: 'a `route.ts` or a `not-found.tsx` below it',
  }),
] as const;

export const coversRoot = message({
  ja: 'ルートの`guard.ts`は、どのルートにも当たらなかったURLでも実行されます。',
  en: 'The root `guard.ts` also runs for a URL no route matched.',
});

export const coversActions = message({
  ja: 'guardが守るのは、Server Actionそのものではありません。アクションはどのページからでも呼べる関数で、呼んだページのURLへ送られます。アクションに必要な確認は、アクションの中でも行ってください。',
  en: 'A guard does not protect a Server Action itself. An action is a function any page can call, and it is posted to the URL of the page that calls it. Check what the action needs inside the action as well.',
});

export const orderTitle = message({
  ja: '実行の順序',
  en: 'Execution order',
});

export const orderWhen = message({
  ja: 'guardは、`paramsSchema`がURLを照合したあと、Server Actionと描画の前に実行されます。`redirect.ts`はどのguardよりも先に応答を返します。`[locale]`の下のguardでは、URLが示すロケールがすでに決まっています。guardが書いたCookieは、そのあとのServer Actionで読めます。',
  en: 'A guard runs after the `paramsSchema` exports have matched the URL, and before the Server Action and the render. A `redirect.ts` answers before any guard. A guard under `[locale]` already has the locale the URL names, and a Server Action after it can read the cookies the guard wrote.',
});
