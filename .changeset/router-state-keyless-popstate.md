---
'@k8ordo/router': patch
'@k8ordo/state': patch
---

WebKitで、同じサイトの別のオリジンを挟んで戻ったあと、それより前の履歴エントリへ戻ると、`usePathname`と`definePageState`のURLの値が古いまま残っていたのを直しました。検索欄が空のまま一覧も絞られず、ナビゲーションの現在地も前のページのままになっていました。WebKitはこの戻るで`currententrychange`を出さないので、`popstate`でも読み直します。
