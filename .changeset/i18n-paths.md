---
'@k8ordo/i18n': minor
---

- `locales.paths` を追加。`@k8ordo/framework` の static モードの `paths` オプションにそのまま渡せる関数で、`/:locale` を持つパターンをロケールの数だけ展開する。ほかの param は展開しない。`/:locale/blog/:slug` は `/ja/blog/:slug` のように param を残して返り、ビルドはそれを描かずに `static build needs pathnames for /:locale/blog/:slug` で止まるので、2 つ目の param を持つサイトは同じ関数の中で残りを展開する（`(patterns) => locales.paths(patterns).flatMap(expandSlug)`）。
- ガイドの「router との組み合わせ」を、router の `bindParams` にロケールを供給する形に書き換えた。i18n は router に依存しない（結ぶのはアプリの 1 行）。`[locale]` の `paramsSchema` は `export const { paramsSchema } = locales` と分割代入で書いてよい（`@k8ordo/framework` は `paramsSchema` の export を構文木から読む）。
