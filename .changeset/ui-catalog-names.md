---
'@k8ordo/ui': minor
---

`@k8ordo/ui/catalog`に`isCatalogName`と`catalogNames`を足しました。`isCatalogName(name)`は、文字列が`catalog`の項目の名前かを確かめ、`CatalogName`として型を付けます。`catalogNames`は、すべての項目の名前を`catalog`の順に並べた配列です。

形式のつなぎは、部品の名前を文字列で受け取ったり、`Object.keys(catalog)`から並べたりします。これまではそこで`name as CatalogName`や`Object.keys(catalog) as CatalogName[]`と書く必要がありました。`examples/ui-integrations`のA2UI、json-render、OpenUIのつなぎは、この2つを使ってキャストをなくしました。写したつなぎも、同じように書き換えられます。
