---
'@k8ordo/ui': major
---

生成UIのカタログの`Select`、`Radio`、`RadioCard`、`ListBox`、`CheckboxGroup`、`CheckboxCard`で、`options`の`value`に無い`defaultValue`を受け付けないようにしました。`catalogPropIssues`は、その値を`Select.defaultValue`や`CheckboxGroup.defaultValue.1`のように位置を付けて返し、選べる値も並べます。選択肢の`label`を`value`と取り違えた値も、これまではそのまま通り、どの選択肢にも当たらない値として描かれていました。`Table`の行と列の検査と同じく、`options`と`defaultValue`がそれぞれ正しければ、ほかのpropの誤りと一緒に返します。`options`か`defaultValue`を`unresolved`に挙げたときは確かめません。

移行するときは、保存したspecやプロンプトの`defaultValue`を、`options`のどれかの`value`に書き換えます。`CheckboxGroup`と`CheckboxCard`では、配列のどの値もそうします。

この6つの`props`も、`Table`と同じくこの検査を持つzodのスキーマになり、`.omit()`、`.pick()`、`.partial()`と、すでにあるキーを置き換える`.extend()`はエラーになります。つなぎでこれらのスキーマから別のスキーマを作っていたときは、`.safeExtend()`で作ります。この検査もJSON Schemaには出ません。
