---
'@k8ordo/ui': major
---

`@k8ordo/ui/catalog/render`の`renderers`が受けるpropsを、項目のスキーマに合う値（`null`を含まない）に決めました。モデルが省いたpropは、無いか`undefined`で渡します。これまでの描画は、OpenUI Langが省いた位置引数に書く`null`を、propごとに`undefined`として扱っていました。形式に依らない描画が1つの形式の書き方を抱えていて、`null`を許さない`CatalogProps`の型とも合っていませんでした。`Button`、`Card`、`Breadcrumb`の`href`に渡した`''`をリンクの無いものとして描く扱いもなくしました。`''`はスキーマに合わない値です。

スキーマに合わせるのは形式のつなぎです。`examples/ui-integrations`のつなぎは、どれも`src/catalog-props.ts`の`parseCatalogProps`を通してから`renderers`を呼びます。`null`のキーを入れ子まで取り除き、残りを項目の`props`のスキーマで確かめ、確かめた値を渡します。確かめて通らない要素は描きません。形式の検証だけでは足りません。JSON Schemaにはzodの検査が出ず、OpenUIは`pattern`を確かめないので、`javascript:`で始まる`href`や`null`の入った配列もそのまま通ります。

移行するときは、写したつなぎで`renderers`を呼ぶ前に、`src/catalog-props.ts`と同じことをします。`null`のキーを入れ子まで取り除き、`catalog[name].props.safeParse()`で確かめ、通った値を`props`に渡して、通らない要素は描きません。形式の状態に結んだ入力欄の値は、利用者が書いた値なので確かめる前に外します。
