---
"@k8ordo/form": minor
---

`input.value` を型に持つのを、`z.stringbool()` のチェックボックスの欄だけにしました。

- `value` を持つ型を `StringCheckboxInput` として export しました。実行時に `value` が入るのは `z.stringbool()` のチェックボックスだけです。
- `FormFields` に 3 つ目の型引数（`value` を持つ欄のパス）を足しました。`formFields` はスキーマから導いて埋め、`useForm` の `field()` はそのパスでだけ `input` を `StringCheckboxInput` として返します。
- それ以外の欄の `input` の型（`FieldInput`）は変わらず `value` を持たないので、制御のときだけ `value` を取る部品（`@k8ordo/ui` の `Radio` や `CheckboxCard` など）にそのまま広げられます。
- 手で書いた `FormFields<FieldPath, ArrayPath>` は 3 つ目を省いても導いた欄を受け取れます。そのときは `input.value` を読めなくなるだけで、チェックボックスは変わらず `value` を送ります。
