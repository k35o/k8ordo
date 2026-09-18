---
"@k8ordo/ui": patch
---

非制御の `Checkbox` と `Radio` で、フォームを reset したあとも reset 前の見た目が残る不具合を直しました。

reset はブラウザが `checked` を初期値へ戻すだけで `change` を飛ばさないため、`input` は未チェックなのにチェックマークや選択の点・枠線が残っていました。見た目を React の state ではなく `input` の `:checked` から引くようにしたので、reset ボタン、`form.reset()`、`@k8ordo/form` の `useForm`、React が action の成功後に行う自動リセットのどれでも、戻った `checked` がそのまま表示されます。

あわせて `Radio` の点は、選択が外れるときもフェードして消えるようになりました（これまでは即座に消えていました）。
