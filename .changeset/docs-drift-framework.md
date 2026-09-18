---
'@k8ordo/static': patch
'@k8ordo/server': patch
---

同梱ドキュメントを実装に追従させました。

- 共有節の「ビルドが拒むもの」の表を今のエラー文と正しい例に、生成ファイルの例を今の `routes.gen.ts` に、`paramsSchema` の検査が型検査であることに直しました。
- static の GUIDE から、サーバー前提の記述（描画時エラーで 500 が返る、など）を外しました。`paths` のビルドエラーと、`_` / `.` で始まるファイルが無視されることも書き足しています。
- server の GUIDE に `serve` の `dist` / `host` と既定値、ファイルを返すのは GET / HEAD だけであることを書きました。`redirect()` の `permanent` を使える option としては載せなくなりました。
- `llms.txt` に公開型を足し、CLAUDE.md の Layout 節を英語にしました。
