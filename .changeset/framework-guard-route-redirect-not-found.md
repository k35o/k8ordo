---
'@k8ordo/framework': minor
---

`guard.ts`と`route.ts`で`redirect()`と`notFound()`を使えるようにしました。`redirect(url)`はそのURLへの`303`で応答し、それまでにguardやroute.tsが書いたcookieとヘッダーも応答に付きます。`notFound()`は、いちばん近い`not-found.tsx`を404で返します。guardの下のページも、POSTで届いたServer Actionも実行されません。

これまで`redirect()`を受けるのはServer Actionだけで、guardやroute.tsで呼ぶと500の`internal error`になっていました。そのため認証のguardでよく書くログインへのリダイレクトは、`new Response(null, { status: 303, headers: { location: href('/login') } })`と手で組む必要があり、actionとは別の書き方を覚えることになっていました。guardの`notFound()`も500でした。

ページの描画中に`redirect()`を呼ぶと、`redirect() ends what answers the request, and a page is a render — …`のエラーを投げるようにしました。これまでは`redirect to …`という名前の無いエラーとして`error.tsx`に出ていました。

guardのリダイレクトは`redirect(href('/login'))`と書き、`Response`は`401`や`403`のようにリダイレクトでない応答に使います。ステータスが`303`なのは、guardがPOSTで届いたServer Actionより先に動き、JavaScriptの無いフォームの送信をGETでログインのページへ移すためです。
