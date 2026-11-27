---
'@k8ordo/ui': patch
---

`CheckboxGroup`と`CheckboxCard`、`Slider`、`RangeSlider`が`required`を受け取り、どの要素にも書かないようにしました。これまでは`FormControl`の`renderInput`で受け取ったpropsを展開すると、`CheckboxGroup`と`CheckboxCard`では`required`が残りの属性として`<fieldset required>`に描かれていました。`<fieldset>`は`required`を持たず、チェックボックスに付けるとそのボックスのチェックを求める意味になります。`Slider`と`RangeSlider`は`<input type="range">`に`required`を付けていましたが、HTMLはrangeに`required`を許しません。rangeは常に値を持つので、必須の検査にも掛かりませんでした。

グループが必須であることは、`<FormControl labelAs="group" required>`の印がグループの名前に入って伝わります。`RangeSlider`の各つまみもこの名前を読むので、これまでは名前の印とつまみの`required`で必須を二度読み上げていました。いくつ選ぶかは、`@k8ordo/form`がスキーマの`.min()`から作るルールか、自分のルールで確かめます。呼び出し側で変えることはありません。
