# @k8ordo/form

## 4.0.0

### Major Changes

- チェックボックスの集まり（`z.array(z.enum([…]))`）で送信に失敗したとき、チェックされていた値を`input.defaultValue`に配列で載せるようにしました。型は`CheckboxGroupInput`（`defaultValue?: string[]`）です。`@k8ordo/ui`の`CheckboxGroup`、`CheckboxCard`、`Autocomplete`や`<select multiple>`は、`input`を展開するだけで値が戻ります。繰り返し行の中の集まりも同じです。`DerivedField`には、集まりの欄であることと配列の件数の範囲を示す`group`が付きます。

  これまでは`input`に`name`しか入っておらず、`state.values`を`Array.isArray`で絞り込んで`defaultValue`に手で渡す必要がありました。`<select>`やラジオでは展開するだけで値が戻るのに、集まりだけが`state.values`の生の形を知っている必要がありました。

  あわせて、`row.field(key)`をキーごとに型付けしました。キーは1行分の中のパスで、`form.field()`のパスと同じく、書き間違えるとビルドのエラーになります。`input`の型もキーごとに入力欄の種類で決まり、行の中の集まりは`CheckboxGroupInput`、数の欄は`NumberInput`です。そのため`ArrayView`、`RowView`、`DerivedArray`は、`FormFields`と同じくスキーマか定義の型を取り、2つ目の型引数に配列のパスを取ります。`RowView<typeof orderSchema, 'items'>`のように書き、型引数を省いた`RowView`は型のエラーになります。

  移行するときは次のようにします。

  - `defaultValue={Array.isArray(state.values?.tags) ? state.values.tags : []}`のような手渡しを消し、`{...tags.input}`だけにします。
  - 手で書くチェックボックスには`input`を展開しないでください。配列が各ボックスの`defaultValue`に載ります。`name={tags.input.name}`と`defaultChecked={tags.input.defaultValue?.includes(option)}`を渡します。
  - `row.field()`のキーの書き間違いは、ビルドのエラーとして見つかるので直します。行の1つの欄を子のコンポーネントに渡すときは、`row.field(key)`が返す`FieldView`を渡します。
  - 行全体を受け取る子のコンポーネントは、`row: RowView`を`row: RowView<typeof orderSchema, 'items'>`のように、スキーマか定義の型と配列のパスで書きます。`ArrayView`と`DerivedArray`も同じく`ArrayView<typeof orderSchema, 'items'>`、`DerivedArray<typeof orderSchema, 'items'>`と書きます。

- `FormFields`と`UseFormReturn`の型引数を、スキーマか`defineForm`の定義の1つにしました。Client Componentのpropsは`fields: FormFields<typeof talkSchema>`と書きます。`formFields(talkSchema)`が返す型と同じで、`form.field()`に渡せるパスと各欄の`input`の型はスキーマから決まります。スキーマは`import type`で読めば、zodはバンドルに入りません。定義を渡したときも`FormFields<typeof signup>`と書けます。

  これまでは`FormFields<'title' | 'eventUrl', never>`のように、パスの集まりを位置引数で手書きしていました。スキーマの写しなので欄を足すたびに直す必要があり、3つ目の型引数（`z.stringbool()`の欄）を書き忘れると`input.value`が型から消え、2つ目を省くと`array()`のパスの誤りが通っていました。

  移行するときは、手書きの型引数をスキーマか定義の型に置き換えます。

  - `FormFields<'title' | 'eventUrl', never>` → `FormFields<typeof talkSchema>`
  - `UseFormReturn<'title', never>` → `UseFormReturn<typeof talkSchema>`
  - 1つの欄だけを描く子のコンポーネントは、`form.field('title')`が返す`FieldView`を受け取ります。
  - フォームを包む汎用のコードは、`<Source extends ObjectSchema | FormDefinition>`を型引数にして`FormFields<Source>`と`UseFormReturn<Source>`を使います。`ObjectSchema`と`FormDefinition`は、`@k8ordo/form`と`@k8ordo/form/server`のどちらからも型をimportできます。

- チェックボックスの集まり（`z.array(z.enum([…]))`）で選べる個数を、スキーマの`.min()`と`.max()`から導くようにし、`minChecked`をなくしました。`formFields`は配列の`.min()`と`.max()`を、ブラウザで確かめるルール（`DerivedRule`の`minChecked`と`maxChecked`）にします。文言はzodのもので、`formFields`を呼ぶたびに取るので、ロケールにも従います。サーバーではこれまでどおりスキーマが確かめます。`.min()`が1つ以上を求める集まりは、`form.field()`の`required`が`true`になり、ラベルに必須の印を付けられます。`input.required`は付きません。チェックボックスに付けると、そのボックスを必須にする意味になるためです。

  これまでは`.min()`を`dropped`に入れて捨て、ブラウザでも確かめるには`minChecked(field, n, message)`で同じ数をもう一度書く必要がありました。同じ制限が2か所に分かれ、文言も2通りになりました。`.max()`には対になるルールが無く、ブラウザでは確かめられませんでした。

  繰り返し行の中の集まりは、行ごとの名前を指すルールが無いので、個数はサーバーだけで確かめ、`dropped`に載せます。zodから個数の文言が取れない制限（`abort`付きの`.refine()`を先に重ねたときなど）も、理由と一緒に`dropped`に載せます。`.max()`が選択肢の数以上のときは、超えようがないのでルールを作りません。

  移行するときは、`minChecked('tags', 2, '2つ以上選んでください')`を消し、スキーマに`z.array(z.enum([…])).min(2, '2つ以上選んでください')`と書きます。`@k8ordo/form/server`から`minChecked`はimportできなくなりました。

- `form.field()`が返す`input`の型を、スキーマから導く入力欄の種類で分けました。`z.coerce.number()`は`NumberInput`（`type: 'number'`、数の`min`と`max`、必ずある`step`）、`z.boolean()`は`CheckboxInput`、`z.stringbool()`は`StringCheckboxInput`（`value: string`）、`z.file()`は`FileInput`（`defaultValue`なし）です。文字列、`z.enum()`、`.nullable()`や`z.union()`、`.pipe()`を通した欄は、これまでどおり`FieldInput`です。`NumberInput`、`CheckboxInput`、`FileInput`は両方の入口から型をimportできます。

  これまではどの欄も同じ`FieldInput`で、ファイルの欄にも文字列の`defaultValue`が、チェックボックスにも`min`や`maxLength`が型の上で付いていました。受け取る側はそれに合わせて型を広げるしかありませんでした。`parseForm`は、ファイルの欄の名前で文字列が送られてきても（GETのフォームやmultipartでないPOST）、`state.values`に入れなくなりました。

  `StringCheckboxInput`の`value`は省略できない`string`になり、`FieldInput`を土台にしなくなりました。`input`を`FieldInput`と注釈していた変数や引数は、欄の種類の型か`FieldView`の型引数に合わせてください。

- `formFields`が、ネイティブの要素が受け取る属性だけを出すようにしました。ただの文字列の欄（`z.string()`、`z.uuid()`などテキストの入力欄になる書式、`.nullable()`やunionの欄、制約を読めない欄）には`type`を付けません。`type="text"`はブラウザの既定なので、付けなくても同じテキストの入力欄になります。`FieldInput`の`min`と`max`は`number`にしました。`formFields`が書くのはもともと数だけです。

  これまでは`type: 'text'`を書いていたので、`type`の無い`<textarea>`や独自の入力欄は、受け取って捨てるための`type`を持つ必要がありました。`min`と`max`も型の上では文字列になりえて、数の部品が文字列を受けるように広げていました。

  `input.type`を`'text'`と比べていたコードは、`type`が無い欄もテキストの入力欄として扱ってください。

### Patch Changes

- `formFields`、`parseForm`、`useForm`が投げる例外、`console.warn`の文、`dropped[].reason`の文を英語にしました。例外と`console.warn`の文の頭には、呼び出したAPIの名前を付けました（`formFields: 'n': form values arrive as strings, …`）。これまではformだけが日本語で、`[@k8ordo/form]`を頭に付けていました。ほかの`@k8ordo/*`パッケージは英語で書いており、英語のドキュメントを読むエージェントや日本語を読まない利用者は、エラーと`dropped`の理由だけを別の言葉で受け取っていました。

  型は変わりません。例外の文や`dropped[].reason`の文字列と比べているテストや表示は、新しい文に合わせてください。

- ガイドとREADMEの例で、`formFields`を呼ぶ場所を、ページのServer Componentの描画の中の1通りにしました。これまでの最初の例はモジュールのトップレベルで呼び、「1回だけ導く」と書いていました。文言は`formFields`を呼んだときに決まるので、トップレベルで呼ぶと、どのリクエストにも最初に読み込んだときのロケールの文言が出ます。二言語のアプリでは間違った言語のまま、エラーにもなりませんでした。

  `@k8ordo/state`のガイドのGETフォームの例と、`@k8ordo/i18n`のガイドの`@k8ordo/form`の項も同じ書き方にそろえました。モジュールのトップレベルで呼んでいるアプリは、ページの描画の中で`fields={formFields(schema)}`のように呼んでください。

- ガイドに、送信がうまくいったことを知らせる方法の節を足しました。JavaScriptが無くても送れる形を保つなら、Server Actionをそのまま`useActionState`に渡し、`FormState & { accepted?: true }`のように成功の印を足した状態を返して、ページの中に文言を出します。トーストはJavaScriptが前提で、actionをクライアントの関数で包むので、JavaScriptが無いと送れなくなります。検証を通ったあとの失敗は`{ ...parsed.state, formError }`で返すと、送った値と`token`が残り、フォーカスもフォーム全体の文言へ移ります。

  これまでガイドの例は`redirect`だけで、成功を知らせる形が書かれていませんでした。トーストを出すためにactionを包むと、気づかないうちにJavaScriptの無い送信を失っていました。

- ガイドの`@k8ordo/ui`と組む節に、`z.stringbool()`の欄を`Checkbox`や`Switch`に展開したときの`value`の行き先を書きました。`input.value`はそのまま`Checkbox`と`Switch`の`value`になり、チェックしたボックスはスキーマの`true`の文字列を送ります。表の行には`z.stringbool()`がありましたが、`value`がどこへ渡るかは書かれていませんでした。

- 文言を書いていない検証に出るzodの既定の文言を、リクエストのロケールに合わせる書き方を、`@k8ordo/i18n`のガイドの`@k8ordo/form`の項に足しました。zodの設定はプロセスに1つなので、`z.config(z.locales.en())`のように固定すると、二言語のアプリでもどのリクエストにも同じ言語の文言が出ていました。`src/lib/zod-locale.ts`に、`satisfies Variants<…>`で型を付けたロケールごとの表と、`locales.getLocale()`で引く`z.config({ localeError })`を書き、スキーマを書くモジュールの先頭でimportします。ロケールを足して表に書き忘れると型エラーになります。`src/i18n.ts`はブラウザでも読み込まれるので、そこには置きません。

  `@k8ordo/form`のガイドからは、この項へ1文で案内します。

## 3.0.0

## 2.3.1

### Patch Changes

- `@k8ordo/*`のパッケージを、すべて同じバージョンで出すようにしました。これまで`@k8ordo/ui`だけは別にバージョンを上げていたので、ほかのパッケージは2.0.0から2.3.1へ飛びます。このリリースに中身の変更はありません。

## 2.0.0

### Major Changes

- `useAsyncCheck`は、2つ目の引数に`useForm`が返す`revalidate`を受け取るようにしました。

  ```tsx
  const taken = useAsyncCheck(checkSlugAvailable, form.revalidate);
  ```

  これまでは、結果を受け取ると入力欄から`focusout`を発火させ、`useForm`に検証をやり直させていました。この`focusout`は実際には起きていないblurなので、フォームや入力欄に書いた`onBlur`も呼ばれていました。

  - `useForm`の返り値に`revalidate(control)`が加わりました。入力欄の検証の結果を読み直し、入力欄から離れたときと同じように文言を表示します。
  - `check`が失敗したときは、これまでどおり何も判定しません。失敗したときのエラーは、握りつぶさずに`reportError`でブラウザに報告します。

### Patch Changes

- サーバーから新しい結果が届いたとき、その結果を描く最初の画面に、前の結果のあとでブラウザが出した文言が一度残る不具合を直しました。

  これまで`useForm`は、新しい結果が届いて画面を描いたあとのeffectで、ブラウザが出した文言、編集済みの欄、`isDirty`、行の数を消していました。そのため、新しい結果を描いた最初の画面では、サーバーが返した文言の代わりに前の文言が出たり、編集済みとして隠したサーバーの文言が出なかったりしました。これらは、新しい結果を描くときに作り直すようになりました。

## 1.4.4

## 1.4.3

## 1.4.2

## 1.4.1

## 1.4.0

## 1.3.0

## 1.2.1

## 1.2.0

## 1.1.0

### Patch Changes

- peerの`zod`の下限を`^4.4.3`から`^4.6.6`に上げました。4.6.5以前の`zod`は、大きな配列を渡されると要素ごとの検証エラーをすべて積み上げ、メモリを使い果たすおそれがあります（[GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5)）。フォームの送信やURLのように外から来た値をスキーマで検証するので、修正の入った4.6.6を下限にしました。

## 1.0.0

### Major Changes

- 1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。`@k8ordo/*` のうち form・state・router・i18n・color-scheme・framework の 6 つはそろって 1.0.0 になり、以後も同じ版で出す。どれか 1 つが版を上げれば、変更のないものも同じ版で出る（`@k8ordo/ui` は別の版で続く）。互いの peer は `^1.0.0` で結ぶ。

  0.1.1 から上げるときに手を入れるもの（詳しくは下の各項目）:

  - peer の `react` / `react-dom` / `@types/react` を `>=19.3.0` にした。
  - 送信のときにブラウザ側で全欄と `defineForm` のルールを検証し、失敗すれば送信を止める。`<form>` に自分の `onSubmit` を書くなら、その中で `form.props.onSubmit(event)` を呼ぶ。
  - どんな入力でも失敗するスキーマ（`z.number()`・`z.literal(1)`・`z.date()`・`z.bigint()` など）は、`formFields` / `parseForm` が導くときに投げる。数値の欄は `z.coerce.number()` で書く。
  - 空の数値欄と、ファイルを選んでいない欄は、入力なし（`undefined`）としてスキーマに渡る。何も選ばれていない選択肢（enum）も `''` ではなく `undefined` になる。
  - チェックボックス群の値は、チェックが 1 つでも配列（`['a']`）になる。

  この版で足した主なもの: `z.stringbool()` のチェックボックス、`z.file()` の欄、ルールの文言に渡す関数、`form.formError`、フォームの reset への追従。

### Minor Changes

- 導出した属性とサーバーの検証が食い違っていた箇所を揃えました。

  - 選択肢（enum）で何も選ばれていないとき、スキーマには `undefined` を渡すようになりました。ラジオ群が未選択のときも、`<select>` がプレースホルダー（`value=""`）のままのときも同じです。これまでは `''` で `required` を判定していたため、`z.enum([...]).optional()` や `.default()` のマークアップに `required` が付く一方で、サーバーは未選択を受け付けていました。**`''` を選択肢の値として受け取っていたスキーマには、`''` の代わりに `undefined` が届きます。**
  - チェックボックス群は、チェックが 1 つでも 0 個でも `state.values` に配列（`['a']` / `[]`）で返すようになりました。1 つだけのとき文字列になり、`field('tags').input.defaultValue` として全ボックスに付いていました。
  - 空の `z.coerce.bigint()` を 0n として通さず、未入力として扱うようになりました。スキーマが未入力を拒むなら `required` も付きます。
  - 1 つのフィールドで複数の cross-field ルールが破れたとき、サーバーもクライアントと同じく先に宣言したルールの文言を返すようになりました。
  - 正規表現を重ねたときに `dropped` へ報告されずに消えていたのを直しました。`pattern` 属性は 1 つしか持てないため、`z.string().regex(a).regex(b)` や `z.email().regex(...)`、`z.email().startsWith(...)` は `dropped` に載ります。`type="date"` などに重ねた正規表現も報告します。
  - 入力の `type` を、JSON Schema に残った `format` ではなくスキーマが宣言した書式から決めるようになりました。`z.email().regex(...)` が `type="text"` に、`z.url().lowercase()` が `pattern` 付きの `type="text"` になっていたのが、それぞれ `email` / `url` のままになります。`.optional()` の内側の書式（`z.iso.time().optional()` など）と、正規表現のフラグ（`.regex(/.../i).optional()` の `i`）も読めるようになりました。フラグが読めずに `pattern` が出てしまい、ブラウザだけ大文字小文字を区別していました。
  - `datetime-local` を諦めて `type="text"` にする判定を、日時の書式そのものが拒むときだけに絞りました。`z.iso.datetime({ local: true }).regex(...)` が、無関係なタイムゾーンの理由で `text` に落ちていました。落とすときは、書式の正規表現をそのまま `pattern` に載せます。
  - `z.file().mime([...])` を `dropped` に報告するようになりました。`accept` はファイル選択の候補を絞るだけで、ブラウザは MIME タイプを検査しません。

- `input.value` を型に持つのを、`z.stringbool()` のチェックボックスの欄だけにしました。

  - `value` を持つ型を `StringCheckboxInput` として export しました。実行時に `value` が入るのは `z.stringbool()` のチェックボックスだけです。
  - `FormFields` に 3 つ目の型引数（`value` を持つ欄のパス）を足しました。`formFields` はスキーマから導いて埋め、`useForm` の `field()` はそのパスでだけ `input` を `StringCheckboxInput` として返します。
  - それ以外の欄の `input` の型（`FieldInput`）は変わらず `value` を持たないので、制御のときだけ `value` を取る部品（`@k8ordo/ui` の `Radio` や `CheckboxCard` など）にそのまま広げられます。
  - 手で書いた `FormFields<FieldPath, ArrayPath>` は 3 つ目を省いても導いた欄を受け取れます。そのときは `input.value` を読めなくなるだけで、チェックボックスは変わらず `value` を送ります。

- 送信するときに、ブラウザ側で全欄を検証するようになりました。

  - これまでは JavaScript が読み込まれるとフォームに `noValidate` を付け、送信時には何も検証していませんでした。そのため action を持たない GET の絞り込みフォームは、JavaScript がある環境では誰も検証していませんでした。
  - 送信時に、まだ触っていない欄も含めて全欄と `defineForm` のルールを検査します。失敗したら送信を止め、失敗した欄すべてにメッセージを出して、画面の順で最初に失敗した欄へフォーカスを移します。
  - `formNoValidate` の付いた送信ボタンは、ブラウザの検証と同じく検査を飛ばします。
  - `form.props` に `onSubmit` が加わりました。`<form>` に自分の `onSubmit` を書くときは、その中で `form.props.onSubmit(event)` を呼んでください。
  - 決めるのはこれまでどおりサーバーです。JavaScript が無い環境では、これまでどおりブラウザ自身の検証が送信を止めます。

- 配列そのもののエラーだけで送信に失敗したときも、フォーカスが移って失敗が伝わるようにしました。

  - `form.array(path)` の戻り値に `errorProps`（`id` と `tabIndex={-1}`）を追加しました。配列の `.min()` / `.max()` 違反は `items.error` に入りますが、それを受け持つ欄が無いため、これまでは配列のエラーだけで失敗するとフォーカスがどこにも移らず、スクリーンリーダーの利用者には失敗が伝わりませんでした。`items.error` を表示する要素に `errorProps` を広げると、そこが文書順で最初の失敗ならフォーカスが移ります。行より上に置けば、行も失敗しているときも配列の問題が先に読まれ、Tab で行へ進めます。

- 送信に失敗したときのフォーカスとアナウンスを直しました。

  - フォーカスの移り先を、`state.errors` の先頭のキーから、ページ上で文書順に最初に失敗した欄に変えました。キーの順は zod が issue を出した順（スキーマの順）で、画面の並びとは限らないため、フォームの途中の欄に飛ぶことがありました。
  - `form.formError` を追加しました。どの欄にも属さない `state.formError` の文言（`message`）と、それを表示する要素に広げる `props`（`id` と `tabIndex={-1}`）を返します。これまで `formError` はフォーカスも読み上げもされず、スクリーンリーダーの利用者には送信の失敗が伝わりませんでした。`props` を広げた要素が失敗した欄より前にあれば、そこにフォーカスが移ります。欄より上に置けば、欄も失敗しているときもフォーム全体の問題が先に読まれ、Tab で失敗した欄へ進めます。`@k8ordo/ui` の `Alert` にもそのまま広げられます。
  - 型 `FormErrorView` を公開しました。

- - `form.props` がフォームの reset を聞くようになりました（`onReset`）。reset ボタン、`form.reset()`、そして React 19.3 が action の成功後に自動で行うリセットのいずれでも、クライアント側のメッセージ・編集済みの集合・追加した行・`isDirty` を描画時の状態に戻します。これまでは action が前と同じ内容の state を返すと、DOM は戻っているのに `isDirty` が `true` のまま、古いメッセージも残っていました。
  - `useForm(fields)` と第 2 引数を省けるようになりました。action の無い GET フォームで空の state を作って使い回す必要はありません。
  - peer を `react` / `react-dom` / `@types/react` とも `>=19.3.0` にしました。

- チェックボックスで `z.stringbool()` を受け付けるようになりました。

  - チェックされていれば送られた文字列をそのままスキーマに渡し、されていなければ何も渡しません（`undefined`）。`z.boolean()` はこれまでどおり真偽値で読みます。
  - `field().input.value` に、スキーマ自身が `true` を encode した綴り（既定は `"true"`、`truthy` を指定すればその先頭）が入ります。`@k8ordo/state` が url の真偽値を書く文字列と同じなので、`formFields(listState.url)` から導いた GET フォームは、state が書くのと同じ URL を送ります。これまではチェックボックスを真偽値で読んでいたため、url に真偽値を持つ state のスキーマを渡すと、どう送っても検証に失敗していました。
  - 未チェックを `true` と読むスキーマ（`z.stringbool().default(true)` など）は、`false` を送る手段が無いため、`formFields` / `parseForm` が理由付きで例外を投げます。

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

- `defineForm` のルール（`sameAs`・`minChecked`・`requiredWhen`）の `message` に、文字列を返す関数も渡せるようになりました。

  - zod の `{ error: () => … }` と同じく、宣言したときではなく報告するときに呼ばれます。`formFields` は欄を導くときに呼び、`parseForm` はルールが破れたときに呼びます。`@k8ordo/i18n` の文言を渡せば、定義をモジュールの先頭に置いたまま、リクエストごとのロケールで報告されます。これまではロケールごとにルールを作り直す必要がありました。
  - 関数はクライアントに渡せないので、`formFields` が返す `rules` は文言を呼んだあとのデータです。その型 `DerivedRule` と、`message` の型 `RuleMessage` を公開しました。`FormFields` の `rules` の型は `Rule[]` から `DerivedRule[]` に変わります。

### Patch Changes

- 同梱ドキュメントを実装に追従させました。

  - GUIDE の保証を実際の挙動に合わせました。`dropped` に載るのはスキーマ全体に付いた `refine` だけで、欄やネストしたオブジェクトのものは載りません。
  - `requiredWhen` の引数と、`useAsyncCheck` に渡す関数の契約を書きました。`@k8ordo/ui` と組み合わせる例は、コンパイルが通る形に直しています。
  - `formFields` は呼ばれたときに文言を読むので、文言がリクエスト（ロケールなど）に従う場合は、モジュールスコープではなく描画中に呼ぶと書き足しました。
  - `llms.txt` に export している型を足し、README の peer 表を `package.json`（`>=19.3.0`）に合わせました。

- 同梱ドキュメントの GUIDE で、`@k8ordo/i18n` の文言をルールに渡す例を、`m.signup.mismatch` のような名前空間経由の呼び出しから、`import { mismatch, pickAtLeast } from '../messages/signup'` と名前で import する形に直しました。

- 送信時の検査で、最初に失敗した欄がスキーマにない欄（サーバーは読まない `required` の同意のチェックボックスなど）のとき、何も表示せずに送信を止めていたのを直した。`useForm` はスキーマの欄の文言しか持たず、`noValidate` のせいでブラウザの吹き出しも出なかった。その欄では `reportValidity()` を呼び、フックが無いときと同じくブラウザ自身の吹き出しで知らせる。スキーマの欄が先に失敗しているときは、これまでどおりその欄の文言を出してフォーカスを移し、ブラウザには知らせさせない。

- `<select>` に `field.input` を広げたとき、送信に失敗した値のエコーが画面から消える不具合を直しました。

  React は `<select>` の `defaultValue` をマウント時にしか反映しません。そのため `useActionState` の action の後に React がフォームを reset すると、select はマウント時の選択に戻り、`state.values` で返した選択が失われていました。`useForm` が各レスポンスのエコーを option の `defaultSelected` に書くようになったので、reset のあとも送った選択が残り、その後の reset と `isDirty` もその選択を基準にします。`<select multiple>` も同じです。

- クライアントで追加した行の欄が送信に失敗したとき、その欄に移したフォーカスがすぐ外れていたのを直しました。新しい state を受けるたびに行の key を振り直していたため、送信前からある行も作り直され、フォーカスした要素ごと消えて `body` に落ちていました。`state.rows` の行数が今の行数と同じなら、行の key をそのまま保ちます。React が action の後に行うフォームのリセットでも同じです。

- 既定の選択肢を持たない `<select>`（空のプレースホルダーを先頭に置いた `z.enum()` の欄など）を、reset のあとも `isDirty` が変更ありと読んでいたのを直しました。GUIDE の「Working with @k8ordo/ui」を、`@k8ordo/ui` の全フィールドとの組み合わせに広げました。

- 任意の peer の `typescript` の下限を `>=7.0.2` から `>=7.0.0` にする。TypeScript 7 の正式版は 7.0.2 が最初なので、受け付ける版は変わらない。ドキュメントで「TypeScript 7以上」と書けるようにするため。

- Server Action の `redirect()` の例で、行き先を `href()` で作るようにした（`@k8ordo/form` の GUIDE と README）。`@k8ordo/framework/server` の `redirect(to)` は URL を書いたまま送り、Vite の `base` を付けない。素の pathname を渡す例は、base の下に置いたアプリで訪問者を base の外へ送ってしまい、「`href()` で作る」というガイド自身の説明とも食い違っていた。

- `z.iso.datetime({ local: true })` と `z.iso.time()` が `type="text"` に落ちていたのを直しました。

  zod 4.5 から、JSON Schema の `format` は標準の書式と値の集合が一致するときにしか出力されなくなり、この 2 つは pattern だけになりました。結果として `datetime-local` / `time` のピッカーが消え、スキーマが求めていたコントロールが失われていました。入力の `type` は JSON Schema の `format` ではなくスキーマが宣言した書式から決めるので、zod のこの変更に左右されません。

  `HiddenValue` の `data-initial`（dirty 判定の基準値）は、レンダー中の ref 参照をやめ、input がマウントされた時点の値から書くようになりました。サーバが返す HTML にはこの属性が乗らなくなります。

## 0.1.1

### Patch Changes

- `formFields` が `dropped`（HTML の制約属性に落ちず、ブラウザでは検査されない
  チェック）を返すとき、production 以外ではスキーマごとに一度 `console.warn`
  でも同じ一覧を出す。戻り値を読まなくても気づけるようにするため。あわせて
  `DroppedCheck` 型をクライアント側エントリ `@k8ordo/form` からも export する
  （`FormFields` の一部としてクライアントの props に現れる型のため）。
