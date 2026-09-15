# @k8ordo/server

## 0.2.0

### Minor Changes

- - route ファイルの `paramsSchema` の検出を、正規表現による文字列走査から Vite 同梱のパーサ（oxc）に置き換えた。`export const { paramsSchema } = locales` のような分割代入も拾い、文字列やコメントの中の同じ語には反応しない。lint の autofix を抑止したり、コード例を別ファイルへ逃がしたりする必要が無くなった。
  - `@k8ordo/server` の下では、生成する `register.gen.ts` が `@k8ordo/router` の `Register` に `request: RouteRequest` を書く。router の `PageProps` / `LayoutProps` はそこから `request` を得るので、route ファイルはモードのパッケージを import せずに済む。`routes.gen.ts` の `RouteRequest` も同じ型を `@k8ordo/server` から import する。
  - ガイドの「Parameters with a schema」を `PageProps<'/products/:id'>` で書き直した。

### Patch Changes

- GUIDE に「Components that need a browser」の節を足しました。React 19.3 の `use(browser())` を `<Suspense>` の下で呼ぶと、サーバー（ビルドでもリクエストでも）は fallback を残し、ブラウザが hydrate 後に描きます。ビルドはそれで止まりません。

- Updated dependencies:
  - @k8ordo/router@0.2.0

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

- static: `site` オプションで `sitemap.xml` を書き出す（リダイレクトと not-found は
  除く）。`vite dev` でも `'use server'` を見つけた時点で拒む。パターンの走査と
  末尾スラッシュ、pathname の復号を engine / router と共有する。
  server: `serve()` が `{ port, url, close }` を返し、`port: 0` で空きポートを
  取れる。`serve` の直接のテストを足す。
