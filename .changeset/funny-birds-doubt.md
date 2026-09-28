---
"@k8ordo/server": patch
"@k8ordo/static": patch
---

`not-found.tsx` を 1 つも置かないアプリで、表にない URL や `notFound()` に答えるフレームワーク自身の 404 を、文書ごと差し替えずルートレイアウトの内側に描くようにした。サイトの枠・`<html lang>`・スタイルシートが残る。`<title>` は `Not found`。ルートレイアウトが無いときだけ、これまでどおり自分で文書を書く。
