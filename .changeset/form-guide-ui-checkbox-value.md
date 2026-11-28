---
'@k8ordo/form': patch
---

ガイドの`@k8ordo/ui`と組む節に、`z.stringbool()`の欄を`Checkbox`や`Switch`に展開したときの`value`の行き先を書きました。`input.value`はそのまま`Checkbox`と`Switch`の`value`になり、チェックしたボックスはスキーマの`true`の文字列を送ります。表の行には`z.stringbool()`がありましたが、`value`がどこへ渡るかは書かれていませんでした。
