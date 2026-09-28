---
"@k8ordo/form": minor
---

`defineForm` のルール（`sameAs`・`minChecked`・`requiredWhen`）の `message` に、文字列を返す関数も渡せるようになりました。

- zod の `{ error: () => … }` と同じく、宣言したときではなく報告するときに呼ばれます。`formFields` は欄を導くときに呼び、`parseForm` はルールが破れたときに呼びます。`@k8ordo/i18n` の文言を渡せば、定義をモジュールの先頭に置いたまま、リクエストごとのロケールで報告されます。これまではロケールごとにルールを作り直す必要がありました。
- 関数はクライアントに渡せないので、`formFields` が返す `rules` は文言を呼んだあとのデータです。その型 `DerivedRule` と、`message` の型 `RuleMessage` を公開しました。`FormFields` の `rules` の型は `Rule[]` から `DerivedRule[]` に変わります。
