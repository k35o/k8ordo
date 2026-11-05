---
"@k8ordo/framework": patch
---

staticモードのビルドが、書き出したHTMLがClient ComponentのCSSとJSを`<head>`でlinkしているかを確かめる検査をやめました。linkはフレームワークがReactに書かせていて、その書き出しはフレームワーク自身のテストで保証しています。この検査が止めるのはk8ordoかReactの不具合だけで、アプリケーションの側で直せることはありませんでした。
