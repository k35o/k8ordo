---
'@k8ordo/framework': patch
---

`reactCompiler: true`で使う任意のpeerの`oxc-transform-react`の範囲を、`^0.152.0`から`>=0.152.0 <0.157.0`に広げました。フレームワークが使う`@vitejs/plugin-react`を6.2.1に上げ、そのpeerの範囲に合わせています。0.152系を入れているアプリはそのまま動き、0.156系まで上げられます。
