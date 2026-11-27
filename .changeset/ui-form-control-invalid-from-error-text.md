---
'@k8ordo/ui': major
---

`FormControl`から`invalid`をなくし、`errorText`が空でないかどうかで不正な値かを決めるようにしました。`errorText`があれば欄の下にエラーの文を描き、`aria-describedby`をその文に向け、`renderInput`に`invalid: true`を渡します。`renderInput`が受け取る`invalid`はこれまでどおりで、各部品の`aria-invalid`になります。

これまでは`invalid`と`errorText`の両方がそろったときだけ文を出していました。`@k8ordo/form`の`invalid`は`error`があるかどうかなので、どの欄でも同じ真偽を2つのpropで渡すことになり、片方を忘れると赤いのに文が無いか、文が出ないままになっていました。catalogの`FormControl`も、`invalid`を受け取らなくなります。

移行するときは、`<FormControl invalid={field.invalid} errorText={field.error} …>`の`invalid`を消します。文を出さずに不正な値の見た目にしていたところは、`renderInput={(props) => <TextField {...props} invalid />}`のように、中の部品に`invalid`を渡します。
