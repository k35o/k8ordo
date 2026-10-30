# @k8ordo/router

## 1.4.2

### Patch Changes

- WebKitで、別のサイトから戻るとbfcacheから戻ったページが先頭に着いていたのを直しました。1.3.0で入った後退です。WebKitはbfcacheから戻すときに、位置を戻す前の、今の履歴エントリへの戻るを出します。これをページの切り替えの取り消しとして扱い、その時点の先頭を覚えて、ブラウザが戻した位置を置き直していました。切り替えの読み込み中でなければ、位置に触りません。

- 一覧と記事を行き来したり目次で移ったりして、離れた履歴エントリが100件を超えると、まだ戻れるページの位置を忘れて先頭に着いていたのを直しました。1.4.1で入った後退です。上限を超えたら、切り捨てられて戻れなくなった履歴エントリの位置から先に捨てます。

- WebKitで、別のサイトを挟んで読み直したページから戻ると、URLだけが変わって前のページが画面に残り、そのあとページの中のリンクで移れなくなっていたのを直しました。WebKitはこの戻るで`navigate`を出さず、`navigation.currentEntry`を`null`にします。そのときは文書を読み直して、URLのページを出します。

- WebKitで、同じサイトの別のオリジンを挟んで戻ったあと、それより前の履歴エントリへ戻ると、`usePathname`と`definePageState`のURLの値が古いまま残っていたのを直しました。検索欄が空のまま一覧も絞られず、ナビゲーションの現在地も前のページのままになっていました。WebKitはこの戻るで`currententrychange`を出さないので、`popstate`でも読み直します。

- WebKitで、同じサイトの別のオリジンを挟んで戻ったあとに進むと、離れたときの位置でなく、戻った先のページの位置に着いていたのを直しました。WebKitはキーの無い戻るのあとも`navigation.currentEntry`を動かさず、次に移るときにルーターが画面のページの位置を古い履歴エントリのものとして書いていました。このあいだは位置を書きません。

## 1.4.1

### Patch Changes

- 別のサイトを挟んで戻ると、それより前のページに、離れたときの位置でなく先頭に着くことがあったのを直しました。1.4.0で入った後退です。

  - 当たっていたのは、タブで別のサイトへ出て、そこからアプリに入り直し、入り直したページから移ったあとです。別のサイトより前の履歴エントリの位置を消していたので、戻るを重ねてbfcacheから戻らずに読み直したページから、それより前のページへ戻ると先頭に着いていました。
  - タブの`sessionStorage`の`@k8ordo/router:left-at`には、最近離れた100件の履歴エントリの位置を残します。これまでは、今のページから続く同じオリジンの履歴エントリの分だけを残していました。

- WebKitで、別のサイトから戻って読み直したページから、それより前のページへ戻ると、離れたときの位置でなく先頭に着いていたのを直しました。1.4.0で入った後退です。WebKitはこの戻るで行き先の履歴エントリのキーを渡さず、ルーターは覚えた位置を引けないので、このときだけ位置をブラウザに戻させます。

## 1.4.0

### Minor Changes

- 戻る・進むで、スクロール位置をブラウザに戻させるのをやめ、その履歴エントリを離れたときの位置にルーターが戻すようにしました。Chromiumでは、移った先のページが描画の中でレイアウトを走らせると（自分の大きさを測る部品、サイズのコンテナの中での`getComputedStyle`など）、前のページの位置が移った先で下げられる量に切り詰められ、その値に戻っていました。前のページの位置が移った先で下げられる量を超えていると、ページの下端に着いていました。ページを替える戻る・進むも、同じページの中の戻る・進むも、`refresh`で読み込み直すものも直ります。

  - 位置を戻す時機は変わりません。移った先のエントリの描画が画面に出てから戻します。ルートに`scroll-behavior: smooth`があっても、アニメーションせずに一度に置きます。
  - 読み込みの間に訪問者が前のページをスクロールしても、離れたときの位置に戻します。これまではブラウザが戻さず、Chromiumではページの先頭、WebKitではスクロールした位置に着いていました。
  - 読み込みの途中で取り消したページのように、一度も画面に出なかった履歴エントリへ進んだときは、新しいページと同じく、フラグメントの要素か先頭へスクロールします。
  - 再読み込みのあとも、それより前の履歴エントリへの戻る・進むは同じ文書のまま行われるので、離れたときの位置をタブの`sessionStorage`に`@k8ordo/router:left-at`のキーで書いておきます。書けないときは、その文書のあいだだけ覚えます。
  - 戻すのは文書のスクロール位置だけです。ページの中でスクロールする要素の位置と、ピンチズームの倍率は戻しません。

## 1.3.0

### Minor Changes

- 同じページの中の戻る・進む（クエリや履歴エントリの状態だけが違う履歴エントリへの移動）で、ブラウザが保存していたスクロール位置に戻すようにしました。これまでは状態の変更として扱い、スクロール位置を動かさないことを保証していましたが、その保証を変えます。位置は、移った先のエントリの描画が画面に出てから戻します。ページが`useDeferredValue`で遅らせて描く分も待つので、絞り込んだ一覧のように高さが変わるページでも、そのエントリを離れたときの位置に戻ります。このナビゲーションの`finished`は、その描画を待ってから解決します。

  - `useInterceptedNavigation`の`refresh`が`true`を返して読み込み直すナビゲーションも、戻る・進むでは、読み込み直したページが画面に出てから位置を戻します。`@k8ordo/framework`のserverモードで`search`をexportしたページがこれに当たります。
  - 別のページの読み込み中に、画面に残るページの履歴エントリへ戻ったときは、ページの切り替えの取り消しとして扱い、位置を動かしません。
  - クエリを書き換えるpushとreplace（`@k8ordo/state`の`update()`など）は変わりません。位置もフォーカスも動かさず、`finished`はすぐに解決します。
  - 同じページの中の戻る・進むも、ページがそのエントリを描く前に別のナビゲーションに追い越されると、`finished`がrejectし、位置は戻りません。

### Patch Changes

- `<Router>`が、画面に出した木ごとに、その木を当てたpathnameを`@k8ordo/state`に知らせるようにしました。URLを先に確定させる遷移のあいだ、画面に残るページのページの状態が、次のページのURLの値で描かれなくなります。公開のAPIは変わりません。

## 1.2.1

## 1.2.0

## 1.1.0

## 1.0.0

### Major Changes

- 1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。`@k8ordo/*` のうち form・state・router・i18n・color-scheme・framework の 6 つはそろって 1.0.0 になり、以後も同じ版で出す。どれか 1 つが版を上げれば、変更のないものも同じ版で出る（`@k8ordo/ui` は別の版で続く）。互いの peer は `^1.0.0` で結ぶ。

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

- paramを持たないパターンの`ParamsOf`と`ParsedParams`、`PageProps`の`request`と`search`が無いときに足す型を、`{}`に解決される`Record<never, never>`から`object`にしました。`{}`は数値や文字列も受け取ってしまいます。

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
