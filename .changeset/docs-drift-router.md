---
'@k8ordo/router': patch
---

同梱ドキュメントを実装に追従させました。

- `llms.txt` に公開型（`Routes` / `ErrorProps` / `NavigateToOptions` / `BoundLinks` / `MatchOptions` / `RegisteredPattern` など）を足し、`matchPath` の `options`、`bindParams` の `navigateTo` の引数、`bigint` を受ける param 値を書きました。
- `LayoutProps` の制約、`error` を持つ枝が lazy なページの上に `<Suspense fallback={null}>` を挟むこと、`canIntercept` が false のナビゲーションも奪わないことを書き足しました。
