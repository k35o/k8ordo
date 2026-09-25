---
"@k8ordo/ui": minor
---

`@k8ordo/form` の `formFields` が導いた属性を、すべてのフィールドがそのまま受けるようになりました。`<TextField {...props} {...field.input} />` のように広げるだけで、送信・検証・エラー表示・リセットまで動きます。

- `TextField` の `type` が `date` / `time` / `datetime-local` / `month` / `week` と任意の文字列を受けます。
- `NumberField` は `min` / `max` に文字列、`step` に `'any'`、非制御の `defaultValue` に文字列を受け、範囲外の値を `setCustomValidity` でブラウザの検証に載せます（文言は新しい `numberFieldRangeUnderflow` / `numberFieldRangeOverflow`）。`precision` の既定は `step` の小数の桁数になり、`step="any"` では丸めません。矢印キーなどでコードから変えた値は `input` イベントで知らせます。
- `Slider` も同じ属性を受けます。非制御の値を DOM に持つようになったので、form の reset で既定値に戻ります。
- `Autocomplete` は選択を隠した `<select multiple>` で送ります。何も選んでいなくても name を持つ要素が残るので、`required` とフォームのルールが効き、送信に失敗したあとのフォーカスは入力欄へ移ります。選択の変化は `input` イベントで知らせます。
- `RadioCard` が `required` を受けて各ラジオに渡します。
- `RadioCard` / `CheckboxCard` / `CheckboxGroup` の非制御の選択が、form の reset と、送信に失敗した値のエコーに追従します。`CheckboxCard` / `CheckboxGroup` の `onChange` は、チェックされた値を文書順で渡すようになりました。
- `Select` が、マウント後に変わった `defaultValue` に reset で戻ります。
- `PasswordInput` の表示切り替えが、広げた `type` に上書きされなくなりました。`Textarea` は `type` を受けて捨てます。
- `FileField` は一覧から外したファイルを、`onChange` を渡していなくても入力から外し、reset で一覧を空にします。文字列の `defaultValue` を型として受けます。
