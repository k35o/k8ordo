---
'@k8ordo/router': major
---

`NavigablePath`をなくしました。手で書いたパスがルート表のどれかのパターンに合うかを型で確かめる型でしたが、使っていた`@k8ordo/state`の`Register`がなくなり、使うものがありませんでした。URLは表のパターンから`href()`で作る1通りなので、手で書いたパスを確かめる型は、その2つ目の書き方を認めることになります。

移行するには、`NavigablePath<typeof routes, Path>`で確かめていたパスを、`href()`で作るように書き換えます。たとえば`'/products/42'`は`href('/products/:id', { id: 42 })`にします。パターンとparamの型検査は`href()`が行います。
