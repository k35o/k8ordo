---
"@k8ordo/state": patch
---

README の `parseUrl` の説明を今の挙動に合わせました。`@k8ordo/framework` の server モードでは `export const search = listState.url` を export したページが、読み取った url の値を `search` として受け取ります（そのまま `initialUrl` に渡せます）。static モードはこの export をビルド時に断り、そこと `search` を export しないページでは `useAppState` がブラウザで url を読みます。
