---
"@k8ordo/ui": minor
---

候補から 1 つを選ぶ `Combobox` を追加しました（WAI-ARIA の combobox、リストの自動補完と手動選択）。`value` / `onChange` は選んだ候補の `value` で、未選択は `''` です。`search` を渡すと、打った文字で候補を非同期に探します。打ち直すと前の問い合わせは `signal` で打ち切り、探している間は一覧を busy にし、失敗や 0 件は `comboboxFailed` / `comboboxEmpty` で知らせます。打ちかけで離れると選んだ候補の表示名に戻し、空にして離れると選択を外します。IME の変換中のキーは変換のものとして扱います。`name` があれば、`Autocomplete` と同じく見えない `<select>` で送るので、`required`・フォームのルール・reset・失敗後のフォーカスの移動がそのまま効きます。json-render と OpenUI のカタログにも、決まった候補を絞り込む形で載せました。あわせて `Autocomplete` は「決まった候補から複数を選ぶ」部品として docs の説明を書き分けました。
