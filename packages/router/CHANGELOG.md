# @k8ordo/router

## 1.0.0

### Major Changes

- 1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。0.x だった `@k8ordo/*` のパッケージ（form・state・router・i18n・color-scheme）はそろって 1.0.0 になり、`@k8ordo/static` と `@k8ordo/server` をまとめた `@k8ordo/framework` も 1.0.0 で始まる。互いの peer は `^1.0.0` で結ぶ。

  0.1.0 から上げるときに手を入れるもの（詳しくは下の各項目）:

  - peer の `react` / `@types/react` を `>=19.3.0` にした。
  - `RouteOf` を削除した。表と照合するパスの型は `NavigablePath<typeof routes, Path>` を使う。
  - `href` の戻り値の型を、表のパスの形（`PathFor<P>`）から `string` にした。Vite の `base` を前に付けたリンク先の URL を返す。
  - `useInterceptedNavigation` の `apply` は transition の外で呼ばれる。ホストは `apply` で設定した値を `useDeferredValue` を通して描く。

  この版で足した主なもの: `bindParams`、`PageProps` / `LayoutProps`、`notFound()`、`route.ts` と `loading.tsx` のための型と `usePendingPathname()`、`<ViewTransition>` で使う transition type、Vite の `base` の付け外し（`withBase` / `withoutBase`）。

### Minor Changes

- `@k8ordo/state` の `href` が、ルート表に `/:locale` のような先頭の param があると、どんなパスでも受け付けていたのを直す。

  - `@k8ordo/router` の `RouteOf<typeof routes>`（表のリンク可能な pathname の union）を削除し、`NavigablePath<typeof routes, Path>` を追加。渡したパスを表のリンク可能なパターンと区間ごとに照合し、合えば `Path`、合わなければ `never` を返す。`:param` は空でない 1 区間（テンプレートリテラルの `${string}` を含む）を受ける。union では `/:locale` が `/${string}` になり、それがすべてのパスを吸収していた。
  - `@k8ordo/state` の `href` は渡されたパスを推論し、`Register` の `routes` の表とこの型で照合する。`'/ja/nowhere'` は `/:locale` の表でも型エラーになる。`RegisteredPath` は `RegisteredPath<Path>`（受け付けるなら `Path`、拒むなら表のリンクできるパターンの和集合）になった。型エラーには `never` でなく、そのパターンが並ぶ。

- - `bindParams(source)` を追加。`href` / `navigateTo` の一部の param を、呼ぶたびに関数から供給する版を作る。`bindParams(() => ({ locale: locales.getLocale() }))` と 1 回結べば、`href('/:locale/products/:id', { id })` は locale を綴らずに書け、`{ locale: 'en' }` を渡せば上書きもできる。パターンは `/:locale/…` のままなので表の型がそのまま効き、router は「locale」という概念を持たない（param 名と関数を知るだけ）。
  - `PageProps<'/products/:id'>` / `LayoutProps<'/products'>` を追加。フレームワークの route ファイルが受け取る props の型で、ページの `params` は生成された `Register` の schema 型から引き、レイアウトの `params` は URL が運んだ文字列のまま（`LayoutProps` の `P` は表にページがあるパターンに限る）。`@k8ordo/framework` の server モードでは生成器が `Register` に `request` を書くので同じ型が `request` を持ち、static モードで `request` を読むページは型で落ちる。router 自身はフレームワークに依存しない。
  - `useMatch` / `matchPath` に `{ inclusive: true }` を追加。`/x/*` にその index `/x` も含めて訊ける。

- 非同期アクションの中で `finished` を待っても止まらないようにしました。

  - 新しい木を `startTransition` ではなく `useDeferredValue` の優先度で描くようにしました。React は非同期アクションが保留中の間、すべての transition をそのアクションの lane にまとめて終わりまで止めるので、`startTransition(async () => { await navigateTo('/about').finished })` では URL だけが変わり、ページも `finished` も止まったままでした。無関係なアクションの保留中に始まったページ遷移や、`@k8ordo/state` の url の `update()` を別ページの読み込み中にアクション内で待つ場合も、同じ理由で止まっていました。
  - `finished` の意味（新しい木が画面に出た）、前のページを保つ挙動、`<ViewTransition>` と transition types は変わりません。
  - `useInterceptedNavigation` の `apply` は transition の外で呼ばれるようになりました。ホストは `apply` で設定した値を `useDeferredValue` を通して描画してください（GUIDE の「Under the framework」）。

- `@k8ordo/router` に `notFound()` と `isNotFound()` を足した。`@k8ordo/framework` のページが自分の pathname は実はページではない（id が名指す商品が無い）と言うと、いちばん近い `not-found.tsx` がその上のレイアウトの内側で 404 として答える。`redirect()` と同じくブランド付きで投げる。

- `@k8ordo/router` に型 `RouteContext<P>` を足した。`@k8ordo/framework` のルートファイル `route.ts` で、メソッドごとに export する関数（`GET` / `POST` など）が受け取る `{ request, params }` の型。

- `PageProps` に `search` を足した。`@k8ordo/state` の url スキーマを `export const search = listState.url` と export したページ（`@k8ordo/framework` の server モード）だけが持ち、型は生成される `Register` の `search` から引く。ほかのページの `PageProps` は search を持たない。`useInterceptedNavigation` には、pathname が変わらない遷移でも読み込むべきかをホストが答える `refresh(url)` を足した。

- Vite の `base` の下（`base: '/docs/'` など、オリジンのサブパス）にアプリを置いても動くようにした。ルート表はアプリの根から書いたままで、URL との境目で base を付け外しする。

  - `@k8ordo/router`: `href` / `navigateTo` / `bindParams` がリンクの前に `import.meta.env.BASE_URL` を付ける。`href` の戻り値はリンク先の URL なので、型を表のパスの形（`PathFor<P>`）から `string` に変えた。`usePathname` と `<Router>` の照合は base を外した pathname で行い、base の外の URL は `<Router>` が引き受けない。付け外しの手順として `withBase(pathname, base?)` / `withoutBase(pathname, base?)`（base の外は `null`）を公開する。
  - `@k8ordo/state`: `href(path, values)` の返すリンクの前に base を付ける。パスは表と同じく根から書く。Vite の外（Next.js など）では何も付けない。

- ページ遷移を React 19.3 の `<ViewTransition>` で animate できるようにしました（peer は `react` / `@types/react` とも `>=19.3.0`）。

  - ページの切り替えを描く commit に `addTransitionType` で型を付けます: `navigation` と、プラットフォームが報告した種類 `navigation-push` / `navigation-replace` / `navigation-traverse`。ページの穴を `<ViewTransition default="none" update={{ navigation: 'auto', default: 'none' }}>` で包むと、ページの差し替えだけがクロスフェードし、`Button` の action など他の transition では動きません。GUIDE に「Animating page changes」を足しました。
  - intercept の handler を passive effect ではなく layout effect で resolve するようにしました。`finished` の意味（新しい木が commit された）は変わらず、描画前になります。スクロール位置も描画前に置くので、新しいページが 1 フレーム古い位置で見えることが無くなります。`<ViewTransition>` があると React は保留中の遷移が finish するまで新しいスナップショットを待ち、passive effect はアニメーション後にしか走らないので、passive のままでは互いに待ち合っていました。

- `BrowserPathname` を足した。この下では、サーバーの描画は pathname を持たないものとして扱い、`usePathname`（と、それを読む `useMatch`）は `use(browser())` でブラウザに任せる。いちばん近い `<Suspense>` がブラウザで描かれる。`@k8ordo/framework` が `fallback.tsx` を包むのに使い、アプリが自分で書くものではない。`browser()` を使うので、`react-dom` を peer に足した。

- 表の枝が `loading`（`@k8ordo/framework` のルートファイル `loading.tsx`）を取れるようにした。置いた階層で、その下を Suspense で包み、サスペンドしている間に出す（その階層の `error.tsx` の境界の内側）。進行中のページの切り替えの行き先を返す `usePendingPathname()`（無ければ `null`）も足した。すでに出ている Suspense の下の切り替えは今までどおり前のページを残すので、その待ちはこれで見せる。

### Patch Changes

- 同梱ドキュメントを実装に追従させました。

  - `llms.txt` に公開型（`Routes` / `ErrorProps` / `NavigateToOptions` / `BoundLinks` / `MatchOptions` / `RegisteredPattern` など）を足し、`matchPath` の `options`、`bindParams` の `navigateTo` の引数、`bigint` を受ける param 値を書きました。
  - `LayoutProps` の制約、`error` を持つ枝が lazy なページの上に `<Suspense fallback={null}>` を挟むこと、`canIntercept` が false のナビゲーションも奪わないことを書き足しました。

- ページを遷移するたびに、表の `error` 境界より下がすべてマウントし直されていたのを直しました。

  - `RouteErrorBoundary` は、失敗したページを離れたときに失敗を消すため、境界に `NavigationGeneration` を key として付けていました。この番号はページが替わるたびに変わるので、失敗していないときも境界の下のレイアウトと DOM が毎回作り直されていました。ルートに `error.tsx` を置いたアプリではヘッダーやフッターまで作り直され、クライアント遷移がページの再読み込みのように見えていました（docs サイトがそうでした）。
  - key をやめ、`NavigationGeneration` が変わったときに失敗の状態だけを消すようにしました。失敗したページを離れると失敗が消えること、search だけの更新では失敗が残ることは変わりません。

- 型エラーと実行時のエラー文で、代わりに何を書けばよいかが分かるようにした。

  - 表に無いパターンを `href` / `navigateTo` / `PageProps` などに渡したときの型エラーが、型の名前でなく、表のパターンの和集合を並べるようになった（`parameter of type '"/" | "/members" | "/posts/:id"'`）。`RegisteredPattern` と `RegisteredNavigablePattern` が表す型は変わらない。
  - `useRoute` / `useParams` を `<Router>` の外で呼んだときのエラー文に、`@k8ordo/framework` のページは `params` を props で受け取り、その下では `useMatch` で読めることを足した。

- GUIDE の「Testing」を直す。パッケージ自身のテストは Chromium だけでなく Firefox と WebKit でも回っている。Vitest の browser mode はテストを iframe の中で動かし、Firefox と WebKit はそこで戻る・進むのスクロール位置を正しく戻さない（Firefox は戻る遷移の handler も 2 回走らせる）ので、戻る・進むはトップレベルのページで確かめる、と書き足す。

- 任意の peer の `typescript` の下限を `>=7.0.2` から `>=7.0.0` にする。TypeScript 7 の正式版は 7.0.2 が最初なので、受け付ける版は変わらない。ドキュメントで「TypeScript 7以上」と書けるようにするため。

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
