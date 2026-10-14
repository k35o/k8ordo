---
"@k8ordo/color-scheme": major
---

1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。`@k8ordo/*` のうち form・state・router・i18n・color-scheme・framework の 6 つはそろって 1.0.0 になり、以後も同じ版で出す。どれか 1 つが版を上げれば、変更のないものも同じ版で出る（`@k8ordo/ui` は別の版で続く）。互いの peer は `^1.0.0` で結ぶ。

0.1.0 から上げるときに手を入れるもの: peer の `@k8ordo/state` を `^0.2.0` から `^1.0.0` にした。API と保存する行（localStorage の `k8ordo-state:color-scheme`）は変わらないので、訪問者が選んだ配色はそのまま読める。

この版で足した主なもの: インラインスクリプトの `nonce` と、CSP のハッシュを返す `colorSchemeScriptHash()`。
