---
'@k8ordo/router': patch
---

同梱ドキュメントを実装に追従させました。

- `startTransition(async () => { await navigateTo(…).finished })` を勧める記述を消しました。非同期アクションの保留中はルーターがページを適用する transition もその終わりを待つので、URL だけ変わってページが出ないまま止まります。`finished` はイベントハンドラで待ってください。
- `llms.txt` に公開型（`Routes` / `ErrorProps` / `NavigateToOptions` / `BoundLinks` / `MatchOptions` / `RegisteredPattern` など）を足し、`matchPath` の `options`、`bindParams` の `navigateTo` の引数、`bigint` を受ける param 値を書きました。
- `LayoutProps` の制約、`error` を持つ枝が lazy なページの上に `<Suspense fallback={null}>` を挟むこと、`canIntercept` が false のナビゲーションも奪わないことを書き足しました。
