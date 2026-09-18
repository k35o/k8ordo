---
'@k8ordo/server': minor
---

`redirect(to, { permanent })` の第 2 引数と `RedirectOptions` 型を消した。JavaScript なしで送られたフォームにはハンドラが常に `303` を返し、クライアントランタイム経由の呼び出しには行き先しか返さないので、`permanent` はどちらの経路でも何もしていなかった。POST への `308` はブラウザに POST をやり直させるため、Server Action の終わり方として意味のある使い道も無い。`redirect(to)` と書いてください。`redirect.ts` が default export する `{ to, permanent }` はこれまでどおり `307` / `308` を選ぶ。
