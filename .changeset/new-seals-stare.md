---
"@k8ordo/i18n": patch
---

ブラウザでロケールを読むとき、Vite の `base` を外した pathname の先頭の区間を読むようにした。`base: '/docs/'` のもとで `/docs/en/ui` は `en` になる（これまでは `docs` を読んで既定のロケールになっていた）。Vite の外では base は無いものとして読む。
