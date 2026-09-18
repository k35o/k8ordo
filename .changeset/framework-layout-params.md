---
'@k8ordo/static': patch
'@k8ordo/server': patch
---

layout が受け取る `params` を、型（router の `LayoutProps`）とガイドが言うとおり文字列に戻した。ページのスキーマが通した値がスタックの全要素に渡っていたため、`[id]` の下のページが `z.coerce.number()` を宣言していると、その上の layout は型が `string` と言っている場所で数値を受け取っていた（`params.id.toUpperCase()` が型を通って実行時に落ちる）。layout は自分の下にどのページが来るか知らず、`not-found.tsx` の下では何も検証されないので、文字列が唯一嘘のない型。パース済みの値が要る layout は自分でパースするか、スキーマを宣言して下のページに受け取らせる。
