---
"@k8ordo/ui": patch
---

`Autocomplete` と `Combobox` の不具合を直しました。

- `Autocomplete` は、IME で変換している間の Enter と矢印キーを変換のものとして扱います。これまでは一覧の中を動かし、Enter でポインタを載せた候補を選んでいました。
- `Autocomplete` の矢印キーが、一覧の中を動かすのと一緒に入力欄のキャレットを行頭・行末へ動かしていたのを止めました。
- `Autocomplete` の候補の id を、値ではなく `useId` から作ります。空白を含む値では id が無効になり、空白で区切って読む支援技術には `aria-activedescendant` の指す候補が見つかりませんでした。
- `Combobox` と `Autocomplete` は、フォームの送信中に `disabled` ではなく `readOnly` になります。Enter で送ると、Chromium がフォーカスを body へ落としていました。送信中と `readOnly` のときは一覧を開かず、値も変えません。`Autocomplete` のタグを外すボタンと「すべて削除」は、`disabled` のときも押せなくなりました。
