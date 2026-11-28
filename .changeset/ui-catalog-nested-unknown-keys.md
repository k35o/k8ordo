---
'@k8ordo/ui': major
---

生成UIのカタログで、propsの中に置くオブジェクトが知らないキーを受け付けないようにしました。これまではzodが入れ子の知らないキーを黙って取り除き、`catalogPropIssues`も最上位のキーしか見ていませんでした。`columns: [{ label: '料金', alig: 'right' }]`のような書き間違いは誤りにならず、意図しない見た目のまま描かれていました。対象は次のオブジェクトです。

- `Table`と`DataTable`の`columns`
- `Accordion`、`Breadcrumb`、`Tree`、`Toolbar`の`items`
- `SideNav`の`groups`と、その`links`
- `Stepper`の`steps`と`Tabs`の`tabs`
- `ColorPicker`の`swatches`
- `Select`や`RadioCard`のように選択肢を持つ入力欄の`options`

`catalogPropIssues`は、そのキーを最上位の知らないpropと同じ文で、オブジェクトの位置を付けて返します（`Table.columns.1: Unknown prop "width". Allowed props: label, align.`）。propsそのものの知らないキーは、これまでどおり`catalogPropIssues`が報告し、zodのparseは取り除きます。

項目の`props`でparseするつなぎは、入れ子に知らないキーがある要素を描かなくなります。`examples/ui-integrations`のつなぎも描きません。A2UIのつなぎが作るカタログ文書では入れ子のオブジェクトに`additionalProperties: false`が付き、A2UIの処理系もその部品を受け付けません。OpenUIのつなぎが作るJSON Schemaは、もとから入れ子を閉じていたので変わりません。

移行するときは、保存したspecやプロンプトの例から、入れ子のオブジェクトに書いたスキーマに無いキーを消します。どのキーかは、`catalogPropIssues`が位置とともに挙げます。
