import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ページは描画であって、応答を書きません。リクエストを通すかどうかと、応答に何を付けるかは、ページより前に走る`guard.ts`が決めます。ログインしていない訪問者をログインのページへ送るのが、よくある使い方です。',
  en: 'A page is a render; it does not write the response. Whether a request gets through, and what the answer carries, is decided before the page by a `guard.ts`. Sending a visitor who has not signed in to the sign-in page is the usual case.',
});

export const placeTitle = message({
  ja: '`guard.ts`を置く',
  en: 'Add a `guard.ts`',
});

export const placeDescription = message({
  ja: '`guard.ts`はどの階層のディレクトリにも置けて、そのディレクトリより下のURLに答える前に走ります。URLに沿って複数あれば、外側から1つずつ順に走ります。',
  en: 'A `guard.ts` may sit in a directory at any level, and runs before any URL below that directory is answered. When several lie along a URL, they run outer first, one at a time.',
});

export const placeExample = message({
  ja: 'この木で`/admin/42`を開くと、ルートの`guard.ts`、`admin/guard.ts`の順に走ります。どちらも通したときだけ、ページが描かれます。',
  en: 'In this tree, opening `/admin/42` runs the root `guard.ts` and then `admin/guard.ts`, and the page renders only when both let it through.',
});

export const placeContext = message({
  ja: 'guardは`{ request, params }`を受け取ります。`request`は届いたままの`Request`で、`params`はそのディレクトリのパターンのパラメータです。guardはどのレイアウトよりも上で走るので、`params`はスキーマで変換される前の文字列のままです。',
  en: 'A guard receives `{ request, params }`: the `Request` as it arrived, and the parameters of its directory’s pattern. It runs above every layout, so `params` are still the strings, before any schema converted them.',
});

export const placeType = message({
  ja: '型は`@k8ordo/server/runtime`の`Guard`で、そのディレクトリのパターンを型引数に渡します。生成されたルート表も、それぞれの`guard.ts`をそのディレクトリのパターンで検査します。',
  en: 'Its type is `Guard` from `@k8ordo/server/runtime`, given its directory’s pattern. The generated route table checks every `guard.ts` against that pattern too.',
});

export const endTitle = message({
  ja: '打ち切るか、通すか',
  en: 'End the request, or let it through',
});

export const endDescription = message({
  ja: '`Response`を返すと、それがそのまま答えになります。リダイレクトでも`401`でも`403`でも構わず、内側のguardも下のページも走りません。何も返さなければ、リクエストは次のguardへ進み、最後のguardの後はURLに答えるものへ渡ります。',
  en: 'Return a `Response`, and that is the answer — a redirect, a `401`, a `403` — and neither the guards inside it nor the page below run. Return nothing, and the request goes on to the next guard, and after the last one to whatever answers the URL.',
});

export const endLocation = message({
  ja: 'リダイレクトの`location`は、guardが書いたまま送られます。`redirect.ts`の行き先と違ってURLなので、`href()`で作ります。`href()`なら、Viteの`base`の下で配信するときも`base`が付きます。',
  en: 'A redirect’s `location` goes out as the guard wrote it. Unlike a `redirect.ts` target it is a URL, so build it with `href()`, which carries Vite’s `base` when the application is served under one.',
});

export const endOther = message({
  ja: '`Response`でも`undefined`でもない値を返すと、`a guard.ts returns a Response to end the request, or nothing to let it through`というエラーになります。',
  en: 'Returning anything other than a `Response` or `undefined` fails with `a guard.ts returns a Response to end the request, or nothing to let it through`.',
});

export const headersTitle = message({
  ja: '応答にヘッダーを足す',
  en: 'Add headers to the answer',
});

export const headersDescription = message({
  ja: 'リクエストを通すときでも、最終的な応答にヘッダーを足せます。`responseHeaders()`が返す`Headers`に書いたものは、ページでもペイロードでも、内側のguardが返した`Response`でも、その答えに付きます。',
  en: 'Even when a guard lets a request through, it can add headers to the final answer. What it writes into the `Headers` `responseHeaders()` returns goes on whatever answers: the page, its payload, or a `Response` a guard further in returned.',
});

export const headersReplace = message({
  ja: '答えがすでに持っているヘッダーは、置き換えます。',
  en: 'A header the answer already carries is replaced.',
});

export const headersWhere = message({
  ja: '`responseHeaders()`が使えるのは、`guard.ts`や`route.ts`、Server Actionが走っている間だけです。ページの中で呼ぶと、例外を投げます。ページは描画であり、応答を書く描画は2つ目のハンドラになってしまうからです。',
  en: '`responseHeaders()` works only while a `guard.ts`, a `route.ts` or a Server Action runs, and throws inside a page: a page is a render, and a render that wrote the response would be a second handler.',
});

export const headersCsp = message({
  ja: 'Content-Security-Policyのヘッダーも、ルートの`guard.ts`で書きます。書き方は次のページで説明しています。',
  en: 'The Content-Security-Policy header is written in the root `guard.ts` too, as covered here:',
});

export const noNextTitle = message({
  ja: 'ページの答えは後から書き換えられない',
  en: 'A page’s answer cannot be rewritten afterwards',
});

export const noNextDescription = message({
  ja: 'ページを走らせて答えを受け取り、書き換えてから返す`next()`はありません。ページはストリーミングで返るので、本文を書き終える前にヘッダーが送られます。guardが決められるのは、ページが始まる前だけです。',
  en: 'There is no `next()` that runs the page and hands its answer back to be rewritten. A page streams, and its headers leave before its body is written, so a guard decides before the page starts, never after.',
});

export const coversTitle = message({
  ja: 'guardが受け持つ範囲',
  en: 'What a guard covers',
});

export const coversDescription = message({
  ja: 'guardは、そのディレクトリより下の次のリクエストの前に走ります。',
  en: 'A guard runs before each of these below its directory:',
});

export const coversList = [
  message({
    ja: 'ページと、クライアント側の遷移で取りに来るそのペイロード',
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
  ja: 'ルートの`guard.ts`は、どのルートにも当たらなかったURLの前にも走ります。',
  en: 'The root `guard.ts` also runs for a URL no route matched.',
});

export const coversRedirect = message({
  ja: '`redirect.ts`は、どのguardよりも先に答えます。そのURLには、守るべきページが無いからです。',
  en: 'A `redirect.ts` answers before any guard runs: the URL it answers has no page to guard.',
});

export const coversActions = message({
  ja: 'guardが守るのは、Server Actionそのものではありません。アクションはどのページからでも呼べる関数で、呼んだページのURLへ送られます。アクションに必要な確認は、アクションの中でも行ってください。',
  en: 'A guard does not protect a Server Action as such. An action is a function any page can call, posted to whichever page calls it, so check what it needs inside the action too.',
});

export const orderTitle = message({
  ja: 'guardが走る順番',
  en: 'When a guard runs',
});

export const orderDescription = message({
  ja: 'guardは、`paramsSchema`がURLを照合した後、Server Actionと描画より前に走ります。そのため`[locale]`の下のguardは、URLが示すロケールの中で動きます。guardが書いたCookieは、その後に走るServer Actionが読めます。',
  en: 'Guards run after the `paramsSchema` exports have matched the URL, and before the Server Action and the render. So a guard under `[locale]` runs in the locale the URL names, and a Server Action after it reads the cookies it wrote.',
});

export const staticNote = message({
  ja: '`@k8ordo/static`では、`guard.ts`はビルドでも`vite dev`でも名指しで拒まれます。ファイルには、通すかどうかを決めるリクエストが無いからです。',
  en: 'Under `@k8ordo/static`, a `guard.ts` is refused by name in the build and in `vite dev`: a file has no request to let through or to stop.',
});
