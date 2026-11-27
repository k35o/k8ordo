---
'@k8ordo/ui': patch
---

`RadioCard`と`CheckboxCard`が、フォームの送信中に選び直せないようにし、`invalid`のときに`aria-invalid`を付けるようにしました。これまでは2つとも`useFormStatus`を読まず、送信中でも選択を変えられました。`invalid`も枠の色だけで伝えていたので、不正な値であることが読み上げで分かりませんでした。`aria-invalid`は、`RadioCard`ではグループ（`role="radiogroup"`）に、`CheckboxCard`では各チェックボックスに付けます。`role="group"`は`aria-invalid`を持てないためです。送信中は`Radio`や`Checkbox`と同じく、各入力に`aria-disabled`を付けて押した操作を捨てます。`disabled`にはしないので、`Enter`で送信した人はフォーカスを失いません。

`CheckboxGroup`も、`invalid`を`<fieldset>`の`aria-invalid`にせず、各チェックボックスに渡すようにしました。これまでは`role="group"`が持てない`aria-invalid`をグループに付けていました。各ボックスは`aria-invalid="false"`のままで、枠も赤くなりませんでした。`<FormControl labelAs="group">`の`errorText`でエラーの文が出ても、ボックスは正しい値として読み上げられていました。
