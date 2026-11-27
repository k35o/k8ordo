---
'@k8ordo/i18n': patch
---

ガイドのserverモードの`/`の例を、`redirect(href('/:locale', { locale }))`で書くようにしました。`@k8ordo/framework`の`guard.ts`は`redirect()`を受けるようになったので、`Location`を手で付けた`307`の`Response`を組む書き方と、`withBase`で`base`を付け直す説明をなくしました。URLはリンクと同じく`href`が作り、Viteの`base`も付きます。
