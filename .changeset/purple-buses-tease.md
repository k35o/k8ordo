---
"@k8ordo/ui": minor
---

`FileField.Dropzone` を追加しました。ドロップしたファイルは選んだときと同じく `multiple` / `maxFiles` に従って一覧と input に加わり（送信される）、`input` イベントでフォームに知らせます。中身を渡さないと組み込みの案内（`fileFieldDrop`）と「ファイルを選択」のボタンが入るので、キーボードでも選べます。フォルダーはドロップでは受けません。あわせて、`multiple` で選び直したときに前の回に選んだファイルが送信から漏れていたのを直しました。生成 UI の `FileField` は `dropzone` を受けます。
