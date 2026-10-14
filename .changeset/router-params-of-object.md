---
'@k8ordo/router': patch
---

paramを持たないパターンの`ParamsOf`と`ParsedParams`、`PageProps`の`request`と`search`が無いときに足す型を、`{}`に解決される`Record<never, never>`から`object`にしました。`{}`は数値や文字列も受け取ってしまいます。
