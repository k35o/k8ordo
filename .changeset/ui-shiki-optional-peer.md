---
'@k8ordo/ui': major
---

shikiを`dependencies`から任意の`peerDependencies`（`>=4.6.0`）に移しました。shikiを使うのは`@k8ordo/ui/code-block`の`CodeBlock`だけですが、これまでは`@k8ordo/ui`を入れたすべてのアプリにshikiとその依存が入っていました（入れた中身の大半を占めていました）。版も4.6.0に固定していたので、アプリが自分で入れるshikiとずれると2つ目が入っていました。`@k8ordo/ui/ai/response`の`streamdown`と同じ扱いです。

移行するときは、`@k8ordo/ui/code-block`を使うアプリで`pnpm add shiki`を実行します。

2026-09-25に決めた「shikiはpeerでなく`dependencies`に置く」を改めます。
