---
"@k8ordo/router": minor
---

表の枝が `loading`（`@k8ordo/framework` のルートファイル `loading.tsx`）を取れるようにした。置いた階層で、その下を Suspense で包み、サスペンドしている間に出す（その階層の `error.tsx` の境界の内側）。進行中のページの切り替えの行き先を返す `usePendingPathname()`（無ければ `null`）も足した。すでに出ている Suspense の下の切り替えは今までどおり前のページを残すので、その待ちはこれで見せる。
