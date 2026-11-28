---
'@k8ordo/router': patch
---

`matchPath`をServer Componentから呼べるようにしました。`matchPath`は純粋な関数ですが、`'use client'`のモジュールにあったので、RSCの環境ではクライアントの参照になり、Server Componentから呼ぶと例外になっていました。フレームワークのレイアウトは`pathname`を受け取るので、サーバーでリンクに印を付けられます。今のページへのリンクは`matchPath('/products', pathname)`で`aria-current="page"`に、今のページを含む区画へのリンクは`matchPath('/products/*', pathname, { inclusive: true })`で`aria-current="true"`にします。ナビゲーション全体をClient Componentにして`useMatch`を使う必要はありません。`useMatch`はこれまでどおりClient Componentで使います。

今のページを`pathname === href(…)`で比べていた場合は、`matchPath`に書き換えます。`pathname`はルート表の書き方で、`href`はViteの`base`を付けたURLなので、`base`の下では一致しません。
