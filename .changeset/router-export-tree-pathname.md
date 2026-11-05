---
'@k8ordo/router': minor
---

ツリーごとに当てたpathnameを持つcontextの`TreePathname`をexportしました。`<Router>`を使わずに木を当てるランタイム（`@k8ordo/framework`のもの）が、同じcontextを自分で用意せずにimportできます。アプリが使うものではありません。
