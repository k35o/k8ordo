---
"@k8ordo/router": major
---

ルート表の`match(pathname, accept)`から`accept`をなくし、合うパターンをすべて表の順に返す`matchAll(pathname)`を足しました。

`accept`は、合った結果を呼び出し側が断ると次のパターンへ進む口でした。断るかどうかは`accept`の中で決めなければならず、`await`できません。合うものをすべて受け取ってから自分で選ぶには、`accept`で`false`を返し続けて集める必要がありました。

```ts
for (const fit of routes.matchAll(pathname)) {
  if (await answers(fit)) return fit;
}
```

- `matchAll`は反復子で、照合するのは反復が進んだところまでです。
- `match(pathname)`は`matchAll(pathname)`の最初の結果です。`accept`を渡していたなら、`matchAll`を回して断る結果を飛ばします。
- `@k8ordo/framework`は`matchAll`を使うようになりました。frameworkの上での動きは変わりません。
