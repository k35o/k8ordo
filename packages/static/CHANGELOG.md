# @k8ordo/static

## 0.2.0

### Minor Changes

- リンクに触れた時点で、その先のページのペイロードを先読みするようにした。

  - クライアントのランタイムが文書全体で、`<a>` へのポインターの乗り（`pointerover`）、フォーカス（`focusin`）、押し始め（`pointerdown`）を拾い、同じオリジンでクリックがその場に読み込むリンクのペイロードを取りに行く。読み解きまで済ませるので、ページが名指すクライアントコンポーネントも先に読み込まれる。
  - `data-k8ordo-prefetch="false"`（JSX では `data-k8ordo-prefetch={false}`）をリンクか、それを囲む要素に付けると止まる。決めるのはこの属性を持ついちばん近い要素なので、止めた領域の中で `"true"` を付けたリンクは先読みする。
  - 取ったものは、そのページへの次の遷移で 1 度だけ、取り始めから 30 秒以内なら使う。Server Action の答えが届いたら先読みしたものはすべて捨て、失敗した先読みもその場で捨てる。
  - Speculation Rules は Chromium にしか無く Baseline ではないので使わない。

- - route ファイルの `paramsSchema` の検出を、正規表現による文字列走査から Vite 同梱のパーサ（oxc）に置き換えた。`export const { paramsSchema } = locales` のような分割代入も拾い、文字列やコメントの中の同じ語には反応しない。lint の autofix を抑止したり、コード例を別ファイルへ逃がしたりする必要が無くなった。
  - `@k8ordo/server` の下では、生成する `register.gen.ts` が `@k8ordo/router` の `Register` に `request: RouteRequest` を書く。router の `PageProps` / `LayoutProps` はそこから `request` を得るので、route ファイルはモードのパッケージを import せずに済む。`register.gen.ts` と `routes.gen.ts` はどちらも `RouteRequest` を `@k8ordo/server/runtime` から import する。
  - ガイドの「Parameters with a schema」を `PageProps<'/products/:id'>` で書き直した。

- `@k8ordo/router` に `notFound()` と `isNotFound()` を足した。フレームワークのページが自分の pathname は実はページではない（id が名指す商品が無い）と言うと、いちばん近い `not-found.tsx` がその上のレイアウトの内側で 404 として答える。`redirect()` と同じくブランド付きで投げる。`@k8ordo/server` では、ステータスを正しくするため、文書（と `HEAD`）はページ自身のコンポーネントが答えるまで送り始めない。ページが `<Suspense>` の下に置いたものはその後に流れる。クライアント遷移のペイロードは待たずに流れ、遅れて届いた `notFound()` は同じ URL の文書の読み込みになる。`@k8ordo/static` では、`paths` が渡した pathname のページが `notFound()` と言うと、その pathname を挙げてビルドを止める。

- ルートファイル `route.ts` を足した。答えるリクエストのメソッドごとに関数（`GET` / `POST` など）を export し、`{ request, params }` を受け取って `Response` を返す。RSS・robots・JSON・webhook のようなページではない答えに使う。表の順番にはページと同じく並び、ページや redirect.ts と同じディレクトリには置けず、メソッドを 1 つも export しなければ拒む。`@k8ordo/server` では export したメソッドにだけ答え（`HEAD` は `GET` から本文を外したもの、ほかは `Allow` 付きの `405`）、上の guard が先に走り、同じ origin は求めず、`cookies()` などが使える。`@k8ordo/static` ではビルドが `GET` を 1 度呼んで答えを pathname のファイルとして書き（`feed.xml/route.ts` → `feed.xml`、`site` があればリクエストの origin はそれ）、`GET` 以外を export する `route.ts` は名指しで拒む。`@k8ordo/router` に型 `RouteContext<P>` を足した。

- Vite の `base` の下（`base: '/docs/'` など、オリジンのサブパス）にアプリを置いても動くようにした。ルート表はアプリの根から書いたままで、URL との境目で base を付け外しする。

  - `@k8ordo/router`: `href` / `navigateTo` / `bindParams` がリンクの前に `import.meta.env.BASE_URL` を付ける。`href` の戻り値はリンク先の URL なので、型を表のパスの形（`PathFor<P>`）から `string` に変えた。`usePathname` と `<Router>` の照合は base を外した pathname で行い、base の外の URL は `<Router>` が引き受けない。付け外しの手順として `withBase(pathname, base?)` / `withoutBase(pathname, base?)`（base の外は `null`）を公開する。
  - `@k8ordo/state`: `href(path, values)` の返すリンクの前に base を付ける。パスは表と同じく根から書く。Vite の外（Next.js など）では何も付けない。
  - `@k8ordo/static` / `@k8ordo/server`: ハンドラは base を外した pathname でページ・ペイロード・redirect を解き、base の外には `404` を返す。`redirect.ts` の行き先（表のパターン）には base を付けて送る。Server Action の `redirect(to)` は URL をそのまま送るので、`href()` で作る。クライアントは base の下の同じオリジンの URL だけを引き受け、hydrate するかどうかも base を外して比べる。`base` が根からのパスでない（`./` や別オリジン）ときはビルドを止める。
  - `@k8ordo/static`: 事前描画はハンドラに base を付けた URL で頼み、ファイルは `dist/client/` の中の表の pathname に書く。`sitemap.xml` の `<loc>` にも base を含める。`paths` オプションは base を付けない pathname を受ける。
  - `@k8ordo/server`: `serve` はビルドの base を `dist/rsc/index.js` の `base` から読み、クライアントのビルドのファイルをその下で配る（`immutable` の判定も base の下の `assets/` で行う）。

- peer を `react` / `react-dom` とも `>=19.3.0` にしました。GUIDE の「Components that need a browser」が前提にしている `use(browser())` は React 19.3 の API で、これまでの `>=19.2.6` ではガイドどおりに書くと動きませんでした。

- `sitemap(site, pathnames)` の export をやめた。モードのパッケージの公開面はプラグインとその options に絞ってあり、どこからも import されていなかった。`sitemap.xml` は引き続き `site` オプションでビルドが書き出す。

- ルートファイル `guard.ts` を足した。どの階層にも置け、その下で答えるもの（ページ・そのペイロード・`HEAD`・送られた Server Action・下の `not-found.tsx`）の前に外から順に走る。`{ request, params }` を受け取り、`Response` を返せばそこで打ち切り、何も返さなければ次へ通す。通すときは `@k8ordo/server/runtime` の `responseHeaders()` で最終的な応答に付けるヘッダーを添えられる。型は `Guard<P>` / `GuardContext<P>`。ページの応答を書き換える `next()` は無い。`@k8ordo/static` は `guard.ts` を、ビルドでは名指しで全部、`vite dev` ではコンパイルした時点で拒む。

### Patch Changes

- `not-found.tsx` の描画に失敗したらビルドを止める。これまでは 404.html の書き出しだけがハンドラの 500 を見ておらず、404.html を書かないまま exit 0 で終わり、最後のログも `k8ordo: wrote N routes and 404.html` と書いていた。ページの失敗と同じく `static build could not render 404.html — see the error above` で止まり、ページと並んで失敗したときは一緒に名前を挙げる。

- ページだけを持つルートグループ（`(home)/page.tsx` のように、`layout.tsx` も子のディレクトリも無いもの）で、アプリケーションが落ちなくなった。生成器がそのグループをページそのもの（葉）として表に書き、`@k8ordo/router` の `defineRoutes` が「親の `/` を宣言し直す」として `route group "/(home)" must have children` を投げていた。表の生成は通り、表を読み込んだところで初めて落ちていた（`@k8ordo/server` では起動時）。グループは常に `children` を持つ枝として書くので、`(home)/guard.ts` を置けば `/` だけに guard が効く。

- 同梱ドキュメントを実装に追従させました。

  - 共有節の「ビルドが拒むもの」の表を今のエラー文と正しい例に、生成ファイルの例を今の `routes.gen.ts` に、`paramsSchema` の検査が型検査であることに直しました。
  - static の GUIDE から、サーバー前提の記述（描画時エラーで 500 が返る、など）を外しました。`paths` のビルドエラーと、`_` / `.` で始まるファイルが無視されることも書き足しています。
  - server の GUIDE に `serve` の `dist` / `host` と既定値、ファイルを返すのは GET / HEAD だけであることを書きました。`redirect()` の `permanent` を使える option としては載せなくなりました。
  - `llms.txt` に公開型を足し、CLAUDE.md の Layout 節を英語にしました。

- layout が受け取る `params` を、型（router の `LayoutProps`）とガイドが言うとおり文字列に戻した。ページのスキーマが通した値がスタックの全要素に渡っていたため、`[id]` の下のページが `z.coerce.number()` を宣言していると、その上の layout は型が `string` と言っている場所で数値を受け取っていた（`params.id.toUpperCase()` が型を通って実行時に落ちる）。layout は自分の下にどのページが来るか知らず、`not-found.tsx` の下では何も検証されないので、文字列が唯一嘘のない型。パース済みの値が要る layout は自分でパースするか、スキーマを宣言して下のページに受け取らせる。

- `redirect.ts` のターゲットに埋める param を二重に percent-encode しなくなった。URLPattern が返すグループは URL が綴ったままの区間（エスケープ済み）なのに、`href` と同じく値としてもう一度 `encodeURIComponent` していたため、`/:slug/new` を返す `[slug]/legacy/redirect.ts` への `/café/legacy` が `Location: /caf%25C3%25A9/new` になっていた。static ビルドが書き出すリダイレクトページも同じ行き先を持っていた。マッチした区間は復号も再エンコードもせずそのまま移すので、`/caf%C3%A9/new` になり、`%2F` を含む区間や復号できないエスケープも綴りどおりに渡る。

- `not-found.tsx` を 1 つも置かないアプリで、表にない URL や `notFound()` に答えるフレームワーク自身の 404 を、文書ごと差し替えずルートレイアウトの内側に描くようにした。サイトの枠・`<html lang>`・スタイルシートが残る。`<title>` は `Not found`。ルートレイアウトが無いときだけ、これまでどおり自分で文書を書く。

- redirect.ts を書き出すページで、行き先を HTML として正しくエスケープする。これまでは `&` と `"` しかエスケープしておらず、行き先に `<` や `>` を含むと、フォールバックのリンクの文字列がタグとして解釈されていた（例: `/tags/<b>` はリンクの中に `<b>` 要素を作る）。sitemap.xml と同じく `&` `<` `>` `"` `'` の 5 文字をエスケープする。

- 公開する tarball に `LICENSE`（MIT の本文）を同梱しました。これまでは `package.json` の `license` フィールドだけで、ライセンス本文が入っていませんでした。

- ブラウザが hydrate を始めるのを、サーバーがストリームで送った Suspense 境界がすべて画面に差し込まれた後にした。

  これまではスクリプトが読み込まれた時点で hydrate していたため、データを待つページ（async な Server Component）では、境界がまだ届いていないか、差し込みがアニメーションフレームを待っているうちに hydrate が始まっていた。そこでルートのコンテキストが変わると（`@k8ordo/color-scheme` を使うアプリでのダークモードの訪問者など）、React は待ちの境界をクライアントで描き直す。その結果、サーバーの HTML が後から届けた `<title>` が body に残って `<title>` が 2 つ並び、裏のタブでは本文の隠しコピーも残っていた。

  - HTML はこれまでどおり届いた順に描かれる。遅れるのはページが操作に応え始める時点で、データを待つページではそのデータが画面に出るまで、裏のタブでは表に出るまで待つ。それまでも、リンクと Server Action のフォームは JavaScript なしのときと同じく動く。
  - `@k8ordo/static` も同じクライアントのエントリを使う。書き出したファイルに差し込み待ちの境界があれば、同じく差し込みを待ってから hydrate する。

- ブラウザは、今いる pathname のために描かれた HTML だけを hydrate するようにした。

  静的ビルドの `404.html` はビルドの番兵の pathname で 1 回だけ描かれ、どの URL でも配られる。描画中に URL を読む部品（`@k8ordo/i18n` の文言など）は、`/en/…` でこれを hydrate するとサーバーの HTML と食い違い、React がエラー（本番では #418）を出してページを作り直していた。サーバーの `<title>` も `<head>` に残って 2 つ並んでいた。

  - 描いたときの pathname と `location.pathname` が違う文書は、`createRoot` で訪問者の URL で描き直す。末尾の `/` の違いは同じ pathname として扱う（`usePathname` と同じ正規化）。
  - 見た目の結末はこれまでと同じ（JavaScript が動くまでは既定のロケール、動いたら訪問者のロケール）で、エラーと `<title>` の重複が無くなる。

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

- `/en/missing` のように既定でないロケールの URL の 404 を、その URL のロケールで描くようにした。

  これまで catch-all（`not-found.tsx`）の params はどのスキーマも通らなかったので、サーバーは `@k8ordo/i18n` のロケールを知らないまま既定のロケールで描いていた。ルートレイアウトは pathname から `<html lang="en">` を書くので、JavaScript の無い訪問者には lang と本文が食い違い、ブラウザでは文言が URL を読むので hydration が失敗していた。

  - catch-all に落ちたとき、`not-found.tsx` の上にあるレイアウトのスキーマを params に通す。全部が受理すればその文脈で描くので、`/en/missing` はサーバーの HTML の時点で英語になる。拒まれても（`/fr/missing`）catch-all は答え、これまでどおりどの文脈にも入らずに描く。
  - not-found とレイアウトが受け取る params は文字列のまま。生成される `routes.gen.ts` に `catchAllSchemas` が増える（`paramSchemas` とは別。そちらはページの params とリンクの型になる）。
  - `@k8ordo/router`: `LayoutProps` と GUIDE の「`not-found.tsx` の下では何も検証されない」という説明を、スキーマは走るが拒んでも描かれる、に直した。型は変わらない。

- GUIDE に「Components that need a browser」の節を足しました。React 19.3 の `use(browser())` を `<Suspense>` の下で呼ぶと、サーバー（ビルドでもリクエストでも）は fallback を残し、ブラウザが hydrate 後に描きます。ビルドはそれで止まりません。

- `guard.ts` が返す `Response` の `location` には Vite の `base` が自動では付かないことをガイドに書く。

  - `base` の節で、`redirect.ts`（base を前に付けて送られる）と、アプリが自分で作るリダイレクト（Server Action の `redirect()` と、guard が返す `Response` の `location`。書いたまま送られるので `href()` で作る。ほかの方法で作った pathname には `withBase()` で base を付ける）を分け、後者を `@k8ordo/server` のものとして書く。
  - `@k8ordo/server` の Guards の例を `href('/login')` で作り、`location` が書いたまま送られることを書く。
  - サイトの `/server/guards` と `/server/deploy` も合わせ、`/static/deploy` からは Server Action の `redirect()` の記述を外す。

- `vite dev` での Server Action の拒否が実際に働くようにする。プラグインの
  `transform` は RSC の `rsc:use-server` より後に回るため、渡ってくるコードには
  すでにランタイムの import が前置されていて、先頭の `'use server'` を探す走査は
  必ず外れていた。テキストの走査（`directive.ts`）をやめ、ビルド時の
  `serverActionModules` と同じレジストリを `isServerActionModule` で 1 モジュール
  ずつ引く。dev とビルドが同じ集合を拒む。

- 静的ビルドが書く HTML で、Suspense 境界をすべてその場に完了した形で書くようにした。これまではストリーミングと同じく、描画の遅れた境界や大きな境界を「隠した `<div hidden id="S:…">` と、それを差し込むインラインスクリプト」として書いていた。差し込みはアニメーションフレームまで遅れるため、ハイドレーションが先に走り、そのときルートのコンテキスト（`@k8ordo/color-scheme` のダークモードなど）が変わると、React が境界をクライアントで描き直していた。結果としてページの中身が隠しコピーと合わせて 2 つずつ残り、`<head>` に `<title>` が 2 つ並んでいた。

  - ビルドは境界がすべて完了するのを待ってから HTML を読み、サイズによる境界の外出しもしない。書き出されたファイルには隠しセグメントも差し込みスクリプトも無く、ハイドレーションは境界をその場で引き継ぐ。
  - JavaScript を実行しない訪問者やクローラにも、本文が隠されずに届く。

- リクエストハンドラが GET・HEAD・POST 以外のメソッドに `405` と `Allow: GET, HEAD, POST` で答え、HEAD にはページを描かずにヘッダーだけを返すようにした。

  - これまでハンドラは POST 以外をすべてページの読み込みとして扱い、PUT・DELETE・PATCH にもページを描いて `200` を返していた。`405` を返すのは `serve()` ではなくハンドラなので、ハンドラを直接呼ぶホストでも同じ答えになる。
  - HEAD には、GET と同じステータスと `content-type` を本文 `null` で返す。これまでは GET と同じくページ全体を描いてから本文を捨てていたので、HEAD のたびにページのデータ取得が走っていた。
  - `@k8ordo/static` では `vite dev` の開発サーバーが同じハンドラで答えるので、そこでも同じ挙動になる。ビルドが書き出すファイルは変わらない。

- 描画に失敗したページを、上に Suspense の境界（`error.tsx` もその 1 つ）があるかどうかに関係なく、ページ名を挙げてビルドを止めるようにした。

  境界の無いまま Server Component が throw すると、ビルドは React の本番用の汎用エラー（`An error occurred in the Server Components render…`）で止まり、どのページが失敗したのかを挙げていなかった。境界があるときと同じく、throw されたメッセージをページの URL と一緒にログに出し、`static build could not render /broken — see the error above` で止まる。境界の無いクライアントコンポーネントが HTML の描画中に throw したときも、境界の無い `not-found.tsx` が throw したとき（`404.html` として挙がる）も同じ。

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
