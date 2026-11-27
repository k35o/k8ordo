---
'@k8ordo/router': major
---

`defineRoutes`が、文法の外のパターンを定義した時点で`TypeError`にするようにしました。認める区間は、`: * ? + { } ( ) \`を含まないリテラル、`:name`（JavaScriptの識別子）、パターン全体の最後に置いた`:name+`と`*`の4つと、`/(name)`のグループだけです。空の区間（`/a//b`、`/a/`）も拒みます。エラー文はパターンと規則を名指しします（`route pattern "/:id?" has the segment ":id?", which is not part of the grammar — …`）。

これまでは`URLPattern`が読める書き方なら通っていて、型と実行時で答えが食い違っていました。`/:id?`の型は`{ 'id?': string }`なのに、照合の結果は`{ id }`で、`href`は`'id?'`を探して失敗しました。`/foo-:bar`は型ではparamを持たないのに、照合では`bar`を取り、`href`は`/foo-:bar`という壊れたリンクを返しました。`:name+`の位置は、キーごとではなく子のキーまでつないだパターンで調べます。`'/files/:path+': { children: { '/edit': … } }`は`/files/:path+/edit`として拒みます。

移行するには、拒まれたパターンを文法の中の書き方に直します。`/:id?`は`/`と`/:id`の2つのパターンに、`/files/:path*`は`/files`と`/files/:path+`に分けます。`@k8ordo/framework`が`src/routes/`から作る表は、もともとこの文法の中にあるので影響しません。
