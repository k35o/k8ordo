# @k8ordo/router

## 0.2.0

### Minor Changes

- `@k8ordo/state` の `href` が、ルート表に `/:locale` のような先頭の param があると、どんなパスでも受け付けていたのを直す。

  - `@k8ordo/router` の `RouteOf<typeof routes>`（表のリンク可能な pathname の union）を削除し、`NavigablePath<typeof routes, Path>` を追加。渡したパスを表のリンク可能なパターンと区間ごとに照合し、合えば `Path`、合わなければ `never` を返す。`:param` は空でない 1 区間（テンプレートリテラルの `${string}` を含む）を受ける。union では `/:locale` が `/${string}` になり、それがすべてのパスを吸収していた。
  - `@k8ordo/state` の `href` は渡されたパスを推論し、`Register` の `routes` の表とこの型で照合する。`'/ja/nowhere'` は `/:locale` の表でも型エラーになる。`RegisteredPath` は `RegisteredPath<Path>`（受け付けるなら `Path`、拒むなら `never`）になった。

- - `bindParams(source)` を追加。`href` / `navigateTo` の一部の param を、呼ぶたびに関数から供給する版を作る。`bindParams(() => ({ locale: locales.getLocale() }))` と 1 回結べば、`href('/:locale/products/:id', { id })` は locale を綴らずに書け、`{ locale: 'en' }` を渡せば上書きもできる。パターンは `/:locale/…` のままなので表の型がそのまま効き、router は「locale」という概念を持たない（param 名と関数を知るだけ）。
  - `PageProps<'/products/:id'>` / `LayoutProps<'/products'>` を追加。フレームワークの route ファイルが受け取る props の型で、`params` は生成された `Register` の schema 型から引く。`@k8ordo/server` の下では生成器が `Register` に `request` を書くので同じ型が `request` を持ち、`@k8ordo/static` の下で `request` を読むページは型で落ちる。どのモードのパッケージにも依存しない。
  - `useMatch` / `matchPath` に `{ inclusive: true }` を追加。`/x/*` にその index `/x` も含めて訊ける。

- 非同期アクションの中で `finished` を待っても止まらないようにしました。

  - 新しい木を `startTransition` ではなく `useDeferredValue` の優先度で描くようにしました。React は非同期アクションが保留中の間、すべての transition をそのアクションの lane にまとめて終わりまで止めるので、`startTransition(async () => { await navigateTo('/about').finished })` では URL だけが変わり、ページも `finished` も止まったままでした。無関係なアクションの保留中に始まったページ遷移や、`@k8ordo/state` の url の `update()` を別ページの読み込み中にアクション内で待つ場合も、同じ理由で止まっていました。
  - `finished` の意味（新しい木が画面に出た）、前のページを保つ挙動、`<ViewTransition>` と transition types は変わりません。
  - `useInterceptedNavigation` の `apply` は transition の外で呼ばれるようになりました。ホストは `apply` で設定した値を `useDeferredValue` を通して描画してください（GUIDE の「Under the framework」）。

- `@k8ordo/router` に `notFound()` と `isNotFound()` を足した。フレームワークのページが自分の pathname は実はページではない（id が名指す商品が無い）と言うと、いちばん近い `not-found.tsx` がその上のレイアウトの内側で 404 として答える。`redirect()` と同じくブランド付きで投げる。`@k8ordo/server` では、ステータスを正しくするため、文書（と `HEAD`）はページ自身のコンポーネントが答えるまで送り始めない。ページが `<Suspense>` の下に置いたものはその後に流れる。クライアント遷移のペイロードは待たずに流れ、遅れて届いた `notFound()` は同じ URL の文書の読み込みになる。`@k8ordo/static` では、`paths` が渡した pathname のページが `notFound()` と言うと、その pathname を挙げてビルドを止める。

- ルートファイル `route.ts` を足した。答えるリクエストのメソッドごとに関数（`GET` / `POST` など）を export し、`{ request, params }` を受け取って `Response` を返す。RSS・robots・JSON・webhook のようなページではない答えに使う。表の順番にはページと同じく並び、ページや redirect.ts と同じディレクトリには置けず、メソッドを 1 つも export しなければ拒む。`@k8ordo/server` では export したメソッドにだけ答え（`HEAD` は `GET` から本文を外したもの、ほかは `Allow` 付きの `405`）、上の guard が先に走り、同じ origin は求めず、`cookies()` などが使える。`@k8ordo/static` ではビルドが `GET` を 1 度呼んで答えを pathname のファイルとして書き（`feed.xml/route.ts` → `feed.xml`、`site` があればリクエストの origin はそれ）、`GET` 以外を export する `route.ts` は名指しで拒む。`@k8ordo/router` に型 `RouteContext<P>` を足した。

- Vite の `base` の下（`base: '/docs/'` など、オリジンのサブパス）にアプリを置いても動くようにした。ルート表はアプリの根から書いたままで、URL との境目で base を付け外しする。

  - `@k8ordo/router`: `href` / `navigateTo` / `bindParams` がリンクの前に `import.meta.env.BASE_URL` を付ける。`href` の戻り値はリンク先の URL なので、型を表のパスの形（`PathFor<P>`）から `string` に変えた。`usePathname` と `<Router>` の照合は base を外した pathname で行い、base の外の URL は `<Router>` が引き受けない。付け外しの手順として `withBase(pathname, base?)` / `withoutBase(pathname, base?)`（base の外は `null`）を公開する。
  - `@k8ordo/state`: `href(path, values)` の返すリンクの前に base を付ける。パスは表と同じく根から書く。Vite の外（Next.js など）では何も付けない。
  - `@k8ordo/static` / `@k8ordo/server`: ハンドラは base を外した pathname でページ・ペイロード・redirect を解き、base の外には `404` を返す。`redirect.ts` の行き先（表のパターン）には base を付けて送る。Server Action の `redirect(to)` は URL をそのまま送るので、`href()` で作る。クライアントは base の下の同じオリジンの URL だけを引き受け、hydrate するかどうかも base を外して比べる。`base` が根からのパスでない（`./` や別オリジン）ときはビルドを止める。
  - `@k8ordo/static`: 事前描画はハンドラに base を付けた URL で頼み、ファイルは `dist/client/` の中の表の pathname に書く。`sitemap.xml` の `<loc>` にも base を含める。`paths` オプションは base を付けない pathname を受ける。
  - `@k8ordo/server`: `serve` はビルドの base を `dist/rsc/index.js` の `base` から読み、クライアントのビルドのファイルをその下で配る（`immutable` の判定も base の下の `assets/` で行う）。

- ページ遷移を React 19.3 の `<ViewTransition>` で animate できるようにしました（peer は `react` / `@types/react` とも `>=19.3.0`）。

  - 新しい木を適用する transition に `addTransitionType` で型を付けます: `navigation` と、プラットフォームが報告した種類 `navigation-push` / `navigation-replace` / `navigation-traverse`。ページの穴を `<ViewTransition default="none" update={{ navigation: 'auto', default: 'none' }}>` で包むと、ページの差し替えだけがクロスフェードし、`Button` の action など他の transition では動きません。GUIDE に「Animating page changes」を足しました。
  - intercept の handler を passive effect ではなく layout effect で resolve するようにしました。`finished` の意味（新しい木が commit された）は変わらず、描画前になります。スクロール位置も描画前に置くので、新しいページが 1 フレーム古い位置で見えることが無くなります。`<ViewTransition>` があると React は保留中の遷移が finish するまで新しいスナップショットを待ち、passive effect はアニメーション後にしか走らないので、passive のままでは互いに待ち合っていました。

### Patch Changes

- 同梱ドキュメントを実装に追従させました。

  - `llms.txt` に公開型（`Routes` / `ErrorProps` / `NavigateToOptions` / `BoundLinks` / `MatchOptions` / `RegisteredPattern` など）を足し、`matchPath` の `options`、`bindParams` の `navigateTo` の引数、`bigint` を受ける param 値を書きました。
  - `LayoutProps` の制約、`error` を持つ枝が lazy なページの上に `<Suspense fallback={null}>` を挟むこと、`canIntercept` が false のナビゲーションも奪わないことを書き足しました。

- 公開する tarball に `LICENSE`（MIT の本文）を同梱しました。これまでは `package.json` の `license` フィールドだけで、ライセンス本文が入っていませんでした。

- `/en/missing` のように既定でないロケールの URL の 404 を、その URL のロケールで描くようにした。

  これまで catch-all（`not-found.tsx`）の params はどのスキーマも通らなかったので、サーバーは `@k8ordo/i18n` のロケールを知らないまま既定のロケールで描いていた。ルートレイアウトは pathname から `<html lang="en">` を書くので、JavaScript の無い訪問者には lang と本文が食い違い、ブラウザでは文言が URL を読むので hydration が失敗していた。

  - catch-all に落ちたとき、`not-found.tsx` の上にあるレイアウトのスキーマを params に通す。全部が受理すればその文脈で描くので、`/en/missing` はサーバーの HTML の時点で英語になる。拒まれても（`/fr/missing`）catch-all は答え、これまでどおりどの文脈にも入らずに描く。
  - not-found とレイアウトが受け取る params は文字列のまま。生成される `routes.gen.ts` に `catchAllSchemas` が増える（`paramSchemas` とは別。そちらはページの params とリンクの型になる）。
  - `@k8ordo/router`: `LayoutProps` と GUIDE の「`not-found.tsx` の下では何も検証されない」という説明を、スキーマは走るが拒んでも描かれる、に直した。型は変わらない。

- ページを遷移するたびに、表の `error` 境界より下がすべてマウントし直されていたのを直しました。

  - `RouteErrorBoundary` は、失敗したページを離れたときに失敗を消すため、境界に `NavigationGeneration` を key として付けていました。この番号はページが替わるたびに変わるので、失敗していないときも境界の下のレイアウトと DOM が毎回作り直されていました。ルートに `error.tsx` を置いたアプリではヘッダーやフッターまで作り直され、クライアント遷移がページの再読み込みのように見えていました（docs サイトがそうでした）。
  - key をやめ、`NavigationGeneration` が変わったときに失敗の状態だけを消すようにしました。失敗したページを離れると失敗が消えること、search だけの更新では失敗が残ることは変わりません。

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

- ページ遷移後のスクロール位置をルーターが持つ。新しい木が画面に出た時点で
  先頭（URL が fragment を名指すならその要素）へ移動し、戻る/進むはブラウザの
  復元に任せる。あわせて、表を持たなくても「どの区間にいるか」を答える
  `useMatch(pattern)` / `matchPath(pattern, pathname)` と、末尾スラッシュの
  扱いを共有するための `normalizePathname` を公開する。
