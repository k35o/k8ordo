---
'@k8ordo/i18n': major
---

`negotiateRequest`の`cookie`オプションをなくし、訪問者が前に選んだ言語の値を受け取る`chosen`にしました。`@k8ordo/framework`のguardでは`locales.negotiateRequest(request, { chosen: cookies().get('locale') })`と書きます。`chosen`は`Accept-Language`より先に使われ、`null`と`undefined`は選択が無いものとして扱います。1つ目の引数は`headers`を持つものなら何でもよく、`Request`のほか、ページが受け取る`request`も渡せます。

これまでは`cookie`にCookieの名前を渡すと、`@k8ordo/i18n`が`Cookie`ヘッダーから生の値を読んでいました。値がタグそのままのCookieしか読めず、`@k8ordo/state`の`defineCookieState`のようにJSONで書くCookieや、ログインした訪問者のプロフィールの言語は渡せませんでした。いまは選択をどこに置くかをアプリが決め、`@k8ordo/i18n`はCookieを読みません。

移行するには、次のように書き換えます。

- `locales.negotiateRequest(request, { cookie: 'locale' })`は、`locales.negotiateRequest(request, { chosen: cookies().get('locale') })`にします。`cookies()`は`@k8ordo/framework/server`から読みます。framework以外のサーバーでは、自分でCookieを読んで値を渡します。
- 言語の切り替えで`cookieStore.set`するCookieは、これまでどおりで変わりません。
- `NegotiateRequestOptions`の`cookie`を参照している型は`chosen`にします。
