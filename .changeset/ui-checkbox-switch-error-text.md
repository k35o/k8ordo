---
'@k8ordo/ui': major
---

`Checkbox`と`Switch`が`errorText`と`helpText`を受け取るようにしました。どちらも`FormControl`と同じ見た目の文をボックスの下に描き、`aria-describedby`で`<input>`に結びます。`errorText`があるときはエラーの文だけを描き、`aria-invalid`と不正な値の見た目にします。文を出さずに不正な値の見た目にするときは、これまでどおり`invalid`を使います。渡した`aria-describedby`は残り、文のidが後ろに足されます。

`Checkbox`と`Switch`は自分でラベルを持つので`FormControl`で包みませんが、エラーの文を出す口がありませんでした。`z.literal(true)`の同意欄などのエラーは素の`<p>`で出すしかなく、入力欄に結ばれませんでした。送信に失敗すると`useForm`はその欄へフォーカスを移しますが、スクリーンリーダーは理由を読みませんでした。`@k8ordo/form`と使うときは、`<Checkbox {...agree.input} errorText={agree.error} label="規約に同意する" />`と書きます。

`Checkbox`と`Switch`のいちばん外側の要素は`<label>`から`<span>`になり、`<label>`と文をその中に描きます。文が無いときも`<span>`を描くので、エラーが出たときに`<input>`が作り直されてフォーカスを失うことはありません。外側の要素を直接選んでいるCSSやテストは、中の`<label>`を選ぶように直してください。
