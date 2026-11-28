---
'@k8ordo/framework': major
---

serverモードで、ページとレイアウトが受け取る`request.cookies`を、同じリクエストの中で`guard.ts`とServer Actionが`cookies()`で書いた後の値にしました。これまでは届いた`Cookie`ヘッダーから作っていたので、Server Actionの答えとして描き直したページは、actionが書く前の値を描いていました。JavaScriptの無いフォームで設定を変えると、その答えのページは古い設定のまま届き、`<html data-density>`のような属性も古いままでした。

これまでの「actionのあとに描き直したページの`request.cookies`には、actionが書いた値は入らない」という説明は撤回します。届いたままのヘッダーは、今までどおり`request.headers.get('cookie')`で読めます。

移行: actionが書く前の値を`request.cookies`から読んでいたページは、`request.headers.get('cookie')`を読むか、actionの戻り値で前の値を渡してください。
