---
"@k8ordo/router": minor
---

非同期アクションの中で `finished` を待っても止まらないようにしました。

- 新しい木を `startTransition` ではなく `useDeferredValue` の優先度で描くようにしました。React は非同期アクションが保留中の間、すべての transition をそのアクションの lane にまとめて終わりまで止めるので、`startTransition(async () => { await navigateTo('/about').finished })` では URL だけが変わり、ページも `finished` も止まったままでした。無関係なアクションの保留中に始まったページ遷移や、`@k8ordo/state` の url の `update()` を別ページの読み込み中にアクション内で待つ場合も、同じ理由で止まっていました。
- `finished` の意味（新しい木が画面に出た）、前のページを保つ挙動、`<ViewTransition>` と transition types は変わりません。
- `useInterceptedNavigation` の `apply` は transition の外で呼ばれるようになりました。ホストは `apply` で設定した値を `useDeferredValue` を通して描画してください（GUIDE の「Under the framework」）。
