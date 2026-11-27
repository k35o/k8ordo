---
'@k8ordo/ui': major
---

`FormControl`の`labelAs`の値を`'label'`と`'group'`にし、`'legend'`をなくしました。`'group'`はラベルを`<span id>`の見出しとして描き、見た目と必須の印は`'label'`と同じです。`Radio`、`RadioCard`、`CheckboxGroup`、`CheckboxCard`、`RangeSlider`のように、自分がグループになる部品を包むときに使います。グループは`renderInput`で受け取る`aria-labelledby`で、この見出しを名前にします。外側の要素はいつも`<div>`になり、`ref`の型は`Ref<HTMLDivElement>`です。

`'legend'`は`<fieldset>`と`<legend>`で包んでいましたが、中のグループの部品も`fieldset`や`radiogroup`で、同じ名前のグループが二重に読み上げられていました。`'label'`で包むと`<label for>`がグループの要素を指し、ラベルを付けられない要素を指すことになっていました。

移行するときは、`labelAs="legend"`を`labelAs="group"`に書き換えます。`ColorPicker`、`DatePicker`、`Combobox`、`Autocomplete`は`id`を文字の入力欄に付けるので、`labelAs`を付けずに包みます。`FormControl`の`ref`に`HTMLFieldSetElement`や`HTMLElement`の型を渡していたところは、`HTMLDivElement`にします。
