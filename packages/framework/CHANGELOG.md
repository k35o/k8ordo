# @k8ordo/framework

## 1.0.0

### Major Changes

- 1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。`@k8ordo/*` のうち form・state・router・i18n・color-scheme・framework の 6 つはそろって 1.0.0 になり、以後も同じ版で出す。どれか 1 つが版を上げれば、変更のないものも同じ版で出る（`@k8ordo/ui` は別の版で続く）。互いの peer は `^1.0.0` で結ぶ。

  0.1.0 から上げるときに手を入れるものはない。

  この版で足した主なもの: `@k8ordo/i18n` の `Register` の生成。

### Minor Changes

- `@k8ordo/i18n` の `Register` を生成するようにしました。アプリの `package.json` が `@k8ordo/i18n` を `dependencies` か `devDependencies` に挙げていて（ルートから解決できることも見ます）、`src/i18n.ts` がロケールの集合を `locales` として export しているとき、`.k8ordo/register.gen.ts` に `declare module '@k8ordo/i18n' { interface Register { locale: LocaleOf<typeof locales> } }` を書きます。アプリはもう `Register` を手で書かなくてよく、ロケールが欠けた文言はこれまでどおり型エラーになります。

  - `locales` の export は、ルートのファイルと同じくファイルを実行せず構文から読みます。`export const locales = defineLocales(…)` と `export { locales } from './locales'` は数え、型だけの export と `export *` は数えません。
  - `src/i18n.ts` があるのに `locales` の export が読めないときは、何も生成せず警告を出します。黙っているとロケールの欠けた文言がそのままコンパイルできてしまうためです。
  - `@k8ordo/ui` の peer として hoist されただけの `@k8ordo/i18n` では生成しません。
  - `vite dev` では `routes/` に加えて `src/i18n.ts` の変更でも生成し直すので、ファイルの追加・削除や `locales` の export の有無がすぐ反映されます。
  - 手で書いた augmentation を残していても、同じ型の宣言なのでそのままコンパイルできます。消して構いません。
  - フレームワークの外（Next.js など）では、これまでどおりアプリが手で書きます。

### Patch Changes

- client コンポーネントが import した CSS が、SSR の HTML に `<link rel="stylesheet">` されないことがあるのを直しました。その JS の `<link rel="modulepreload">` も同じく出ないことがありました。ブラウザでの遷移を受け持つ部品は SSR でも描かれ、そのモジュールが読み込む `@vitejs/plugin-rsc/browser` が、client 参照の読み込み口をブラウザ用のものに差し替えていたためです。ブラウザ用の読み込み口はこの 2 つを出しません。どちらの読み込み口が残るかはバンドルの中の評価順で決まり、ブラウザ用が残ったアプリでは、CSS が当たるのは JS が読み込まれた後で、JS を切った訪問者には当たりませんでした。

- Updated dependencies:
  - @k8ordo/router@1.0.0
