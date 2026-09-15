---
'@k8ordo/static': patch
'@k8ordo/server': patch
---

GUIDE に「Components that need a browser」の節を足しました。React 19.3 の `use(browser())` を `<Suspense>` の下で呼ぶと、サーバー（ビルドでもリクエストでも）は fallback を残し、ブラウザが hydrate 後に描きます。ビルドはそれで止まりません。
