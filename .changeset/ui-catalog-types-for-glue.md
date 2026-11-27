---
'@k8ordo/ui': minor
---

生成UIのカタログに、形式のつなぎがキャストせずに使える型を足しました。つなぎは`catalog`を回すので、部品の名前を実行時にしか知りません。部品ごとの型はそこでは使えず、これまでのつなぎは`renderers[name] as AnyRenderer`のように、自分で型を消していました。

- `@k8ordo/ui/catalog`の`AnyCatalogEntry`は、部品の型を消した項目です。`catalog`のどの項目も、`const entry: AnyCatalogEntry = catalog[name]`とそのまま代入できます。`value.initial`は、どの部品のpropsでも受け取ります。
- `@k8ordo/ui/catalog/render`の`rendererOf(name)`は、その名前の描画の関数を、型を消した`AnyRenderer`として返します。`AnyRenderer`が受ける`AnyRenderArgs`では、propsは`Record<string, unknown>`、入力欄の値とsetterは`unknown`です。

`RenderArgs`の`children`は省けるようになりました。子を持たない部品は`renderers.Button({ props: { label: 'OK' } })`と呼べます。`examples/ui-integrations`のA2UI、json-render、OpenUIのつなぎは、自前の`AnyRenderer`や`Entry`の型と、`catalog`や`renderers`へのキャストをなくし、この2つを使います。写したつなぎも、同じように書き換えられます。
