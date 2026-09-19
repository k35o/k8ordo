# @k8ordo/server

## 0.2.0

### Minor Changes

- - route ファイルの `paramsSchema` の検出を、正規表現による文字列走査から Vite 同梱のパーサ（oxc）に置き換えた。`export const { paramsSchema } = locales` のような分割代入も拾い、文字列やコメントの中の同じ語には反応しない。lint の autofix を抑止したり、コード例を別ファイルへ逃がしたりする必要が無くなった。
  - `@k8ordo/server` の下では、生成する `register.gen.ts` が `@k8ordo/router` の `Register` に `request: RouteRequest` を書く。router の `PageProps` / `LayoutProps` はそこから `request` を得るので、route ファイルはモードのパッケージを import せずに済む。`register.gen.ts` と `routes.gen.ts` はどちらも `RouteRequest` を `@k8ordo/server/runtime` から import する。
  - ガイドの「Parameters with a schema」を `PageProps<'/products/:id'>` で書き直した。

- peer を `react` / `react-dom` とも `>=19.3.0` にしました。GUIDE の「Components that need a browser」が前提にしている `use(browser())` は React 19.3 の API で、これまでの `>=19.2.6` ではガイドどおりに書くと動きませんでした。

- `redirect(to, { permanent })` の第 2 引数と `RedirectOptions` 型を消した。JavaScript なしで送られたフォームにはハンドラが常に `303` を返し、クライアントランタイム経由の呼び出しには行き先しか返さないので、`permanent` はどちらの経路でも何もしていなかった。POST への `308` はブラウザに POST をやり直させるため、Server Action の終わり方として意味のある使い道も無い。`redirect(to)` と書いてください。`redirect.ts` が default export する `{ to, permanent }` はこれまでどおり `307` / `308` を選ぶ。

- 実行時に使う API を `@k8ordo/server/runtime` に移した。ルートの `@k8ordo/server` はプラグインの `framework()` と `ServerOptions` だけを持つ。

  ルートのエントリは 1 つのファイルで `serve` / `redirect` と並んで `vite`・`@vitejs/plugin-react`・`@vitejs/plugin-rsc` を import していたため、ビルドしたアプリ（`dist/rsc/index.js` と `serve.js`）が `pnpm install --prod` した環境で `ERR_MODULE_NOT_FOUND` で落ちていた。`@k8ordo/server/runtime` は Vite を読まないので、`vite` は devDependency のままでよい。`vite.config.ts` は `@k8ordo/static` と同一のまま。

  - `serve` / `Server` / `ServeOptions` → `@k8ordo/server/runtime`
  - `redirect` / `RedirectTarget` / `RouteRequest` → `@k8ordo/server/runtime`
  - 生成する `routes.gen.ts` / `register.gen.ts` も `RouteRequest` を `@k8ordo/server/runtime` から import する（次のビルドで書き直される）。

### Patch Changes

- 同梱ドキュメントを実装に追従させました。

  - 共有節の「ビルドが拒むもの」の表を今のエラー文と正しい例に、生成ファイルの例を今の `routes.gen.ts` に、`paramsSchema` の検査が型検査であることに直しました。
  - static の GUIDE から、サーバー前提の記述（描画時エラーで 500 が返る、など）を外しました。`paths` のビルドエラーと、`_` / `.` で始まるファイルが無視されることも書き足しています。
  - server の GUIDE に `serve` の `dist` / `host` と既定値、ファイルを返すのは GET / HEAD だけであることを書きました。`redirect()` の `permanent` を使える option としては載せなくなりました。
  - `llms.txt` に公開型を足し、CLAUDE.md の Layout 節を英語にしました。

- layout が受け取る `params` を、型（router の `LayoutProps`）とガイドが言うとおり文字列に戻した。ページのスキーマが通した値がスタックの全要素に渡っていたため、`[id]` の下のページが `z.coerce.number()` を宣言していると、その上の layout は型が `string` と言っている場所で数値を受け取っていた（`params.id.toUpperCase()` が型を通って実行時に落ちる）。layout は自分の下にどのページが来るか知らず、`not-found.tsx` の下では何も検証されないので、文字列が唯一嘘のない型。パース済みの値が要る layout は自分でパースするか、スキーマを宣言して下のページに受け取らせる。

- `redirect.ts` のターゲットに埋める param を二重に percent-encode しなくなった。URLPattern が返すグループは URL が綴ったままの区間（エスケープ済み）なのに、`href` と同じく値としてもう一度 `encodeURIComponent` していたため、`/:slug/new` を返す `[slug]/legacy/redirect.ts` への `/café/legacy` が `Location: /caf%25C3%25A9/new` になっていた。static ビルドが書き出すリダイレクトページも同じ行き先を持っていた。マッチした区間は復号も再エンコードもせずそのまま移すので、`/caf%C3%A9/new` になり、`%2F` を含む区間や復号できないエスケープも綴りどおりに渡る。

- ブラウザが hydrate を始めるのを、サーバーがストリームで送った Suspense 境界がすべて画面に差し込まれた後にした。

  これまではスクリプトが読み込まれた時点で hydrate していたため、データを待つページ（async な Server Component）では、境界がまだ届いていないか、差し込みがアニメーションフレームを待っているうちに hydrate が始まっていた。そこでルートのコンテキストが変わると（`@k8ordo/color-scheme` を使うアプリでのダークモードの訪問者など）、React は待ちの境界をクライアントで描き直す。その結果、サーバーの HTML が後から届けた `<title>` が body に残って `<title>` が 2 つ並び、裏のタブでは本文の隠しコピーも残っていた。

  - HTML はこれまでどおり届いた順に描かれる。遅れるのはページが操作に応え始める時点で、データを待つページではそのデータが画面に出るまで、裏のタブでは表に出るまで待つ。それまでも、リンクと Server Action のフォームは JavaScript なしのときと同じく動く。
  - `@k8ordo/static` も同じクライアントのエントリを使う。書き出したファイルに差し込み待ちの境界があれば、同じく差し込みを待ってから hydrate する。

- - `[locale]` の `paramsSchema` が受け付けたロケールが、そのページの描画より長く残っていたのを直した。フレームワークはパターンごとにスキーマを専用の非同期コンテキストで走らせ、答えたパターンのコンテキストで描画を始める。
    - 同じスタックの後続スキーマが弾いたパターン（`/en/blog/nope` で slug のスキーマが拒否）の受理は捨てられ、404 は `/en/nothing` と同じく既定ロケールで描かれる。これまでは受理したロケールが残り、404 の言語が URL の形で変わっていた。
    - 静的ビルドはページを並行に描くが、あるページのロケールが別のページや `404.html` に漏れなくなった。これまで `404.html` は、直前に同期的に描き始めたページのロケールで書かれていた。今は常に既定ロケールで書かれる。
    - スキーマが非同期コンテキストに書いた値は、ハンドラを呼んだ側に残らない。
  - `AsyncLocalStorage` を `process.getBuiltinModule` から得られないサーバー側のランタイムでは、`paramsSchema` がロケールを受け付けたときに throw するようにした。これまでは受理したのに `getLocale()` が既定ロケールを返していた（`locales.run` は元から throw していた）。ブラウザでは従来どおり受理するだけで、何も書かない。

- JavaScript が有効なときに `redirect()` で終わる Server Action（`<form action>` など）が、URL だけを変えて新しいページを描画しないまま止まっていたのを直しました。ページ遷移を非同期アクションの外で描くようになった `@k8ordo/router` に合わせ、クライアントで受け取った木を `useDeferredValue` を通して描くようにしています。

- デプロイの前に開いたタブが新しいデプロイのページへ遷移したとき、`error.tsx` を出さずに同じ URL を文書として読み直すようにした。

  これまでは、遷移で取りに行ったペイロードをそのまま描いていた。デプロイを跨ぐとペイロードは新しいデプロイが描いたもので、タブで動いている古いスクリプトが知らないクライアントコンポーネントを参照することがある。その参照は描画の時点で解決に失敗し（`client reference not found`）、ページの `error.tsx` に捕まって、読み直しにはならなかった。

  - ペイロードに、それを描いたときのクライアント（ページの HTML が読み込むスクリプトの URL）を載せる。ブラウザは HTML に埋め込まれたペイロードから自分のスクリプトを覚え、遷移で届いたペイロードが別のスクリプトを名指ししていれば、描かずに同じ URL を文書として読み込む。
  - `@k8ordo/server` の Server Action の答えも同じ扱いにした。別のスクリプト向けに描かれた答えは適用せず、ページを読み直す。
  - スクリプトの URL には中身のハッシュが入るので、ブラウザで動くものが変わらないデプロイでは、開いているタブはこれまでどおりクライアント側で遷移する。

- GUIDE に「Components that need a browser」の節を足しました。React 19.3 の `use(browser())` を `<Suspense>` の下で呼ぶと、サーバー（ビルドでもリクエストでも）は fallback を残し、ブラウザが hydrate 後に描きます。ビルドはそれで止まりません。

- Updated dependencies:
  - @k8ordo/router@0.2.0

## 0.1.0

### Minor Changes

- route ファイルに `error.tsx` と `redirect.ts` が加わる。error.tsx は下の
  部分木が throw したとき layout の内側でそれを描く（router の表では branch の
  `error`）。redirect.ts は表より先に答え、server では 307/308、static では
  meta refresh のページとして書き出される。server は Server Action から
  `redirect()` で終われる（JS なしは 303、あれば遷移の指示）。server では
  page と layout が読み取り専用の `request`（headers と cookies）を受け取り、
  生成される型も server のときだけその項目を持つ。static はビルド時に throw した
  ページを書き出さず、ページ名を挙げて止まる。

- page.tsx / layout.tsx が `export const paramsSchema` でパラメータのスキーマを
  宣言できる。生成器がそれを拾い、ページの描画前に stack 沿いに実行して
  params を型付きの値にする。スキーマが拒んだ値はそのパターンが答えなかった
  ものとして次のパターン（最終的に not-found）へ進み、404 になる。
  static では paths に渡した値が拒まれるとビルドが落ちる。router の Register が
  `params` を持ち、`href` はページが受け取る型で値を受け取って綴る。

- static: `site` オプションで `sitemap.xml` を書き出す（リダイレクトと not-found は
  除く）。`vite dev` でも `'use server'` を見つけた時点で拒む。パターンの走査と
  末尾スラッシュ、pathname の復号を engine / router と共有する。
  server: `serve()` が `{ port, url, close }` を返し、`port: 0` で空きポートを
  取れる。`serve` の直接のテストを足す。
