# @k8ordo/form

## 0.2.0

### Minor Changes

- 導出した属性とサーバーの検証が食い違っていた箇所を揃えました。

  - 選択肢（enum）で何も選ばれていないとき、スキーマには `undefined` を渡すようになりました。ラジオ群が未選択のときも、`<select>` がプレースホルダー（`value=""`）のままのときも同じです。これまでは `''` で `required` を判定していたため、`z.enum([...]).optional()` や `.default()` のマークアップに `required` が付く一方で、サーバーは未選択を受け付けていました。**`''` を選択肢の値として受け取っていたスキーマには、`''` の代わりに `undefined` が届きます。**
  - チェックボックス群は、チェックが 1 つでも 0 個でも `state.values` に配列（`['a']` / `[]`）で返すようになりました。1 つだけのとき文字列になり、`field('tags').input.defaultValue` として全ボックスに付いていました。
  - `z.stringbool()` をチェックボックスに使うと、`formFields` / `parseForm` が理由付きで例外を投げるようになりました。パースは真偽値を渡すため、どの入力でも失敗するフォームになっていました。`z.boolean()` を使ってください。
  - 空の `z.coerce.bigint()` を 0n として通さず、未入力として扱うようになりました。スキーマが未入力を拒むなら `required` も付きます。
  - 1 つのフィールドで複数の cross-field ルールが破れたとき、サーバーもクライアントと同じく先に宣言したルールの文言を返すようになりました。
  - 正規表現を重ねたときに `dropped` へ報告されずに消えていたのを直しました。`pattern` 属性は 1 つしか持てないため、`z.string().regex(a).regex(b)` や `z.email().regex(...)`、`z.email().startsWith(...)` は `dropped` に載ります。`type="date"` などに重ねた正規表現も報告します。
  - 入力の `type` を、JSON Schema に残った `format` ではなくスキーマが宣言した書式から決めるようになりました。`z.email().regex(...)` が `type="text"` に、`z.url().lowercase()` が `pattern` 付きの `type="text"` になっていたのが、それぞれ `email` / `url` のままになります。`.optional()` の内側の書式（`z.iso.time().optional()` など）と、正規表現のフラグ（`.regex(/.../i).optional()` の `i`）も読めるようになりました。フラグが読めずに `pattern` が出てしまい、ブラウザだけ大文字小文字を区別していました。
  - `datetime-local` を諦めて `type="text"` にする判定を、日時の書式そのものが拒むときだけに絞りました。`z.iso.datetime({ local: true }).regex(...)` が、無関係なタイムゾーンの理由で `text` に落ちていました。落とすときは、書式の正規表現をそのまま `pattern` に載せます。
  - `z.file().mime([...])` を `dropped` に報告するようになりました。`accept` はファイル選択の候補を絞るだけで、ブラウザは MIME タイプを検査しません。

- - `form.props` がフォームの reset を聞くようになりました（`onReset`）。reset ボタン、`form.reset()`、そして React 19.3 が action の成功後に自動で行うリセットのいずれでも、クライアント側のメッセージ・編集済みの集合・追加した行・`isDirty` を描画時の状態に戻します。これまでは action が前と同じ内容の state を返すと、DOM は戻っているのに `isDirty` が `true` のまま、古いメッセージも残っていました。
  - `useForm(fields)` と第 2 引数を省けるようになりました。action の無い GET フォームで空の state を作って使い回す必要はありません。
  - peer を `react` / `react-dom` / `@types/react` とも `>=19.3.0` にしました。

- フォームが実際に送信する値と、スキーマが受け取れる値を突き合わせるようにした。

  - どんな入力でも失敗するスキーマは `formFields` / `parseForm` が derive 時に
    投げる。送信値は必ず文字列なので `z.number()` や `z.literal(1)`、`z.date()`、
    `z.bigint()` は満たしようがない（数値は `z.coerce.number()` を使う）。
  - 空の数値入力とファイル未選択を「入力なし」として扱う。`z.coerce.number()` は
    `''` を 0 と読むため、空欄が誰も入力していない 0 になり `required` も落ちて
    いた。属性を決めるプローブと `parseForm` が渡す値を一本化した。
  - `z.file()` を `type="file"` として導出し、`.mime()` を `accept` に落とす。
    バイト数の上下限は対応する属性がないので `dropped` で報告する。
  - `.transform()` や `z.custom()` のように制約を読み取れないリーフを、黙って
    `type="text"` にせず `dropped` に載せる。

### Patch Changes

- 同梱ドキュメントを実装に追従させました。

  - GUIDE の保証を実際の挙動に合わせました。`dropped` に載るのはスキーマ全体に付いた `refine` だけで、欄やネストしたオブジェクトのものは載りません。チェックボックス群のエコーはチェックが 1 つのとき文字列です。
  - `requiredWhen` の引数と、`useAsyncCheck` に渡す関数の契約を書きました。`@k8ordo/ui` と組み合わせる例は、コンパイルが通る形に直しています。
  - `formFields` は呼ばれたときに文言を読むので、文言がリクエスト（ロケールなど）に従う場合は、モジュールスコープではなく描画中に呼ぶと書き足しました。
  - `llms.txt` に export している型を足し、README の peer 表を `package.json`（`>=19.3.0`）に合わせました。

- `z.iso.datetime({ local: true })` と `z.iso.time()` が `type="text"` に落ちていたのを直しました。

  zod 4.5 から、JSON Schema の `format` は標準の書式と値の集合が一致するときにしか出力されなくなり、この 2 つは pattern だけになりました。結果として `datetime-local` / `time` のピッカーが消え、スキーマが求めていたコントロールが失われていました。JSON に `format` が無いときはチェック自身から読み直すようにしています。

  `HiddenValue` の `data-initial`（dirty 判定の基準値）は、レンダー中の ref 参照をやめ、input がマウントされた時点の値から書くようになりました。サーバが返す HTML にはこの属性が乗らなくなります。

## 0.1.1

### Patch Changes

- `formFields` が `dropped`（HTML の制約属性に落ちず、ブラウザでは検査されない
  チェック）を返すとき、production 以外ではスキーマごとに一度 `console.warn`
  でも同じ一覧を出す。戻り値を読まなくても気づけるようにするため。あわせて
  `DroppedCheck` 型をクライアント側エントリ `@k8ordo/form` からも export する
  （`FormFields` の一部としてクライアントの props に現れる型のため）。
