---
'@k8ordo/state': patch
---

`useAppState`の`initialUrl`と`initialCookie`に`undefined`を渡せるようにしました。`undefined`は渡さなかったときと同じで、サーバーとブラウザで共用する部品が受け取ったpropsをそのまま渡せます。

これまでは型が`undefined`を受けず、`exactOptionalPropertyTypes`を有効にしたプロジェクトでは、値が無いときにオプションごと三項演算子で分ける必要がありました。実行時の扱いは変わりません。
