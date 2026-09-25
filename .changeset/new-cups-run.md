---
"@k8ordo/server": minor
"@k8ordo/static": minor
"@k8ordo/router": minor
---

ページが `@k8ordo/state` の url スキーマを `export const search = listState.url` と export したときだけ、そのページが型付きの `search` を props で受け取るようにした（`PageProps` の `search`、生成される `Register` の `search`）。search が変わる遷移（GET フォーム・リンク・url の `update()`）では、そのページだけをその場で取り直す（スクロールとフォーカスはそのまま）。ほかのページとレイアウトは今までどおり search を見ない。`@k8ordo/static` はこの export をビルド時（と `vite dev`）に名指しで断る。`@k8ordo/router` の `useInterceptedNavigation` には、pathname が変わらない遷移でも読み込むべきかをホストが答える `refresh(url)` を足した。
