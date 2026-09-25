---
'@k8ordo/form': patch
---

同梱の GUIDE の「Working with @k8ordo/ui」を、`@k8ordo/ui` の `Checkbox` が `CheckboxGroup` の外でも `itemValue` を `value` 属性に出すようになったのに合わせて直しました。`z.stringbool()` の欄は素の `<input>` ではなく、`<Checkbox {...field.input} itemValue={field.input.value} … />` で描けます。
