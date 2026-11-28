---
'@k8ordo/form': major
---

チェックボックスの集まり（`z.array(z.enum([…]))`）で送信に失敗したとき、チェックされていた値を`input.defaultValue`に配列で載せるようにしました。型は`CheckboxGroupInput`（`defaultValue?: string[]`）です。`@k8ordo/ui`の`CheckboxGroup`、`CheckboxCard`、`Autocomplete`や`<select multiple>`は、`input`を展開するだけで値が戻ります。繰り返し行の中の集まりも同じです。`DerivedField`には、集まりの欄であることと配列の件数の範囲を示す`group`が付きます。

これまでは`input`に`name`しか入っておらず、`state.values`を`Array.isArray`で絞り込んで`defaultValue`に手で渡す必要がありました。`<select>`やラジオでは展開するだけで値が戻るのに、集まりだけが`state.values`の生の形を知っている必要がありました。

あわせて、`row.field(key)`をキーごとに型付けしました。キーは1行分の中のパスで、`form.field()`のパスと同じく、書き間違えるとビルドのエラーになります。`input`の型もキーごとに入力欄の種類で決まり、行の中の集まりは`CheckboxGroupInput`、数の欄は`NumberInput`です。そのため`ArrayView`、`RowView`、`DerivedArray`は、`FormFields`と同じくスキーマか定義の型を取り、2つ目の型引数に配列のパスを取ります。`RowView<typeof orderSchema, 'items'>`のように書き、型引数を省いた`RowView`は型のエラーになります。

移行するときは次のようにします。

- `defaultValue={Array.isArray(state.values?.tags) ? state.values.tags : []}`のような手渡しを消し、`{...tags.input}`だけにします。
- 手で書くチェックボックスには`input`を展開しないでください。配列が各ボックスの`defaultValue`に載ります。`name={tags.input.name}`と`defaultChecked={tags.input.defaultValue?.includes(option)}`を渡します。
- `row.field()`のキーの書き間違いは、ビルドのエラーとして見つかるので直します。行の1つの欄を子のコンポーネントに渡すときは、`row.field(key)`が返す`FieldView`を渡します。
- 行全体を受け取る子のコンポーネントは、`row: RowView`を`row: RowView<typeof orderSchema, 'items'>`のように、スキーマか定義の型と配列のパスで書きます。`ArrayView`と`DerivedArray`も同じく`ArrayView<typeof orderSchema, 'items'>`、`DerivedArray<typeof orderSchema, 'items'>`と書きます。
