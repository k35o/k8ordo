---
'@k8ordo/i18n': minor
---

- `locales.paths` を追加。`@k8ordo/static` の `paths` オプションにそのまま渡せる関数で、`/:locale` を持つパターンをロケールの数だけ展開する。他の param を持つパターンはそのまま返し、ビルドがその名前で値を求める。
- ガイドの「router との組み合わせ」を、router の `bindParams` にロケールを供給する形に書き換えた。i18n は router に依存しない（結ぶのはアプリの 1 行）。`[locale]` の `paramsSchema` は `export const { paramsSchema } = locales` と分割代入で書いてよい（生成器がファイルをパースして export を読むようになった）。
