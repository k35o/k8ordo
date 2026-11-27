---
'@k8ordo/i18n': minor
---

`locales.negotiate`が、リストの`null`と`undefined`を読み飛ばすようにしました。BCP 47ではないタグと同じ扱いです。ブラウザで、Cookieに覚えた選択を`navigator.languages`の前に並べるときは、`locales.negotiate([saved?.value, ...navigator.languages])`と書けます。

これまでは各要素に`toLowerCase()`を呼んでいたので、`undefined`が混ざるとエラーになりました。選択がまだ無いときに備えて、`[...(saved?.value === undefined ? [] : [saved.value]), ...navigator.languages]`のように条件つきで展開する必要がありました。
