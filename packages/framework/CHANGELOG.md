# @k8ordo/framework

## 0.2.0

### Minor Changes

- `@k8ordo/i18n` の `Register` を生成するようにしました。アプリの `package.json` が `@k8ordo/i18n` を `dependencies` か `devDependencies` に挙げていて（ルートから解決できることも見ます）、`src/i18n.ts` がロケールの集合を `locales` として export しているとき、`.k8ordo/register.gen.ts` に `declare module '@k8ordo/i18n' { interface Register { locale: LocaleOf<typeof locales> } }` を書きます。アプリはもう `Register` を手で書かなくてよく、ロケールが欠けた文言はこれまでどおり型エラーになります。

  - `locales` の export は、ルートのファイルと同じくファイルを実行せず構文から読みます。`export const locales = defineLocales(…)` と `export { locales } from './locales'` は数え、型だけの export と `export *` は数えません。
  - `src/i18n.ts` があるのに `locales` の export が読めないときは、何も生成せず警告を出します。黙っているとロケールの欠けた文言がそのままコンパイルできてしまうためです。
  - `@k8ordo/ui` の peer として hoist されただけの `@k8ordo/i18n` では生成しません。
  - `vite dev` では `routes/` に加えて `src/i18n.ts` の変更でも生成し直すので、ファイルの追加・削除や `locales` の export の有無がすぐ反映されます。
  - 手で書いた augmentation を残していても、同じ型の宣言なのでそのままコンパイルできます。消して構いません。
  - フレームワークの外（Next.js など）では、これまでどおりアプリが手で書きます。

### Patch Changes

- Updated dependencies:
  - @k8ordo/router@1.0.0
