---
"@k8ordo/router": minor
---

`BrowserPathname` を足した。この下では、サーバーの描画は pathname を持たないものとして扱い、`usePathname`（と、それを読む `useMatch`）は `use(browser())` でブラウザに任せる。いちばん近い `<Suspense>` がブラウザで描かれる。`@k8ordo/framework` が `fallback.tsx` を包むのに使い、アプリが自分で書くものではない。`browser()` を使うので、`react-dom` を peer に足した。
