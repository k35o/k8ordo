---
"@k8ordo/state": patch
"docs": patch
---

localStorage・sessionStorage の状態で、書き込む値でスキーマが例外を投げたとき（自分の出力を読み直すと zod の issue ではなく素の `Error` を投げる `.transform()` など）、`update()` のハンドルがその例外で reject するようにした。これまでは書き込みのマイクロタスクの中で捕まらない例外になり、ハンドルは決着せず、書き込みも失われていた。Cookie の状態はもともとそうしていた。描画された値は残る。
