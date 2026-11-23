---
'@k8ordo/framework': minor
---

`routes/`に`[...name]`のディレクトリを置けるようにしました。`files/[...path]/`は`/files`より下の区間を1つ以上すべて受け取り、パターンは`/files/:path+`です。これまでは区間の数が決まらないURLを受けるルートを書けず、`not-found.tsx`で受けるしかありませんでした。値は区間ごとにデコードした配列で、`page.tsx`、`layout.tsx`、`route.ts`、`guard.ts`の`params`に渡ります。`paramsSchema`にも配列が渡るので、配列のスキーマで検証できます。`redirect.ts`の行き先に`:path+`と書くと、受け取った区間をURLの綴りのまま移します。同じ階層では固定の区間、`[name]`、`[...name]`の順に試し、`not-found.tsx`はその後です。`[...name]`は必ず最後のディレクトリで、下にディレクトリ（グループも）を置くと、また同じ階層に2つ並べると、ビルドが名指しして止まります。`not-found.tsx`、`fallback.tsx`、`paths.ts`も置けません。区間が無くても当たる`[[...name]]`の形はありません。使えるのはserverモードだけです。staticモードは、区間の数がリクエストごとに違って書き出すパスを決められないので、ビルドの最初と`vite dev`のコンパイル時に、`[...name]`のディレクトリを名指しして`this application wants mode: 'server'`で止めます。
