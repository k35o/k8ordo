---
'@k8ordo/framework': patch
---

文書として開いたページで、ハイドレーションしたあとのクライアントコンポーネントの`useId`が、HTMLに書いたidと違う値を返さないようにしました。1.3.0から、static・serverのどちらのモードでも、`vite dev`でも、ブラウザのReactはHTMLと違うidを持っていました。ハイドレーションは属性をHTMLのまま残すので、ブラウザがidで結ぶ関係が切れていました。

- `@k8ordo/ui`の`Tooltip`や`Popover`は、トリガーの`anchor-name`とコンテンツの`position-anchor`が合わず、Chromiumでは画面の左上に出ていました。WebKitではトリガーに重なって、クリックがトリガーに届かないことがありました。
- ハイドレーションのあとに描いた要素の`aria-labelledby`や`aria-describedby`が、HTMLにある要素をidで指すときは、指す先の要素がありませんでした。
- `404.html`と`fallback.tsx`の殻は、ハイドレーションせずに描き直すので当たりませんでした。
