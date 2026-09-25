---
"@k8ordo/static": patch
"@k8ordo/server": patch
---

ページだけを持つルートグループ（`(home)/page.tsx` のように、`layout.tsx` も子のディレクトリも無いもの）で、アプリケーションが落ちなくなった。生成器がそのグループをページそのもの（葉）として表に書き、`@k8ordo/router` の `defineRoutes` が「親の `/` を宣言し直す」として `route group "/(home)" must have children` を投げていた。表の生成は通り、表を読み込んだところで初めて落ちていた（`@k8ordo/server` では起動時）。グループは常に `children` を持つ枝として書くので、`(home)/guard.ts` を置けば `/` だけに guard が効く。
