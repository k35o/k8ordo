---
'@k8ordo/router': patch
---

型エラーと実行時のエラー文で、代わりに何を書けばよいかが分かるようにした。

- 表に無いパターンを `href` / `navigateTo` / `PageProps` などに渡したときの型エラーが、型の名前でなく、表のパターンの和集合を並べるようになった（`parameter of type '"/" | "/members" | "/posts/:id"'`）。`RegisteredPattern` と `RegisteredNavigablePattern` が表す型は変わらない。
- `useRoute` / `useParams` を `<Router>` の外で呼んだときのエラー文に、`@k8ordo/framework` のページは `params` を props で受け取り、その下では `useMatch` で読めることを足した。
