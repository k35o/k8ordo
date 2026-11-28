---
'@k8ordo/state': minor
---

`defineCookieState`の`parseCookies`が、`ReadonlyMap`に限らず、Cookieの名前からパーセントデコードした値を返す`get`を持つものを受け取るようにしました。`@k8ordo/framework`のserverモードでは、ページの`request.cookies`に加えて、`guard.ts`と`route.ts`とServer Actionの`cookies()`をそのまま渡せます。Next.jsの`cookies()`は`get`が`{ name, value }`を返すので、`parseCookies({ get: (name) => store.get(name)?.value })`と書きます。

これまでは`ReadonlyMap`しか受け取らず、guardやServer Actionで同じCookieの状態を読むには、`cookies()`から`Map`を自分で作る必要がありました。
