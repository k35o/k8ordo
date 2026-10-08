import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`vite build`の出力を公開できるようにします。staticモードでは`dist/client/`を静的ホスティングに置き、serverモードでは`dist/`を置いて`node dist/server.js`で起動します。',
  en: 'Publish what `vite build` writes. In static mode, `dist/client/` goes on a static host, and in server mode `dist/` goes on the server and starts with `node dist/server.js`.',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const staticTitle = message({
  ja: 'staticモード',
  en: 'Static mode',
});

export const staticLead = message({
  ja: 'staticモードでは、`dist/client/`だけを静的ホスティングで配信します。',
  en: 'In static mode, a static host serves `dist/client/` and nothing else.',
});

export const outputTitle = message({
  ja: 'ビルドの出力',
  en: 'Build output',
});

export const outputList = [
  message({
    ja: '`index.html`：そのURLのページです。描画に使ったペイロードが埋め込まれています。',
    en: '`index.html`: the page at that URL, with the payload it was rendered from embedded.',
  }),
  message({
    ja: '`index.rsc`：同じページのペイロードです。クライアント側の遷移で読み込みます。',
    en: '`index.rsc`: the same page as a payload, fetched on a client navigation.',
  }),
  message({
    ja: '`old/index.html`：`redirect.ts`から書いたページで、行き先へリダイレクトします。隣に`index.rsc`はありません。',
    en: '`old/index.html`: the page written from a `redirect.ts`, which redirects to the target. No `index.rsc` sits beside it.',
  }),
  message({
    ja: '`404.html`：`not-found.tsx`を描画したファイルです。',
    en: '`404.html`: `not-found.tsx`, rendered.',
  }),
  message({
    ja: '`sitemap.xml`：`site`を渡したときだけ書かれます。',
    en: '`sitemap.xml`: written only when `site` is given.',
  }),
  message({
    ja: '`assets/`：クライアントのスクリプトとスタイルです。',
    en: '`assets/`: the client’s scripts and styles.',
  }),
] as const;

export const outputServe = message({
  ja: '`dist/client/`のほかはページの描画に使ったもので、配信しません。',
  en: 'The rest of `dist/` rendered the pages, and is not served.',
});

export const outputLog = message({
  ja: 'ビルドは最後に、書いたルートの数と、`404.html`と`sitemap.xml`を書いたかどうかを1行で出します。数にはリダイレクトのページも含まれます。',
  en: 'The build ends with one line: how many routes it wrote, and whether it wrote `404.html` and `sitemap.xml`. Redirect pages count among the routes.',
});

export const outputPayload = message({
  ja: 'ハイドレーションと遷移でのペイロードの使われ方は、',
  en: 'How hydration and navigation use the payloads is covered in ',
});

export const hostTitle = message({
  ja: '静的ホスティング',
  en: 'Static hosts',
});

export const hostRequire = message({
  ja: 'ホスティングには次の3つが必要です。',
  en: 'The host has to do three things.',
});

export const hostList = [
  message({
    ja: '`/products/1`のようなURLに、`products/1/index.html`を返す',
    en: 'Return `products/1/index.html` for a URL like `/products/1`',
  }),
  message({
    ja: '`index.rsc`をそのまま返す（`Content-Type`はHTML以外なら何でもよい）',
    en: 'Serve `index.rsc` as it is, with any `Content-Type` but HTML',
  }),
  message({
    ja: '持っていないURLに`404.html`を返す',
    en: 'Return `404.html` for a URL it does not have',
  }),
] as const;

export const hostUnknown = message({
  ja: 'サイトに無いURLへの遷移では、応答がペイロードでないので、普通の文書の読み込みに切り替わります。ホスティングはその読み込みに`404.html`を返します。`/robots.txt`のように同じoriginに置いた別のファイルへのリンクも、同じ仕組みでファイルそのものが開きます。',
  en: 'A navigation to a URL the site does not have gets a response that is not a payload. It turns into an ordinary document load, and the host returns `404.html` for it. A link to another file on the same origin, such as `/robots.txt`, works the same way: the file itself opens.',
});

export const downloadTitle = message({
  ja: 'ダウンロードのリンク',
  en: 'Download links',
});

export const hostDownload = message({
  ja: 'ホスティングがダウンロードとして返すファイルへのリンクには、`download`属性を付けます。そのリンクはルーターが扱わず、ブラウザがそのままダウンロードします。',
  en: 'Add the `download` attribute to a link to a file the host serves as a download. The router then leaves the link alone, and the browser downloads the file.',
});

export const hostStatus = message({
  ja: '`404.html`に404のステータスを付けるかどうかは、ホスティングの設定です。ビルドが書けるのはページまでで、応答のステータスは書けません。',
  en: 'Whether `404.html` goes out with a 404 status is the host’s setting. The build can write the page, but not the response.',
});

export const notFoundTitle = message({
  ja: '`404.html`の中身',
  en: 'What `404.html` holds',
});

export const notFoundOnce = message({
  ja: '`404.html`は、サイトに無いURLのために1度だけ描画されます。`not-found.tsx`より上の階層にパラメータを受け取る区間があると、そのパラメータにはどのルートも宣言していない値が入ります。',
  en: '`404.html` is rendered once, for a URL the site does not have. A dynamic segment above `not-found.tsx` gets a value no route declared.',
});

export const notFoundHydrate = message({
  ja: 'ブラウザはこのファイルをハイドレーションしません。訪問者が開いたURLで描画し直します。Client Componentは、`usePathname()`で最初の描画から訪問者のURLを読めます。',
  en: 'The browser does not hydrate this file. It renders the page again at the URL the visitor opened. A Client Component reads the visitor’s URL with `usePathname()` from its first render.',
});

export const notFoundSite = message({
  ja: 'このサイトの`404.html`もそうなっています。ファイルは日本語で書かれていて、`/en/…`のURLで開くと、ブラウザが描画し直した時点で英語になります。JavaScriptが動かない環境では、ビルドで描画した日本語のまま残ります。',
  en: 'This site’s `404.html` works that way. The file is written in Japanese, and opened at an `/en/…` URL it turns English once the browser renders it again. Without JavaScript, the Japanese the build wrote stays.',
});

export const sitemapTitle = message({
  ja: '`sitemap.xml`',
  en: '`sitemap.xml`',
});

export const sitemapWrite = message({
  ja: '`framework()`の`site`にサイトの配信元を渡すと、ビルドは書いたページをすべて並べた`sitemap.xml`も書きます。リダイレクトと`route.ts`の応答、`404.html`はページではないので載りません。',
  en: 'Give `site` the origin the site is served from, and the build also writes `sitemap.xml`, listing every page it wrote. Redirects, `route.ts` responses and `404.html` are not pages, and are left out.',
});

export const sitemapNone = message({
  ja: '`site`を渡さなければ、`sitemap.xml`は書かれません。',
  en: 'Without `site`, no `sitemap.xml` is written.',
});

export const serverTitle = message({
  ja: 'serverモード',
  en: 'Server mode',
});

export const serverLead = message({
  ja: 'serverモードでは、ビルドがリクエストごとにページを描画するハンドラと、それを動かすサーバーを書き出します。',
  en: 'In server mode, the build writes a handler that renders a page per request, and a server that runs it.',
});

export const serverOutputTitle = message({
  ja: 'ビルドの出力',
  en: 'Build output',
});

export const outputHandler = message({
  ja: '`dist/client/`にページのHTMLはありません。',
  en: '`dist/client/` holds no page HTML.',
});

export const serverOutputList = [
  message({
    ja: '`dist/server.js`：Node.jsで起動するサーバーです。',
    en: '`dist/server.js`: the server, started with Node.js.',
  }),
  message({
    ja: '`dist/package.json`：`dist/`の中の`.js`をES Moduleとして読ませます。',
    en: '`dist/package.json`: makes the `.js` files in `dist/` load as ES modules.',
  }),
  message({
    ja: '`dist/rsc/index.js`：リクエストハンドラです。',
    en: '`dist/rsc/index.js`: the request handler.',
  }),
  message({
    ja: '`dist/ssr/`：ハンドラがペイロードをHTMLにするときに使います。',
    en: '`dist/ssr/`: what the handler uses to turn a payload into HTML.',
  }),
  message({
    ja: '`dist/client/`：ブラウザに配信するファイルです。圧縮の効く種類のファイルには、Brotliとgzipで圧縮したコピー（`.br`と`.gz`）が隣に置かれます。',
    en: '`dist/client/`: the files served to the browser. A file whose type compresses gets a Brotli and a gzip copy beside it (`.br` and `.gz`).',
  }),
] as const;

export const outputDeps = message({
  ja: 'ビルドは、サーバーとハンドラが使う依存をすべて`dist/`にバンドルします。外に残るのはNode.jsの組み込みモジュールだけです。実行時に`node_modules`を読まないので、`@k8ordo/framework`と`@k8ordo/router`は`devDependencies`に入れます。',
  en: 'The build bundles every dependency the server and the handler use into `dist/`. Only Node.js’s built-in modules stay outside. Nothing reads `node_modules` at run time, so `@k8ordo/framework` and `@k8ordo/router` go in `devDependencies`.',
});

export const startTitle = message({
  ja: '起動',
  en: 'Starting',
});

export const startRun = message({
  ja: '`dist/`をサーバーに置き、`node dist/server.js`で起動します。インストールは要りません。アプリの`package.json`も`node_modules`も無い場所で動きます。',
  en: 'Put `dist/` on the server and start it with `node dist/server.js`. Nothing needs installing: it runs where neither the application’s `package.json` nor `node_modules` exists.',
});

export const startEnv = [
  message({
    ja: '`PORT`：待ち受けるポートです。既定は`3000`です。',
    en: '`PORT`: the port to listen on. `3000` by default.',
  }),
  message({
    ja: '`HOST`：待ち受けるホストです。既定の`localhost`には同じマシンからしか接続できないので、コンテナの中などでは`0.0.0.0`にします。Nodeは`localhost`のアドレスのうち1つ、多くは`::1`だけで待ち受けます。同じマシンのプロキシからは`127.0.0.1`でなく`localhost`を指すか、`HOST=127.0.0.1`にします。',
    en: '`HOST`: the host to listen on. The default `localhost` accepts connections from the same machine only, so inside a container set it to `0.0.0.0`. Node listens on one of the addresses `localhost` names, often only `::1`, so point a proxy on the same machine at `localhost` rather than `127.0.0.1`, or set `HOST=127.0.0.1`.',
  }),
] as const;

export const startStop = message({
  ja: '`SIGTERM`か`SIGINT`を受けると、新しい接続を断り、処理中の応答を返し終えてから終了コード`0`で終わります。コンテナの最初のプロセスとして起動しても、止める指示ですぐに止まります。',
  en: 'On `SIGTERM` or `SIGINT` it stops taking connections, finishes the answers already under way, and exits with `0`. Started as a container’s first process, it still stops as soon as it is told to.',
});

export const externalTitle = message({
  ja: 'バンドルできない依存',
  en: 'Dependencies that cannot be bundled',
});

export const externalWhy = message({
  ja: 'ネイティブのバイナリを持つ依存や、自分のファイルをパスで読む依存は、バンドルすると動きません。`rsc`環境の`resolve.external`に名前を書くと、その依存だけがバンドルから外れます。',
  en: 'A dependency that ships a native binary, or reads its own files by path, stops working once bundled. Name it in the `rsc` environment’s `resolve.external`, and that dependency alone is left out of the bundle.',
});

export const externalInstall = message({
  ja: '外した依存は`dependencies`に入れ、実行時にインストールします。`npm install --omit=dev`のように開発時の依存を省いてインストールし、アプリのディレクトリの中で`dist/server.js`を起動します。',
  en: 'Keep a dependency left out this way in `dependencies` and install it for run time. Install without development dependencies, as `npm install --omit=dev` does, and start `dist/server.js` inside the application’s directory.',
});

export const serveTitle = message({
  ja: '`serve()`',
  en: '`serve()`',
});

export const serveRun = message({
  ja: '`dist/server.js`が動かすのは、`@k8ordo/framework/serve`の`serve()`です。自前のサーバーから呼ぶときは、`@k8ordo/framework`を`dependencies`に入れ、実行時にもインストールします。オプションは3つです。',
  en: '`dist/server.js` runs `serve()` from `@k8ordo/framework/serve`. To call it from a server of your own, put `@k8ordo/framework` in `dependencies` and install it for run time as well. It takes three options.',
});

export const serveOptions = [
  message({
    ja: '`dist`：ビルドの出力ディレクトリです。既定は`dist`で、今の作業ディレクトリから解決します。',
    en: '`dist`: the build output directory. `dist` by default, resolved from the working directory.',
  }),
  message({
    ja: '`port`：待ち受けるポートです。既定は`3000`で、`0`を渡すと空いているポートをシステムが選びます。',
    en: '`port`: the port to listen on. `3000` by default; `0` lets the system pick a free one.',
  }),
  message({
    ja: '`host`：待ち受けるホストです。既定の`localhost`には同じマシンからしか接続できないので、コンテナの中などでは`0.0.0.0`を渡します。',
    en: '`host`: the host to listen on. The default `localhost` accepts connections from the same machine only, so inside a container pass `0.0.0.0`.',
  }),
] as const;

export const serveReturn = message({
  ja: '返り値には`url`と`port`、`close()`があります。テストからビルドに対してサーバーを立て、終わったら止められます。',
  en: 'The return value has `url`, `port` and `close()`, so a test can start a server against the build and stop it when done.',
});

export const answersTitle = message({
  ja: '`serve()`の応答',
  en: 'How `serve()` responds',
});

export const answersFiles = message({
  ja: '`GET`と`HEAD`のうち、`dist/client/`の中のファイルを指すリクエストには、そのファイルを返します。それ以外のリクエストは、すべてハンドラに渡します。',
  en: 'A `GET` or `HEAD` that names a file in `dist/client/` is answered with that file. Every other request goes to the handler.',
});

export const answersList = [
  message({
    ja: 'キャッシュ：`/assets/`の下はファイル名に中身のハッシュが入っています。`immutable`を付けて1年キャッシュさせます。それ以外のファイルは`no-cache`です。',
    en: 'Caching: files under `/assets/` carry a hash of their contents in their names. They are sent `immutable` and cached for a year. Any other file is `no-cache`.',
  }),
  message({
    ja: '圧縮：圧縮したコピーがあるファイルは、`Accept-Encoding`が選ぶほうを返します。ページとペイロードは、圧縮しながらストリーミングします。',
    en: 'Compression: a file with compressed copies is sent in the one `Accept-Encoding` prefers. Pages and payloads are compressed as they stream.',
  }),
  message({
    ja: '再検証：ファイルには中身から作った`ETag`が付きます。同じソースから別々にビルドしたサーバーでも、再検証は`304`で終わります。',
    en: 'Revalidation: a file’s `ETag` is derived from its contents, so a revalidation ends in a `304` even against another server built from the same source.',
  }),
  message({
    ja: '範囲：1つの範囲を求める`Range`には`206`で答えます。Safariが`<video>`を再生するのに必要です。',
    en: 'Ranges: a `Range` asking for one span gets a `206`, which Safari needs before it plays a `<video>`.',
  }),
  message({
    ja: '失敗：ハンドラがエラーになったときは、`500`と本文`internal error`だけを返します。エラーの内容は、訪問者でなくサーバーのログに出ます。',
    en: 'Failure: when the handler throws, the response is a `500` with the body `internal error`. The error itself goes to the server’s log, not to the visitor.',
  }),
] as const;

export const answersSafe = message({
  ja: 'パスに`..`や`%2e%2e`が含まれていても、`dist/client/`の外のファイルは返しません。',
  en: 'Even with `..` or `%2e%2e` in the path, no file outside `dist/client/` is served.',
});

export const handlerTitle = message({
  ja: 'ほかのランタイム',
  en: 'Other runtimes',
});

export const handlerExport = message({
  ja: '`dist/rsc/index.js`は、`(request: Request) => Promise<Response>`の関数をdefault exportしています。ハンドラは隣の`dist/ssr/`を読み込むので、2つは同じ場所に置きます。依存はバンドル済みなので、インストールは要りません。',
  en: '`dist/rsc/index.js` default-exports a function of type `(request: Request) => Promise<Response>`. The handler loads `dist/ssr/` from beside itself, so keep the two in the same place. Its dependencies are bundled in, so nothing needs installing.',
});

export const handlerRuntime = message({
  ja: 'Webの`Request`と`Response`、ストリームのほかに、ハンドラが実行環境に求めるのは`node:async_hooks`の`AsyncLocalStorage`だけです。Node.jsとBunとDeno、`nodejs_compat`を付けたCloudflare Workersで、importしたハンドラをそのまま渡せます。',
  en: 'Beyond the web’s `Request`, `Response` and streams, the only thing the handler needs from its runtime is `AsyncLocalStorage` from `node:async_hooks`. Node.js, Bun, Deno, and Cloudflare Workers with `nodejs_compat` all take the imported handler as it is.',
});

export const handlerFiles = message({
  ja: 'ハンドラはファイルを配信しません。ハンドラの前で`dist/client/`を配信し、どのファイルにも一致しないリクエストだけをハンドラに渡します。Workersでは、`wrangler.jsonc`の`assets.directory`に`dist/client`を指定します。',
  en: 'The handler serves no files. Serve `dist/client/` in front of it, and pass it only the requests that match no file. On Workers, set `assets.directory` in `wrangler.jsonc` to `dist/client`.',
});

export const handlerNode = message({
  ja: '`route.ts`やServer Actionで`node:fs`のようなNode.js専用のモジュールをimportできます。ただし、アプリはそのモジュールを持つランタイムでしか動かなくなります。',
  en: 'A `route.ts` or Server Action can import a Node.js-only module such as `node:fs`. The application then runs only on a runtime that has it.',
});

export const proxyTitle = message({
  ja: 'プロキシの後ろ',
  en: 'Behind a proxy',
});

export const proxyOrigin = message({
  ja: 'ハンドラは`Origin`ヘッダーのホストとURLのホストを比べて`POST`を受け付けるので、`Request`は訪問者が求めたURLで作ります。この検査については、',
  en: 'The handler accepts a `POST` by comparing the host in its `Origin` header with the host of the URL, so the `Request` has to carry the URL the visitor asked for. The check is covered in ',
});

export const proxyServe = message({
  ja: '`serve()`はリクエストの`Host`ヘッダーからURLを作り、転送用のヘッダーは読みません。前に置くプロキシは、元の`Host`を書き換えずに渡してください。ホストを含むリクエスト行（`GET http://…`）や、ホストとして読めない`Host`には`400`を返します。',
  en: '`serve()` builds the URL from the request’s `Host` header and reads no forwarding header. A proxy in front of it has to pass the original `Host` on unchanged. A request line that names a host of its own (`GET http://…`), or a `Host` that is not a host, gets a `400`.',
});

export const proxyBuild = message({
  ja: 'パスからURLを自分で作るホストは、`new URL(path, origin)`で解決せず、originの後ろに文字列としてつなぎます。解決すると、`//evil.test/`で始まるパスが`evil.test`のURLになり、別のサイトのフォームがこの検査を通ってしまいます。',
  en: 'A host that builds the URL from a path itself appends the path to the origin as text rather than resolving it with `new URL(path, origin)`. Resolved, a path starting with `//evil.test/` becomes a URL on `evil.test`, and a form on another site would pass the check.',
});

export const vercelTitle = message({
  ja: 'Vercel',
  en: 'Vercel',
});

export const vercelOutput = message({
  ja: "`@k8ordo/framework/vercel`の`vercel()`を`framework()`の隣に足すと、`vite build`はVercelのBuild Output API（v3）の形で`.vercel/output/`も書きます。`vercel deploy --prebuilt`で、それをそのままデプロイできます。`mode: 'static'`と並べると、設定を読み込んだ時点でエラーになります。staticモードのビルドは、`dist/client/`をファイルとして置くだけで足ります。",
  en: "Add `vercel()` from `@k8ordo/framework/vercel` beside `framework()`, and `vite build` also writes `.vercel/output/` in the shape of Vercel’s Build Output API (v3). `vercel deploy --prebuilt` deploys it as it is. Beside `mode: 'static'` it fails when the config loads; a static build is `dist/client/`, served as files.",
});

export const vercelFunction = message({
  ja: 'クライアントのビルドは、VercelのCDNに置く静的ファイルになります。どのファイルにも一致しないリクエストは、Node.jsの関数1つが処理します。その関数の中身がリクエストハンドラです。`serve()`のために圧縮したコピーは入れません。',
  en: 'The client build becomes static files on Vercel’s CDN, and every request that matches no file goes to one Node.js function, which is the request handler. The copies compressed for `serve()` are left out.',
});

export const vercelBundle = message({
  ja: 'Vercelの関数は自分のディレクトリの中身しか持てません。ハンドラは依存をすべてバンドルしているので、そのまま関数になります。`resolve.external`で外した依存は関数に入らないので、Vercelでは動きません。',
  en: 'A Vercel function holds nothing but its own directory. The handler has every dependency bundled in, so it becomes the function as it is. A dependency left out with `resolve.external` is not in the function, and does not work on Vercel.',
});

export const tabsTitle = message({
  ja: 'デプロイ前に開いたタブ',
  en: 'Tabs opened before a deploy',
});

export const tabsScript = message({
  ja: '開いたままのタブは、読み込んだときのスクリプトを動かし続けます。遷移で読み込むペイロードは今のデプロイから送られ、タブのスクリプトに無いClient Componentを含むことがあります。ペイロードには、対応するクライアントスクリプトのURLが入っています。',
  en: 'A tab that stays open keeps running the script it loaded. The payloads it fetches on navigation come from the current deploy, and may include a Client Component that script does not have. Every payload records the URL of the client script it was rendered for.',
});

export const tabsReload = message({
  ja: 'タブのスクリプトと合わないペイロードは描画せず、同じURLを文書として読み込み直します。訪問者は`error.tsx`でなく、新しいスクリプトで描画したページを見ます。スクリプトのURLには、読み込むものすべてのハッシュが入っています。ブラウザで動くものを変えなかったデプロイなら、タブはそのまま遷移を続けます。',
  en: 'A payload that does not match the tab’s script is not rendered. The same URL is loaded as a document instead, and the visitor sees the page rendered by the new script rather than `error.tsx`. The script’s URL includes a hash of everything it loads. After a deploy that changed nothing the browser runs, open tabs keep navigating as before.',
});

export const tabsMode = message({
  ja: 'serverモードでは、Server Actionの応答も同じです。スクリプトと合わない応答は反映せず、ページを読み込み直します。',
  en: 'In server mode, the same goes for a Server Action’s response: one that does not match the script is not applied, and the page is loaded again.',
});

export const baseTitle = message({
  ja: 'サブパスでの配信',
  en: 'Serving under a subpath',
});

export const baseConfig = message({
  ja: '`https://example.com/docs/`のように、originの直下以外で配信するときは、そのパスをViteの`base`に書きます。アプリのほかの部分は変わりません。`routes/products/page.tsx`は、ルート表では`/products`で、アドレスバーでは`/docs/products`です。この2つのあいだでは、次のものに`base`が付いたり外れたりします。',
  en: 'To serve below the root of the origin, such as `https://example.com/docs/`, set that path as Vite’s `base`; nothing else in the application changes. `routes/products/page.tsx` is `/products` in the route table and `/docs/products` in the address bar. Between the two, the base is added or removed as follows.',
});

export const baseList = [
  message({
    ja: '`href()`と`navigateTo()`：`href()`が返すURLと、`navigateTo()`の遷移先には`base`が付きます。',
    en: '`href()` and `navigateTo()`: `href()` returns the URL with the base, and `navigateTo()` navigates to it with the base.',
  }),
  message({
    ja: '`pathname`と`usePathname()`：`base`を外した値です。',
    en: '`pathname` and `usePathname()`: the value without the base.',
  }),
  message({
    ja: 'ペイロードとクライアントのファイル：`/docs/products/index.rsc`や`/docs/assets/`のように、`base`の下に置かれます。',
    en: 'Payloads and client files: below the base, as `/docs/products/index.rsc` and `/docs/assets/`.',
  }),
  message({
    ja: '`redirect.ts`の行き先：ルート表と同じくアプリのルートから書き、送るときに`base`が付きます。別のoriginの行き先はそのまま送ります。',
    en: 'A `redirect.ts` target: written from the root like the route table, and sent with the base in front. A target on another origin is sent as written.',
  }),
  message({
    ja: '`base`の外のURL：serverモードではハンドラが`404`を返します。どちらのモードでも、クライアントのランタイムはその遷移を扱わず、ブラウザが通常どおり読み込みます。',
    en: 'A URL outside the base: in server mode the handler returns `404`. In either mode the client runtime does not handle the navigation, and the browser loads it as usual.',
  }),
] as const;

export const baseRedirect = message({
  ja: 'serverモードでServer Actionから呼ぶ`redirect()`と、`guard.ts`が返す`Response`の`location`：`base`を付けずにそのまま送ります。どちらもURLなので`href()`で作ります。ほかの方法で作ったパスには、`@k8ordo/framework`の`withBase()`で`base`を付けます。',
  en: 'In server mode, `redirect()` from a Server Action and the `location` of a `Response` a `guard.ts` returns: sent as written, without the base. Both are URLs, so build them with `href()`. Give a path built some other way its base with `withBase()` from `@k8ordo/framework`.',
});

export const baseStatic = message({
  ja: 'staticモードでは、ページはルート表のパスのまま`dist/client/`に書かれます。ホスティングはこのディレクトリを`/docs/`で配信します。`paths`には`base`を除いたパスを渡します。`sitemap.xml`には`base`を含めたURLが載ります。',
  en: 'In static mode, pages are written into `dist/client/` at their paths in the route table, and the host serves that directory at `/docs/`. `paths` takes paths without the base. `sitemap.xml` lists URLs with it.',
});

export const baseServer = message({
  ja: 'serverモードでは、`serve()`がビルドの使った`base`を`dist/rsc/index.js`から読み、クライアントのファイルをその下で配信します。ハンドラを自分で呼ぶホストは、訪問者が求めたとおり`base`を含めたURLを渡します。',
  en: 'In server mode, `serve()` reads the base the build was made for from `dist/rsc/index.js`, and serves the client files below it. A host that calls the handler itself passes the URL as the visitor asked for it, base included.',
});

export const baseRefused = message({
  ja: "`base`はルートから始まるパスにします。`./`のような相対パスや別のoriginでは、ビルドが`k8ordo serves its pages under Vite's base, so base has to be a path from the root`で始まるエラーで止まります。",
  en: "`base` has to be a path from the root. With a relative path like `./`, or another origin, the build stops with an error that begins `k8ordo serves its pages under Vite's base, so base has to be a path from the root`.",
});
