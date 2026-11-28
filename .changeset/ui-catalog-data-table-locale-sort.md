---
'@k8ordo/ui': patch
---

`@k8ordo/ui/catalog/render`の`DataTable`の並べ替えで、セルの文字をアプリの言語（`@k8ordo/i18n`の今のロケール）の規則で比べるようにしました。これまでは閲覧者の環境の言語で比べていたので、たとえばスウェーデン語のアプリを英語のブラウザで開くと、`ä`が`a`の隣に並んでいました。`Combobox`と`CommandPalette`の絞り込みと同じ扱いです。
