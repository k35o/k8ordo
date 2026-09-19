# docs

## 0.0.10

### Patch Changes

- テーマの実装（context・保存・hydrate 前スクリプト）を `@k8ordo/color-scheme` に置き換え、`/color-scheme` のランディングとデモを足した。

- サイトの i18n 層を `@k8ordo/i18n` に載せ替えた。手書きの辞書・`MESSAGE_KEYS`・`useTranslation` / `<T k>` を消し、ロケール集合は `src/i18n.ts` の `defineLocales`（`Register` に登録）、文言は `src/messages/<area>.ts` に `message({ ja, en })` を 1 export ずつ置いて `m.nav.home()` のように呼ぶ。Server Component と Client Component で呼び方は同じで、Provider は無い。`[locale]` の `paramsSchema`、ルートレイアウトの `lang`、`vite.config.ts` のパス展開、`/` の振り分けは全部同じ `locales` を読む。`/i18n` のランディングを足し、`/ui/i18n` の文言は `uiI18n` 名前空間に、`PageTitle` / `PackageLanding` は Server Component からも使える共有コンポーネントにした。クライアントバンドルには client component が名前で参照した文言だけが残る。

- - 全リンクを `src/links.ts`（router の `bindParams` にロケールを束ねた `href` / `navigateTo`）に載せ替えた。行き先は `/:locale/…` のパターンで、無いページは型で落ちる。`LocaleAnchor` と nav データもその型（`SitePath`）で受ける。
  - `vite.config.ts` の `paths` は `locales.paths`、`UIProvider` の辞書は `dictionaries[locale]`、`[locale]/layout.tsx` の `paramsSchema` は分割代入で export、i18n のコード例はページに戻した。

- - UI 以外の 7 パッケージに、Get Started から始まる話題別のガイドを足しました（form 4・state 5・router 5・static 6・server 7・i18n 5・color-scheme 2 ページ）。router の `matchPath`、i18n のロケールの交渉などは、その場で試せるデモ付きです。static と server で同じ話題は、文言と部品を 1 つにしてモードごとの差分だけを書き分けています。
  - パッケージとそのセクションの一覧を `src/data/packages.ts` の 1 か所にまとめました。ヘッダーの 2 段目、フッターの列、トップページ、ランディングのセクション一覧、ガイドの前後ナビがそこを読みます。ランディングからは Get Started と `GUIDE.md` へ進めます。
  - 既存の UI ページも実装に追従させました。Storybook へのリンクの id、動作要件の React のバージョン、`dictionaries` の案内、Toast / Textarea / Popover の例などです。

- React 19.3 に上げました。ページの差し替えを `<ViewTransition>` でクロスフェードし（ルーターが transition に付ける `navigation` の型で選ぶ）、`useClient` のページを消し、フォームのデモは `useForm(fields)` と書くようにしました。

- ページを遷移するたびに、表の `error` 境界より下がすべてマウントし直されていたのを直しました。

  - `RouteErrorBoundary` は、失敗したページを離れたときに失敗を消すため、境界に `NavigationGeneration` を key として付けていました。この番号はページが替わるたびに変わるので、失敗していないときも境界の下のレイアウトと DOM が毎回作り直されていました。ルートに `error.tsx` を置いたアプリではヘッダーやフッターまで作り直され、クライアント遷移がページの再読み込みのように見えていました（docs サイトがそうでした）。
  - key をやめ、`NavigationGeneration` が変わったときに失敗の状態だけを消すようにしました。失敗したページを離れると失敗が消えること、search だけの更新では失敗が残ることは変わりません。

- Updated dependencies:
  - @k8ordo/color-scheme@0.2.0
  - @k8ordo/form@0.2.0
  - @k8ordo/i18n@0.2.0
  - @k8ordo/router@0.2.0
  - @k8ordo/state@0.3.0
  - @k8ordo/ui@3.0.0

## 0.0.10

### Patch Changes

- Updated dependencies:
  - @k8ordo/state@0.2.0
  - @k8ordo/ui@2.0.0
