---
'@k8ordo/ui': patch
---

`@k8ordo/ui/catalog/render`の`Toast`が、自分を`ToastProvider`で包むのをやめ、アプリの`ToastProvider`でトーストを出すようにしました。これまでは`Toast`を1つ置くたびにトーストの領域が1つ増え、アプリの領域と同じ位置に重なっていました。表示の上限（5件）とホバー中の一時停止も、領域ごとに別々に働いていました。

生成UIは、アプリの`ToastProvider`の中で描きます。外で`Toast`を描くと、`useToast must be used within a ToastProvider`のエラーになります。
