---
'@k8ordo/router': minor
---

- `bindParams(source)` を追加。`href` / `navigateTo` の一部の param を、呼ぶたびに関数から供給する版を作る。`bindParams(() => ({ locale: locales.getLocale() }))` と 1 回結べば、`href('/:locale/products/:id', { id })` は locale を綴らずに書け、`{ locale: 'en' }` を渡せば上書きもできる。パターンは `/:locale/…` のままなので表の型がそのまま効き、router は「locale」という概念を持たない（param 名と関数を知るだけ）。
- `PageProps<'/products/:id'>` / `LayoutProps<'/products'>` を追加。フレームワークの route ファイルが受け取る props の型で、`params` は生成された `Register` の schema 型から引く。`@k8ordo/server` の下では生成器が `Register` に `request` を書くので同じ型が `request` を持ち、`@k8ordo/static` の下で `request` を読むページは型で落ちる。どのモードのパッケージにも依存しない。
- `useMatch` / `matchPath` に `{ inclusive: true }` を追加。`/x/*` にその index `/x` も含めて訊ける。
