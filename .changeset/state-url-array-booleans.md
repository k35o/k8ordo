---
"@k8ordo/state": major
"docs": patch
---

url の配列の要素の真偽値を、トップレベルの欄と同じ規則で読み書きするようにした（破壊的変更）。

- `z.array(z.coerce.boolean())` や `z.array(z.boolean())` の url 欄は、定義時に `TypeError` を投げる。これまでは受け付けて、`"false"` を `true` と読んでいた。
- `z.array(z.stringbool(...))` の要素は、要素のスキーマ自身の綴りで書く。これまでは `String()` で `"true"` / `"false"` と書いていたので、`z.stringbool({ truthy: ['yes'] })` の配列は `update()` のたびに既定値（`[]`）に落ちていた。

移行: 真偽値の配列を url に置いているなら、要素を `z.stringbool()` にする。
