---
"@k8ordo/ui": patch
---

`FileField` の `File[]` の `defaultValue` が、一覧に出るだけで送信されていなかったのを直しました。form の reset では、一覧と入力の両方が `defaultValue` に戻ります。`multiple`（または `webkitDirectory`）で選び直したときに入力へ書き戻した一覧は `input` イベントで知らせるので、`@k8ordo/form` などのフォームにも送る列全体が届きます。`onChange` には、新しく選んだ分やドロップした分だけでなく、一覧に並ぶファイル全体を渡します。
