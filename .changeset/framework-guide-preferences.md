---
'@k8ordo/framework': patch
'@k8ordo/state': patch
'@k8ordo/color-scheme': patch
'@k8ordo/i18n': patch
---

`@k8ordo/framework`のガイドに「Preferences」の節を足し、訪問者の設定をどこに置くかを3つの規則にまとめました。見た目だけを変える設定は`defineLocalState`に置き、`inlineRead()`のインラインスクリプトで描く前に当てます。サーバーが値で応答を変える設定は、serverモードで`defineCookieState`に置き、`parseCookies`で読み、`cookie(patch, current)`か`update()`で書きます。言語の選択は素のCookieに置き、`negotiateRequest`の`chosen`に渡します。`@k8ordo/state`の例で密度をCookieに置いているのは、JavaScriptの無いフォームで変え、それを受けるServer ActionがCookieにしか書けないからだと、2つ目の規則に書きました。

これまでは、`@k8ordo/color-scheme`のガイドが表示の設定をlocalStorageに置くよう勧め、`@k8ordo/state`のガイドとexampleは密度をCookieに置いていて、どちらを選ぶかの基準がありませんでした。`@k8ordo/state`、`@k8ordo/color-scheme`、`@k8ordo/i18n`のガイドからは、この節へ1文で案内します。docsサイトでは、frameworkの`request`のページに同じ節を足し、stateのCookieとcolor-schemeの保存先のページから案内します。

`request`を読む例（`references/guards.md`）は、素の`theme`のCookieから`data-theme`を、`Accept-Language`から`<html lang>`を書いていて、この規則と`getLocale()`で`lang`を書く決まりの両方に反していました。Cookieの状態を`parseCookies(request.cookies)`で読んで`initialCookie`に渡し、ヘッダーは`Sec-GPC`を読む例に書き換えました。
