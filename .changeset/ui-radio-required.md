---
"@k8ordo/ui": minor
---

`Radio` が `required` を受け取るようになりました。各 `<input type="radio">` に渡るので、どれも選ばれていないあいだはグループが `valueMissing` になり、フォームは送信されません。

これまでは props の型に `required` がなく、無理に渡しても `role="radiogroup"` の `div` に乗るだけで、未選択でも `form.checkValidity()` が `true` を返していました。`@k8ordo/form` の `form.field(path).input`（`{ name, required, defaultValue }`）をそのまま広げられます。
