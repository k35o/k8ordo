---
'@k8ordo/router': major
---

パターンの最後に`:name+`を書けるようにしました。`/files/:path+`は`/files`より下の区間を1つ以上すべて受け取り、`/files`そのものには合いません。これまで複数の区間を受け取れるのは`/*`だけで、受け取った部分は`params`に入らず、リンク先にもできませんでした。`:name+`の値は区間の配列です。`match`、`matchPath`、`useMatch`、`useParams`は区間ごとにデコードした配列を返し、`/files/a%2Fb/c`は`{ path: ['a/b', 'c'] }`になります。`href`と`bindParams`が返す`href`は同じ配列を受け取り、区間ごとにエスケープして`/`でつなぎます。空の配列と空文字の区間は、パターンに合わないパスになるので`TypeError`にします。型も同じで、`ParamsOf<'/files/:path+'>`は`{ path: readonly string[] }`、`PathFor`は`` `/files/${string}` ``、`NavigablePath`は1区間以上のパスを通します。`Match['params']`の値の型は`string | readonly string[]`に広がります。

`Match['params']`の値を`string`として読んでいたコード（`match(pathname)?.params`や`useRoute().params`を文字列として渡す箇所）は、型エラーになります。そのパターンの型が分かる場所では`useParams(pattern)`や`ParamsOf<pattern>`で読み直します。表に`:name+`が無く、値がいつも1区間だと分かっている場所では、`typeof value === 'string'`で確かめてから使います。
