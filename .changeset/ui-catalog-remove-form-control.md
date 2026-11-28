---
'@k8ordo/ui': major
---

生成UIのカタログから`FormControl`をなくしました。カタログの入力欄はどれも自分の`label`と`helpText`を持ち、描くときに`FormControl`で包みます。`FormControl`の項目は、`fieldType`で`TextField`、`Textarea`、`PasswordInput`のどれかを描くだけで、同じ欄を2通りに書けていました。

移行するときは、保存したspecやプロンプトの`FormControl`を、`fieldType`に合わせて`TextField`（`'text'`か省略）、`Textarea`（`'textarea'`）、`PasswordInput`（`'password'`）に書き換えます。`label`、`name`、`placeholder`、`defaultValue`、`helpText`はそのまま渡せます。`errorText`と`required`を書く先はないので外します。`errorText`を書いていた欄は`invalid: true`にします。OpenUI Langでは引数の並びが変わり、`FormControl("お名前", "text", "name", "山田 太郎")`は`TextField("name", "お名前", "山田 太郎")`になります。
