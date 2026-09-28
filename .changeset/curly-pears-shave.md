---
"@k8ordo/static": minor
---

`framework()` に `csp` オプションを足した。渡したポリシー（ディレクティブとソース）を各ページの `<head>` の先頭の `<meta http-equiv="Content-Security-Policy">` に書き、そのページでフレームワークが出すインラインスクリプトのハッシュを `script-src` に足す（`script-src` が無ければ `default-src` から作り、`script-src-elem` があればそこにも足す）。アプリ自身のインラインスクリプトはそのハッシュをポリシーで許す。ファイルには nonce を残さない。`<meta>` では効かない `frame-ancestors`・`report-uri`・`sandbox` と、モジュールのスクリプトが読み込めなくなる `strict-dynamic` は断る。
