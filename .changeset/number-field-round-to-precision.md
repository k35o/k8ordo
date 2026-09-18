---
"@k8ordo/ui": patch
---

`NumberField` が、フォーカスを外したときに入力を `precision` の桁数に丸めた値を `onChange` と `aria-valuenow` に渡すようになりました。

これまでは表示だけが丸められ、値には入力した小数の桁がそのまま残っていました。たとえば `precision` が `0`（既定）のときに `2.5` と入力すると、表示は `3` なのに `onChange` には `2.5` が届き、`aria-valuenow` も `2.5` でした。表示・`aria-valuenow`・`onChange` の値が一致するようになります。
