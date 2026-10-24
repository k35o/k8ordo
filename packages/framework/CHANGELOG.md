# @k8ordo/framework

## 1.1.0

### Minor Changes

- `framework()` が `reactCompiler` を受け取るようになりました。`true` にすると、クライアントコンポーネントを React Compiler（Rust 版。`@vitejs/plugin-react` の `compiler`）で変換します。`mode: 'static'` と `mode: 'server'` のどちらでも、`vite dev` とビルドの両方で効きます。

  - アプリに `oxc-transform-react`（`^0.152.0`）を入れてください。`@k8ordo/framework` の任意の peer です。入っていないと、`vite dev` も `vite build` も設定を読んだ時点で、React のプラグインのエラー（`React Compiler requires the optional …`）で止まります。
  - Server Component と、クライアントコンポーネントをサーバーで描く HTML には掛かりません。
  - 既定は `false` で、これまでと変わりません。

- `mode: 'static'` の `vercel()` が、`route.ts` から書いたファイルを、その `GET` が返した `Content-Type` で配るようにしました。`.vercel/output/config.json` の `overrides` に、ファイルごとの型として書きます。

  - 拡張子の無いファイル（`blog/feed` など）にも型が付き、`vite dev` と同じ型になります。
  - 拡張子と同じ型でも書くので、Vercel が拡張子に付ける型には頼りません。型を返さなかった `GET`（型の無いバイト列の本文など）のファイルだけは、これまでどおり拡張子で決まります。
  - 文字列の本文の `Response` には、型を書かなくても `text/plain;charset=UTF-8` が付き、Vercel でもその型で配られます。`route.ts` では型を書いてください。
  - `vite preview` と `serve` は、これまでどおり拡張子で型を決めます。

- `vercel()` が `beforeFiles` と `beforeNotFound` を受け取るようになりました。`mode: 'static'` のビルドで、Vercel の Build Output API のルート（`src`・`dest`・`status`・`headers`・`continue`・`check`・`caseSensitive`・`has`）を、`.vercel/output/config.json` の2か所に渡したまま書きます。全ページのヘッダー、末尾のスラッシュのリダイレクト、`Accept` での出し分け、外のオリジンへの中継を、ビルドの出力に書けます。

  - `beforeFiles` はどのファイルよりも前に、`beforeNotFound` はシェルの書き換えの後、`404.html` の前に置きます。全パスに当たるルートを `beforeNotFound` に置いても、シェルを隠しません。
  - ルートを当てるのは Vercel だけです。`vite dev`・`vite preview`・`serve` には当てません。
  - Vercel は `src` をパスの全体に当てます。`^/posts/` は `/posts/first` に当たらないので、`^/posts/.+$` のように書いてください。
  - `mode: 'server'` で渡すと、ビルドを止めます。ファイルの無い URL にはハンドラが答えるためです。
  - `has` のヘッダーの `key` が小文字でないと、`vercel()` を呼んだ時点で止めます。Vercel は小文字で比べるので、そのままでは当たらないおそれがあるためです。ほかは検査しません。
  - 型 `VercelOptions` と `VercelRoute` を `@k8ordo/framework/vercel` から export します。
  - 引数なしの `vercel()` が書くものは変わりません。

### Patch Changes

- staticモードの`csp`に`report-to`があると、`framework()`を呼んだ時点でエラーにするようにしました。`report-to`が名指す送り先は`Reporting-Endpoints`レスポンスヘッダーでしか決まらないので、`<meta>`に書いたポリシーの違反のレポートは届いていませんでした。レポートを受け取るポリシーは、ホスティングのヘッダーで設定してください。ヘッダーのポリシーには、ビルドがページごとに足すハッシュが入りません。ヘッダーの`script-src`の書き方は`docs/references/csp.md`にあります。

- `vercel()`が書く`config.json`で、`assets/`の下のハッシュ付きのファイルに`Cache-Control: public, max-age=31536000, immutable`が付くようにしました。Vercelはrouteの`src`をパスの全体に当てるので、これまでの`assets/`で終わる`src`はどのファイルにも当たらず、`assets/`の下のファイルも`public, max-age=0, must-revalidate`で配られていました。staticモードとserverモードのどちらの出力も直ります。

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
