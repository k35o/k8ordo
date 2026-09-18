---
"@k8ordo/ui": patch
---

`NumberField` が blur で確定する値を `precision` の桁に丸めるようになりました。これまでは表示だけが丸められ、`onChange` と `aria-valuenow` には入力したままの値が渡っていました（`precision={0}` で `1.5` と入れると、表示は `2` なのに値は `1.5`）。
