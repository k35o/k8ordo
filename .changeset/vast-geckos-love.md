---
"@k8ordo/server": patch
"@k8ordo/form": patch
"docs": patch
---

Server Action の `redirect()` の例で、行き先を `href()` で作るようにした（`@k8ordo/server` の GUIDE の `signIn` と README、`@k8ordo/form` の GUIDE と README、サイトの `/server/actions`）。`redirect(to)` は URL を書いたまま送り、Vite の `base` を付けない。素の pathname を渡す例は、base の下に置いたアプリで訪問者を base の外へ送ってしまい、「`href()` で作る」というガイド自身の説明とも食い違っていた。
