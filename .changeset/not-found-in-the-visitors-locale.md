---
'@k8ordo/server': patch
'@k8ordo/static': patch
'@k8ordo/router': patch
---

`/en/missing` のように既定でないロケールの URL の 404 を、その URL のロケールで描くようにした。

これまで catch-all（`not-found.tsx`）の params はどのスキーマも通らなかったので、サーバーは `@k8ordo/i18n` のロケールを知らないまま既定のロケールで描いていた。ルートレイアウトは pathname から `<html lang="en">` を書くので、JavaScript の無い訪問者には lang と本文が食い違い、ブラウザでは文言が URL を読むので hydration が失敗していた。

- catch-all に落ちたとき、`not-found.tsx` の上にあるレイアウトのスキーマを params に通す。全部が受理すればその文脈で描くので、`/en/missing` はサーバーの HTML の時点で英語になる。拒まれても（`/fr/missing`）catch-all は答え、これまでどおりどの文脈にも入らずに描く。
- not-found とレイアウトが受け取る params は文字列のまま。生成される `routes.gen.ts` に `catchAllSchemas` が増える（`paramSchemas` とは別。そちらはページの params とリンクの型になる）。
- `@k8ordo/router`: `LayoutProps` と GUIDE の「`not-found.tsx` の下では何も検証されない」という説明を、スキーマは走るが拒んでも描かれる、に直した。型は変わらない。
