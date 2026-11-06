---
"@k8ordo/ui": patch
---

`Select`・`PasswordInput`・`DatePicker`で、`invalid`の赤い枠線がフォーカス中に消えていたのを直しました。フォーカスの輪は、不正な値の欄（`aria-invalid="true"`の要素か、それを中に持つ枠）の枠線を消さなくなりました。

`TextField`・`Textarea`・`DateField`・`ColorPicker`・`Autocomplete`・`Combobox`の見た目は変わりません。`NumberField`は、読み取り専用や送信中にフォーカスしたとき、ほかの欄と同じく輪の内側の枠線が消えるようになりました。これまでは無効のときの色の枠線が残っていました。
