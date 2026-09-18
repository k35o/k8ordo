---
'@k8ordo/form': minor
---

導出した属性とサーバーの検証が食い違っていた箇所を揃えました。

- 選択肢（enum）で何も選ばれていないとき、スキーマには `undefined` を渡すようになりました。ラジオ群が未選択のときも、`<select>` がプレースホルダー（`value=""`）のままのときも同じです。これまでは `''` で `required` を判定していたため、`z.enum([...]).optional()` や `.default()` のマークアップに `required` が付く一方で、サーバーは未選択を受け付けていました。**`''` を選択肢の値として受け取っていたスキーマには、`''` の代わりに `undefined` が届きます。**
- チェックボックス群は、チェックが 1 つでも 0 個でも `state.values` に配列（`['a']` / `[]`）で返すようになりました。1 つだけのとき文字列になり、`field('tags').input.defaultValue` として全ボックスに付いていました。
- `z.stringbool()` をチェックボックスに使うと、`formFields` / `parseForm` が理由付きで例外を投げるようになりました。パースは真偽値を渡すため、どの入力でも失敗するフォームになっていました。`z.boolean()` を使ってください。
- 空の `z.coerce.bigint()` を 0n として通さず、未入力として扱うようになりました。スキーマが未入力を拒むなら `required` も付きます。
- 1 つのフィールドで複数の cross-field ルールが破れたとき、サーバーもクライアントと同じく先に宣言したルールの文言を返すようになりました。
- 正規表現を重ねたときに `dropped` へ報告されずに消えていたのを直しました。`pattern` 属性は 1 つしか持てないため、`z.string().regex(a).regex(b)` や `z.email().regex(...)`、`z.email().startsWith(...)` は `dropped` に載ります。`type="date"` などに重ねた正規表現も報告します。
- 入力の `type` を、JSON Schema に残った `format` ではなくスキーマが宣言した書式から決めるようになりました。`z.email().regex(...)` が `type="text"` に、`z.url().lowercase()` が `pattern` 付きの `type="text"` になっていたのが、それぞれ `email` / `url` のままになります。`.optional()` の内側の書式（`z.iso.time().optional()` など）と、正規表現のフラグ（`.regex(/.../i).optional()` の `i`）も読めるようになりました。フラグが読めずに `pattern` が出てしまい、ブラウザだけ大文字小文字を区別していました。
- `datetime-local` を諦めて `type="text"` にする判定を、日時の書式そのものが拒むときだけに絞りました。`z.iso.datetime({ local: true }).regex(...)` が、無関係なタイムゾーンの理由で `text` に落ちていました。落とすときは、書式の正規表現をそのまま `pattern` に載せます。
- `z.file().mime([...])` を `dropped` に報告するようになりました。`accept` はファイル選択の候補を絞るだけで、ブラウザは MIME タイプを検査しません。
