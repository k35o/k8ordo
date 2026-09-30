---
"@k8ordo/i18n": patch
"docs": patch
---

`/` の振り分けの説明を、`@k8ordo/server` では `guard.ts` が `307` で答える書き方に改めた。

- GUIDE の「The `/` page」は、`parseAcceptLanguage` と redirect でサーバーでも同じ判断ができる、と書くだけで、どこで redirect を返すかを示していなかった。`(home)/guard.ts` が `locales.negotiateRequest(request, { cookie: 'locale' })` で選び、`withBase(locales.localize('/', locale))` へ `307` を返す形にした。guard を `/` だけに効かせるためにルートグループに入れること、`null` を返すページが要ること、`308` にしない理由も書いた。`guard.ts` を拒む `@k8ordo/static` では、これまでどおり effect で移る。
- llms.txt の GUIDE の要約に、`/` の振り分けがモードで違うことを足した。
- ドキュメントサイトの `/i18n/integrations` の `@k8ordo/server` の節（コード例をページ＋クライアントの `RedirectTo` から guard＋`null` のページに）と、`/i18n/routing` の `/` の節も同じ内容に直した。
