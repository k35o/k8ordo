# @k8ordo/router

## 0.2.0

### Minor Changes

- - `bindParams(source)` を追加。`href` / `navigateTo` の一部の param を、呼ぶたびに関数から供給する版を作る。`bindParams(() => ({ locale: locales.getLocale() }))` と 1 回結べば、`href('/:locale/products/:id', { id })` は locale を綴らずに書け、`{ locale: 'en' }` を渡せば上書きもできる。パターンは `/:locale/…` のままなので表の型がそのまま効き、router は「locale」という概念を持たない（param 名と関数を知るだけ）。
  - `PageProps<'/products/:id'>` / `LayoutProps<'/products'>` を追加。フレームワークの route ファイルが受け取る props の型で、`params` は生成された `Register` の schema 型から引く。`@k8ordo/server` の下では生成器が `Register` に `request` を書くので同じ型が `request` を持ち、`@k8ordo/static` の下で `request` を読むページは型で落ちる。どのモードのパッケージにも依存しない。
  - `useMatch` / `matchPath` に `{ inclusive: true }` を追加。`/x/*` にその index `/x` も含めて訊ける。

- ページ遷移を React 19.3 の `<ViewTransition>` で animate できるようにしました（peer は `react` / `@types/react` とも `>=19.3.0`）。

  - 新しい木を適用する transition に `addTransitionType` で型を付けます: `navigation` と、プラットフォームが報告した種類 `navigation-push` / `navigation-replace` / `navigation-traverse`。ページの穴を `<ViewTransition default="none" update={{ navigation: 'auto', default: 'none' }}>` で包むと、ページの差し替えだけがクロスフェードし、`Button` の action など他の transition では動きません。GUIDE に「Animating page changes」を足しました。
  - intercept の handler を passive effect ではなく layout effect で resolve するようにしました。`finished` の意味（新しい木が commit された）は変わらず、描画前になります。スクロール位置も描画前に置くので、新しいページが 1 フレーム古い位置で見えることが無くなります。`<ViewTransition>` があると React は保留中の遷移が finish するまで新しいスナップショットを待ち、passive effect はアニメーション後にしか走らないので、passive のままでは互いに待ち合っていました。

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
