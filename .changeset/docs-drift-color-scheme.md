---
'@k8ordo/color-scheme': patch
---

同梱ドキュメントを実装に追従させました。

- Tailwind CSS 4 の既定の `dark:` はメディアクエリで、`<html>` の `dark` クラスを読むのは `@k8ordo/ui` の dark variant（Tailwind を直接使うなら `@custom-variant` の宣言が要る）だと直しました。
- 既定の `'system'` のとき、サーバーはシステムの設定を知らないので `scheme` を `'light'` で描く、と書きました。
- `setPreference('system')` は保存行を消すのではなく preference を外すこと、クライアントだけでマウントしたときはインラインスクリプトが実行されないことを書きました。
- README の peer 表に optional peer の `@types/react` を足し、`@k8ordo/state` の範囲を公開時の `^0.2.0` にしました。
