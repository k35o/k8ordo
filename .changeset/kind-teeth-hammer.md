---
"@k8ordo/router": minor
"@k8ordo/server": minor
"@k8ordo/static": minor
---

`@k8ordo/router` に `notFound()` と `isNotFound()` を足した。フレームワークのページが自分の pathname は実はページではない（id が名指す商品が無い）と言うと、いちばん近い `not-found.tsx` がその上のレイアウトの内側で 404 として答える。`redirect()` と同じくブランド付きで投げる。`@k8ordo/server` では、ステータスを正しくするため、文書（と `HEAD`）はページ自身のコンポーネントが答えるまで送り始めない。ページが `<Suspense>` の下に置いたものはその後に流れる。クライアント遷移のペイロードは待たずに流れ、遅れて届いた `notFound()` は同じ URL の文書の読み込みになる。`@k8ordo/static` では、`paths` が渡した pathname のページが `notFound()` と言うと、その pathname を挙げてビルドを止める。
