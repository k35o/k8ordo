---
"@k8ordo/i18n": patch
"docs": patch
---

GUIDE とサイトの `/i18n/locales` の、言語の切り替えでロケールの Cookie を書く例を直した。これまでの `cookieStore.set('locale', next)` は Cookie Store API の既定のままで、ブラウザを閉じると消えるセッション Cookie になり、`SameSite=Strict` なのでほかのサイトのリンクから来た最初のリクエストには付かなかった。`sameSite: 'lax'` と遠い `expires` を付けて書く例にした（`maxAge` は TypeScript の `lib.dom` の `CookieInit` にまだ無いので、`expires` で書く）。
