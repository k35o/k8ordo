import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`framework()`のオプションと、`src/routes/`に置けるファイル、`@k8ordo/framework`の各エントリポイントがexportするものの一覧です。それぞれの使い方は、ガイドの各ページにあります。',
  en: 'The options of `framework()`, the files `src/routes/` may hold, and what each entry point of `@k8ordo/framework` exports. How to use each is in the guide pages.',
});

export const entriesTitle = message({
  ja: 'エントリポイント',
  en: 'Entry points',
});

export const entriesDescription = message({
  ja: '`@k8ordo/framework`は、コードが動く場所ごとにエントリポイントを分けています。デプロイしたアプリが読み込むエントリポイントは、どれもViteを読み込みません。',
  en: '`@k8ordo/framework` splits its entry points by where the code runs. No entry point that a deployed application loads imports Vite.',
});

export const entriesList = [
  message({
    ja: '`@k8ordo/framework`：アプリのコードがimportする型と関数です。',
    en: '`@k8ordo/framework`: the types and functions the application’s code imports.',
  }),
  message({
    ja: '`@k8ordo/framework/vite`：`vite.config.ts`で使うプラグイン`framework()`です。Viteを読み込みます。',
    en: '`@k8ordo/framework/vite`: `framework()`, the plugin for `vite.config.ts`. It loads Vite.',
  }),
  message({
    ja: '`@k8ordo/framework/server`：serverモードだけ。ハンドラの中で動くコードがimportする関数と型です。staticモードで値をimportするとビルドがエラーになります。Node.jsから使うのは`AsyncLocalStorage`だけなので、ハンドラが動くランタイムならどこでも動きます。',
    en: '`@k8ordo/framework/server`: server mode only. The functions and types that code inside the handler imports. In static mode, a module that imports a value from it fails the build. It needs nothing from Node.js but `AsyncLocalStorage`, so it runs wherever the handler does.',
  }),
  message({
    ja: '`@k8ordo/framework/serve`：serverモードのビルドをNode.jsで動かす`serve()`です。`dist/server.js`が呼ぶ関数で、自前のサーバーからも使えます。',
    en: '`@k8ordo/framework/serve`: `serve()`, which runs a server mode build on Node.js. `dist/server.js` calls it, and a server of your own can too.',
  }),
  message({
    ja: '`@k8ordo/framework/vercel`：serverモードのビルドをVercel向けに書き出すプラグイン`vercel()`です。',
    en: '`@k8ordo/framework/vercel`: `vercel()`, the plugin that writes a server mode build for Vercel.',
  }),
  message({
    ja: '`@k8ordo/framework/generated`：生成される`.k8ordo/`のファイルだけがimportする型と関数です。手で書くコードからはimportしません。',
    en: '`@k8ordo/framework/generated`: what the generated `.k8ordo/` files import. Code written by hand does not import it.',
  }),
] as const;

export const frameworkSummary = message({
  ja: 'アプリをビルドするViteのプラグインです。ReactのプラグインとRSCのパイプラインを含む配列を返すので、`plugins`にそのまま渡します。',
  en: 'The Vite plugin that builds the application. It returns an array holding React’s plugin and the RSC pipeline, so pass it to `plugins` as it is.',
});

export const frameworkMode = message({
  ja: "`'static'`か`'server'`です。省略できません。`'static'`はすべてのページをファイルに書き出し、`'server'`はリクエストごとに描画します。",
  en: "`'static'` or `'server'`, with no default. `'static'` writes every page into files, and `'server'` renders per request.",
});

export const frameworkRoutesDir = message({
  ja: 'ルートのディレクトリです。プロジェクトのルートからの相対パスで、既定は`src/routes`です。変えても、生成されるファイルは`.k8ordo/`に書かれます。',
  en: 'The route directory, relative to the project root. `src/routes` by default. The generated files go to `.k8ordo/` either way.',
});

export const frameworkPaths = message({
  ja: 'staticモードだけ。パラメータを持つルートのパス名を返す関数です。値の要るパターンの一覧を受け取り、パス名の配列かそのPromiseを返します。パス名にViteの`base`は含めません。',
  en: 'Static mode only. A function that returns the pathnames of routes with parameters. It receives the patterns that need values and returns an array of pathnames, or a promise of one. The pathnames carry no Vite `base`.',
});

export const frameworkSite = message({
  ja: 'staticモードだけ。サイトの配信元です（`https://example.com`）。渡すと、ビルドが`sitemap.xml`も書きます。`route.ts`が受け取る`request.url`のoriginにもなります。',
  en: 'Static mode only. The origin the site is served from, such as `https://example.com`. With it, the build also writes `sitemap.xml`. It is also the origin of the `request.url` a `route.ts` receives.',
});

export const frameworkCsp = message({
  ja: 'staticモードだけ。各ページに書くContent-Security-Policyです。ディレクティブごとにソースの配列を渡します。ビルドがフレームワークのスクリプトのハッシュを足して、`<meta>`に書きます。',
  en: 'Static mode only. The Content-Security-Policy every page carries, as an array of sources per directive. The build adds the hashes of the framework’s scripts and writes it into a `<meta>`.',
});

export const frameworkReturns = message({
  ja: 'Viteのプラグインの配列。',
  en: 'An array of Vite plugins.',
});

export const frameworkCaveats = [
  message({
    ja: "`paths`と`site`、`csp`は、どれか1つでも`mode: 'server'`と一緒に書くと型エラーになります。",
    en: "`paths`, `site` or `csp` written beside `mode: 'server'` is a type error.",
  }),
  message({
    ja: "`csp`に`<meta>`では効かないディレクティブか`'strict-dynamic'`を渡すと、`framework()`を呼んだ時点で`the \"csp\" option cannot go into a page's <meta> as it is`のエラーになります。",
    en: "When `csp` holds a directive a `<meta>` ignores, or `'strict-dynamic'`, `framework()` fails as soon as it is called, with the error `the \"csp\" option cannot go into a page's <meta> as it is`.",
  }),
] as const;

export const filesTitle = message({
  ja: 'ルートのファイル',
  en: 'Route files',
});

export const filesDescription = message({
  ja: '`src/routes/`の下に置けるファイルと、それぞれがexportするものと受け取るものの一覧です。これ以外の名前のファイルは、`_`で始まるディレクトリに置きます。',
  en: 'The files a directory under `src/routes/` may hold, with what each exports and receives. A file with any other name goes under a directory whose name starts with `_`.',
});

export const pageDefault = message({
  ja: 'default export：そのディレクトリのURLで表示するページのコンポーネントです。`params`と`pathname`を受け取ります。',
  en: 'Default export: the page component for the directory’s URL. It receives `params` and `pathname`.',
});

export const pageRequest = message({
  ja: 'serverモードでは`request`（`RouteRequest`）も受け取ります。',
  en: 'In server mode, it also receives `request`, a `RouteRequest`.',
});

export const pageSchema = message({
  ja: '`paramsSchema`：パラメータを検証するスキーマです。Standard Schemaを実装したものを渡します。省略できます。',
  en: '`paramsSchema`: a schema that validates the parameters. Anything that implements Standard Schema works. Optional.',
});

export const pageSearch = message({
  ja: '`search`：serverモードだけ。ページが読むクエリのスキーマで、`@k8ordo/state`の定義の`url`を渡します。exportしたページは、読んだ値を`search`として受け取ります。',
  en: '`search`: server mode only. The schema of the query the page reads, the `url` of a `@k8ordo/state` definition. A page that exports it receives the parsed values as `search`.',
});

export const layoutDefault = message({
  ja: 'default export：その下に描画されるものを`children`として受け取って包むコンポーネントです。`params`と`pathname`も受け取ります。`params`の型は文字列のままです。',
  en: 'Default export: a component that wraps what renders below it, received as `children`. It also receives `params` and `pathname`. `params` stays typed as strings.',
});

export const layoutSchema = message({
  ja: '`paramsSchema`：その下のすべてのページで、ページ自身のスキーマより先に実行されます。',
  en: '`paramsSchema`: runs for every page below, before the page’s own schema.',
});

export const notFoundDefault = message({
  ja: 'default export：その下でどのルートにも当たらなかったURLで表示するコンポーネントです。`params`と`pathname`を受け取ります。`params`の値は検証されていない文字列です。',
  en: 'Default export: the component rendered for a URL below the directory that no route matched. It receives `params` and `pathname`. The `params` are unvalidated strings.',
});

export const notFoundNote = message({
  ja: 'staticモードでは`404.html`として書き出されるので、アプリに1つだけ置けます。serverモードでは404のステータスで返し、ディレクトリごとに置けます。',
  en: 'In static mode, it is written as `404.html`, so an application may hold only one. In server mode, it answers with a 404 status, and each directory may hold its own.',
});

export const errorDirective = message({
  ja: "`'use client'`のファイルにします。",
  en: "A `'use client'` file.",
});

export const errorDefault = message({
  ja: 'default export：`error`と`reset`を受け取るコンポーネントです。その下でエラーが起きたとき、代わりに描画されます。`params`は受け取りません。',
  en: 'Default export: a component that receives `error` and `reset`. It renders in place of what is below it when that throws. It receives no `params`.',
});

export const loadingDefault = message({
  ja: 'default export：propsを受け取らないコンポーネントです。その下のページを待つ間、`<Suspense>`のfallbackとして描画されます。',
  en: 'Default export: a component with no props. It renders as the `<Suspense>` fallback while the page below it loads.',
});

export const redirectDefault = message({
  ja: 'default export：行き先の文字列か、`{ to, permanent }`です。`to`はルート表のパターンで書きます。`to`のパラメータには、リクエストのURLから取り出した値が入ります。',
  en: 'Default export: the target as a string, or `{ to, permanent }`. `to` is a pattern of the route table. Its parameters are filled with the matched values.',
});

export const redirectNote = message({
  ja: 'staticモードでは、行き先へ送るページとして書き出されます。serverモードでは、`GET`と`HEAD`に`307`を返し、`permanent`なら`308`を返します。',
  en: 'In static mode, it is written as a page that sends the visitor to the target. In server mode, it answers `GET` and `HEAD` with a `307`, or a `308` when `permanent`.',
});

export const routeMethods = message({
  ja: '`GET`や`POST`などのメソッド名のexport：`{ request, params }`を受け取り、`Response`を返す関数です。',
  en: 'Exports named after methods, such as `GET` and `POST`: functions that receive `{ request, params }` and return a `Response`.',
});

export const routeSchema = message({
  ja: '`paramsSchema`：ページと同じく、パラメータを検証します。',
  en: '`paramsSchema`: validates the parameters, as a page’s does.',
});

export const routeNote = message({
  ja: 'staticモードでは`GET`だけをexportでき、その応答がそのURLのファイルとして書き出されます。serverモードでは7つのメソッドのどれでもexportできます。',
  en: 'In static mode, only `GET` may be exported, and its response is written as the file at that URL. In server mode, any of the seven methods may be exported.',
});

export const guardDefault = message({
  ja: 'serverモードだけ。default export：`Guard`型の関数です。その下のURLに応答する前に実行されます。`Response`を返すとそこで応答し、何も返さなければページや`route.ts`の処理に進みます。',
  en: 'Server mode only. Default export: a function of type `Guard`. It runs before anything below the directory responds. Returning a `Response` answers the request there. Returning nothing goes on to the page or the `route.ts`.',
});

export const rootTitle = message({
  ja: 'アプリ向けのAPI',
  en: 'Application API',
});

export const rootDescription = message({
  ja: 'どれも`@k8ordo/router`のexportを、名前で再exportしています。どちらもフレームワークが描画しない`<Router>`を読むので、`useParams`と`useRoute`は含みません。ページは`params`をpropsで受け取ります。それぞれの説明は`@k8ordo/router`の',
  en: 'Each is an export of `@k8ordo/router`, re-exported by name. `useParams` and `useRoute` are not among them: they read a `<Router>` the framework never renders. A page receives `params` as a prop instead. Each one is described on the ',
});

export const rootLinkTail = message({
  ja: 'にあります。',
  en: ' page of `@k8ordo/router`.',
});

export const cookiesSummary = message({
  ja: 'serverモードだけ。リクエストのCookieを読み書きします。`guard.ts`と`route.ts`、Server Actionの中で呼びます。',
  en: 'Server mode only. Reads and writes the request’s cookies. Call it from a `guard.ts`, a `route.ts` or a Server Action.',
});

export const cookiesGet = message({
  ja: '名前で値を読みます。無ければ`undefined`です。',
  en: 'Reads a value by name. `undefined` when there is none.',
});

export const cookiesHas = message({
  ja: 'その名前のCookieがあるかどうかを返します。',
  en: 'Whether a cookie of that name exists.',
});

export const cookiesSet = message({
  ja: '値を書きます。3つ目の引数で`CookieOptions`の属性を渡します。',
  en: 'Writes a value. The third argument takes the attributes of `CookieOptions`.',
});

export const cookiesDelete = message({
  ja: 'Cookieを消します。書いたときと同じ`path`と`domain`を渡します。',
  en: 'Deletes a cookie. Pass the `path` and `domain` it was written with.',
});

export const cookiesCaveats = [
  message({
    ja: '読み取りには、同じリクエストの中で先に書いた値が反映されます。書いていない名前は、リクエストのCookieの値を返します。',
    en: 'A read reflects what was written earlier in the same request. A name not written yet returns the value the request carried.',
  }),
  message({
    ja: '書いた値は、どの応答でも`Set-Cookie`ヘッダーでブラウザに送られます。',
    en: 'Every write goes to the browser as a `Set-Cookie` on the response, whatever the response is.',
  }),
  message({
    ja: 'ページの描画の中で呼ぶと、`cookies() belongs to what answers the request`のエラーになります。ページは`request.cookies`を読みます。',
    en: 'Called while a page renders, it fails with `cookies() belongs to what answers the request`. A page reads `request.cookies` instead.',
  }),
] as const;

export const cookieOptionsSummary = message({
  ja: '`cookies().set()`の3つ目の引数で渡すCookieの属性です。既定値は、セッションのCookieに向いた値です。',
  en: 'The cookie attributes passed to `cookies().set()` as its third argument. The defaults suit a session cookie.',
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
  en: 'The lifetime in seconds. `0` expires it at once.',
});

export const cookieOptionsExpires = message({
  ja: '期限を`Date`で渡します。',
  en: 'The expiry, as a `Date`.',
});

export const cookieOptionsHttpOnly = message({
  ja: '既定は`true`で、ページのスクリプトからは読めません。',
  en: '`true` by default, so a page’s script cannot read it.',
});

export const cookieOptionsSecure = message({
  ja: '既定は`true`で、HTTPSでしか送られません。`localhost`と`127.0.0.1`、`[::1]`へのHTTPのリクエストでは、既定が`false`になります。',
  en: '`true` by default, so it is sent over HTTPS only. For an HTTP request to `localhost`, `127.0.0.1` or `[::1]`, the default is `false`.',
});

export const cookieOptionsSameSite = message({
  ja: "既定は`'lax'`です。`'none'`は常に`secure`で、既定でもそうなります。`secure: false`と一緒に渡すとエラーになります。",
  en: "`'lax'` by default. `'none'` is always `secure`, by default too. Passing it with `secure: false` is an error.",
});

export const responseHeadersSummary = message({
  ja: 'serverモードだけ。最終的な応答が持つ`Headers`を返します。`guard.ts`と`route.ts`、Server Actionの中で呼びます。',
  en: 'Server mode only. Returns the `Headers` the final response will carry. Call it from a `guard.ts`, a `route.ts` or a Server Action.',
});

export const responseHeadersCaveats = [
  message({
    ja: 'ここに書いたヘッダーは、ページのHTMLとRSCのペイロード、`guard.ts`が返した`Response`のどれにも付きます。応答がすでに持っているヘッダーは置き換えます。',
    en: 'A header set here goes on the response, whether that is a page’s HTML, its RSC payload or a `Response` a `guard.ts` returned. A header the response already carries is replaced.',
  }),
  message({
    ja: 'リクエストの外で呼ぶと`responseHeaders() needs a request`、ページの描画の中で呼ぶと`responseHeaders() belongs to what answers the request`のエラーになります。',
    en: 'Outside a request it fails with `responseHeaders() needs a request`, and inside a page render with `responseHeaders() belongs to what answers the request`.',
  }),
] as const;

export const requestHeadersSummary = message({
  ja: 'serverモードだけ。リクエストのヘッダーを返します。`guard.ts`と`route.ts`、Server Actionの中で呼びます。引数しか受け取らないServer Actionで、ヘッダーを読むのに使います。',
  en: 'Server mode only. Returns the headers the request arrived with. Call it from a `guard.ts`, a `route.ts` or a Server Action. It is how a Server Action, which receives only its arguments, reads the headers.',
});

export const requestHeadersCaveats = [
  message({
    ja: 'リクエストの外で呼ぶと`requestHeaders() needs a request`、ページの描画の中で呼ぶと`requestHeaders() belongs to what answers the request`のエラーになります。',
    en: 'Outside a request it fails with `requestHeaders() needs a request`, and inside a page render with `requestHeaders() belongs to what answers the request`.',
  }),
] as const;

export const redirectSummary = message({
  ja: 'serverモードだけ。Server Actionを終え、別のURLへリダイレクトします。',
  en: 'Server mode only. Ends a Server Action and redirects to another URL.',
});

export const redirectTo = message({
  ja: '行き先のURLです。書いたまま送られるので、`href()`で作ります。',
  en: 'The target URL. It is sent as written, so build it with `href()`.',
});

export const redirectReturns = message({
  ja: '値を返しません。呼んだ行より後は実行されません。',
  en: 'Never returns. The lines after it never run.',
});

export const redirectCaveats = [
  message({
    ja: '内部で例外を使って処理を終えるので、`try`の中では呼びません。',
    en: 'It ends the action by throwing, so do not call it inside a `try`.',
  }),
  message({
    ja: 'JavaScriptが読み込まれる前に送られたフォームには`303`を返します。クライアントのランタイムからの呼び出しには、ルーターに行き先を伝えるペイロードを返します。',
    en: 'A form posted before JavaScript loaded gets a `303`. A call from the client runtime gets a payload that tells the router where to go.',
  }),
] as const;

export const nonceSummary = message({
  ja: 'serverモードだけ。この応答のインラインスクリプトに付けるnonceを返します。リクエストごとに新しい値です。',
  en: 'Server mode only. Returns the nonce this response’s inline scripts carry. It is new for every request.',
});

export const nonceCaveats = [
  message({
    ja: 'リクエストを処理している間なら、描画の中でも同じ値を返します。',
    en: 'While the request is being handled, the render included, it returns the same value.',
  }),
  message({
    ja: 'リクエストの外で呼ぶと、`nonce() needs a request`のエラーになります。',
    en: 'Outside a request it fails with `nonce() needs a request`.',
  }),
] as const;

export const guardSummary = message({
  ja: 'serverモードだけ。`guard.ts`がdefault exportする関数の型です。そのディレクトリのパターンを型引数に渡します。',
  en: 'Server mode only. The type of what a `guard.ts` default-exports. Pass its directory’s pattern as the type argument.',
});

export const guardRequest = message({
  ja: '受け取ったままの`Request`です。',
  en: 'The `Request` as it arrived.',
});

export const guardParams = message({
  ja: 'そのディレクトリのパターンのパラメータです。`guard.ts`はスキーマより前に実行されるので、URLの文字列のままです。',
  en: 'The parameters of the directory’s pattern. A `guard.ts` runs before any schema, so they are the URL’s strings.',
});

export const routeRequestSummary = message({
  ja: 'serverモードだけ。ページとレイアウト、`not-found.tsx`が受け取る`request`の型です。どちらのフィールドも読むだけです。',
  en: 'Server mode only. The type of the `request` a page, a layout and a `not-found.tsx` receive. Both fields are read-only.',
});

export const routeRequestHeaders = message({
  ja: 'リクエストのヘッダーです。',
  en: 'The request’s headers.',
});

export const routeRequestCookies = message({
  ja: '`Cookie`ヘッダーを名前ごとに読み取ったMapです。同じ名前が2回あれば、最初の値を使います。',
  en: 'The `Cookie` header parsed by name. When a name appears twice, the first value is used.',
});

export const redirectTargetSummary = message({
  ja: '`redirect.ts`がdefault exportする値の型です。`satisfies RedirectTarget`と書くと、書いたその場で形を検査できます。型だけのimportなので、staticモードでも使えます。',
  en: 'The type of what a `redirect.ts` default-exports. Write `satisfies RedirectTarget` to check the shape where it is written. It is a type-only import, so static mode may use it too.',
});

export const serveSummary = message({
  ja: 'serverモードだけ。ビルドをNode.jsのHTTPサーバーで動かします。待ち受けを始めると、URLと止める関数を返します。',
  en: 'Server mode only. Runs the build on a Node.js HTTP server. Once it is listening, it returns its URL and a function to stop it.',
});

export const serveDist = message({
  ja: 'ビルドの出力ディレクトリです。既定は`dist`で、今の作業ディレクトリから解決します。',
  en: 'The build output directory. `dist` by default, resolved from the working directory.',
});

export const servePort = message({
  ja: '待ち受けるポートです。既定は`3000`で、`0`を渡すと空いているポートをシステムが選びます。',
  en: 'The port to listen on. `3000` by default. `0` lets the system pick a free one.',
});

export const serveHost = message({
  ja: '待ち受けるホストです。既定の`localhost`には同じマシンからしか接続できないので、コンテナの中などでは`0.0.0.0`を渡します。',
  en: 'The host to listen on. The default, `localhost`, is reachable from the same machine only, so pass `0.0.0.0` inside a container.',
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
  en: 'Its URL, in the form `http://<host>:<port>`.',
});

export const serveClose = message({
  ja: 'サーバーを止めます。止まると解決するPromiseを返します。',
  en: 'Stops the server. The promise resolves once it has stopped.',
});

export const serveCaveats = [
  message({
    ja: '自前のサーバーから呼ぶときは、`@k8ordo/framework`を`dependencies`に入れ、実行時にもインストールします。ビルドが書く`dist/server.js`は、この関数をバンドル済みで持っています。',
    en: 'To call it from a server of your own, put `@k8ordo/framework` in `dependencies` and install it for run time as well. The `dist/server.js` the build writes has it bundled in.',
  }),
  message({
    ja: '`GET`と`HEAD`のうち、`dist/client/`の中のファイルを指すものにはそのファイルを返します。それ以外はハンドラに渡します。',
    en: 'A `GET` or `HEAD` that names a file in `dist/client/` gets that file. Everything else goes to the handler.',
  }),
  message({
    ja: 'ハンドラでエラーが起きたときは、`500`と本文`internal error`だけを返し、内容はサーバーのログに出します。',
    en: 'When the handler throws, it responds with a `500` and the body `internal error` and logs what was thrown.',
  }),
] as const;

export const vercelSummary = message({
  ja: 'serverモードだけ。`vite build`に、VercelのBuild Output API（v3）の形で`.vercel/output/`も書かせるプラグインです。`framework()`の隣に置きます。',
  en: 'Server mode only. A plugin that has `vite build` also write `.vercel/output/` in the shape of Vercel’s Build Output API (v3). Put it beside `framework()`.',
});

export const vercelReturns = message({
  ja: 'Viteのプラグイン。',
  en: 'A Vite plugin.',
});

export const vercelCaveats = [
  message({
    ja: '関数になるのは、依存をすべてバンドルしたハンドラです。`resolve.external`でバンドルから外した依存は関数に入らないので、Vercelでは動きません。',
    en: 'The function is the handler, with every dependency bundled in. A dependency left out with `resolve.external` is not in the function, and does not work on Vercel.',
  }),
  message({
    ja: "`mode: 'static'`と組み合わせると、設定を読み込んだ時点でエラーになります。staticモードのビルドは`dist/client/`なので、Vercelにはファイルのままデプロイします。",
    en: "Beside `mode: 'static'` it fails the build when the config loads. A static build is `dist/client/`, which Vercel serves as files.",
  }),
] as const;
