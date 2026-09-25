---
"@k8ordo/state": minor
---

`defineSessionState(key, schema)` を追加。sessionStorage に置く状態で、`defineLocalState` と同じ作りです。

- 値は sessionStorage の `k8ordo-state:<key>`（定義の `storageKey`）の 1 行に置きます。そのタブのリロードでは残り、タブを閉じると消え、ほかのタブとは共有されません。
- サルベージ・書き込みのまとめ方・ハンドル・`inlineRead()` は local と同じです。`inlineRead()` は sessionStorage を読みます。
- 種類が違えば、同じキーでも別の状態です。`defineLocalState` と `defineSessionState` に同じキーを付けても、行も値も共有しません。
- `SessionState` 型を export しました。
