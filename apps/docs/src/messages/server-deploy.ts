import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`vite build` は、リクエストハンドラと、ブラウザに配るファイルを書きます。`serve()` はそれを Node.js で動かし、ほかのホストはハンドラを直接呼べます。このページは、出力の形、`serve()` の答え方、ほかのホストでの動かし方を説明します。',
  en: '`vite build` writes a request handler and the files the browser is served. `serve()` runs them on Node.js, and any other host can call the handler directly. This page covers the shape of the output, how `serve()` answers, and running the handler elsewhere.',
});

export const outputTitle = message({
  ja: 'ビルドの出力',
  en: 'The build output',
});

export const outputDescription = message({
  ja: '`dist/rsc/index.js` がリクエストハンドラ、`dist/ssr/` はハンドラがペイロードを HTML にするのに使う部分、`dist/client/` がブラウザに配るファイルです。このモードではページを前もって描かないので、`dist/client/` にページの HTML はありません。',
  en: '`dist/rsc/index.js` is the request handler, `dist/ssr/` is what it turns payloads into HTML with, and `dist/client/` holds the files the browser is served. Nothing is rendered ahead of time in this mode, so there is no page HTML in `dist/client/`.',
});

export const outputDeps = message({
  ja: 'ハンドラは、アプリの依存を実行時に `node_modules` から import します。サーバーを動かす場所には、アプリの依存をインストールしておきます。`vite` はビルドにしか使わないので、`pnpm install --prod` のように開発時の依存を省いたインストールで動きます。',
  en: "The handler imports the application's dependencies from `node_modules` at run time, so install them where the server runs. `vite` is only for the build, so an install without dev dependencies (`pnpm install --prod`) is enough.",
});

export const serveTitle = message({
  ja: '`serve()`',
  en: '`serve()`',
});

export const serveDescription = message({
  ja: '`serve()` はビルドを Node.js の HTTP サーバーで動かします。待ち受けを始めてから、どこで待ち受けているかと止め方を返し、`k8ordo: serving <dist> on <url>` をログに出します。オプションの型は `ServeOptions`、返り値の型は `Server` です。',
  en: '`serve()` runs the build on a Node.js HTTP server. Once it is listening it hands back where it listens and a way to stop it, and logs `k8ordo: serving <dist> on <url>`. Its options are typed `ServeOptions`, and what it returns `Server`.',
});

export const optionsTable = {
  option: message({ ja: 'オプション', en: 'Option' }),
  defaultValue: message({ ja: '既定値', en: 'Default' }),
  meaning: message({ ja: '意味', en: 'Meaning' }),
  dist: message({
    ja: 'ビルドの出力ディレクトリ（`rsc/` と `client/` を持つもの）。現在の作業ディレクトリから解決します。',
    en: 'The build output directory — the one holding `rsc/` and `client/` — resolved from the current working directory.',
  }),
  port: message({
    ja: '待ち受けるポート。`0` ならシステムが空いているポートを選び、返り値の `port` がどれかを教えます。',
    en: 'The port to listen on. `0` asks the system for a free one, and the returned `port` says which.',
  }),
  host: message({
    ja: '待ち受けるホスト。既定では同じマシンからしか届かないので、コンテナの中などで外から届かせるには `0.0.0.0` を渡します。',
    en: 'The host to listen on. The default is reachable from the same machine only; pass `0.0.0.0` to be reachable from outside, as inside a container.',
  }),
};

export const handleTable = {
  field: message({ ja: '返り値（`Server`）', en: 'Returned (`Server`)' }),
  meaning: message({ ja: '意味', en: 'Meaning' }),
  port: message({
    ja: '実際に待ち受けているポート',
    en: 'The port it actually listens on',
  }),
  url: message({
    ja: '`http://<host>:<port>`',
    en: '`http://<host>:<port>`',
  }),
  close: message({
    ja: 'サーバーを止め、止まったら解決する Promise を返す',
    en: 'Stops the server, returning a promise that settles once it has stopped',
  }),
};

export const serveTest = message({
  ja: '`port: 0` と `close()` があるので、テストはビルドに対して自分のサーバーを立て、終わったら止められます。',
  en: 'With `port: 0` and `close()`, a test can start its own server against a build and stop what it started.',
});

export const answersTitle = message({
  ja: '`serve()` の答え方',
  en: 'How `serve()` answers',
});

export const answersFiles = message({
  ja: 'GET と HEAD のうち、`dist/client/` の中のファイルを指すものには、そのファイルをそのまま返します。`content-type` は拡張子に登録された型で、テキストには `charset=utf-8` が付き、登録のない拡張子は `application/octet-stream` です。`/assets/` の下はファイル名に内容のハッシュが入っているので `cache-control: public, max-age=31536000, immutable`、それ以外は `no-cache` です。HEAD には、ファイルでもハンドラでも、GET と同じヘッダーだけを本文なしで返します。',
  en: 'A GET or HEAD naming a file inside `dist/client/` is answered with that file as it is. Its `content-type` is the type registered for its extension, with `charset=utf-8` on text, or `application/octet-stream` when none is registered. Everything under `/assets/` carries a content hash in its name, so it gets `cache-control: public, max-age=31536000, immutable`; anything else gets `no-cache`. A HEAD gets the headers a GET would and no body, whether a file or the handler answers it.',
});

export const answersHandler = message({
  ja: 'それ以外はすべてハンドラに渡ります。GET と HEAD 以外のメソッドは、ファイルと同じパスでもかならずハンドラが答えます。ハンドラのステータスとヘッダーはそのまま返り、複数の `Set-Cookie` も 1 つにまとめられません。ハンドラが例外を投げたときは `500` と本文 `internal error` だけを返し、中身は訪問者ではなくサーバーのログに出します。本文を送り始めてから失敗したときは、もうステータスを変えられないので、ページの途中で繋いだままにせず接続を切ります。',
  en: "Everything else goes to the handler, and any method but GET and HEAD always does, even to a path that names a file. The handler's status and headers pass through as they are, several `Set-Cookie` headers included. When the handler throws, the answer is a `500` with the body `internal error`; the details go to the server's log, not to the visitor. A body that fails after it has started streaming can no longer change its status, so the connection is cut rather than left open on half a page.",
});

export const answersSafe = message({
  ja: 'リクエストの pathname は、どう綴られていても `dist/client/` の中のファイルしか指せません。`..`・`%2e%2e`・`%2f` を使った綴りは中に留まり、復号できないエスケープや NUL バイトはファイル名として扱われません。外へ出ることは、リクエストごとに判定する場合ではなく、パスの解決が作り出せない結果です。',
  en: 'A request pathname can only ever name a file inside `dist/client/`, whatever it is spelled like: spellings with `..`, `%2e%2e` or `%2f` stay inside, and an escape that cannot be decoded or a NUL byte is not a file name at all. Traversal is not a case weighed per request but an outcome the path resolution cannot produce.',
});

export const answersStatuses = message({
  ja: 'ハンドラが返すステータスの一覧は、リンク先にあります。',
  en: 'The statuses the handler answers with are listed here.',
});

export const handlerTitle = message({
  ja: 'リクエストハンドラ',
  en: 'The request handler',
});

export const handlerDescription = message({
  ja: '`serve()` はビルドを動かすホストの 1 つです。動かされているアプリそのものはリクエストハンドラで、リクエストを `Request` にして渡し、返った `Response` で答えられる環境なら、どこでもホストになれます。ハンドラは `dist/rsc/index.js` が default export する `(request: Request) => Promise<Response>` という、ただの関数です。`@k8ordo/static` がビルド時に作って呼ぶのも、同じハンドラをそのモード向けにコンパイルしたものです。ハンドラは隣の `dist/ssr/` を読み込むので 2 つは一緒に置きます。アプリの依存は名前で import するので、動かす場所で解決できるようにしておくか、Wrangler のように bundle に含めます。',
  en: "`serve()` is one host for the build. What it hosts — the application itself — is the request handler, and anything that can turn a request into a `Request` and answer with the `Response` it gets back can host it. The handler is a plain function, `(request: Request) => Promise<Response>`, default-exported from `dist/rsc/index.js`; `@k8ordo/static` builds and calls the same handler at build time, compiled for that mode. It loads `dist/ssr/` from beside itself, so the two travel together, and it imports the application's dependencies by name, so they have to resolve where it runs — or be bundled in, as Wrangler does.",
});

export const handlerRuntimes = message({
  ja: 'Web の `Request`・`Response`・ストリームのほかに、ハンドラが実行環境から借りるのは `node:async_hooks` の `AsyncLocalStorage` だけです。React は描画ごとの状態をそこに持ち、`paramsSchema` もそこに書きます。Node.js・Bun・Deno・`nodejs_compat` を付けた Cloudflare Workers はどれもこれを持っていて、import したハンドラをそのまま受け取ります。',
  en: "Past the web platform's `Request`, `Response` and streams, the one thing the handler takes from its runtime is `AsyncLocalStorage` from `node:async_hooks`: React keeps each render's state in it, and a `paramsSchema` writes to it. Node.js, Bun, Deno, and Cloudflare Workers with the `nodejs_compat` flag all have it, and each takes the imported handler as it is.",
});

export const handlerImports = message({
  ja: 'この約束は、ハンドラが走らせるコードも Node にしか無いものを import しない限りで成り立ちます。`redirect()` と型が `@k8ordo/server/runtime` から、`serve()` が別の入口 `@k8ordo/server/serve` から来るのはそのためです。`node:fs` を読む route ファイルや Server Action は、アプリをそれを持つ実行環境に縛ります。',
  en: 'What the handler runs keeps that promise only as long as it imports nothing that needs Node either — which is why `redirect()` and the types come from `@k8ordo/server/runtime`, and `serve()` from an entry of its own, `@k8ordo/server/serve`. A route file or a Server Action that reads `node:fs` ties the application to a runtime that has it.',
});

export const handlerMethods = message({
  ja: 'ハンドラが答えるメソッドは GET・HEAD・POST です。ほかのメソッドには、`Allow` ヘッダーでその 3 つを示した `405` を返すので、ホストの側でメソッドを絞る必要はありません。HEAD には GET と同じステータスとヘッダーを本文 `null` で返し、ページは描きません。',
  en: 'The handler answers GET, HEAD and POST, and any other method with a `405` whose `Allow` header names those three, so a host needs no method filter of its own. A HEAD gets the status and headers a GET would, with a `null` body, and the page is not rendered for it.',
});

export const handlerFiles = message({
  ja: 'ハンドラはファイルを配りません。`dist/client/` をハンドラの前で配信し（`assets/` の下は名前に中身のハッシュが入っているので `Cache-Control: public, max-age=31536000, immutable`）、どのファイルも指さないリクエストをハンドラに渡します。Workers では、クライアントのビルドを指す static assets がそれにあたり、Worker が動く前に答えます。',
  en: "The handler serves no files. Put `dist/client/` in front of it — the files under `assets/` with `Cache-Control: public, max-age=31536000, immutable`, since their names carry their contents' hash — and hand it every request that names none. On Workers that is static assets pointed at the client build, which answer before the Worker runs.",
});

export const handlerOrigin = message({
  ja: '`Request` は、訪問者が求めた URL で作ります。ハンドラは、POST の `Origin` ヘッダーがあり、そのホストがその URL のホストと一致するときだけ受け付け、それ以外の POST には `403` で答えるからです。プロキシの後ろでは、公開されているホストをそのまま渡します。`serve()` はリクエスト自身の `Host` ヘッダーから URL を作り、転送用のヘッダーは読まないので、前に置くプロキシは元の `Host` を書き換えずに渡します。',
  en: "Build the `Request` with the URL the visitor asked for: the handler accepts a POST only when its `Origin` header is present and names that URL's host, and answers any other POST with a `403`. Behind a proxy that means passing the public host through — `serve()` builds the URL from the request's own `Host` header and reads no forwarded header, so a proxy in front of it has to pass the original `Host` on unchanged.",
});

export const vercelTitle = message({
  ja: 'Vercel にデプロイする',
  en: 'Deploying to Vercel',
});

export const vercelDescription = message({
  ja: '`@k8ordo/server/vercel` の `vercel()` を `framework()` の隣に置くと、`vite build` は Vercel の Build Output API（v3）の形で `.vercel/output/` も書きます。`vercel build` と `vercel deploy --prebuilt` は、それをそのままデプロイします。',
  en: "Put `vercel()` from `@k8ordo/server/vercel` beside `framework()`, and `vite build` also writes `.vercel/output/` in the shape of Vercel's Build Output API (v3), which `vercel build` and `vercel deploy --prebuilt` deploy as it is.",
});

export const vercelOutput = message({
  ja: 'クライアントのビルドは Vercel の CDN に置く静的ファイルになります。`assets/` の下は、ファイルが答えたときにだけ `immutable` を付けるので、無いファイルの 404 が 1 年キャッシュされることはありません。どのファイルも指さないリクエストは、Node.js の関数 1 つが受けます。中身はリクエストハンドラで、`fetch` として Vercel に渡し、答えをストリームのまま返します。`base` を指定したビルドでは、`serve()` と同じく静的ファイルをその下に置き、base の外の URL にはハンドラが `404` で答えます。`serve()` 向けに圧縮したコピーは入れません。Vercel は自分で圧縮し、コピーの分だけアップロードするファイルが増えるからです。',
  en: "The client build becomes static files on Vercel's CDN — a file under `assets/` is sent `immutable` only once a file has answered, so a missing one is never cached for a year — and every request that names no file goes to one Node.js function: the request handler, handed to Vercel as `fetch` and streaming its answer. Under a `base` the static files sit below it, as `serve()` hands them out, and the handler answers every URL outside it with a `404`. The copies compressed for `serve()` are left out: Vercel compresses on its own, and each is one more file to upload.",
});

export const vercelBundled = message({
  ja: 'Vercel の関数が持てるのは自分のディレクトリの中身だけなので、`vercel()` の下ではハンドラをすべての依存ごと bundle してビルドします。ネイティブのバイナリを持つ依存や、自分のファイルをパスで読む依存は、そうして束ねられないので動きません。ビルドのたびに書き直すのは `.vercel/output/` だけで、その隣に `vercel pull` が書いたプロジェクトのリンクは残します。',
  en: 'A Vercel function holds nothing but its own directory, so under `vercel()` the handler is built with every dependency bundled in. A dependency that ships a native binary, or that reads its own files by path, cannot be bundled that way and does not work there. Each build replaces `.vercel/output/` and nothing else: the project link `vercel pull` writes beside it stays.',
});

export const routesDirTitle = message({
  ja: '`routesDir`',
  en: '`routesDir`',
});

export const routesDirDescription = message({
  ja: '`framework()` が受け取るオプションは `routesDir` だけです（型は `ServerOptions`）。ルートのディレクトリをプロジェクトのルートからの相対パスで指定し、既定は `src/routes` です。生成されるファイルは変わらず `.k8ordo/` に書かれ、問題の行も `routes/` から始まります。',
  en: '`routesDir` is the one option `framework()` takes (typed `ServerOptions`): the route directory, relative to the project root, `src/routes` by default. The generated files still go to `.k8ordo/`, and problem lines still begin with `routes/`.',
});
