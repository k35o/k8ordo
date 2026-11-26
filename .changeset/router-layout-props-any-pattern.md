---
'@k8ordo/router': minor
---

`LayoutProps<P>`が、ページの無いディレクトリのレイアウトのパターンも受け取るようにしました。`blog/[slug]/layout.tsx`の下に`comments/page.tsx`しか無いとき、これまでは`LayoutProps<'/blog/:slug'>`が型エラーになり、propsの型を手で書き、serverモードで`request`を読むなら`RouteRequest`を`@k8ordo/framework/server`から足す必要がありました。いまは`LayoutProps<'/blog/:slug'>`と書けます。パターンの書き間違いは、生成されるルート表がimportの位置でレイアウトのpropsと照らし合わせるので、そこで型エラーになります。手で書いていたpropsの型は、`LayoutProps`に置き換えられます。
