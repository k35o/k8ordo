---
"@k8ordo/ui": patch
---

`light:` バリアントが `.light` クラスの下で効く定義になっており、`<html>` に `dark` しか付けない `@k8ordo/color-scheme` と組み合わせると一度も効かなかったのを直しました。`light:` は `.dark` の下ではないところで効きます。`.light` クラスはもう読みません。
