---
'@k8ordo/color-scheme': minor
---

`@k8ordo/color-scheme` を追加。アプリケーションのカラースキーム軸を持つパッケージ。

- `<ColorSchemeProvider defaultPreference?>` をルートレイアウトの `<body>` の中で全体に被せる。先頭にインラインスクリプトを描いて最初の描画の前に `<html>` へ `dark` を付け（`@k8ordo/ui` と Tailwind の dark variant が読むクラス）、hydrate 後は保存行とシステム設定を読んでクラスを追従させる。`<head>` に置くものは無い。`defaultPreference` は訪問者が選ぶまで何に従うか（既定は `'system'`）。
- `useColorScheme()` が `{ scheme, preference, setPreference }` を返す。`scheme` は画面に出ている `'light' | 'dark'`、`preference` は訪問者の設定 `'light' | 'dark' | 'system'`。`setPreference('system')` で保存行を消す。hook は Provider を読むだけで、DOM には触らない。
- 保存先は `@k8ordo/state` の `defineLocalState('color-scheme')`（`colorSchemeState` として export）。キーも JSON の形もここには書かれない。サーバーは既定値で描き、hydrate 直後のレンダーは DOM に書かず、ストアを読んだレンダーから追従する。
- peer: `@k8ordo/state`、`react` / `@types/react` `>=19.3.0`、`zod`。
