---
"@k8ordo/router": minor
---

`PageProps` に `search` を足した。`@k8ordo/state` の url スキーマを `export const search = listState.url` と export したページ（`@k8ordo/framework` の server モード）だけが持ち、型は生成される `Register` の `search` から引く。ほかのページの `PageProps` は search を持たない。`useInterceptedNavigation` には、pathname が変わらない遷移でも読み込むべきかをホストが答える `refresh(url)` を足した。
