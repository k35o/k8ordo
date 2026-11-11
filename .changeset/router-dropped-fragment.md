---
'@k8ordo/router': patch
---

URLからfragmentを外す移動（`/docs#api`から`/docs`）を、WebKitでも横取りするようにしました。WebKitはこの移動の`navigate`イベントにも`hashChange`を立てますが、行き先を同じ文書とは知らせず、横取りしなければ文書を読み込み直します。routerは`hashChange`だけを見てブラウザに任せていたので、Safariではfragmentの付いたページからそのページ自身へのリンクをたどると、文書が読み込み直されていました。今は、文書の中のfragmentへの移動だけをブラウザに任せます。`<Router>`と`useInterceptedNavigation`、それを使う`@k8ordo/framework`のランタイムに効きます。
