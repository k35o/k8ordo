---
'@k8ordo/framework': minor
---

`k8ordo generate` コマンドを足しました。アプリのディレクトリで実行すると、Vite の設定を `vite build` と同じように読み、`.k8ordo/`（ルート表と `Register`）を `vite build` の開始時と同じ中身で書いて終わります。環境のビルドもページの描画もしないので、`paths` を呼ばず、ページが読むデータにも触れません。DB や secrets の無い CI のジョブでも、`tsc` の前に型を用意できます。

```yaml
- run: pnpm exec k8ordo generate
- run: pnpm exec tsc --noEmit
```

- `routes/` に問題があると、ビルドと同じエラー（`routes/ is not a valid pathname space:` に続けて問題をすべて）を出して終了コード 1 で終わり、何も書きません。
- `framework()` を使っていない Vite の設定では、生成するものが無いと言って終了コード 1 で終わります。
