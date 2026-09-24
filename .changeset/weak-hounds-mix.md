---
"@k8ordo/static": patch
---

描画に失敗したページを、上に Suspense の境界（`error.tsx` もその 1 つ）があるかどうかに関係なく、ページ名を挙げてビルドを止めるようにした。

- 境界の無いまま Server Component が throw すると、ビルドは React の本番用の汎用エラー（`An error occurred in the Server Components render…`）で止まり、どのページが失敗したのかを挙げていなかった。境界があるときと同じく、throw されたメッセージをページの URL と一緒にログに出し、`static build could not render /broken — see the error above` で止まる。境界の無いクライアントコンポーネントが HTML の描画中に throw したときも同じ。
