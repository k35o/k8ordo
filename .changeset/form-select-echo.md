---
'@k8ordo/form': patch
---

`<select>` に `field.input` を広げたとき、送信に失敗した値のエコーが画面から消える不具合を直しました。

React は `<select>` の `defaultValue` をマウント時にしか反映しません。そのため `useActionState` の action の後に React がフォームを reset すると、select はマウント時の選択に戻り、`state.values` で返した選択が失われていました。`useForm` が各レスポンスのエコーを option の `defaultSelected` に書くようになったので、reset のあとも送った選択が残り、その後の reset と `isDirty` もその選択を基準にします。`<select multiple>` も同じです。
