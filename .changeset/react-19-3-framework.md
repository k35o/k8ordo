---
'@k8ordo/static': minor
'@k8ordo/server': minor
---

peer を `react` / `react-dom` とも `>=19.3.0` にしました。GUIDE の「Components that need a browser」が前提にしている `use(browser())` は React 19.3 の API で、これまでの `>=19.2.6` ではガイドどおりに書くと動きませんでした。
