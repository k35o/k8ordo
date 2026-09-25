---
"@k8ordo/i18n": minor
"docs": patch
---

ロケール集合に `negotiateRequest(request, { cookie? })` を足した。Request から、定義したロケールのどれかを選ぶ。

- `cookie` で名前を渡すと、その Cookie（訪問者が前に選んだロケール）を先に、次に `Accept-Language` を希望の順に試す。どちらも `negotiate` と同じ規則（完全一致 → 同じ言語 → 既定値）を通るので、集合にもう無いロケールが Cookie に残っていてもヘッダーに落ちる。
- Cookie の名前はアプリケーションが決める。`cookie` を省くとヘッダーだけを読む。
- ページより前に走り redirect を返せるファイルから、`/` をロケールへ振り分けるのに使う。型 `NegotiateRequestOptions` を公開した。

サイトの `/i18n/locales` に `negotiateRequest` を足し、サーバーで `/` を振り分ける例（`/i18n/integrations`）をこれに書き換えた。
