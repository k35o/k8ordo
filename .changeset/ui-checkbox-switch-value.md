---
'@k8ordo/ui': major
---

`Checkbox`の`itemValue`を、ネイティブと同じ名前の`value`にしました。`Switch`も`value`を受け取ります。どちらもチェックしたときに`name`で送る文字列で、省くとブラウザの既定の`on`を送ります。チェックの状態はこれまでどおり`checked`と`defaultChecked`で扱います。

これまでは`Checkbox`が`value`を型から外し、`input`の後ろで`itemValue`を書いていたので、`@k8ordo/form`が`z.stringbool()`の欄に導く`input.value`を展開しても消えていました。チェックすると`on`が送られ、`truthy`を変えたスキーマでは読めず、`@k8ordo/state`がURLに書く`inStock=true`とも食い違っていました。`Switch`は実行時には`value`を通していましたが、型では受け取れませんでした。今は`z.stringbool()`の欄も、`{...field.input}`を展開するだけでスキーマの綴りを送ります。

移行するときは、`<Checkbox itemValue="true" />`を`<Checkbox value="true" />`に書き換えます。`z.stringbool()`の欄を素の`<input {...field.input} />`で描いていたところは、`<Checkbox {...field.input} label="…" />`にできます。
