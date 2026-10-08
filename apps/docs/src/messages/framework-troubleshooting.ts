import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'よくある症状の原因と直し方です。エラー文で探すときは、ページの中を検索してください。',
  en: 'Common symptoms, their causes and their fixes. To look up an error, search this page for its wording.',
});

export const causeLabel = message({
  ja: '原因',
  en: 'Cause',
});

export const fixLabel = message({
  ja: '直し方',
  en: 'Fix',
});

export const wantsServerTitle = message({
  ja: "`this application wants mode: 'server'`",
  en: "`this application wants mode: 'server'`",
});

export const wantsServerCause = message({
  ja: 'staticモードで、リクエストが要るものを使っています。エラーの1行目は拒んだものの種類を示し、その下の行がファイルを挙げます。',
  en: 'Under static mode, the application uses something that needs a request. The first line of the error says what kind, and the lines below name the files.',
});

export const wantsServerFix = message({
  ja: "それが必要なら、`framework()`の`mode`を`'server'`に変えます。`paths`、`site`、`csp`はstaticモードだけのオプションなので外します。CSPは`guard.ts`で`nonce()`を使ってヘッダーに書きます。型だけを使っているなら、`import type`に書き換えます。staticモードのままで通ります。要らないなら、そのコードを消します。検索や絞り込みのようなGETのフォームなら、Server Actionは要りません。",
  en: "If the application needs it, change the `mode` of `framework()` to `'server'`. Remove `paths`, `site` and `csp`, which only static mode accepts. Under server mode, write the CSP as a header in `guard.ts`, using `nonce()`. If only types are used, change the import to `import type`, which static mode lets through. If the application does not need it, remove that code. A GET form, such as a search or a filter, needs no Server Action.",
});

export const pathsTitle = message({
  ja: '`static build needs pathnames for …`',
  en: '`static build needs pathnames for …`',
});

export const pathsCause = message({
  ja: 'staticモードで、パラメータを持つルートに当てはまるURLが`paths`に1つもありません。ビルドはパラメータの値を自分では決められません。',
  en: 'Under static mode, no URL in `paths` fits a route with parameters. A build cannot choose the values itself.',
});

export const pathsFix = message({
  ja: '`framework()`の`paths`で、そのルートのURLを並べます。',
  en: 'List that route’s URLs with the `paths` option of `framework()`.',
});

export const unusedTitle = message({
  ja: '`the "paths" option supplied pathnames no route wants`',
  en: '`the "paths" option supplied pathnames no route wants`',
});

export const unusedCause = message({
  ja: 'staticモードで、`paths`が返したURLのどれかがどのルートにも当たりません。多くはURLの打ち間違いです。パラメータを埋め残した値（`/ja/blog/:slug`のような）も同じエラーになります。',
  en: 'Under static mode, a URL that `paths` returned matches no route. Most often it is a typo. A value with a parameter left unfilled, such as `/ja/blog/:slug`, gets the same error.',
});

export const unusedFix = message({
  ja: 'エラーの後ろに並んだURLを直すか、`paths`から外します。',
  en: 'Fix the URLs the error lists, or drop them from `paths`.',
});

export const renderTitle = message({
  ja: '`static build could not render …`',
  en: '`static build could not render …`',
});

export const renderCause = message({
  ja: 'staticモードのビルドで、そのページの描画中にServer Componentがエラーになりました。上にSuspenseの境界が無いClient Componentがエラーになったときも、ビルドは同じエラー文で止まります。',
  en: 'Under static mode, a Server Component threw while the build rendered the page. When a Client Component with no Suspense boundary above it throws, the build stops with the same message.',
});

export const renderFix = message({
  ja: '元のエラーは、このエラー文より上にページのURLと一緒に出力されています。それを手がかりに直します。',
  en: 'The original error is logged above this message, beside the page’s URL. Start from there.',
});

export const devTitle = message({
  ja: '`vite dev`と`vite preview`でだけ表示できるページ',
  en: 'Pages that render only in `vite dev` and `vite preview`',
});

export const devCause = message({
  ja: 'staticモードでも、`vite dev`はファイルを書かずにリクエストのたびにページを描画します。`paths`に無い値のページも描画します。Server Componentがエラーになっても、`500`を返して動き続けます。ビルドのあとの`vite preview`も、`dist/client/`にファイルとして無いURLには同じハンドラで答えるので、同じように動きます。',
  en: 'Under static mode too, `vite dev` writes no files and renders each page per request. It renders values `paths` does not list. When a Server Component throws, it responds with a `500` and keeps running. `vite preview` after a build behaves the same way: any URL that is not a file in `dist/client/` is answered by the same handler.',
});

export const devFix = message({
  ja: '公開する前に`vite build`を通し、止まったときのエラー文に従って直します。書き出したサイトは、`dist/client/`を静的なファイルサーバーで配って確かめます。',
  en: 'Run `vite build` before you ship, and follow the message it stops with. To check the site it wrote, serve `dist/client/` with a static file server.',
});

export const statusTitle = message({
  ja: '`200`で返る`404.html`',
  en: '`404.html` served with a `200`',
});

export const statusCause = message({
  ja: 'staticモードでは、`404.html`に付くステータスをホスティングが決めます。ビルドが書けるのはページまでで、応答のステータスは書けません。',
  en: 'Under static mode, the status that goes with `404.html` is the host’s to decide. A build can write the page, but not the response.',
});

export const statusFix = message({
  ja: 'ホスティングの設定で、存在しないURLに`404.html`を`404`のステータスで返すようにします。',
  en: 'Configure the host to serve `404.html` with a `404` status for unknown URLs.',
});

export const cspTitle = message({
  ja: '`the "csp" option cannot go into a page\'s <meta> as it is`',
  en: '`the "csp" option cannot go into a page\'s <meta> as it is`',
});

export const cspCause = message({
  ja: "staticモードの`csp`オプションに、`<meta>`では効かないディレクティブか`'strict-dynamic'`などが入っています。`<meta>`で効かないのは`frame-ancestors`、`report-uri`、`sandbox`の3つです。1つのエントリに複数のソースを空白区切りで書いた場合も、同じエラーになります。",
  en: "Under static mode, the `csp` option holds something a `<meta>` cannot carry, such as a directive a `<meta>` ignores or `'strict-dynamic'`. The directives a `<meta>` ignores are `frame-ancestors`, `report-uri` and `sandbox`. An entry with several sources separated by spaces gets the same error.",
});

export const cspFix = message({
  ja: "`<meta>`で効かないディレクティブは、ホスティングのヘッダーで設定します。`'strict-dynamic'`は外します。フレームワークのモジュールのスクリプトは、`'self'`で許可されます。ソースは1つずつ配列の要素にします。",
  en: "Set the directives a `<meta>` ignores as headers at the host. Drop `'strict-dynamic'`: the framework’s module script is allowed by `'self'`. Give each source its own array entry.",
});

export const forbiddenTitle = message({
  ja: '`403`になるServer Actionの送信',
  en: 'Server Action submissions answered with a `403`',
});

export const forbiddenCause = message({
  ja: 'serverモードで、ハンドラが受け付ける`POST`は、`Origin`ヘッダーのホストがリクエストのURLのホストと一致するものだけです。前に置いたプロキシが`Host`を書き換えていると、この2つが一致しません。',
  en: 'Under server mode, the handler accepts a `POST` only when its `Origin` header names the host of the request’s URL. A proxy in front that rewrites `Host` makes the two disagree.',
});

export const forbiddenFix = message({
  ja: 'プロキシで、元の`Host`をそのまま渡します。ハンドラを自分で呼ぶ場合は、訪問者がアクセスしたURLで`Request`を作ります。',
  en: 'Have the proxy pass the original `Host` on unchanged. If you call the handler yourself, build the `Request` from the URL the visitor requested.',
});

export const redirectTitle = message({
  ja: '`redirect()`のあとも移らないページ',
  en: 'No redirect after `redirect()`',
});

export const redirectCause = message({
  ja: 'serverモードで、`redirect()`は例外を使って処理を終えます。`try`の中で呼ぶと、`catch`がその例外を受け取ります。',
  en: 'Under server mode, `redirect()` ends by throwing. Called inside a `try`, the `catch` receives that exception.',
});

export const redirectFix = message({
  ja: '`redirect()`は`try`の外で呼びます。',
  en: 'Call `redirect()` outside the `try`.',
});

export const renderApiTitle = message({
  ja: '`… belongs to what answers the request, and a page is a render`',
  en: '`… belongs to what answers the request, and a page is a render`',
});

export const renderApiCause = message({
  ja: 'serverモードで、ページの描画の中から`cookies()`や`responseHeaders()`、`requestHeaders()`を呼んでいます。これらはリクエストに応答する処理のためのAPIで、ページの描画からは呼べません。',
  en: 'Under server mode, a page calls `cookies()`, `responseHeaders()` or `requestHeaders()` while it renders. These belong to the code that answers the request, not to a render.',
});

export const renderApiFix = message({
  ja: 'リクエストのヘッダーやCookieを読むなら、ページが受け取る`request`を使います。書くなら、`guard.ts`かServer Actionに移します。',
  en: 'To read the request’s headers or cookies, use the `request` the page receives. To write, move the code into a `guard.ts` or a Server Action.',
});

export const internalTitle = message({
  ja: '`internal error`とだけ表示されるページ',
  en: 'A page that shows only `internal error`',
});

export const internalCause = message({
  ja: 'serverモードで、ハンドラが応答を作れず、`serve()`が`500`を返しています。上にSuspenseの境界が無い場所でServer Componentがエラーになると、こうなります。',
  en: 'Under server mode, the handler could not produce a response, and `serve()` responded with a `500`. A Server Component that throws with no Suspense boundary above it leads here.',
});

export const internalFix = message({
  ja: 'エラーの内容は、サーバーのログに`k8ordo: GET /products/1 failed`のような行で出ています。訪問者に自前のエラー画面を見せるなら、`error.tsx`を置きます。',
  en: 'What was thrown is in the server’s log, on a line such as `k8ordo: GET /products/1 failed`. If the visitor should see a page of your own, add an `error.tsx`.',
});

export const insecureTitle = message({
  ja: 'HTTPで保存されないCookie',
  en: 'Cookies not kept over HTTP',
});

export const insecureCause = message({
  ja: 'serverモードの`cookies().set()`では、`secure`の既定が`true`です。ブラウザは、HTTPSでないHTTPで受け取った`Secure`のCookieを保存しません。既定が`false`になるのは、HTTPで`localhost`か`127.0.0.1`、`[::1]`に来たリクエストだけです。',
  en: 'Under server mode, `secure` defaults to `true` in `cookies().set()`. A browser does not keep a `Secure` cookie that arrived over HTTP without TLS. The default is `false` only for HTTP requests to `localhost`, `127.0.0.1` or `[::1]`.',
});

export const insecureFix = message({
  ja: '本番はHTTPSで配信します。それ以外の場所をHTTPで動かすなら、`set`に`secure: false`を渡します。',
  en: 'Serve production over HTTPS. Anywhere else you run over HTTP, pass `secure: false` to `set`.',
});

export const sameSiteTitle = message({
  ja: '`a cookie with sameSite "none" has to be secure`',
  en: '`a cookie with sameSite "none" has to be secure`',
});

export const sameSiteCause = message({
  ja: "serverモードで、`sameSite: 'none'`のCookieに`secure: false`を渡しています。ブラウザは`Secure`の無い`SameSite=None`を捨てるので、`cookies().set()`がその場でエラーにします。",
  en: "Under server mode, a cookie with `sameSite: 'none'` was given `secure: false`. A browser drops `SameSite=None` without `Secure`, so `cookies().set()` throws on the spot.",
});

export const sameSiteFix = message({
  ja: "`sameSite: 'none'`のCookieは`secure`のままにして、HTTPSで配信します。",
  en: "Leave a `sameSite: 'none'` cookie `secure`, and serve over HTTPS.",
});

export const hydrationTitle = message({
  ja: '本番でだけ出るハイドレーションのエラー',
  en: 'Hydration errors only in production',
});

export const hydrationCause = message({
  ja: 'ルートレイアウトが描画した文書は、まるごとハイドレーションの対象です。CDNの機能でHTMLが書き換えられると、Reactが描画する内容とHTMLが食い違います。Webフォントの埋め込み、メールアドレスの難読化、スクリプトの遅延読み込みがその例です。',
  en: 'The whole document the root layout renders is hydrated. When a CDN feature rewrites the HTML, it no longer matches what React renders. Web-font inlining, email obfuscation and script deferral are such features.',
});

export const hydrationFix = message({
  ja: 'CDNのその機能を切ります。フォントやスクリプトをサイトと同じオリジンから配信すると、CDNが書き換えるものが無くなります。',
  en: 'Turn that feature off. Serving fonts and scripts from your site’s own origin leaves the CDN nothing to rewrite.',
});

export const typesTitle = message({
  ja: '型の付かない`href()`と`params`',
  en: 'Untyped `href()` and `params`',
});

export const typesCause = message({
  ja: '`tsconfig.json`の`include`に`.k8ordo/`が含まれていません。`.k8ordo`はドットで始まるので、`".k8ordo"`とディレクトリ名だけを書いても読み込まれません。型はclone直後と同じになります。',
  en: 'The `include` in `tsconfig.json` does not cover `.k8ordo/`. The name starts with a dot, so an entry that names only the directory, `".k8ordo"`, does not pick it up. The types then look as they do right after a clone.',
});

export const typesFix = message({
  ja: '`include`に`.k8ordo/**/*.ts`のようにグロブで書きます。',
  en: 'List it with a glob: `.k8ordo/**/*.ts`.',
});

export const freshTitle = message({
  ja: 'clone直後の`PageProps`の型',
  en: '`PageProps` types after a clone',
});

export const freshCause = message({
  ja: "`.k8ordo/`は生成物でgitに入らないので、cloneした直後にはまだありません。ルート表が無いあいだ、`PageProps`の`params`は文字列の型になります。`mode: 'server'`では`request`と`search`も型から消え、`Property 'request' does not exist`のエラーになります。",
  en: "`.k8ordo/` is generated and not in git, so a fresh clone does not have it yet. Without the route table, `params` in `PageProps` is typed as strings. Under `mode: 'server'`, `request` and `search` drop out of it too, and `tsc` reports `Property 'request' does not exist`.",
});

export const freshFix = message({
  ja: '`tsc`の前に`vite dev`か`vite build`を一度実行して、`.k8ordo/`を生成します。',
  en: 'Run `vite dev` or `vite build` once before `tsc`, so `.k8ordo/` is generated.',
});

export const grammarTitle = message({
  ja: '`routes/ holds only page.tsx, …`',
  en: '`routes/ holds only page.tsx, …`',
});

export const grammarCause = message({
  ja: '`routes/`の中に、`page.tsx`や`layout.tsx`のようなルートのファイルでないものがあります。拡張子だけが違う`page.ts`も同じです。',
  en: 'A file under `routes/` is not a route file such as `page.tsx` or `layout.tsx`. `page.ts`, with the wrong extension, counts too.',
});

export const grammarFix = message({
  ja: '部品やデータは、`_parts/`のように`_`で始まるディレクトリへ移します。ページなら拡張子を`.tsx`にします。',
  en: 'Move components and data under a directory whose name starts with `_`, such as `_parts/`. For a page, use the `.tsx` extension.',
});

export const syncTitle = message({
  ja: '`a params schema must validate synchronously`',
  en: '`a params schema must validate synchronously`',
});

export const syncCause = message({
  ja: '`paramsSchema`が非同期に検証しています。URLに当たるルートは描画の前に決まるので、スキーマの結果を待てません。',
  en: 'The `paramsSchema` validates asynchronously. The route that matches a URL is decided before anything renders, so the result cannot be awaited.',
});

export const syncFix = message({
  ja: 'スキーマには値の形の検証だけを書きます。データがあるかどうかはページで確かめ、無ければ`notFound()`を呼びます。',
  en: 'Keep the schema to the shape of the value. Check whether the data exists in the page, and call `notFound()` when it does not.',
});

export const serverOnlyTitle = message({
  ja: "`'server-only' cannot be imported in client build`",
  en: "`'server-only' cannot be imported in client build`",
});

export const serverOnlyCause = message({
  ja: '`server-only`をimportしたモジュールが、Client Componentから読まれています。エラーの2行目から下が、そこに至ったimportの連鎖です。',
  en: 'A module that imports `server-only` is reached from a Client Component. The lines below the first are the chain of imports that got it there.',
});

export const serverOnlyFix = message({
  ja: 'Client Componentからは直接importせず、Server Componentで読んだ値をpropsで渡します。',
  en: 'Do not import it from the Client Component. Import it in a Server Component instead, and pass what it gives you down as props.',
});

export const functionsTitle = message({
  ja: '`Functions cannot be passed directly to Client Components`',
  en: '`Functions cannot be passed directly to Client Components`',
});

export const functionsCause = message({
  ja: 'Server ComponentからClient Componentへ、関数をpropsで渡しています。propsはシリアライズして送るので、関数は渡せません。',
  en: 'A Server Component passes a function to a Client Component as a prop. Props are serialized on the way, and a function cannot be.',
});

export const functionsFix = message({
  ja: '関数を呼んだ結果の値を渡すか、関数をClient Componentの側へ移します。',
  en: 'Pass the value the function returns, or move the function into the Client Component.',
});

export const routeHookTitle = message({
  ja: '`useRoute must render inside a matched <Router>`',
  en: '`useRoute must render inside a matched <Router>`',
});

export const routeHookCause = message({
  ja: '`@k8ordo/router`から`useRoute()`か`useParams()`をimportしています。このフレームワークではブラウザがルート表を持たないので、2つのフックには読むルートがありません。',
  en: '`useRoute()` or `useParams()` is imported from `@k8ordo/router`. Under this framework the browser holds no route table, so the two hooks have no route to read.',
});

export const routeHookFix = message({
  ja: 'ページが受け取った`params`を、propsでClient Componentに渡します。Client Componentの中では、`useMatch()`にパターンを渡しても読めます。',
  en: 'Pass the `params` the page received down to the Client Component as props. Inside the Client Component, `useMatch()` given the pattern reads them too.',
});
