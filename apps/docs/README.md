# docs

k8ordo ファミリーのドキュメントサイト。<https://ordo.k8o.me> で公開している。

`/` が家族の入口で、各パッケージは `/<package>` 以下を持つ（現在は `/ui`）。
URL の構成とメンバーの迎え方は [`CLAUDE.md`](CLAUDE.md) にある。

## 技術スタック

- [@funstack/static](https://github.com/uhyo/funstack-static) - サーバー不要の React Server Components フレームワーク
- [@funstack/router](https://github.com/uhyo/funstack-router) - Navigation API ベースの React ルーター
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストの CSS フレームワーク

## 開発

```bash
pnpm --filter docs dev
```
