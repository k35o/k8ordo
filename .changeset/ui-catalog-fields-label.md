---
'@k8ordo/ui': major
---

生成UIのカタログの入力欄に、必須の`label`と任意の`helpText`を足しました。どの欄も`FormControl`の`renderInput`で描きます。

これまで`TextField`、`Textarea`、`PasswordInput`、`NumberField`、`Slider`、`Select`、`Autocomplete`、`FileField`は`label`を持たず、モデルが置いたこれらの欄には名前がありませんでした。`label`を持つ欄も、見出しを`<span>`で描いて`aria-labelledby`で結んでいたので、見出しを押しても欄にフォーカスが移りませんでした。`RangeSlider`の`label`は、画面に出ない`aria-label`でした。

`label`は欄を指す`<label for>`として描きます。`Radio`、`RadioCard`、`CheckboxGroup`、`CheckboxCard`、`RangeSlider`、`FileField`では、グループの名前になる見出しとして描きます（`labelAs="group"`）。`helpText`は欄の下に出て、欄の説明として読み上げられます。

`label`を足した8つの項目は、OpenUI Langの位置引数の並びをここで一度だけ決め直しました。必須の`label`が加わると、これらの項目の保存済みの文字列はどれもそのままでは通らないためです。`label`は`name`の直後（`name`の無い`FileField`では先頭）に、`helpText`は末尾に置きます。末尾に`label`を置くと、モデルは前にある任意の引数をすべて`null`で埋めて書くことになります。今の並びは次のとおりです。

- `TextField(name, label, placeholder, defaultValue, invalid, disabled, readOnly, type, helpText)`
- `Textarea(name, label, placeholder, defaultValue, invalid, disabled, readOnly, rows, autoResize, helpText)`
- `PasswordInput(name, label, placeholder, defaultValue, invalid, disabled, helpText)`
- `NumberField(name, label, defaultValue, min, max, step, invalid, disabled, helpText)`
- `Slider(name, label, defaultValue, min, max, step, invalid, disabled, helpText)`
- `Select(name, label, options, defaultValue, invalid, disabled, helpText)`
- `Autocomplete(name, label, options, defaultValue, invalid, disabled, helpText)`
- `FileField(label, triggerLabel, multiple, maxFiles, clearable, dropzone, helpText)`

もとから`label`を持つ`DatePicker`、`RangeSlider`、`ColorPicker`、`Radio`、`RadioCard`、`Combobox`、`CheckboxGroup`、`CheckboxCard`は並びを変えず、`helpText`を末尾に足しました。

移行するときは、保存したspecやプロンプトの`TextField`、`Textarea`、`PasswordInput`、`NumberField`、`Slider`、`Select`、`Autocomplete`、`FileField`に`label`を書き足します。OpenUI Langでは、上の並びに合わせて引数を書き直します。2番目の引数は`label`として読まれるので、書き直さずに残した文字列は、ほかのpropの値が別のpropに入って描かれます。`TextField("email", "you@example.com", "k8o@example.com")`は、`TextField("email", "メールアドレス", "you@example.com", "k8o@example.com")`にします。
