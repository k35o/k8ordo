---
'@k8ordo/form': patch
'@k8ordo/state': patch
'@k8ordo/i18n': patch
---

ガイドとREADMEの例で、`formFields`を呼ぶ場所を、ページのServer Componentの描画の中の1通りにしました。これまでの最初の例はモジュールのトップレベルで呼び、「1回だけ導く」と書いていました。文言は`formFields`を呼んだときに決まるので、トップレベルで呼ぶと、どのリクエストにも最初に読み込んだときのロケールの文言が出ます。二言語のアプリでは間違った言語のまま、エラーにもなりませんでした。

`@k8ordo/state`のガイドのGETフォームの例と、`@k8ordo/i18n`のガイドの`@k8ordo/form`の項も同じ書き方にそろえました。モジュールのトップレベルで呼んでいるアプリは、ページの描画の中で`fields={formFields(schema)}`のように呼んでください。
