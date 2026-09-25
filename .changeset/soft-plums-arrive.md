---
"@k8ordo/server": patch
"@k8ordo/static": patch
"docs": patch
---

`guard.ts` が返す `Response` の `location` には Vite の `base` が自動では付かないことをガイドに書く。

- `base` の節で、`redirect.ts`（base を前に付けて送られる）と、アプリが自分で作るリダイレクト（Server Action の `redirect()` と、guard が返す `Response` の `location`。書いたまま送られるので `href()` で作る。ほかの方法で作った pathname には `withBase()` で base を付ける）を分け、後者を `@k8ordo/server` のものとして書く。
- `@k8ordo/server` の Guards の例を `href('/login')` で作り、`location` が書いたまま送られることを書く。
- サイトの `/server/guards` と `/server/deploy` も合わせ、`/static/deploy` からは Server Action の `redirect()` の記述を外す。
