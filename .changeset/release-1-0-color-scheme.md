---
"@k8ordo/color-scheme": major
---

1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。0.x だった `@k8ordo/*` のパッケージ（form・state・router・i18n・color-scheme）はそろって 1.0.0 になり、`@k8ordo/static` と `@k8ordo/server` をまとめた `@k8ordo/framework` も 1.0.0 で始まる。互いの peer は `^1.0.0` で結ぶ。

0.1.0 から上げるときに手を入れるもの: peer の `@k8ordo/state` を `^0.2.0` から `^1.0.0` にした。API と保存する行（localStorage の `k8ordo-state:color-scheme`）は変わらないので、訪問者が選んだ配色はそのまま読める。

この版で足した主なもの: インラインスクリプトの `nonce` と、CSP のハッシュを返す `colorSchemeScriptHash()`。
