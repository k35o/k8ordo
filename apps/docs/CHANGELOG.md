# docs

## 0.0.10

### Patch Changes

- テーマの実装（context・保存・hydrate 前スクリプト）を `@k8ordo/color-scheme` に置き換え、`/color-scheme` のランディングとデモを足した。

- サイトの i18n 層を `@k8ordo/i18n` に載せ替えた。手書きの辞書・`MESSAGE_KEYS`・`useTranslation` / `<T k>` を消し、ロケール集合は `src/i18n.ts` の `defineLocales`（`Register` に登録）、文言は `src/messages/<area>.ts` に `message({ ja, en })` を 1 export ずつ置いて `m.nav.home()` のように呼ぶ。Server Component と Client Component で呼び方は同じで、Provider は無い。`[locale]` の `paramsSchema`、ルートレイアウトの `lang`、`vite.config.ts` のパス展開、`/` の振り分けは全部同じ `locales` を読む。`/i18n` のランディングを足し、`/ui/i18n` の文言は `uiI18n` 名前空間に、`PageTitle` / `PackageLanding` は Server Component からも使える共有コンポーネントにした。クライアントバンドルには client component が名前で参照した文言だけが残る。

- - 全リンクを `src/links.ts`（router の `bindParams` にロケールを束ねた `href` / `navigateTo`）に載せ替えた。行き先は `/:locale/…` のパターンで、無いページは型で落ちる。`LocaleAnchor` と nav データもその型（`SitePath`）で受ける。
  - `vite.config.ts` の `paths` は `locales.paths`、`UIProvider` の辞書は `dictionaries[locale]`、`[locale]/layout.tsx` の `paramsSchema` は分割代入で export、i18n のコード例はページに戻した。

- React 19.3 に上げました。ページの差し替えを `<ViewTransition>` でクロスフェードし（ルーターが transition に付ける `navigation` の型で選ぶ）、`useClient` のページを消し、フォームのデモは `useForm(fields)` と書くようにしました。

- Updated dependencies:
  - @k8ordo/form@0.2.0
  - @k8ordo/router@0.2.0
  - @k8ordo/ui@3.0.0

## 0.0.10

### Patch Changes

- Updated dependencies:
  - @k8ordo/state@0.2.0
  - @k8ordo/ui@2.0.0
