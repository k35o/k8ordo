---
'@k8ordo/i18n': patch
---

同梱ドキュメントを実装に追従させました。

- `@k8ordo/server` でもページの描画中にはリダイレクトできないので、`/` の振り分けをサーバーでするには手前のプロキシかホストが要る、と直しました。
- `@k8ordo/ui` との組み合わせを `dictionaries[locale]` で書くようにしました。`@k8ordo/form` の文言は `{ error: m.x }` で渡し、`formFields` は描画中に、`parseForm` は `locales.run` の中で呼ぶ、と書いています。
- `locales.paths` が `:locale` 以外の param を持つパターンをどう扱うか、`localize` が既にロケールを持つパスを検査しないこと、テストでの注意（最後の `defineLocales` が勝つ、など）を実装どおりに書きました。
