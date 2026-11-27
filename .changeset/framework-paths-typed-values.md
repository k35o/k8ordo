---
'@k8ordo/framework': major
---

`paths.ts`が返す値と受け取る上のパラメータを、リンクの`href()`と同じ型にしました。`Paths<'/products/:id'>`は、ページの`paramsSchema`が`id`を数値に変えるなら数値の配列を返す型になり、スキーマが無ければ文字列、数値、bigint、真偽値のどれでも返せます。ビルドは値を`href()`と同じく`String()`で綴ってからURLのためにエスケープします。上のディレクトリのパラメータは、上のディレクトリのレイアウトが読んだ形で渡ります。上の`paths.ts`が返した値をこの綴りにしてから、その`paths.ts`のディレクトリより上にあるレイアウトの`paramsSchema`で外側から順に読み直したもので、型もそのスキーマの出力どおりです。どのスキーマも読まないパラメータは文字列です。隣り合うルートグループの2つの`paths.ts`が同じパターンで上のレイアウトが違うときは、どちらが受け取るものも受けられる型になります。隣のページのスキーマと、同じディレクトリのレイアウトのスキーマは、まだ値の無いそのディレクトリのパラメータを読むことがあるので使いません。`[locale]/layout.tsx`のスキーマがロケールを読むなら`locale`はそのロケールで、`[year]`のレイアウトが`z.coerce.number()`で読むなら、`[year]`にページが無く上の`paths.ts`が`'2024'`を返しても、`year`は数値の`2024`で届きます。そのスキーマが上の値を拒んだときは、その値の下の`paths.ts`を呼ばず、ビルドは`the paths.ts files stand where a params schema refuses the values above them, so they were not asked: …`で止まります。

これまでは値を空でない文字列に限り、上のパラメータも文字列で渡していました。同じidをリンクでは`product.id`、`paths.ts`では`String(product.id)`と2通りに書くことになり、ロケールを取る関数に`locale`を渡すにはキャストが要りました。

移行: 数値のスキーマを持つページの`paths.ts`で`String(product.id)`のように文字列にしている箇所は、`product.id`のまま返してください。文字列を返したままだと型エラーになります。上のパラメータを`Number(year)`のように読み直している箇所は、上のレイアウトのスキーマが読んだ値がそのまま届くので要りません。ページのスキーマでだけ読んでいるパラメータを読んだ形で受け取りたいときは、そのスキーマを上のディレクトリの`layout.tsx`に移します。値の検査は「空でない文字列、数値、bigint、真偽値」に変わり、エラー文は`… has to return an array of the values of :id, each a non-empty string, a number, a bigint or a boolean`です。
