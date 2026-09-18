---
"@k8ordo/ui": patch
---

非制御の `Switch` で、フォームを reset したあとも reset 前の見た目と `aria-checked` が残る不具合を直しました。

reset はブラウザが `checked` を初期値へ戻すだけで `change` を飛ばさないため、`input` はオフに戻っているのに、トラックの色・つまみの位置・`aria-checked="true"` がオンのまま残り、支援技術にもオンと伝わっていました。見た目を React の state ではなく `input` の `:checked` から引き、`aria-checked` は付けないようにしました（`role="switch"` を持つ checkbox の `input` は、ネイティブの `checked` がそのまま状態として公開されます）。reset ボタン、`form.reset()`、`@k8ordo/form` の `useForm`、React が action の成功後に行う自動リセットのどれでも、戻った `checked` がそのまま表示されます。
