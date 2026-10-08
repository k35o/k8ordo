---
"@k8ordo/framework": major
---

`@k8ordo/static` と `@k8ordo/server` を 1 つにまとめたパッケージとして 1.0.0 で始める。どちらの作り方にするかは `vite.config.ts` の `framework({ mode: 'static' })` / `framework({ mode: 'server' })` で選ぶ。`@k8ordo/static` と `@k8ordo/server` は 0.1.0 で終わり、以後は出さない。

0.1.0 から移るときに書き換えるもの:

- 依存の `@k8ordo/static` / `@k8ordo/server` を `@k8ordo/framework` に入れ替える。`@k8ordo/router` は引き続き必須の peer で、`^1.0.0` を入れる。peer の `react` / `react-dom` は `>=19.3.0`。
- `vite.config.ts` は `import { framework } from '@k8ordo/framework/vite'` にして、`mode` を書く。`mode` に既定は無い。`paths`・`site`・`csp` は `mode: 'static'` のときだけ書ける。
- アプリのコードは `@k8ordo/router` でなく `@k8ordo/framework` から import する（`href`、`navigateTo`、`notFound`、`usePathname`、`PageProps`、`LayoutProps` など）。`useParams` と `useRoute` は出していない。ページは `params` を props で受け取る。
- `@k8ordo/server` から import していたものの移り先:
  - `framework` / `ServerOptions` → `@k8ordo/framework/vite`
  - `serve` / `Server` / `ServeOptions` → `@k8ordo/framework/serve`
  - `redirect` / `RedirectTarget` / `RouteRequest` → `@k8ordo/framework/server`。`cookies()` などリクエストの中で使う API もここにある。
- `redirect(to, { permanent })` の第 2 引数と `RedirectOptions` 型を削除した。
- `@k8ordo/static` の `sitemap(site, pathnames)` を削除した。`sitemap.xml` は引き続き `site` オプションでビルドが書く。
- `.k8ordo/` の生成物は、次の `vite dev` か `vite build` で `@k8ordo/framework` を指す形に書き直される。
- `redirect.ts` を、表より先ではなく、表の中で宣言した順番（文字どおりの区間が先）に照合する。
- Vite の `base` が根からのパスでない（`./` や別オリジン）ときは、ビルドを止める。
- `mode: 'server'` の `vite build` は、`dist/` だけで動く形で書き出す。ハンドラと `serve()` が使う依存をすべて `dist/` に同梱し（外に残るのは Node.js の組み込みモジュールだけ）、起動の入口 `dist/server.js` と、`.js` を ES Module として読ませる `dist/package.json` を書く。デプロイは `dist/` を置いて `node dist/server.js` を起動するだけで、`npm install` も `node_modules` も要らない。待ち受ける先は環境変数 `PORT`（既定 `3000`）と `HOST`（既定 `localhost`）で変える。`SIGTERM` と `SIGINT` を受けると処理中の応答を返し終えてから終了コード 0 で終わるので、コンテナの PID 1 で動かしても `docker stop` ですぐ止まる。`serve()` を呼ぶだけの `serve.js` は消してよい。
- どちらのモードも、アプリの `package.json` に `"type": "module"` が無くてもビルドできる。`rsc` と `ssr` の入口を `.js` で書き、両者を含むディレクトリ（既定は `dist/`）に `{"type":"module"}` の `package.json` を書く。そのディレクトリがアプリのルートかそれより上になる出力先の設定は、アプリの `package.json` を上書きしないようビルドが止まる。
- これに合わせて、`@k8ordo/framework` と `@k8ordo/router` は server モードでも `devDependencies` に入れる。`@k8ordo/framework/serve` は自前のサーバーを書くときのために残り、そのときは `@k8ordo/framework` を `dependencies` に入れて実行時にもインストールする。
- 同梱できない依存（ネイティブのバイナリを持つもの、自分のファイルをパスで読むもの）は、`vite.config.ts` の `environments.rsc.resolve.external` に名前を書いて同梱から外し、`dependencies` に入れて実行時にインストールする。
- `mode: 'server'` のリクエストハンドラは、GET・HEAD・POST 以外のメソッドに `405` で答える。`serve()` は、リクエスト行がパスでないもの（絶対形式や `OPTIONS *`）と、ホストとして読めない `Host` に `400` で答える。
- `mode: 'static'` は、リクエストが要るものをビルドと `vite dev` で名指しして止める。対象は `'use server'` のモジュール、`guard.ts`、`search` を export するページ、GET 以外を export する `route.ts`、`@k8ordo/framework/server` の import。エラーの最後の行は `this application wants mode: 'server'`。

0.1.0 から足した主なもの: `guard.ts`・`route.ts`・`loading.tsx`、`cookies()` / `requestHeaders()` / `responseHeaders()` / `nonce()`、`notFound()`、ページの型付きの `search`、`csp` オプション、Vercel のアダプタ（`@k8ordo/framework/vercel`）、成果物だけで動く server モードの出力（`node dist/server.js`）、Node.js 以外のランタイムでも動くリクエストハンドラ、Vite の `base` の下への配置、リンクの先読み。
