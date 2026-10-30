---
'@k8ordo/router': patch
---

WebKitで、別のサイトを挟んで読み直したページから戻ると、URLだけが変わって前のページが画面に残り、そのあとページの中のリンクで移れなくなっていたのを直しました。WebKitはこの戻るで`navigate`を出さず、`navigation.currentEntry`を`null`にします。そのときは文書を読み直して、URLのページを出します。
