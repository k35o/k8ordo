# @k8ordo/static

## 0.1.1

### Patch Changes

- `vite dev` での Server Action の拒否が実際に働くようにする。プラグインの
  `transform` は RSC の `rsc:use-server` より後に回るため、渡ってくるコードには
  すでにランタイムの import が前置されていて、先頭の `'use server'` を探す走査は
  必ず外れていた。テキストの走査（`directive.ts`）をやめ、ビルド時の
  `serverActionModules` と同じレジストリを `isServerActionModule` で 1 モジュール
  ずつ引く。dev とビルドが同じ集合を拒む。

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
