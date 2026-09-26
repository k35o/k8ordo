---
"@k8ordo/state": minor
---

`urlReader(schema)` を足した。url スキーマを受け取り、`parseUrl` と同じ入力（`URLSearchParams` か、値の record）から同じ読み方で値を返す関数を返す。codec は 1 度だけ作る。フレームワークが `search` を宣言したページの search を読むのに使う。
