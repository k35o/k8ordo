---
"@k8ordo/ui": patch
"docs": patch
---

`FileField.Dropzone` にドロップしたファイルを `accept` で選り分ける。ブラウザが `accept` を当てるのはファイル選択ダイアログだけで、ドロップで届いたファイルは素通しになるため、`accept="image/*"` の欄に落とした PDF が一覧にも送信にも入っていた。`<input accept>` と同じ規則（MIME の完全一致・`type/*`・拡張子。大文字小文字は区別しない）で照らし、当たらないファイルは加えない。当たるものが 1 つも無いドロップは、選んであったファイルを置き換えず、`onChange` も `input` イベントも出さない。

サイトの FileField の説明も合わせた。
