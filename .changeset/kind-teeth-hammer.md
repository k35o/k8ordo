---
"@k8ordo/router": minor
---

`@k8ordo/router` に `notFound()` と `isNotFound()` を足した。`@k8ordo/framework` のページが自分の pathname は実はページではない（id が名指す商品が無い）と言うと、いちばん近い `not-found.tsx` がその上のレイアウトの内側で 404 として答える。`redirect()` と同じくブランド付きで投げる。
