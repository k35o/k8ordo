---
"@k8ordo/state": major
"@k8ordo/server": patch
"docs": patch
---

`cookieValue` がパーセントエンコードせず、素の JSON を返すようにした（破壊的変更）。

これまでは `encodeURIComponent(JSON)` を返していたが、`@k8ordo/server` の `cookies().set`（Next.js の `cookies().set` も）は値をもう一度エンコードして `Set-Cookie` に書く。読む側（`request.cookies` とブラウザのストア）は 1 回しか戻さないので、GUIDE どおりに `cookies().set(def.cookieName, def.cookieValue(values))` と書いた Cookie は `%7B…` のまま JSON として読めず、`parseCookies` もブラウザのストアも黙って既定値を返していた。

- `cookieValue(values)` は、エンコードしていない JSON を返す。`parseCookies` が受け取る、1 回デコード済みの値と同じ形。
- ブラウザのストアは、Cookie Store API に渡す前に自分で `encodeURIComponent` する。ブラウザが書く Cookie の中身はこれまでと変わらない。
- 移行: `cookieValue` の値を `@k8ordo/server` や Next.js の `cookies().set` に渡しているなら、そのままで直る。`Set-Cookie` ヘッダーを自分で組み立てているなら、`encodeURIComponent(def.cookieValue(values))` にする。これまでにサーバーが二重にエンコードして書いた Cookie は、引き続き既定値として読まれ、次に書いたときに直る。

`@k8ordo/server` の文書（`references/guards.md`）に、`cookies().set` が値をパーセントエンコードして書き、リクエストの Cookie は戻してから渡すことを書いた。サイトの `/state/reading` と `/server/guards` にも同じことを書いた。
