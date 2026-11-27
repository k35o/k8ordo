---
'@k8ordo/ui': major
---

`@k8ordo/form`のためだけに受けていたpropsをなくしました。`Textarea`、`Combobox`、`ColorPicker`は`type`を受けなくなり、`FileField.Root`の`defaultValue`は`File[]`だけになりました。これまでは`@k8ordo/form`の`formFields`がただの文字列の欄にも`type="text"`を導き、ファイルの欄にも文字列の`defaultValue`の型を付けていたので、展開しても型のエラーにならないよう受けて捨てていました。`@k8ordo/form`はネイティブの要素に合う属性だけを出すようになったので、各コンポーネントは描く要素の属性だけを受け取ります。

移行するときは、`Textarea`、`Combobox`、`ColorPicker`に`type`を渡している箇所から`type`を消し、`FileField.Root`の`defaultValue`には`File`の配列だけを渡します。`@k8ordo/form`の`input`を展開しているだけなら、書き換えるところはありません。ただし`z.email()`や`z.url()`、`z.iso.*()`の欄を`Textarea`に展開していると、導かれた`type`が`<textarea>`に残ります。その欄は`TextField`で描きます。
