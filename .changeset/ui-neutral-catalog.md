---
'@k8ordo/ui': major
---

生成UIのアダプタ（`@k8ordo/ui/json-render`、`@k8ordo/ui/json-render/registry`、`@k8ordo/ui/openui`、`@k8ordo/ui/openui/prompt`、`@k8ordo/ui/ai-sdk`）をなくし、どの形式にも依らないカタログ`@k8ordo/ui/catalog`と、その描画の`@k8ordo/ui/catalog/render`に置き換えました。peerの`@json-render/core`、`@json-render/react`、`@openuidev/lang-core`、`@openuidev/react-lang`、`ai`は要らなくなりました。

`catalog`は、コンポーネントの名前ごとに説明とpropsのzodスキーマを持ちます。子を並べるコンポーネントには`children`が、入力欄には値を持つpropを示す`value`が付きます。`renderers`は同じ名前で、コンポーネントの描き方を持ちます。形式とのつなぎは、この2つを回して作ります。これまでは部品を1つ足すたびに形式ごとの登録を手で直し、説明文も形式ごとに写していました。

json-render、OpenUI、AI SDKのつなぎは、リポジトリの`examples/ui-integrations`にあります。移行するときは、使う形式のつなぎをアプリに写します。`validateGeneratedSpec`、`JsonRenderUI`、`UISpec`はjson-renderのつなぎに、`mapMessageParts`はAI SDKのつなぎにあります。propsの検査は`catalogPropIssues`に、`uiRules`は`catalogRules`になりました。
