---
'@k8ordo/ui': minor
---

`catalogPropIssues`に、形式があとで解決するpropを渡す`unresolved`を足しました。json-renderのspecが`{ "$bindState": "/form/name" }`で状態に結んだpropは、検査のときにはまだ値ではないので、型が合わないと報告されていました。`unresolved`に挙げたpropは名前だけを確かめ、値は確かめません。必須のpropでも、欠けたとは報告しません。
