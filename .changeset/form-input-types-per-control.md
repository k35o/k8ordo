---
'@k8ordo/form': major
---

`form.field()`が返す`input`の型を、スキーマから導く入力欄の種類で分けました。`z.coerce.number()`は`NumberInput`（`type: 'number'`、数の`min`と`max`、必ずある`step`）、`z.boolean()`は`CheckboxInput`、`z.stringbool()`は`StringCheckboxInput`（`value: string`）、`z.file()`は`FileInput`（`defaultValue`なし）です。文字列、`z.enum()`、`.nullable()`や`z.union()`、`.pipe()`を通した欄は、これまでどおり`FieldInput`です。`NumberInput`、`CheckboxInput`、`FileInput`は両方の入口から型をimportできます。

これまではどの欄も同じ`FieldInput`で、ファイルの欄にも文字列の`defaultValue`が、チェックボックスにも`min`や`maxLength`が型の上で付いていました。受け取る側はそれに合わせて型を広げるしかありませんでした。`parseForm`は、ファイルの欄の名前で文字列が送られてきても（GETのフォームやmultipartでないPOST）、`state.values`に入れなくなりました。

`StringCheckboxInput`の`value`は省略できない`string`になり、`FieldInput`を土台にしなくなりました。`input`を`FieldInput`と注釈していた変数や引数は、欄の種類の型か`FieldView`の型引数に合わせてください。
