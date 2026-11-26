---
'@k8ordo/ui': patch
---

`exports`に`"./package.json"`を足しました。`@k8ordo/ui/package.json`を読むツールが`ERR_PACKAGE_PATH_NOT_EXPORTED`で失敗していました。ほかのk8ordoのパッケージは、すでに公開しています。
