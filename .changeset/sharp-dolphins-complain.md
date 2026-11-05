---
"@k8ordo/framework": patch
"@k8ordo/i18n": patch
---

別のURLのために描いた文書も、HTMLの要素のままハイドレーションするようにしました。

静的なビルドの`404.html`と`fallback.tsx`の殻は、訪問者のURLとは別のpathnameのために描かれます。これまでブラウザはそれらをハイドレーションせず、`createRoot`で描き直していたので、HTMLの要素はすべて別の要素に置き換わっていました。インラインスクリプトの中身や`src`も書き直すため、`require-trusted-types-for 'script'`を強制した文書では、その書き込みが拒まれていました。

- ハイドレーションの間は、`usePathname()`と`@k8ordo/i18n`の文言が、文書を描いたときのpathnameを読みます。HTMLと食い違わないので、要素はそのまま残ります。
- ハイドレーションを終えると、同じページを訪問者のURLで描き直します。Client Componentの文言は、これまでどおり訪問者のロケールになります。
- `usePathname()`を読むeffectは、最初のコミットで描いたときのpathnameを受け取り、そのあと訪問者のURLを受け取ります。
