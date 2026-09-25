---
"@k8ordo/server": patch
---

`serve()` が配るファイルの `content-type` を、拡張子に登録された型で決めるようにした。

- これまでは 15 種の手書きの表で、`.webmanifest`・`.avif`・`.gif`・`.mjs`・`.woff`・`.xml`・`.pdf`・`.mp4` などは `application/octet-stream` で返っていた。表を `mime-types` に置き換え、登録された型で返る。テキストには `charset=utf-8` が付く。
- 登録の無い拡張子は、これまでどおり `application/octet-stream`。
- `.ico` は `image/x-icon` から、登録された `image/vnd.microsoft.icon` に変わる。
