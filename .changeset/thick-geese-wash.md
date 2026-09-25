---
"@k8ordo/server": minor
"@k8ordo/static": minor
---

ルートファイル `guard.ts` を足した。どの階層にも置け、その下で答えるもの（ページ・そのペイロード・`HEAD`・送られた Server Action・下の `not-found.tsx`）の前に外から順に走る。`{ request, params }` を受け取り、`Response` を返せばそこで打ち切り、何も返さなければ次へ通す。通すときは `@k8ordo/server/runtime` の `responseHeaders()` で最終的な応答に付けるヘッダーを添えられる。型は `Guard<P>` / `GuardContext<P>`。ページの応答を書き換える `next()` は無い。`@k8ordo/static` は `guard.ts` を、ビルドでは名指しで全部、`vite dev` ではコンパイルした時点で拒む。
