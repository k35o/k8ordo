---
'@k8ordo/static': patch
'@k8ordo/server': patch
---

`redirect.ts` のターゲットに埋める param を二重に percent-encode しなくなった。URLPattern が返すグループは URL が綴ったままの区間（エスケープ済み）なのに、`href` と同じく値としてもう一度 `encodeURIComponent` していたため、`/:slug/new` を返す `[slug]/legacy/redirect.ts` への `/café/legacy` が `Location: /caf%25C3%25A9/new` になっていた。static ビルドが書き出すリダイレクトページも同じ行き先を持っていた。マッチした区間は復号も再エンコードもせずそのまま移すので、`/caf%C3%A9/new` になり、`%2F` を含む区間や復号できないエスケープも綴りどおりに渡る。
