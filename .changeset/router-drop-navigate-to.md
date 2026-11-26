---
'@k8ordo/router': major
'@k8ordo/framework': major
---

`navigateTo`をなくしました。コードからページを移るときは、`href`で作ったURLをNavigation APIの`navigation.navigate()`に渡します。リンクの`<a href>`と同じURLなので、ルーターも同じように扱い、`{ committed, finished }`も同じものが返ります。型の検査とViteの`base`は`href`がすでに受け持っていて、`navigateTo`はそれを`navigation.navigate()`に渡すだけでした。それなのに、paramとオプションがどちらも素のオブジェクトなので、パターンの文字列で見分ける分岐を抱え、すべてのparamを束ねたパターンでは`navigateTo('/:locale', undefined, { history: 'replace' })`と`undefined`の席を書かせていました。

`bindParams`は、束ねた`href`そのものを返すようになりました。`NavigateToOptions`と`BoundLinks`の型もなくなり、`@k8ordo/framework`からの再exportも消えました。

移行するには、次のように書き換えます。

- `navigateTo('/products/:id', { id })`は`navigation.navigate(href('/products/:id', { id }))`にします。
- `navigateTo('/products', { history: 'replace' })`は`navigation.navigate(href('/products'), { history: 'replace' })`にします。
- `export const { href, navigateTo } = bindParams(…)`は`export const href = bindParams(…)`にします。

`navigateTo`は既定で`push`でしたが、`navigation.navigate()`の既定の`'auto'`は、別のURLなら`push`、今と同じURLなら`replace`です。リンクのクリックと同じ振る舞いで、今のページを選び直しても同じエントリが2つ積まれることはありません。

この変更は、2026-09-03に決めた「ページを変えるのは`navigateTo`、状態を変えるのは`update`」を「ページを変えるのは`navigation.navigate(href(…))`、状態を変えるのは`update()`」に置き換えます。
