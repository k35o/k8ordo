---
'@k8ordo/state': major
---

`defineCookieState`の`cookieValue`をなくし、サーバーから同じCookieを書く`cookie(patch, current)`にしました。返り値は名前と値と属性の組で、`@k8ordo/framework`では`cookies().set(...density.cookie({ density: 'compact' }, cookies()))`と展開して書きます。`patch`は、`current`から`parseCookies`と同じ読み方で読んだ今の値に重ねてからスキーマに通すので、渡さなかったフィールドは訪問者が保存した値のままです。ブラウザの`update()`と同じ書き込みです。属性は、ブラウザのストアと同じ定数から作った`{ path: '/', sameSite: 'lax', maxAge: 34_560_000, httpOnly: false }`です。`migrate`が読めなかったCookieは上書きせず、`migrate`のエラーを`cause`にしたエラーになります。

これまでの`cookieValue(values)`は、渡さなかったフィールドを既定値で埋めていました。フィールドが2つ以上ある定義では、1つだけを変えるServer Actionが、ほかのフィールドに保存された値を黙って既定値に戻していました。属性は返さなかったので、`{ httpOnly: false, maxAge: 34_560_000 }`を手で写す必要もありました。frameworkの`cookies().set`は既定で`HttpOnly`を付けるので、写し忘れるとブラウザのストアからCookieが見えなくなり、型でも実行時にも何も起きませんでした。

移行するには、次のように書き換えます。

- `cookies().set(density.cookieName, density.cookieValue(values), { httpOnly: false, maxAge: 34_560_000 })`は、`cookies().set(...density.cookie(values, cookies()))`にします。
- Next.jsでは、`const store = await cookies()`のあとで`store.set(...density.cookie(values, { get: (name) => store.get(name)?.value }))`と書きます。
- すべてのフィールドを既定値に戻すために`cookieValue()`や`cookieValue({})`を書いていた箇所は、`cookies().delete(density.cookieName)`でCookieを消します。
- テストで値だけが要る箇所は、`density.cookie(values, new Map())[1]`にします。空の`Map`は何も保存していない訪問者です。
