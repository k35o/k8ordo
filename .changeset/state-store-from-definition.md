---
'@k8ordo/state': patch
---

`useAppState`が、種類ごとのストアをすべてimportしないようにしました。定義（`definePageState`、`defineLocalState`など）が自分の種類のストアを結び、`useAppState`はそれを引くだけです。これまでは、たとえば`defineLocalState`だけを使うモジュールにも、ページとCookieのストア、`definePageState`、URLのコーデックが一緒に載っていました。公開のAPIは変わりません。
