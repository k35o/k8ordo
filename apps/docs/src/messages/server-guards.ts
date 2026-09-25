import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ページは描画であって、応答を書きません。リクエストを通すかどうかと、応答にページ以外の何を付けるかは、ページより前に走る `guard.ts` が決めます。このページは、`guard.ts` の書き方、打ち切り方と通し方、`responseHeaders()` での添え方、guard が受け持つ範囲、`cookies()` での Cookie の読み書きを説明します。',
  en: 'A page is a render; it does not write the response. Whether a request gets through, and what the answer carries beyond the page, is decided before the page by a `guard.ts`. This page covers writing one, ending a request and letting it through, adding to the answer with `responseHeaders()`, what a guard covers, and reading and writing cookies with `cookies()`.',
});

export const guardTitle = message({
  ja: '`guard.ts`',
  en: '`guard.ts`',
});

export const guardDescription = message({
  ja: '`guard.ts` はどの階層のディレクトリにも置け、そのディレクトリより下で答えるものの前に走ります。URL に沿って複数あれば、外側から 1 つずつ順に走ります。',
  en: 'A `guard.ts` can sit in a directory at any level, and runs before whatever answers below that directory. When several lie along a URL, they run outer first, one at a time.',
});

export const guardReceives = message({
  ja: '受け取るのは `{ request, params }` です。`request` は届いたままの `Request`、`params` はそのディレクトリのパターンの params で、URL が運んだ文字列のままです。guard はどのレイアウトよりも上で走るので、スキーマが型を付ける前にいます。型は `@k8ordo/server/runtime` の `Guard<P>` で、生成された表も各 `guard.ts` をそのディレクトリのパターンで検査します。',
  en: 'It receives `{ request, params }`: the `Request` as it arrived, and the params of the pattern its directory puts it under, as the strings the URL carried — a guard runs above every layout, before any schema has typed them. The type is `Guard<P>` from `@k8ordo/server/runtime`, and the generated table checks each `guard.ts` against its directory’s pattern either way.',
});

export const endTitle = message({
  ja: '打ち切るか、通すか',
  en: 'Ending the request, or letting it through',
});

export const endDescription = message({
  ja: '`Response` を返すと、それが答えになります。リダイレクトでも `401` でも `403` でもかまいません。その内側の guard も、下のページも走りません。何も返さなければ次の guard へ、最後の guard のあとは URL に答えるものへ渡ります。',
  en: 'Returning a `Response` makes it the answer — a redirect, a `401`, a `403`, whatever it is — and neither the guards inside it nor the page below run. Returning nothing hands the request on to the next guard, and after the last one to whatever answers the URL.',
});

export const endLocation = message({
  ja: 'リダイレクトの `location` は、guard が書いたまま送られます。`redirect.ts` の行き先のような表のパターンではなく URL なので、`href()` で作ります。`href()` なら、アプリを Vite の `base` の下に置いたときも、それが付きます。',
  en: 'A redirect’s `location` goes out as the guard wrote it. It is a URL, not a pattern in the table’s terms like a `redirect.ts` target, so build it with `href()`, which carries Vite’s `base` when the application is served under one.',
});

export const addTitle = message({
  ja: '応答に添える',
  en: 'Adding to the answer',
});

export const addDescription = message({
  ja: '通すときでも、最終的な応答に付けるものは添えられます。`responseHeaders()` は、何が答えるかにかかわらず最終的な応答が持つ `Headers` です。ページでも、そのペイロードでも、not-found でも、さらに内側の guard が打ち切った応答でも同じです。',
  en: 'Letting a request through can still add to its answer. `responseHeaders()` is the `Headers` the final response will carry, whatever answers — the page, its payload, the not-found, or a guard further in that ends the request.',
});

export const addReplace = message({
  ja: '答えがすでに持っているヘッダーは置き換えます。`responseHeaders()` は guard か Server Action が走っている間だけ使え、それ以外の場所では throw します。ページは描画で、応答を書く描画は 2 つ目のハンドラになってしまうからです。',
  en: 'A header the answer already carries is replaced. `responseHeaders()` works while a guard or a Server Action runs and throws anywhere else: a page is a render, and a render that wrote the response would be a second handler.',
});

export const nextTitle = message({
  ja: '`next()` は無い',
  en: 'There is no `next()`',
});

export const nextDescription = message({
  ja: 'ページを走らせてその答えを受け取り、書き換えてから返す `next()` はありません。ページはストリーミングで返り、本文を書き終える前にヘッダーが送られます。だから guard が決められるのは、ページが始まる前だけです。',
  en: 'There is no `next()` that runs the page and hands its answer back to be rewritten. A page streams, and its headers are on the wire before its body is written — so a guard decides before the page starts, never after.',
});

export const coversTitle = message({
  ja: 'guard が受け持つもの',
  en: 'What a guard covers',
});

export const coversDescription = message({
  ja: 'guard は、そのディレクトリより下のすべての URL の前に走ります。',
  en: 'A guard runs before every URL below its directory:',
});

export const coversPage = message({
  ja: 'ページと、クライアント遷移で取りに来るそのペイロード',
  en: 'each page, and its payload for a client navigation',
});

export const coversHead = message({
  ja: 'そのページへの `HEAD`',
  en: 'a `HEAD` for it',
});

export const coversAction = message({
  ja: 'そのページへ送られた Server Action',
  en: 'a Server Action posted to it',
});

export const coversNotFound = message({
  ja: '下にある `not-found.tsx`。ルートの guard は、どれも答えない URL にも走ります',
  en: 'a `not-found.tsx` below it — and the root’s guard also runs for a URL nothing answers',
});

export const coversRedirect = message({
  ja: '`redirect.ts` はどの guard よりも前に答えます。移転したディレクトリには、守るものが下にありません。',
  en: 'A `redirect.ts` is answered before any guard runs: a directory that redirects has nothing below it to guard.',
});

export const coversActions = message({
  ja: 'guard は Server Action そのものを守りません。アクションはどのページからでも呼べる関数で、呼んだページの URL へ送られます。アクションが要るものは、アクションの中で確かめます。',
  en: 'A guard does not protect a Server Action as such: an action is a function any page can call, posted to whichever URL calls it. An action checks what it needs itself.',
});

export const orderTitle = message({
  ja: '走る順番',
  en: 'When it runs',
});

export const orderDescription = message({
  ja: 'guard は params のスキーマが URL を照合したあと、POST が運ぶ Server Action と描画より前に走ります。`[locale]` の下の guard は、URL が名指すロケールの中で走ります。',
  en: 'The guards run after the params schemas have matched the URL, and before the Server Action a `POST` carries and before the render — so a guard under `[locale]` runs in the locale the URL names.',
});

export const staticTitle = message({
  ja: '`@k8ordo/static` では',
  en: 'Under `@k8ordo/static`',
});

export const staticDescription = message({
  ja: 'ファイルには守るリクエストがありません。`@k8ordo/static` は `guard.ts` を名指しで拒みます。ビルドでも `vite dev` でもです。',
  en: 'A file has no request to guard. `@k8ordo/static` refuses a `guard.ts` by name, in the build and in `vite dev`.',
});

export const cookiesTitle = message({
  ja: '`cookies()`',
  en: '`cookies()`',
});

export const cookiesDescription = message({
  ja: '`cookies()` はリクエストの Cookie で、`guard.ts` か Server Action の中で読み書きできます。読むと、リクエストが運んできたものに、同じリクエストの中で先に書いたものが重なって見えます。guard が書いた値は、そのあとに走る Server Action が読みます。書いたものは、答えが何であれ、その答えの `Set-Cookie` になってブラウザに届きます。',
  en: 'The request’s cookies, to read and to write, from a `guard.ts` or a Server Action. A read sees what the request carried with what was set or deleted earlier in the same request — a guard’s write is what a Server Action after it reads — and every write reaches the browser as a `Set-Cookie` on the answer, whatever the answer is.',
});

export const cookiesOptions = message({
  ja: "`set` は `path`・`domain`・`maxAge`（秒）・`expires`・`httpOnly`・`secure`・`sameSite` を受け取ります。既定はセッションに合わせた `path: '/'`・`httpOnly: true`・`secure: true`・`sameSite: 'lax'` です。`localhost` は主要なブラウザで安全な配信元として扱われます。それ以外を素の HTTP で配るなら `secure: false` を渡します。`delete` には、書いたときの `path` と `domain` を渡します。ブラウザは Cookie をそれで見分けるからです。",
  en: "`set` takes `path`, `domain`, `maxAge` (seconds), `expires`, `httpOnly`, `secure` and `sameSite`. The defaults are what a session wants: `path: '/'`, `httpOnly: true`, `secure: true` and `sameSite: 'lax'`. `localhost` counts as secure to the browsers that matter; anywhere else served over plain HTTP, pass `secure: false`. `delete` takes the `path` and `domain` the cookie was set with, since a browser keys it by those.",
});

export const cookiesPage = message({
  ja: 'ページは Cookie を書きません。props の `request.cookies` から、リクエストが運んできた Cookie を読むだけです。',
  en: 'A page never writes a cookie: it reads `request.cookies` from its props, the cookies the request carried.',
});
