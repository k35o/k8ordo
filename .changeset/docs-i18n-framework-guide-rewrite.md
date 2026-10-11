---
'docs': patch
---

i18n のガイドを書き直し、@k8ordo/framework が無くても読める形にした。ロケールの決まり方を i18n の言葉（ブラウザでは URL の先頭の区間、サーバーでは locales.run か paramsSchema）で説明し、文言は名前で import する例にした。「静的に書き出す」と「ほかのパッケージと組み合わせる」のページを外し、framework で i18n を使うときの話（/ の振り分け、<html lang>、404 のロケール、Register が生成されないとき）は framework のガイドに置いた。framework の仕組みのページは、いつ、どこで何をするかと、保証することとしないことに絞った。ランディングの「次に読む」と、DocSection の description をなくした。
