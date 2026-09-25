---
"@k8ordo/ui": patch
---

`multiple`（または `webkitDirectory`）の `FileField` で、選び直すと前に選んだファイルが一覧に残ったまま送信から落ちていたのを直しました。入力は常に `FileField.ItemList` に並ぶファイルをそのまま持ちます。`File[]` の `defaultValue` も送信され、form の reset では一覧と入力の両方が `defaultValue` に戻ります。`onChange` には、新しく選んだ分だけでなく一覧に並ぶファイル全体を渡します。
