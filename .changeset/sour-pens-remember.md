---
"@k8ordo/server": minor
"@k8ordo/static": minor
"@k8ordo/router": minor
---

ルートファイル `loading.tsx` を足した。置いた階層で、その下を Suspense で包み、サスペンドしている間に出る（その階層の `error.tsx` の境界の内側）。クライアント遷移でそのディレクトリに入るときと、ページの中がストリームの途中でサスペンドしたときに出る。`@k8ordo/router` の表の枝も `loading` を取れるようにし、進行中のページの切り替えの行き先を返す `usePendingPathname()`（無ければ `null`）を足した。すでに出ている Suspense の下の切り替えは今までどおり前のページを残すので、その待ちはこれで見せる。
