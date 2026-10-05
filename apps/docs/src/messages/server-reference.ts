import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`framework()`のオプションと、`src/routes/`に置けるファイル、`@k8ordo/server`の各入口からimportできるものの一覧です。それぞれの使い方は、ガイドの各ページで説明しています。',
  en: 'The options of `framework()`, the files `src/routes/` may hold, and what each entry of `@k8ordo/server` exports. How to use each is covered in the guides.',
});

export const frameworkSummary = message({
  ja: 'アプリをサーバーで動かすViteのプラグインです。ReactのプラグインとRSCのパイプラインを含んだ配列を返すので、`plugins`にそのまま渡します。',
  en: 'The Vite plugin that makes the application run on a server. It returns an array that includes React’s plugin and the RSC pipeline; put it in `plugins` as it is.',
});

export const frameworkRoutesDir = message({
  ja: 'ルートのディレクトリです。プロジェクトのルートからの相対パスで、既定は`src/routes`です。変えても、生成されるファイルは`.k8ordo/`に書かれます。',
  en: 'The route directory, relative to the project root; `src/routes` by default. The generated files still go to `.k8ordo/`.',
});

export const frameworkReturns = message({
  ja: 'Viteのプラグインの配列。',
  en: 'An array of Vite plugins.',
});

export const pageRequest = message({
  ja: 'このモードでは、`request`も受け取ります。リクエストのヘッダーとCookieが入っています。',
  en: 'In this mode it also receives `request`: the request’s headers and cookies.',
});

export const pageSearch = message({
  ja: '`search`：読むurlスキーマです。宣言したページは、そのスロットを`search`として受け取ります。',
  en: '`search`: the url schema the page reads. A page that declares it receives that slot as `search`.',
});

export const notFoundNote = message({
  ja: 'このモードでは404のステータスで答えます。ディレクトリごとに置けます。',
  en: 'In this mode it answers under a 404, and each directory may hold its own.',
});

export const redirectNote = message({
  ja: 'このモードでは、`GET`と`HEAD`に`307`で答え、`permanent`なら`308`で答えます。',
  en: 'In this mode it answers `GET` and `HEAD` with a `307`, or a `308` when `permanent`.',
});

export const routeNote = message({
  ja: 'このモードでは7つのメソッドのどれもexportできます。`HEAD`が無ければ、`GET`の答えから本文を外して返します。',
  en: 'In this mode any of the seven methods may be exported. Without a `HEAD`, it answers with the `GET` response, body left off.',
});

export const guardDefault = message({
  ja: 'default export：`{ request, params }`を受け取る関数です。`Response`を返すとそこで打ち切り、何も返さなければ通します。その下のURLに答える前に走ります。',
  en: 'Default export: a function that receives `{ request, params }`. Returning a `Response` ends the request there; returning nothing lets it through. It runs before anything below its directory answers.',
});

export const entriesTitle = message({
  ja: '4つの入口',
  en: 'Four entries',
});

export const entriesDescription = message({
  ja: '`@k8ordo/server`は、コードが動く場所ごとに入口を分けています。デプロイしたアプリが読み込むのは`runtime`と`serve`だけで、どちらもViteを読み込みません。',
  en: '`@k8ordo/server` splits its entries by where the code runs. A deployed application loads only `runtime` and `serve`, and neither loads Vite.',
});

export const entriesList = [
  message({
    ja: '`@k8ordo/server`：`vite.config.ts`で使うプラグインの`framework()`です。Viteを読み込みます。',
    en: '`@k8ordo/server`: `framework()`, the plugin for `vite.config.ts`. It loads Vite.',
  }),
  message({
    ja: '`@k8ordo/server/runtime`：ハンドラの中で動くコードがimportするものです。Node.jsにしか無いものを使わないので、ハンドラと一緒にどのランタイムでも動きます。',
    en: '`@k8ordo/server/runtime`: what code inside the handler imports. It uses nothing only Node.js has, so it runs wherever the handler does.',
  }),
  message({
    ja: '`@k8ordo/server/serve`：ビルドをNode.jsで動かす`serve()`です。',
    en: '`@k8ordo/server/serve`: `serve()`, which runs the build on Node.js.',
  }),
  message({
    ja: '`@k8ordo/server/vercel`：Vercel向けの出力を書くプラグインの`vercel()`です。',
    en: '`@k8ordo/server/vercel`: `vercel()`, the plugin that writes Vercel’s output.',
  }),
] as const;

export const cookiesSummary = message({
  ja: 'リクエストのCookieを読み書きします。`guard.ts`、`route.ts`、Server Actionの中で呼びます。',
  en: 'Reads and writes the request’s cookies, from a `guard.ts`, a `route.ts` or a Server Action.',
});

export const cookiesGet = message({
  ja: '名前で値を読みます。無ければ`undefined`です。',
  en: 'Reads a value by name; `undefined` when there is none.',
});

export const cookiesHas = message({
  ja: 'その名前のCookieがあるかどうかを返します。',
  en: 'Whether a cookie of that name is there.',
});

export const cookiesSet = message({
  ja: '値を書きます。3つ目の引数で、`CookieOptions`の属性を渡します。',
  en: 'Writes a value, with the attributes of `CookieOptions` as the third argument.',
});

export const cookiesDelete = message({
  ja: 'Cookieを消します。書いたときと同じ`path`と`domain`を渡します。',
  en: 'Deletes a cookie. Pass the `path` and `domain` it was written with.',
});

export const cookiesCaveats = [
  message({
    ja: '読むと、リクエストが運んできたCookieに、同じリクエストの中で先に書いたものが重なって見えます。',
    en: 'A read sees the cookies the request carried, with what was written earlier in the same request on top.',
  }),
  message({
    ja: '書いたものは、答えが何であっても、その答えの`Set-Cookie`としてブラウザに届きます。',
    en: 'Every write reaches the browser as a `Set-Cookie` on the answer, whatever the answer is.',
  }),
  message({
    ja: 'ページの描画の中で呼ぶと、例外を投げます。ページは`request.cookies`を読みます。',
    en: 'It throws when called while a page renders; a page reads `request.cookies`.',
  }),
] as const;

export const cookieOptionsSummary = message({
  ja: '`cookies().set()`の3つ目の引数で渡す、Cookieの属性です。何も渡さなければ、セッションに合った値になります。',
  en: 'The attributes passed to `cookies().set()` as its third argument. Leave them out, and they are what a session wants.',
});

export const cookieOptionsPath = message({
  ja: '既定は`/`です。',
  en: '`/` by default.',
});

export const cookieOptionsDomain = message({
  ja: '既定では付けません。',
  en: 'Not set by default.',
});

export const cookieOptionsMaxAge = message({
  ja: '有効期間を秒で渡します。`0`を渡すと、すぐに切れます。',
  en: 'How long it lasts, in seconds. `0` expires it at once.',
});

export const cookieOptionsExpires = message({
  ja: '期限を`Date`で渡します。',
  en: 'When it expires, as a `Date`.',
});

export const cookieOptionsHttpOnly = message({
  ja: '既定は`true`で、ページのスクリプトからは読めません。',
  en: '`true` by default: a page’s script cannot read it.',
});

export const cookieOptionsSecure = message({
  ja: '既定は`true`で、HTTPSでしか送られません。この機械（`localhost`など）に素のHTTPで届いたリクエストでは、既定が`false`になります。',
  en: '`true` by default: sent over HTTPS only. For a request over plain HTTP to this machine (`localhost` and the like), the default is `false`.',
});

export const cookieOptionsSameSite = message({
  ja: "既定は`'lax'`です。`'none'`は`secure`のときだけ使えます。",
  en: "`'lax'` by default. `'none'` only goes with `secure`.",
});

export const responseHeadersSummary = message({
  ja: '最終的な応答が持つ`Headers`を返します。ここに書いたヘッダーは、ページでもペイロードでも、guardが返した`Response`でも、答えに付きます。',
  en: 'Returns the `Headers` the final response will carry. What is set here goes on the answer, whether a page, its payload or a `Response` a guard returned.',
});

export const responseHeadersCaveats = [
  message({
    ja: '答えがすでに持っているヘッダーは置き換えます。',
    en: 'A header the answer already carries is replaced.',
  }),
  message({
    ja: '`guard.ts`、`route.ts`、Server Actionの外で呼ぶと、例外を投げます。',
    en: 'It throws outside a `guard.ts`, a `route.ts` or a Server Action.',
  }),
] as const;

export const requestHeadersSummary = message({
  ja: 'リクエストが運んできたヘッダーを返します。引数しか受け取らないServer Actionの中で、ヘッダーを読むのに使います。',
  en: 'Returns the headers the request arrived with — for a Server Action, which receives its arguments rather than the request.',
});

export const requestHeadersCaveats = [
  message({
    ja: '`guard.ts`、`route.ts`、Server Actionの外で呼ぶと、例外を投げます。',
    en: 'It throws outside a `guard.ts`, a `route.ts` or a Server Action.',
  }),
] as const;

export const redirectSummary = message({
  ja: 'Server Actionを終え、訪問者を別のURLへ送ります。',
  en: 'Ends a Server Action and sends the visitor to another URL.',
});

export const redirectTo = message({
  ja: '行き先のURLです。書いたまま送られるので、`href()`で作ります。',
  en: 'Where to go. It is sent as written, so build it with `href()`.',
});

export const redirectReturns = message({
  ja: '値を返さず、例外を投げます。',
  en: 'It never returns; it throws.',
});

export const redirectCaveats = [
  message({
    ja: '例外を投げて終わるので、`try`の中では呼びません。',
    en: 'It ends by throwing, so do not call it inside a `try`.',
  }),
  message({
    ja: 'JavaScriptが届く前に送られたフォームには`303`で、クライアントのランタイムからの呼び出しには、行き先へ移るよう伝えるペイロードで答えます。',
    en: 'A form posted before JavaScript arrived is answered with a `303`; a call from the client runtime with a payload telling the router where to go.',
  }),
] as const;

export const nonceSummary = message({
  ja: 'この答えのインラインスクリプトに付けるnonceを返します。リクエストごとに新しい値です。',
  en: 'Returns the nonce this answer’s inline scripts carry, new for every request.',
});

export const nonceCaveats = [
  message({
    ja: 'リクエストに答えている間なら、描画の中でも同じ値を返します。',
    en: 'It returns the same value anywhere the request is being answered, the render included.',
  }),
  message({
    ja: 'リクエストの外で呼ぶと、例外を投げます。',
    en: 'It throws outside a request.',
  }),
] as const;

export const guardSummary = message({
  ja: '`guard.ts`がdefault exportする関数の型です。そのディレクトリのパターンを型引数に渡します。',
  en: 'The type of what a `guard.ts` default-exports, given its directory’s pattern.',
});

export const guardRequest = message({
  ja: '届いたままの`Request`です。',
  en: 'The `Request` as it arrived.',
});

export const guardParams = message({
  ja: 'そのディレクトリのパターンのパラメータです。guardはスキーマより前に走るので、URLの文字列のままです。',
  en: 'The parameters of its directory’s pattern, as the URL’s strings: a guard runs before any schema.',
});

export const routeRequestSummary = message({
  ja: 'ページとレイアウト、`not-found.tsx`が受け取る`request`の型です。どちらのフィールドも読むだけです。',
  en: 'The type of the `request` a page, a layout and a `not-found.tsx` receive. Both fields are read-only.',
});

export const routeRequestHeaders = message({
  ja: 'リクエストのヘッダーです。',
  en: 'The request’s headers.',
});

export const routeRequestCookies = message({
  ja: '`Cookie`ヘッダーを名前ごとに読み取ったものです。同じ名前が2回あれば、最初のものを使います。',
  en: 'The `Cookie` header read by name. When a name appears twice, the first wins.',
});

export const redirectTargetSummary = message({
  ja: '`redirect.ts`がdefault exportする値の型です。`satisfies RedirectTarget`と書くと、書いたその場で形を検査できます。',
  en: 'The type of what a `redirect.ts` default-exports. Write `satisfies RedirectTarget` to check the shape where it is written.',
});

export const serveSummary = message({
  ja: 'ビルドをNode.jsのHTTPサーバーで動かします。待ち受けを始めてから、待ち受けている場所と止め方を返します。',
  en: 'Runs the build on a Node.js HTTP server. Once it is listening, it returns where it listens and how to stop it.',
});

export const serveDist = message({
  ja: 'ビルドの出力ディレクトリです。既定は`dist`で、今の作業ディレクトリから解決します。',
  en: 'The build output directory; `dist` by default, resolved from the working directory.',
});

export const servePort = message({
  ja: '待ち受けるポートです。既定は`3000`で、`0`を渡すと空いているポートをシステムが選びます。',
  en: 'The port to listen on; `3000` by default. `0` lets the system pick a free one.',
});

export const serveHost = message({
  ja: '待ち受けるホストです。既定の`localhost`には同じマシンからしか届かないので、コンテナの中などでは`0.0.0.0`を渡します。',
  en: 'The host to listen on. The default, `localhost`, is reachable from the same machine only; pass `0.0.0.0` inside a container and the like.',
});

export const serveReturns = message({
  ja: '待ち受けを始めたサーバー。',
  en: 'The server, once it is listening.',
});

export const servePortField = message({
  ja: '実際に待ち受けているポートです。',
  en: 'The port it actually listens on.',
});

export const serveUrl = message({
  ja: '`http://<host>:<port>`の形のURLです。',
  en: 'Its URL, `http://<host>:<port>`.',
});

export const serveClose = message({
  ja: 'サーバーを止めます。止まると解決するPromiseを返します。',
  en: 'Stops the server, returning a promise that settles once it has stopped.',
});

export const serveCaveats = [
  message({
    ja: '`GET`と`HEAD`のうち、`dist/client/`の中のファイルを指すものにはそのファイルを返し、それ以外はハンドラに渡します。',
    en: 'A `GET` or `HEAD` naming a file in `dist/client/` gets that file; everything else goes to the handler.',
  }),
  message({
    ja: 'ハンドラが例外を投げたときは、`500`と本文`internal error`だけを返し、内容はサーバーのログに出します。',
    en: 'When the handler throws, it answers a `500` with the body `internal error`, and logs what was thrown.',
  }),
] as const;

export const vercelSummary = message({
  ja: '`vite build`に、VercelのBuild Output API（v3）の形で`.vercel/output/`も書かせるプラグインです。`framework()`の隣に置きます。',
  en: 'A plugin that has `vite build` also write `.vercel/output/` in the shape of Vercel’s Build Output API (v3). Put it beside `framework()`.',
});

export const vercelReturns = message({
  ja: 'Viteのプラグイン。',
  en: 'A Vite plugin.',
});

export const vercelCaveats = [
  message({
    ja: 'ハンドラをすべての依存ごとバンドルします。そのため、ネイティブのバイナリを持つ依存や、自分のファイルをパスで読む依存は動きません。',
    en: 'The handler is bundled with every dependency, so one that ships a native binary, or reads its own files by path, does not work.',
  }),
] as const;
