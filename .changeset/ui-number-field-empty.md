---
"@k8ordo/ui": major
---

`NumberField` に空の状態ができました。`value` と `onChange` の型は `number | null` になり、`null` が空欄を表します。

- 非制御で `defaultValue` を渡さなければ空欄で始まります。これまでは描画直後から `0` を表示し、何も入力していなくても `0` を送信していました。空の間は `''` を送信し、`aria-valuenow` を出しません。
- 空欄のまま blur しても空のままです。これまでは `0` が入っていました。入力を消して blur すると `onChange` に `null` を渡します。
- 空欄からの ArrowUp / ArrowDown と増減ボタンは `0` から始まります。`0` が範囲外なら `min` / `max` の近い方から始まります。
- `required` を input 自体に付けるようにしました。必須の空欄はブラウザの検証で弾かれます。
- 制御モードで親が `onChange` の値を `value` に採らなかったときは、表示が `value` に戻ります。

移行: `value` を `number` で持っていた箇所は `number | null` にしてください。`0` から始めたい場合は、非制御なら `defaultValue={0}` を、制御なら `useState<number | null>(0)` を渡してください。json-render と openui のアダプタでも、`defaultValue` の無い NumberField は `0` ではなく空欄で始まります。
