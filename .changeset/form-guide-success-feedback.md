---
'@k8ordo/form': patch
---

ガイドに、送信がうまくいったことを知らせる方法の節を足しました。JavaScriptが無くても送れる形を保つなら、Server Actionをそのまま`useActionState`に渡し、`FormState & { accepted?: true }`のように成功の印を足した状態を返して、ページの中に文言を出します。トーストはJavaScriptが前提で、actionをクライアントの関数で包むので、JavaScriptが無いと送れなくなります。検証を通ったあとの失敗は`{ ...parsed.state, formError }`で返すと、送った値と`token`が残り、フォーカスもフォーム全体の文言へ移ります。

これまでガイドの例は`redirect`だけで、成功を知らせる形が書かれていませんでした。トーストを出すためにactionを包むと、気づかないうちにJavaScriptの無い送信を失っていました。
