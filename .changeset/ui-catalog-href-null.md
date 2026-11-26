---
'@k8ordo/ui': patch
---

`@k8ordo/ui/catalog/render`の`Button`が、`href`に`null`を受け取るとリンクとして描かれ、`href`の無い`<a>`になっていたのを直しました。OpenUI Langは省いた位置引数を`null`で渡すので、`Button("保存", null, null, null, null, null, …)`のように後ろの引数を書くと押せないボタンになっていました。`Card`の`href`も同じく、`null`をリンク無しとして扱います。
