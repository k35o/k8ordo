---
"@k8ordo/static": patch
"@k8ordo/server": patch
---

JavaScript が有効なときに `redirect()` で終わる Server Action（`<form action>` など）が、URL だけを変えて新しいページを描画しないまま止まっていたのを直しました。ページ遷移を非同期アクションの外で描くようになった `@k8ordo/router` に合わせ、クライアントで受け取った木を `useDeferredValue` を通して描くようにしています。
