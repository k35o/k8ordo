---
"@k8ordo/static": patch
---

`not-found.tsx` の描画に失敗したらビルドを止める。これまでは 404.html の書き出しだけがハンドラの 500 を見ておらず、404.html を書かないまま exit 0 で終わり、最後のログも `k8ordo: wrote N routes and 404.html` と書いていた。ページの失敗と同じく `static build could not render 404.html — see the error above` で止まり、ページと並んで失敗したときは一緒に名前を挙げる。
