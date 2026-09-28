---
"@k8ordo/server": minor
"docs": patch
---

serve の配信を整える。ビルドがクライアントの資産ごとに Brotli と gzip のコピー（`.br` / `.gz`）を作り、serve が `Accept-Encoding` で選んで `Vary: Accept-Encoding` 付きで返す。ファイルには中身から作った `ETag` を付けて条件付きリクエストに `304` で答え、1 つの範囲の `Range` には `206`（Safari の `<video>` 再生に要る）で答える。ページとペイロードはストリームのまま `node:zlib` で圧縮し、React が書いた部分ごとに押し出すので、シェルは遅い境界を待たずに届く。
