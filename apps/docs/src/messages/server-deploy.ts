import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`vite build`は、リクエストハンドラとブラウザに配るファイルを`dist/`に書き出します。Node.jsでは`serve()`がそれを動かし、ほかのランタイムやVercelでは、ハンドラを直接渡して動かします。',
  en: '`vite build` writes the request handler and the files the browser is served into `dist/`. On Node.js `serve()` runs them; other runtimes and Vercel are handed the handler itself.',
});

export const outputTitle = message({
  ja: 'ビルドが書き出すもの',
  en: 'What the build writes',
});

export const outputDescription = message({
  ja: 'このモードではページを前もって描かないので、`dist/client/`にページのHTMLはありません。代わりに、リクエストのたびにページを描くハンドラが書かれます。',
  en: 'Nothing is rendered ahead of time in this mode, so there is no page HTML in `dist/client/`. A handler that renders pages per request is written instead.',
});

export const outputList = [
  message({
    ja: '`dist/rsc/index.js`：リクエストハンドラです。',
    en: '`dist/rsc/index.js`: the request handler.',
  }),
  message({
    ja: '`dist/ssr/`：ハンドラがペイロードをHTMLにするときに使います。',
    en: '`dist/ssr/`: what the handler turns payloads into HTML with.',
  }),
  message({
    ja: '`dist/client/`：ブラウザに配るファイルです。圧縮の効く種類のファイルには、Brotliとgzipで圧縮したコピー（`.br`と`.gz`）が隣に置かれます。',
    en: '`dist/client/`: the files the browser is served. Each one whose type compresses gets a Brotli and a gzip copy beside it, `.br` and `.gz`.',
  }),
] as const;

export const outputDeps = message({
  ja: 'ハンドラは、アプリの依存を実行時に`node_modules`から読み込みます。サーバーを動かす場所にも依存をインストールしておきます。`vite`はビルドにしか使わないので、`pnpm install --prod`のように開発時の依存を省いても動きます。',
  en: 'The handler imports the application’s dependencies from `node_modules` at run time, so install them where the server runs. `vite` is only for the build, so an install without development dependencies, such as `pnpm install --prod`, is enough.',
});

export const serveTitle = message({
  ja: '`serve()`で動かす',
  en: 'Run it with `serve()`',
});

export const serveDescription = message({
  ja: '`@k8ordo/server/serve`の`serve()`は、ビルドをNode.jsのHTTPサーバーで動かします。待ち受けを始めると、待ち受けている場所と止め方を返します。',
  en: '`serve()` from `@k8ordo/server/serve` runs the build on a Node.js HTTP server. Once it is listening, it returns where it listens and how to stop it.',
});

export const serveOptions = [
  message({
    ja: '`dist`：ビルドの出力ディレクトリです。既定は`dist`で、今の作業ディレクトリから解決します。',
    en: '`dist`: the build output directory; `dist` by default, resolved from the working directory.',
  }),
  message({
    ja: '`port`：待ち受けるポートです。既定は`3000`で、`0`を渡すと空いているポートをシステムが選びます。',
    en: '`port`: the port to listen on; `3000` by default. `0` lets the system pick a free one.',
  }),
  message({
    ja: '`host`：待ち受けるホストです。既定の`localhost`には同じマシンからしか届かないので、コンテナの中などでは`0.0.0.0`を渡します。',
    en: '`host`: the host to listen on. The default, `localhost`, is reachable from the same machine only; inside a container and the like, pass `0.0.0.0`.',
  }),
] as const;

export const serveTest = message({
  ja: '返り値の`port`と`url`、`close()`を使えば、テストからビルドに対してサーバーを立て、終わったら止められます。',
  en: 'With the returned `port`, `url` and `close()`, a test can start a server against the build and stop it when done.',
});

export const answersTitle = message({
  ja: '`serve()`の答え方',
  en: 'How `serve()` answers',
});

export const answersDescription = message({
  ja: '`GET`と`HEAD`のうち、`dist/client/`の中のファイルを指すリクエストには、そのファイルを返します。それ以外のリクエストは、すべてハンドラに渡します。',
  en: 'A `GET` or `HEAD` naming a file in `dist/client/` is answered with that file. Every other request goes to the handler.',
});

export const answersList = [
  message({
    ja: 'キャッシュ：`/assets/`の下はファイル名に中身のハッシュが入っているので、`immutable`を付けて1年キャッシュさせます。それ以外のファイルは`no-cache`です。',
    en: 'Caching: files under `/assets/` carry their contents’ hash in their names, so they go out `immutable`, cached for a year. Anything else is `no-cache`.',
  }),
  message({
    ja: '圧縮：圧縮したコピーがあるファイルは、`Accept-Encoding`が選ぶほうを返します。ページとペイロードは、描いたそばから圧縮して流します。',
    en: 'Compression: a file with compressed copies is sent in the one `Accept-Encoding` prefers. Pages and payloads are compressed as they stream.',
  }),
  message({
    ja: '再検証：ファイルには中身から作った`ETag`が付くので、同じソースから別々にビルドしたサーバーでも、再検証は`304`で終わります。',
    en: 'Revalidation: a file’s `ETag` comes from its contents, so a revalidation ends in a `304` even against another server built from the same source.',
  }),
  message({
    ja: '範囲：1つの範囲を求める`Range`には`206`で答えます。Safariが`<video>`を再生するのに必要です。',
    en: 'Ranges: a `Range` asking for one span gets a `206`, which Safari needs before it plays a `<video>`.',
  }),
  message({
    ja: '失敗：ハンドラが例外を投げたときは、`500`と本文`internal error`だけを返します。投げられた内容は、訪問者ではなくサーバーのログに出ます。',
    en: 'Failure: when the handler throws, the answer is a `500` with the body `internal error`. What was thrown goes to the server’s log, not to the visitor.',
  }),
] as const;

export const answersSafe = message({
  ja: 'リクエストのパスは、どう綴られていても`dist/client/`の外のファイルを指せません。`..`や`%2e%2e`を使った綴りも中に留まります。',
  en: 'A request path can never name a file outside `dist/client/`, however it is spelled: spellings with `..` or `%2e%2e` stay inside.',
});

export const handlerTitle = message({
  ja: 'ほかのランタイムで動かす',
  en: 'Run it on another runtime',
});

export const handlerDescription = message({
  ja: '`serve()`は、ビルドを動かすホストの1つにすぎません。アプリそのものはリクエストハンドラで、`dist/rsc/index.js`が`(request: Request) => Promise<Response>`の関数をdefault exportしています。',
  en: '`serve()` is only one host for the build. The application itself is the request handler: `dist/rsc/index.js` default-exports a function, `(request: Request) => Promise<Response>`.',
});

export const handlerRuntime = message({
  ja: 'Webの`Request`と`Response`、ストリームのほかに、ハンドラが実行環境から借りるのは`node:async_hooks`の`AsyncLocalStorage`だけです。Node.jsとBun、Deno、`nodejs_compat`を付けたCloudflare Workersなら、importしたハンドラをそのまま渡せます。',
  en: 'Beyond the web’s `Request`, `Response` and streams, the only thing the handler takes from its runtime is `AsyncLocalStorage` from `node:async_hooks`. Node.js, Bun, Deno, and Cloudflare Workers with `nodejs_compat` all take the imported handler as it is.',
});

export const handlerFiles = message({
  ja: 'ハンドラはファイルを配りません。ハンドラの前で`dist/client/`を配り、どのファイルにも当たらないリクエストだけをハンドラに渡します。Workersでは、static assetsにクライアントのビルドを指定します。',
  en: 'The handler serves no files. Serve `dist/client/` in front of it, and hand it only the requests that name no file. On Workers, point static assets at the client build.',
});

export const handlerTogether = message({
  ja: 'ハンドラは隣の`dist/ssr/`を読み込むので、2つは一緒に置きます。アプリの依存は名前でimportするので、動かす場所で解決できるようにするか、Wranglerのようにバンドルに含めます。',
  en: 'The handler loads `dist/ssr/` from beside itself, so the two travel together. It imports the application’s dependencies by name, so they must resolve where it runs, or be bundled in, as Wrangler does.',
});

export const handlerNode = message({
  ja: 'どのランタイムでも動くのは、ハンドラが動かすコードもNode.jsにしか無いものをimportしない間だけです。`node:fs`を読む`route.ts`やServer Actionを書くと、アプリはそれを持つランタイムに縛られます。',
  en: 'It runs anywhere only while the code the handler runs imports nothing that needs Node.js either. A `route.ts` or a Server Action that reads `node:fs` ties the application to a runtime that has it.',
});

export const proxyTitle = message({
  ja: 'プロキシの後ろに置く',
  en: 'Run it behind a proxy',
});

export const proxyDescription = message({
  ja: 'ハンドラは、`POST`の`Origin`ヘッダーのホストが、答えているURLのホストと一致するときだけ受け付けます。それ以外の`POST`には`403`で答えるので、`Request`は訪問者が求めたURLで作ります。',
  en: 'The handler accepts a `POST` only when its `Origin` header names the host of the URL it is answering, and answers any other with a `403`. So the `Request` has to carry the URL the visitor asked for.',
});

export const proxyServe = message({
  ja: '`serve()`はリクエストの`Host`ヘッダーからURLを作り、転送用のヘッダーは読みません。前に置くプロキシは、元の`Host`を書き換えずに渡してください。ホストを自分で名乗るリクエスト行（`GET http://…`）や、ホストとして読めない`Host`には`400`で答えます。',
  en: '`serve()` builds the URL from the request’s `Host` header and reads no forwarded header, so a proxy in front of it has to pass the original `Host` on unchanged. A request line naming a host of its own (`GET http://…`), or a `Host` that is not a host, gets a `400`.',
});

export const proxyBuild = message({
  ja: 'パスからURLを自分で作るホストは、`new URL(path, origin)`で解決せず、originの後ろに文字列としてつなぎます。解決すると、`//evil.test/`で始まるパスが`evil.test`のURLになり、別のサイトのフォームがこの検査を通ってしまいます。',
  en: 'A host that builds the URL from a path itself appends the path to the origin as text rather than resolving it with `new URL(path, origin)`. Resolved, a path starting `//evil.test/` becomes a URL on `evil.test`, and a form there would pass the check.',
});

export const vercelTitle = message({
  ja: 'Vercelにデプロイする',
  en: 'Deploy to Vercel',
});

export const vercelDescription = message({
  ja: '`@k8ordo/server/vercel`の`vercel()`を`framework()`の隣に足すと、`vite build`はVercelのBuild Output API（v3）の形で`.vercel/output/`も書きます。`vercel deploy --prebuilt`で、それをそのままデプロイできます。',
  en: 'Add `vercel()` from `@k8ordo/server/vercel` beside `framework()`, and `vite build` also writes `.vercel/output/` in the shape of Vercel’s Build Output API (v3), which `vercel deploy --prebuilt` deploys as it is.',
});

export const vercelOutput = message({
  ja: 'クライアントのビルドはVercelのCDNに置く静的ファイルになり、どのファイルにも当たらないリクエストはNode.jsの関数1つが受けます。その関数の中身が、リクエストハンドラです。`serve()`のために圧縮したコピーは入れません。Vercelが自分で圧縮するからです。',
  en: 'The client build becomes static files on Vercel’s CDN, and every request that names no file goes to one Node.js function — the request handler. The copies compressed for `serve()` are left out, since Vercel compresses on its own.',
});

export const vercelBundle = message({
  ja: 'Vercelの関数は自分のディレクトリの中身しか持てないので、`vercel()`の下ではハンドラをすべての依存ごとバンドルします。ネイティブのバイナリを持つ依存や、自分のファイルをパスで読む依存は、この形では動きません。',
  en: 'A Vercel function holds nothing but its own directory, so under `vercel()` the handler is bundled with every dependency. One that ships a native binary, or reads its own files by path, does not work there.',
});

export const tabsMode = message({
  ja: 'このモードでは、Server Actionの答えにも同じ決まりが掛かります。スクリプトが合わなければ、答えを当てはめずにページを読み込み直します。',
  en: 'In this mode a Server Action’s answer is held to the same rule: when the script does not match, the page is loaded again rather than the answer applied.',
});

export const baseMode = message({
  ja: '`serve()`は、ビルドが使った`base`を`dist/rsc/index.js`から読み、クライアントのファイルをその下で配ります。ハンドラを自分で呼ぶホストは、訪問者が求めたとおり`base`を含めたURLを渡します。',
  en: '`serve()` reads the base the build was made for from `dist/rsc/index.js`, and hands out the client files below it. A host that calls the handler itself passes the URL as the visitor asked for it, base included.',
});

export const baseRedirect = message({
  ja: 'このモードでアプリが自分で作るリダイレクトは、書いたまま送られます。Server Actionの`redirect()`と、`guard.ts`が返す`Response`の`location`です。どちらもURLなので`href()`で作ります。ほかの方法で作ったパスには、`@k8ordo/router`の`withBase()`で`base`を付けます。',
  en: 'A redirect the application builds itself in this mode is sent as written: `redirect()` from a Server Action, and the `location` of a `Response` a `guard.ts` returns. Build both with `href()`, or give a path built some other way its base with `withBase()` from `@k8ordo/router`.',
});
