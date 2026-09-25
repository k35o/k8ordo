---
'@k8ordo/server': patch
'@k8ordo/static': patch
---

ブラウザは、今いる pathname のために描かれた HTML だけを hydrate するようにした。

静的ビルドの `404.html` はビルドの番兵の pathname で 1 回だけ描かれ、どの URL でも配られる。描画中に URL を読む部品（`@k8ordo/i18n` の文言など）は、`/en/…` でこれを hydrate するとサーバーの HTML と食い違い、React がエラー（本番では #418）を出してページを作り直していた。サーバーの `<title>` も `<head>` に残って 2 つ並んでいた。

- 描いたときの pathname と `location.pathname` が違う文書は、`createRoot` で訪問者の URL で描き直す。末尾の `/` の違いは同じ pathname として扱う（`usePathname` と同じ正規化）。
- 見た目の結末はこれまでと同じ（JavaScript が動くまでは既定のロケール、動いたら訪問者のロケール）で、エラーと `<title>` の重複が無くなる。
