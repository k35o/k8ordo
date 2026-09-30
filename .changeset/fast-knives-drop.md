---
"@k8ordo/server": minor
---

`@k8ordo/server/runtime` に `cookies()` と `requestHeaders()` を足した。`cookies()` はリクエストの Cookie で、`guard.ts` と Server Action の中で `get` / `has` / `set` / `delete` できる。同じリクエストの中の書き込みはその後の読み取りに見え、書いたものは答えの `Set-Cookie` になる。`set` の既定は `path: "/"`・`httpOnly: true`・`sameSite: "lax"`。`secure` の既定は `true` だが、素の HTTP でこの機械（`localhost`・`127.0.0.1`・`[::1]`）に届いたリクエストでは `false`（Safari はそこで `Secure` の Cookie を捨てる）。`sameSite: "none"` は常に `Secure`。値はパーセントエンコードして書き、`get` はデコード済みの値を返す。`requestHeaders()` はリクエストが運んできたヘッダー。Server Action はリクエストの文脈を持つようになり、`responseHeaders()` も使える。ページは今までどおり props の `request` を読むだけで、描画中に呼ぶとどれも throw する。
