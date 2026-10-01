# @k8ordo/server

## 1.0.0

### Major Changes

- 1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。0.x だった `@k8ordo/*` のパッケージ（form・state・router・static・server・i18n・color-scheme）はそろって 1.0.0 になり、互いの peer は `^1.0.0` で結ぶ。

  0.1.0 から上げるときに手を入れるもの（詳しくは下の各項目）:

  - peer の `react` / `react-dom` を `>=19.3.0`、`@k8ordo/router` を `^0.1.0` から `^1.0.0` にした。
  - ルートの `@k8ordo/server` は `framework()` と `ServerOptions` だけになった。`serve` は `@k8ordo/server/serve`、`redirect` と `RedirectTarget` / `RouteRequest` は `@k8ordo/server/runtime` から import する。
  - `redirect(to, { permanent })` の第 2 引数と `RedirectOptions` 型を削除した。
  - リクエストハンドラは GET・HEAD・POST 以外のメソッドに `405` で答える。`serve()` は、リクエスト行がパスでないもの（絶対形式・`OPTIONS *`）と、ホストとして読めない `Host` に `400` で答える。
  - `redirect.ts` を、表より先ではなく、表の中で宣言した順番（文字どおりの区間が先）に照合する。リダイレクトの URL への GET・HEAD 以外のリクエストには `405` で答える。
  - Vite の `base` が根からのパスでない（`./` や別オリジン）ときは、ビルドを止める。

  この版で足した主なもの: `guard.ts`・`route.ts`・`loading.tsx`、`cookies()` / `requestHeaders()` / `responseHeaders()` / `nonce()`、`notFound()`、ページの型付きの `search`、Vercel のアダプタ（`@k8ordo/server/vercel`）、Node.js 以外のランタイムでも動くリクエストハンドラ、Vite の `base` の下への配置、リンクの先読み。

### Minor Changes

- serve の配信を整える。ビルドがクライアントの資産ごとに Brotli と gzip のコピー（`.br` / `.gz`）を作り、serve が `Accept-Encoding` で選んで `Vary: Accept-Encoding` 付きで返す。ファイルには中身から作った `ETag` を付けて条件付きリクエストに `304` で答え、1 つの範囲の `Range` には `206`（Safari の `<video>` 再生に要る）で答える。ページとペイロードはストリームのまま `node:zlib` で圧縮し、React が書いた部分ごとに押し出すので、シェルは遅い境界を待たずに届く。

- リンクに触れた時点で、その先のページのペイロードを先読みするようにした。

  - クライアントのランタイムが文書全体で、`<a>` へのポインターの乗り（`pointerover`）、フォーカス（`focusin`）、押し始め（`pointerdown`）を拾い、同じオリジンでクリックがその場に読み込むリンクのペイロードを取りに行く。読み解きまで済ませるので、ページが名指すクライアントコンポーネントも先に読み込まれる。
  - `data-k8ordo-prefetch="false"`（JSX では `data-k8ordo-prefetch={false}`）をリンクか、それを囲む要素に付けると止まる。決めるのはこの属性を持ついちばん近い要素なので、止めた領域の中で `"true"` を付けたリンクは先読みする。
  - 取ったものは、そのページへの次の遷移で 1 度だけ、取り始めから 30 秒以内なら使う。（`@k8ordo/server` では）Server Action の答えが届いたら先読みしたものはすべて捨て、失敗した先読みもその場で捨てる。
  - Speculation Rules は Chromium にしか無く Baseline ではないので使わない。

- `@k8ordo/server/runtime` に `cookies()` と `requestHeaders()` を足した。`cookies()` はリクエストの Cookie で、`guard.ts` と Server Action の中で `get` / `has` / `set` / `delete` できる。同じリクエストの中の書き込みはその後の読み取りに見え、書いたものは答えの `Set-Cookie` になる。`set` の既定は `path: "/"`・`httpOnly: true`・`sameSite: "lax"`。`secure` の既定は `true` だが、素の HTTP でこの機械（`localhost`・`127.0.0.1`・`[::1]`）に届いたリクエストでは `false`（Safari はそこで `Secure` の Cookie を捨てる）。`sameSite: "none"` は常に `Secure`。値はパーセントエンコードして書き、`get` はデコード済みの値を返す。`requestHeaders()` はリクエストが運んできたヘッダー。Server Action はリクエストの文脈を持つようになり、`responseHeaders()` も使える。ページは今までどおり props の `request` を読むだけで、描画中に呼ぶとどれも throw する。

- - route ファイルの `paramsSchema` の検出を、正規表現による文字列走査から Vite 同梱のパーサ（oxc）に置き換えた。`export const { paramsSchema } = locales` のような分割代入も拾い、文字列やコメントの中の同じ語には反応しない。lint の autofix を抑止したり、コード例を別ファイルへ逃がしたりする必要が無くなった。
  - `@k8ordo/server` の下では、生成する `register.gen.ts` が `@k8ordo/router` の `Register` に `request: RouteRequest` を書く。router の `PageProps` / `LayoutProps` はそこから `request` を得るので、route ファイルはモードのパッケージを import せずに済む。`register.gen.ts` と `routes.gen.ts` はどちらも `RouteRequest` を `@k8ordo/server/runtime` から import する。
  - ガイドの「Parameters with a schema」を `PageProps<'/products/:id'>` で書き直した。

- `@k8ordo/router` に `notFound()` と `isNotFound()` を足した。フレームワークのページが自分の pathname は実はページではない（id が名指す商品が無い）と言うと、いちばん近い `not-found.tsx` がその上のレイアウトの内側で 404 として答える。`redirect()` と同じくブランド付きで投げる。`@k8ordo/server` では、ステータスを正しくするため、文書（と `HEAD`）はページ自身のコンポーネントが答えるまで送り始めない。ページが `<Suspense>` の下に置いたものはその後に流れる。クライアント遷移のペイロードは待たずに流れ、遅れて届いた `notFound()` は同じ URL の文書の読み込みになる。`@k8ordo/static` では、`paths` が渡した pathname のページが `notFound()` と言うと、その pathname を挙げてビルドを止める。

- Vercel のアダプタ `@k8ordo/server/vercel` を追加。`plugins: [framework(), vercel()]` とすると、`vite build` が Vercel の Build Output API（v3）の形で `.vercel/output/` も書き、`vercel build` / `vercel deploy --prebuilt` がそのままデプロイする。クライアントのビルドは CDN の静的ファイル（`assets/` はファイルが答えたときだけ immutable）、それ以外はリクエストハンドラを `fetch` として渡すストリーミングの Node.js 関数 1 つになる。Vite の `base` を指定したビルドでは、静的ファイルをその下に置く。関数は自分のディレクトリしか持てないので、`vercel()` の下ではハンドラをすべての依存ごと bundle する（ネイティブのバイナリを持つ依存は動かない）。

- ルートファイル `route.ts` を足した。答えるリクエストのメソッドごとに関数（`GET` / `POST` など）を export し、`{ request, params }` を受け取って `Response` を返す。RSS・robots・JSON・webhook のようなページではない答えに使う。表の順番にはページと同じく並び、ページや redirect.ts と同じディレクトリには置けず、メソッドを 1 つも export しなければ拒む。`@k8ordo/server` では export したメソッドにだけ答え（`HEAD` は `GET` から本文を外したもの、ほかは `Allow` 付きの `405`）、上の guard が先に走り、同じ origin は求めず、`cookies()` などが使える。`@k8ordo/static` ではビルドが `GET` を 1 度呼んで答えを pathname のファイルとして書き（`feed.xml/route.ts` → `feed.xml`、`site` があればリクエストの origin はそれ）、`GET` 以外を export する `route.ts` は名指しで拒む。`@k8ordo/router` に型 `RouteContext<P>` を足した。

- ページが `@k8ordo/state` の url スキーマを `export const search = listState.url` と export したときだけ、そのページが型付きの `search` を props で受け取るようにした（`PageProps` の `search`、生成される `Register` の `search`）。search が変わる遷移（GET フォーム・リンク・url の `update()`）では、そのページだけをその場で取り直す（スクロールとフォーカスはそのまま）。ほかのページとレイアウトは今までどおり search を見ない。`@k8ordo/static` はこの export をビルド時（と `vite dev`）に名指しで断る。`@k8ordo/router` の `useInterceptedNavigation` には、pathname が変わらない遷移でも読み込むべきかをホストが答える `refresh(url)` を足した。

- Vite の `base` の下（`base: '/docs/'` など、オリジンのサブパス）にアプリを置いても動くようにした。ルート表はアプリの根から書いたままで、URL との境目で base を付け外しする。

  - `@k8ordo/router`: `href` / `navigateTo` / `bindParams` がリンクの前に `import.meta.env.BASE_URL` を付ける。`href` の戻り値はリンク先の URL なので、型を表のパスの形（`PathFor<P>`）から `string` に変えた。`usePathname` と `<Router>` の照合は base を外した pathname で行い、base の外の URL は `<Router>` が引き受けない。付け外しの手順として `withBase(pathname, base?)` / `withoutBase(pathname, base?)`（base の外は `null`）を公開する。
  - `@k8ordo/state`: `href(path, values)` の返すリンクの前に base を付ける。パスは表と同じく根から書く。Vite の外（Next.js など）では何も付けない。
  - `@k8ordo/static` / `@k8ordo/server`: ハンドラは base を外した pathname でページ・ペイロード・redirect を解き、base の外には `404` を返す。`redirect.ts` の行き先（表のパターン）には base を付けて送る。クライアントは base の下の同じオリジンの URL だけを引き受け、hydrate するかどうかも base を外して比べる。`base` が根からのパスでない（`./` や別オリジン）ときはビルドを止める。
  - `@k8ordo/static`: 事前描画はハンドラに base を付けた URL で頼み、ファイルは `dist/client/` の中の表の pathname に書く。`sitemap.xml` の `<loc>` にも base を含める。`paths` オプションは base を付けない pathname を受ける。
  - `@k8ordo/server`: Server Action の `redirect(to)` は URL をそのまま送るので、`href()` で作る。`serve` はビルドの base を `dist/rsc/index.js` の `base` から読み、クライアントのビルドのファイルをその下で配る（`immutable` の判定も base の下の `assets/` で行う）。

- peer を `react` / `react-dom` とも `>=19.3.0` にしました。`references/boundaries.md` の「Components that need a browser」が前提にしている `use(browser())` は React 19.3 の API で、これまでの `>=19.2.6` ではガイドどおりに書くと動きませんでした。

- `redirect(to, { permanent })` の第 2 引数と `RedirectOptions` 型を消した。JavaScript なしで送られたフォームにはハンドラが常に `303` を返し、クライアントランタイム経由の呼び出しには行き先しか返さないので、`permanent` はどちらの経路でも何もしていなかった。POST への `308` はブラウザに POST をやり直させるため、Server Action の終わり方として意味のある使い道も無い。`redirect(to)` と書いてください。`redirect.ts` が default export する `{ to, permanent }` はこれまでどおり `307` / `308` を選ぶ。

- 実行時の API をプラグインと別の入口に分けた。ルートの `@k8ordo/server` はプラグインの `framework()` と `ServerOptions` だけを持つ。

  これまでルートのエントリは 1 つのファイルで `serve` / `redirect` と並んで `vite`・`@vitejs/plugin-react`・`@vitejs/plugin-rsc` を import していたため、ビルドしたアプリ（`dist/rsc/index.js` と `serve.js`）が `pnpm install --prod` した環境で `ERR_MODULE_NOT_FOUND` で落ちていた。新しい入口は Vite を読まないので、`vite` は devDependency のままでよい。`vite.config.ts` は `@k8ordo/static` と同一のまま。

  - `serve` / `Server` / `ServeOptions` → `@k8ordo/server/serve`
  - `redirect` / `RedirectTarget` / `RouteRequest` → `@k8ordo/server/runtime`（`cookies()` などリクエストの中で使う API もここにある）
  - 生成する `routes.gen.ts` / `register.gen.ts` も `RouteRequest` を `@k8ordo/server/runtime` から import する（次のビルドで書き直される）。

  リクエストハンドラ（`dist/rsc/index.js` の `(request: Request) => Promise<Response>`）がビルドの正式な出口になる。`@k8ordo/server/runtime` は `serve` の Node 専用の依存を読まないので、ハンドラが実行環境から借りるのは `node:async_hooks` の `AsyncLocalStorage` だけで、Node.js・Bun・Deno・`nodejs_compat` の Cloudflare Workers でそのまま動く。

- Server Action を、送られた先のページの文脈で実行するようにした。action のリクエストでもページの params のスキーマが走り、その文脈（`@k8ordo/i18n` が記録するロケールなど）の中で action が走るので、`/ja/…` のページから送られた action は `ja` で文言を作る。ロケールを `bind` したり `locales.run` で囲んだりする必要はなくなった。

- Content-Security-Policy のために、フレームワークが自分で出すインラインスクリプト（hydration 用に HTML へ書くペイロードと React のもの）と起動のモジュールに、リクエストごとに作った nonce を付けるようにした。`@k8ordo/server/runtime` の `nonce()` でそれを読める（guard.ts・レイアウトやページ・Server Action のどこからでも、描画の中でも同じ値）。フレームワークはポリシーを決めないので、アプリが guard.ts でそれを名指す `Content-Security-Policy` を書く。

- ルートファイル `loading.tsx` を足した。置いた階層で、その下を Suspense で包み、サスペンドしている間に出る（その階層の `error.tsx` の境界の内側）。クライアント遷移でそのディレクトリに入るときと、（`@k8ordo/server` では）ページの中がストリームの途中でサスペンドしたときに出る。`@k8ordo/router` の表の枝も `loading` を取れるようにし、進行中のページの切り替えの行き先を返す `usePendingPathname()`（無ければ `null`）を足した。すでに出ている Suspense の下の切り替えは今までどおり前のページを残すので、その待ちはこれで見せる。

- ルートファイル `guard.ts` を足した。どの階層にも置け、その下で答えるもの（ページ・そのペイロード・`HEAD`・送られた Server Action・下の `not-found.tsx`）の前に外から順に走る。`{ request, params }` を受け取り、`Response` を返せばそこで打ち切り、何も返さなければ次へ通す。通すときは `@k8ordo/server/runtime` の `responseHeaders()` で最終的な応答に付けるヘッダーを添えられる。型は `Guard<P>` / `GuardContext<P>`。ページの応答を書き換える `next()` は無い。`@k8ordo/static` は `guard.ts` を、ビルドでは名指しで全部、`vite dev` ではコンパイルした時点で拒む。

### Patch Changes

- `redirect.ts` を、表と同じく末尾のスラッシュを落としたパス名で照合するようにした。これまでは生のパス名で照合していたので、`old/redirect.ts` があっても `/old/` の文書リクエストは 404 になっていた。クライアント遷移で `/old/` へ行くと、ペイロードの代わりにリダイレクトを受け取って `/old/` を文書として読み直し、そこで 404 に落ちていた。

- ページだけを持つルートグループ（`(home)/page.tsx` のように、`layout.tsx` も子のディレクトリも無いもの）で、アプリケーションが落ちなくなった。生成器がそのグループをページそのもの（葉）として表に書き、`@k8ordo/router` の `defineRoutes` が「親の `/` を宣言し直す」として `route group "/(home)" must have children` を投げていた。表の生成は通り、表を読み込んだところで初めて落ちていた（`@k8ordo/server` では起動時）。グループは常に `children` を持つ枝として書く（`@k8ordo/server` では、`(home)/guard.ts` を置けば `/` だけに guard が効く）。

- `serve()` が配るファイルの `content-type` を、拡張子に登録された型で決めるようにした。

  - これまでは 15 種の手書きの表で、`.webmanifest`・`.avif`・`.gif`・`.mjs`・`.woff`・`.xml`・`.pdf`・`.mp4` などは `application/octet-stream` で返っていた。表を `mime-types` に置き換え、登録された型で返る。テキストには `charset=utf-8` が付く。
  - 登録の無い拡張子は、これまでどおり `application/octet-stream`。
  - `.ico` は `image/x-icon` から、登録された `image/vnd.microsoft.icon` に変わる。

- 同梱ドキュメントを実装に追従させました。

  - 共有節の「ビルドが拒むもの」の表を今のエラー文と正しい例に、生成ファイルの例を今の `routes.gen.ts` に、`paramsSchema` の検査が型検査であることに直しました。
  - static の同梱ドキュメントから、サーバー前提の記述（描画時エラーで 500 が返る、など）を外しました。`paths` のビルドエラーと、`_` / `.` で始まるファイルが無視されることも書き足しています。
  - server の同梱ドキュメントに `serve` の `dist` / `host` と既定値、ファイルを返すのは GET / HEAD だけであることを書きました。`redirect()` の `permanent` を使える option としては載せなくなりました。
  - `llms.txt` に公開型を足しました。

- 同梱ドキュメントを、入口の `GUIDE.md` とトピックごとの `references/*.md` に分けました。`@k8ordo/ui` と同じ形です。

  - static は routing / params / errors / boundaries / deploy の 5 本、server はそれに actions / guards を足した 7 本で、docs サイトの `/static/…`・`/server/…` のページと同じ分け方です。
  - `llms.txt` に references を載せ、docs サイトの `/llms.txt` からも `/static/docs/references/…` などの markdown の twin に辿れるようにしました。
  - static の GUIDE で、`framework()` の option の一覧から `csp` が抜けていたのを足しました。

- layout が受け取る `params` を、型（生成される `routes.gen.ts` の `Layout` と router の `LayoutProps`）とガイドが言うとおり文字列に戻した。ページのスキーマが通した値がスタックの全要素に渡っていたため、`[id]` の下のページが `z.coerce.number()` を宣言していると、その上の layout は型が `string` と言っている場所で数値を受け取っていた（`params.id.toUpperCase()` が型を通って実行時に落ちる）。layout は自分の下にどのページが来るか知らず、その下の `not-found.tsx` はレイアウトのスキーマが拒んでも描かれるので、文字列が唯一嘘のない型。パース済みの値が要る layout は自分でパースするか、スキーマを宣言して下のページに受け取らせる。

- `redirect.ts` のターゲットに埋める param を二重に percent-encode しなくなった。URLPattern が返すグループは URL が綴ったままの区間（エスケープ済み）なのに、`href` と同じく値としてもう一度 `encodeURIComponent` していたため、`/:slug/new` を返す `[slug]/legacy/redirect.ts` への `/café/legacy` が `Location: /caf%25C3%25A9/new` になっていた。static ビルドが書き出すリダイレクトページも同じ行き先を持っていた。マッチした区間は復号も再エンコードもせずそのまま移すので、`/caf%C3%A9/new` になり、`%2F` を含む区間や復号できないエスケープも綴りどおりに渡る。

- `not-found.tsx` を 1 つも置かないアプリで、表にない URL や `notFound()` に答えるフレームワーク自身の 404 を、文書ごと差し替えずルートレイアウトの内側に描くようにした。サイトの枠・`<html lang>`・スタイルシートが残る。`<title>` は `Not found`。ルートレイアウトが無いときだけ、これまでどおり自分で文書を書く（`@k8ordo/static` では `vite dev` の答え。`not-found.tsx` の無い静的ビルドは `404.html` を書かない）。

- `serve()` が、パスが `//`（や `/\`）で始まるリクエストを別のホストの URL として handler に渡していたのを直した（セキュリティ）。

  - これまでは `new URL(パス, http://<Host>)` と解決していたので、`https://example.com//evil.test/x` は `http://evil.test/x` として handler に届いていた。Server Action の同一オリジン検査は `Origin` をこの URL のホストと比べるため、evil.test のページからこの URL へ送ったフォームが検査を通り、action が走った。cookie は SameSite の規則どおりに付く（`SameSite=None` の cookie や、同じサイトの別のサブドメインから送ったときは付く）。`guard.ts` や `route.ts` の `request.url` のホストも evil.test になり、`new URL('/login', request.url)` のようなリダイレクトは evil.test へ向かっていた。
  - パスは `Host` のホストの後ろに文字列としてつなぐ。`//evil.test/x` は `example.com` の `//evil.test/x` というパスになる。
  - 挙動の変化: リクエスト行がパスでないもの（プロキシへ送る絶対形式の `GET http://…`、`OPTIONS *`）と、`Host` がホストとして読めないもの（空、`@` や `/` を含むもの）には `400` で答える。これまで絶対形式はそこに書かれたホストで配り、`OPTIONS *` はページの読み込みとして描いていた。ブラウザがオリジンサーバーへ送るのはパスだけなので、ブラウザからのリクエストは変わらない。`Host` を送らない HTTP/1.0 のリクエストは、これまでどおり `localhost` の URL で handler に渡す。
  - `@k8ordo/server/vercel` など、基盤が URL を作って handler を呼ぶホストは、この変更の対象外。

- ブラウザが hydrate を始めるのを、サーバーがストリームで送った Suspense 境界がすべて画面に差し込まれた後にした。

  これまではスクリプトが読み込まれた時点で hydrate していたため、データを待つページ（async な Server Component）では、境界がまだ届いていないか、差し込みがアニメーションフレームを待っているうちに hydrate が始まっていた。そこでルートのコンテキストが変わると（`@k8ordo/color-scheme` を使うアプリでのダークモードの訪問者など）、React は待ちの境界をクライアントで描き直す。その結果、サーバーの HTML が後から届けた `<title>` が body に残って `<title>` が 2 つ並び、裏のタブでは本文の隠しコピーも残っていた。

  - HTML はこれまでどおり届いた順に描かれる。遅れるのはページが操作に応え始める時点で、データを待つページではそのデータが画面に出るまで、裏のタブでは表に出るまで待つ。それまでも、リンクと Server Action のフォームは JavaScript なしのときと同じく動く。

- - `[locale]` の `paramsSchema` が受け付けたロケールが、そのページの描画より長く残っていたのを直した。フレームワークはパターンごとにスキーマを専用の非同期コンテキストで走らせ、答えたパターンのコンテキストで描画を始める。
    - 同じスタックの後続スキーマが弾いたパターン（`/en/blog/nope` で slug のスキーマが拒否）の受理は捨てられ、404 は `/en/nothing` と同じ道筋で描かれる（`not-found.tsx` の上のレイアウトのスキーマがロケールを受け付ければ、その URL のロケールで）。これまでは受理したロケールが残り、404 の言語が URL の形で変わっていた。
    - 静的ビルドはページを並行に描くが、あるページのロケールが別のページや `404.html` に漏れなくなった。これまで `404.html` は、直前に同期的に描き始めたページのロケールで書かれていた。今は常に既定ロケールで書かれる。
    - スキーマが非同期コンテキストに書いた値は、ハンドラを呼んだ側に残らない。
  - `AsyncLocalStorage` を `process.getBuiltinModule` から得られないサーバー側のランタイムでは、`paramsSchema` がロケールを受け付けたときに throw するようにした。これまでは受理したのに `getLocale()` が既定ロケールを返していた（`locales.run` は元から throw していた）。ブラウザでは従来どおり受理するだけで、何も書かない。

- JavaScript が有効なときに `redirect()` で終わる Server Action（`<form action>` など）が、URL だけを変えて新しいページを描画しないまま止まっていたのを直しました。ページ遷移を非同期アクションの外で描くようになった `@k8ordo/router` に合わせ、クライアントで受け取った木を `useDeferredValue` を通して描くようにしています。

- デプロイの前に開いたタブが新しいデプロイのページへ遷移したとき、`error.tsx` を出さずに同じ URL を文書として読み直すようにした。

  これまでは、遷移で取りに行ったペイロードをそのまま描いていた。デプロイを跨ぐとペイロードは新しいデプロイが描いたもので、タブで動いている古いスクリプトが知らないクライアントコンポーネントを参照することがある。その参照は描画の時点で解決に失敗し（`client reference not found`）、ページの `error.tsx` に捕まって、読み直しにはならなかった。

  - ペイロードに、それを描いたときのクライアント（ページの HTML が読み込むスクリプトの URL）を載せる。ブラウザは HTML に埋め込まれたペイロードから自分のスクリプトを覚え、遷移で届いたペイロードが別のスクリプトを名指ししていれば、描かずに同じ URL を文書として読み込む。
  - `@k8ordo/server` の Server Action の答えも同じ扱いにした。別のスクリプト向けに描かれた答えは適用せず、ページを読み直す。
  - スクリプトの URL には中身のハッシュが入るので、ブラウザで動くものが変わらないデプロイでは、開いているタブはこれまでどおりクライアント側で遷移する。

- `/en/missing` のように既定でないロケールの URL の 404 を、その URL のロケールで描くようにした。

  これまで catch-all（`not-found.tsx`）の params はどのスキーマも通らなかったので、サーバーは `@k8ordo/i18n` のロケールを知らないまま既定のロケールで描いていた。ルートレイアウトは pathname から `<html lang="en">` を書くので、JavaScript の無い訪問者には lang と本文が食い違い、ブラウザでは文言が URL を読むので hydration が失敗していた。

  - catch-all に落ちたとき、`not-found.tsx` の上にあるレイアウトのスキーマを params に通す。全部が受理すればその文脈で描くので、`/en/missing` はサーバーの HTML の時点で英語になる。拒まれても（`/fr/missing`）catch-all は答え、これまでどおりどの文脈にも入らずに描く。
  - not-found とレイアウトが受け取る params は文字列のまま。生成される `routes.gen.ts` に `catchAllSchemas` が増える（`paramSchemas` とは別。そちらはページの params とリンクの型になる）。
  - `@k8ordo/static` のビルドが書く `404.html` は 1 つで、番兵の pathname で描くので既定のロケールのまま（ブラウザが訪問者の URL で描き直す）。`vite dev` では URL のロケールで描く。

- `references/boundaries.md` に「Components that need a browser」の節を足しました。React 19.3 の `use(browser())` を `<Suspense>` の下で呼ぶと、サーバー（ビルドでもリクエストでも）は fallback を残し、ブラウザが hydrate 後に描きます。ビルドはそれで止まりません。

- `guard.ts` が返す `Response` の `location` には Vite の `base` が自動では付かないことをガイドに書く。

  - `base` の節で、`redirect.ts`（base を前に付けて送られる）と、アプリが自分で作るリダイレクト（Server Action の `redirect()` と、guard が返す `Response` の `location`。書いたまま送られるので `href()` で作る。ほかの方法で作った pathname には `withBase()` で base を付ける）を分け、後者を `@k8ordo/server` のものとして書く。
  - `@k8ordo/server` の Guards の例を `href('/login')` で作り、`location` が書いたまま送られることを書く。
  - サイトの `/server/guards` と `/server/deploy` も合わせ、`/static/deploy` からは Server Action の `redirect()` の記述を外す。

- リクエストハンドラが GET・HEAD・POST 以外のメソッドに `405` と `Allow: GET, HEAD, POST` で答え、HEAD には本文を返さないようにした。

  - これまでハンドラは POST 以外をすべてページの読み込みとして扱い、PUT・DELETE・PATCH にもページを描いて `200` を返していた。`405` を返すのは `serve()` ではなくハンドラなので、ハンドラを直接呼ぶホストでも同じ答えになる。
  - HEAD には、GET と同じステータスと `content-type` を本文 `null` で返す。表にない URL には何も描かずに `404` で答え、ページは自身のコンポーネントが答えるまで（`notFound()` と言うかを確かめるため）描いて止める。これまでは GET と同じくページ全体を描き切ってから本文を捨てていた。
  - `@k8ordo/static` では `vite dev` の開発サーバーが同じハンドラで答えるので、そこでも同じ挙動になる。ビルドが書き出すファイルは変わらない。

- `[slug]/redirect.ts` のようにパラメータのディレクトリに置いた `redirect.ts` が、隣の文字どおりのページ（`about/page.tsx`）の URL を奪わなくなった。

  - これまでは、表を照合する前に `redirect.ts` を照合していた。一方で表の並び順と影の検査は「文字どおりの区間が先に勝つ」前提なので、`[slug]/redirect.ts` の隣に `about/page.tsx` があると、`/about` は両モードで必ず 307 になり、ビルドも何も報告しなかった。
  - `redirect.ts` は、`route.ts` と同じく、何も描かないコンポーネントで表の中に自分の位置を持つ。宣言した順番（文字どおりの区間が先、パラメータが後）で照合され、表がそのパターンに行き着いたときだけリダイレクトで答える。
  - 挙動の変化: リダイレクトの URL への `GET`・`HEAD` 以外のリクエストには、`Allow: GET, HEAD` 付きの `405` で答える。これまで POST は表へ進んで後に宣言されたパターンのページや not-found が答え、そのほかのメソッドには 307 / 308 を返していた。
  - リダイレクトの URL も表に載るので、生成される `Register` を通じて `href()` などの型付きのパスに含まれる。

- Server Action の `redirect()` の例で、行き先を `href()` で作るようにした（`@k8ordo/server` の GUIDE の `signIn` と README、`@k8ordo/form` の GUIDE と README、サイトの `/server/actions`）。`redirect(to)` は URL を書いたまま送り、Vite の `base` を付けない。素の pathname を渡す例は、base の下に置いたアプリで訪問者を base の外へ送ってしまい、「`href()` で作る」というガイド自身の説明とも食い違っていた。

- Updated dependencies:
  - @k8ordo/router@1.0.0

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
