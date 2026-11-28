---
'@k8ordo/ui': major
---

生成UIのカタログの`Table`と`DataTable`で、セルの数が列の数と違う行を受け付けないようにしました。`catalogPropIssues`は、その行を`Table.rows.1: Expected 2 cells (one per column), received 1`のように行の位置を付けて返します。`catalogRules`がモデルに最初に伝える約束事なのに、これまでは検査を素通りしていました。描くときも、短い行はセルが欠け、長い行は見出しの外にはみ出していました。`catalogRules`の文も、`DataTable`を含む形に直しました。

行と列の検査は、`columns`と`rows`がそれぞれ正しければ、ほかのpropの誤りと一緒に返します。`caption`の型の誤りと短い行は、1度の検査でどちらも返ります。

`catalogPropIssues`の`unresolved`に挙げたpropがあっても、propどうしの検査は残ります。日付や時刻の`TextField`の`defaultValue`の検査も同じです。行と列の検査は、`columns`と`rows`のどちらかを`unresolved`に挙げたときだけ飛ばします。

移行するときは、保存したspecの`Table`と`DataTable`で、どの行にも列の数だけセルを置きます。空のセルは`''`で書きます。

`catalog.Table.props`と`catalog.DataTable.props`は、この検査を持つzodのスキーマになりました。`.omit()`、`.pick()`、`.partial()`は`.partial() cannot be used on object schemas containing refinements`の形のエラーになり、すでにあるキーを置き換える`.extend()`もエラーになります。つなぎでこれらのスキーマから別のスキーマを作っていたときは、`.safeExtend()`で作ります。この検査はJSON Schemaには出ないので、zodで確かめるか`catalogPropIssues`を通したときだけ効きます。`examples/ui-integrations`のつなぎは、描く前にzodで確かめ、列の数と違う行のある表を描きません。
