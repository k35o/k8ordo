---
'@k8ordo/router': patch
---

2つの`paramsSchema`が同じparamを読むとき、`ParsedParams`（`PageProps`と`RouteContext`の`params`、`href`が受け取るparam）がそのparamを後のスキーマの出力で型付けするようにしました。フレームワークはスキーマを外側のレイアウトから順に走らせ、それぞれの出力を前の値に重ねるので、ページが受け取るのは後のスキーマの値です。これまでは型だけが外側のスキーマの出力を残していて、たとえばレイアウトが`year`を数値に、ページが`Date`に読むと、型は`number`なのに値は`Date`でした。外側のスキーマだけが読むparamの型はこれまでどおりです。
