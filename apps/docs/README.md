# docs

k8ordo のドキュメントサイト。<https://ordo.k8o.me> で公開している。

`/` が全体の入口で、各パッケージは `/<package>` 以下を持つ。
URL の構成とパッケージの増やし方は [`CLAUDE.md`](CLAUDE.md) にある。

## 技術スタック

- [@k8ordo/static](../../packages/static) - 事前描画してファイルに焼く、このリポジトリのフレームワーク
- [@k8ordo/router](../../packages/router) - Navigation API と URLPattern の上に立つルーター
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストの CSS フレームワーク

## 開発

```bash
pnpm --filter docs dev
```
