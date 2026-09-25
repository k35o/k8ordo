---
'@k8ordo/i18n': patch
'docs': patch
---

404 がどのロケールで描かれるかの説明を実装に合わせた。

- GUIDE は「`404.html` の Client Component は hydration の後に訪問者のロケールで描き直される」と書いていたが、実際には hydration の最中に URL を読んで失敗していた。`404.html` は hydrate されずに訪問者の URL で描き直されること、`/en/…` の 404 はサーバーでも `en` で描かれること、`getLocale()` と `delocalize` が 404 でも一致することに直した。
- ドキュメントサイトの framework・i18n・router の各ページと、同じ思い込みで書かれていたコメントも直した。
