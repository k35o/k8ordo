---
'@k8ordo/ui': patch
---

`CheckboxGroup` の外で使う `Checkbox` でも、`itemValue` を input の `value` 属性として出すようにしました。

これまで単独の `Checkbox` は `itemValue` を受け取っても捨てており、`value` は型から外したうえで上書きしていたので、送る文字列を変える手段がありませんでした。チェックした箱は常にブラウザ既定の `on` を送るため、`z.stringbool({ truthy: ['yes'] })` のように特定の綴りを読むスキーマや、`@k8ordo/state` が URL に書く `inStock=true` と食い違っていました。

- `<Checkbox itemValue="true" name="inStock" … />` はチェック時に `inStock=true` を送ります。
- `itemValue` を渡さなければこれまでどおり `value` 属性は出さず、`on` を送ります。
- `CheckboxGroup` の中での挙動は変わりません。
