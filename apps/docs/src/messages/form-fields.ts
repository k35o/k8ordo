import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'スキーマの末端 1 つが、入力要素 1 つになります。このページは zod から HTML への対応表です。`field()` が返すもの、型ごとに導かれる属性、ネスト・繰り返し行・チェックボックス群・ファイルの名前の付き方、そして `formFields` が受け付けないスキーマを扱います。',
  en: 'Every leaf of the schema becomes one control. This page is the map from zod to HTML: what `field()` returns, which attributes each type derives, how nested objects, repeated rows, checkbox groups and files are named, and which schemas `formFields` refuses.',
});

export const resultTitle = message({
  ja: '`formFields` が返すもの',
  en: 'What `formFields` returns',
});

export const resultDescription = message({
  ja: '`formFields(schema)` の結果は 4 つの部分からなる JSON で、`useForm` にはこの結果をまるごと渡します。スキーマの代わりに `defineForm` の定義を渡すこともできます。',
  en: 'The result of `formFields(schema)` is JSON in four parts, and `useForm` takes all of it. A `defineForm` definition can be passed in place of the schema.',
});

export const resultFields = message({
  ja: '`fields` — パスごとの `DerivedField`。`input`（広げる属性）、`messages`（ValidityState のフラグ、つまり `ValidityFlag` ごとの文言）、`secret`（入力値を返してはいけない欄か）を持ちます。',
  en: '`fields` — a `DerivedField` per path: `input` (the attributes to spread), `messages` (the wording per ValidityState flag, a `ValidityFlag`) and `secret` (whether the value must never be echoed).',
});

export const resultArrays = message({
  ja: '`arrays` — 繰り返し行ごとの `DerivedArray`。`path`・`minItems`・`maxItems` と、1 行ぶんの欄の説明 `item` を持ちます。',
  en: '`arrays` — a `DerivedArray` per repeated group: `path`, `minItems`, `maxItems`, and `item`, which describes the fields of one row.',
});

export const resultRules = message({
  ja: '`rules` — `defineForm` で宣言した複数の欄にまたがる検証。ただのデータです。',
  en: '`rules` — the cross-field rules declared with `defineForm`, as plain data.',
});

export const resultDropped = message({
  ja: '`dropped` — HTML の属性にできず、ブラウザでは検査されない検証の一覧。',
  en: '`dropped` — the checks that could not become attributes and therefore do not run in the browser.',
});

export const resultJson = message({
  ja: 'たとえば `z.string().min(1, …).max(120, …)` の `title` は、次のデータになります。',
  en: 'For example, a `title` of `z.string().min(1, …).max(120, …)` becomes this data.',
});

export const fieldTitle = message({
  ja: '`field(path)` が返すもの',
  en: 'What `field(path)` returns',
});

export const fieldDescription = message({
  ja: '`form.field(path)` は、導かれた属性に今のフォームの状態を重ねた `FieldView` を返します。',
  en: "`form.field(path)` returns a `FieldView`: the derived attributes with the form's current state laid over them.",
});

export const memberColumn = message({
  ja: 'メンバー',
  en: 'Member',
});

export const typeColumn = message({
  ja: '型',
  en: 'Type',
});

export const meaningColumn = message({
  ja: '意味',
  en: 'Meaning',
});

export const fieldInput = message({
  ja: '入力要素に広げる属性。`name` は常にあり、残りはスキーマから導かれた制約属性です。`state` に `values` があるとき（`parseForm` が返した結果ならいつでも）は、返ってきた入力値が `defaultValue`（チェックボックスなら `defaultChecked`）として入ります。',
  en: 'The attributes to spread onto the control. `name` is always there; the rest are the constraint attributes derived from the schema. Whenever `state` carries `values` (any result `parseForm` returned), the echoed value is added as `defaultValue` (`defaultChecked` for a checkbox).',
});

export const fieldError = message({
  ja: '表示するメッセージ。ブラウザ側のメッセージがあればそれを、無ければその欄が編集されるまでサーバーのエラーを返します。',
  en: "The message to show: the browser-side message when there is one, otherwise the server's error until the field is edited.",
});

export const fieldInvalid = message({
  ja: '`error !== undefined`。`aria-invalid` やスタイルに使います。',
  en: '`error !== undefined`, for `aria-invalid` and styling.',
});

export const fieldRequired = message({
  ja: '導かれた `required`。ラベルに必須の印を付けるときに使います。',
  en: 'The derived `required`, for a required marker on the label.',
});

export const fieldEdit = message({
  ja: '既存の値を編集するフォームでは、自分の `defaultValue` を `input` の展開より前に書きます。`state` に `values` が無いうちは `input` が `defaultValue` を持たないので自分の値が使われ、`parseForm` の結果が返ってきたあとは、返ってきた入力値が上書きします。',
  en: 'In a form that edits an existing record, write your own `defaultValue` before the `input` spread. Until `state` carries `values`, `input` has no `defaultValue`, so yours is used; once a `parseForm` result comes back, the echoed value overrides it.',
});

export const fieldUnknown = message({
  ja: 'スキーマに無いパスはコンパイルで止まりますが、型を迂回して渡した場合も `field()` は実行時に例外を投げます。',
  en: 'A path the schema does not have fails to compile, and if one gets past the types anyway, `field()` throws at runtime.',
});

export const mappingTitle = message({
  ja: 'zod の型と導かれる属性',
  en: 'From zod types to attributes',
});

export const mappingDescription = message({
  ja: '変換は `z.toJSONSchema` の出力と zod 自身のチェックを突き合わせて行います。表の属性は `input` に入るもので、`name` は省いています。',
  en: "The conversion pairs `z.toJSONSchema`'s output with zod's own checks. The table shows what lands in `input`, leaving out `name`.",
});

export const schemaColumn = message({
  ja: 'スキーマ',
  en: 'Schema',
});

export const attributesColumn = message({
  ja: '`input`',
  en: '`input`',
});

export const notesColumn = message({
  ja: '補足',
  en: 'Notes',
});

export const mapString = message({
  ja: "`''` を受け付けるので `required` は付きません。",
  en: "Accepts `''`, so no `required`.",
});

export const mapStringBounds = message({
  ja: '`.length(4)` は `minLength` と `maxLength` の両方になります。',
  en: '`.length(4)` becomes both `minLength` and `maxLength`.',
});

export const mapEmail = message({
  ja: 'zod のメール用正規表現はブラウザの `v` フラグでコンパイルできないため `pattern` にはせず、`dropped` に載ります。ブラウザ側は `type="email"` の検査だけが働きます。',
  en: 'zod\'s email regex does not compile under the browser\'s `v` flag, so it is not emitted as `pattern` and is listed in `dropped`. In the browser, only the `type="email"` check runs.',
});

export const mapUrl = message({
  ja: 'ブラウザ側は `type="url"` の検査が働きます。',
  en: 'The browser runs its `type="url"` check.',
});

export const mapRegex = message({
  ja: '`^…$` で囲まれ、フラグが無いか `u` だけで、`v` フラグでもコンパイルできる正規表現だけが `pattern` になります。それ以外は `dropped` に載ります。',
  en: 'A regex becomes `pattern` only when it is wrapped in `^…$`, has no flags or only `u`, and compiles under the `v` flag. Anything else is listed in `dropped`.',
});

export const mapDate = message({
  ja: '日付の正規表現は出しません。`type="date"` のほうが厳しく制約します。',
  en: 'The date regex is not emitted; `type="date"` constrains the value more tightly.',
});

export const mapTime = message({
  ja: '`type="time"` は `pattern` を読まないので、正規表現は `dropped` に載ります。',
  en: '`type="time"` ignores `pattern`, so the regex is listed in `dropped`.',
});

export const mapDatetimeLocal = message({
  ja: '`datetime-local` が送る形（タイムゾーンなし）を受け付けるスキーマです。',
  en: 'A schema that accepts what `datetime-local` submits: no timezone.',
});

export const mapDatetime = message({
  ja: 'タイムゾーンを要求するので、`datetime-local` では満たせません。`type="text"` に落として `dropped` に載せます。',
  en: 'It demands a timezone, which `datetime-local` cannot submit, so it falls back to `type="text"` and is listed in `dropped`.',
});

export const mapFormatText = message({
  ja: '専用の `type` が無い形式（`z.uuid()`・`z.ipv4()`・`z.iso.duration()` など）はテキスト欄になり、正規表現はブラウザが同じ意味で読めるときだけ `pattern` になります。',
  en: 'A format with no `type` of its own (`z.uuid()`, `z.ipv4()`, `z.iso.duration()`, …) becomes a text input, and its regex becomes `pattern` only when the browser reads it the same way.',
});

export const mapNumber = message({
  ja: '空の数値欄は 0 ではなく未入力として届くので、`required` になります。',
  en: 'An empty numeric field arrives as nothing entered, not as 0, so it is `required`.',
});

export const mapInt = message({
  ja: '`.int()` が持つ安全な整数の範囲は属性にしません。整数の `.positive()` や `.gt(0)` は `min: 1` になりますが、小数の `.gt()` / `.lt()` は境界を含まないため `dropped` に載ります。',
  en: 'The safe-integer range `.int()` carries is not emitted. On an integer, `.positive()` or `.gt(0)` becomes `min: 1`; on a float, `.gt()` / `.lt()` are exclusive bounds HTML cannot express and are listed in `dropped`.',
});

export const mapMultipleOf = message({
  ja: '`.multipleOf()` は `step` になります。',
  en: '`.multipleOf()` becomes `step`.',
});

export const mapNumberOptional = message({
  ja: '未入力を受け付けるので `required` は付きません。`.default(5)` も同じです。',
  en: 'Nothing entered is accepted, so no `required`. `.default(5)` is the same.',
});

export const mapBoolean = message({
  ja: 'チェックされていないボックスは `false` として届き、`z.boolean()` はそれを受け付けます。',
  en: 'An unchecked box arrives as `false`, which `z.boolean()` accepts.',
});

export const mapLiteralTrue = message({
  ja: '同意のチェックボックス。未チェックを拒むので `required` になり、文言は zod のものです。',
  en: "A consent box. It rejects an unchecked box, so it is `required`, in zod's wording.",
});

export const mapEnum = message({
  ja: '`type` を持ちません。`<select>` かラジオボタンで描きます。',
  en: 'No `type`: render it as a `<select>` or a radio group.',
});

export const mapGroup = message({
  ja: '名前だけを持つチェックボックス群です。`.min()` / `.max()` は `dropped` に載ります。',
  en: 'A checkbox group that carries only its name. `.min()` / `.max()` are listed in `dropped`.',
});

export const mapFile = message({
  ja: '`.mime()` は `accept` になります。サイズの `.min()` / `.max()` は `dropped` に載ります。',
  en: '`.mime()` becomes `accept`. Size bounds from `.min()` / `.max()` are listed in `dropped`.',
});

export const mapFileOptional = message({
  ja: '選ばれなかったファイル欄は未入力として届くので、`.optional()` なら `required` は付きません。',
  en: 'An unfilled file input arrives as nothing entered, so with `.optional()` there is no `required`.',
});

export const mapPassword = message({
  ja: '`secret: true` になり、入力値は返されません。',
  en: 'Marked `secret: true`; the value is never echoed.',
});

export const mapNullable = message({
  ja: 'どちらの枝を検査すべきか決まらないので、中の制約は属性にならず `dropped` に載ります。union も同じです。',
  en: 'There is no telling which branch to check, so the constraints inside do not become attributes and are listed in `dropped`. A union is the same.',
});

export const mapCoerceOther = message({
  ja: "文字列を読むスキーマなので残りますが、制約は読み取れず `dropped` に載ります。空の欄は `''` として届くので、`z.coerce.bigint()` は空欄を `0n` と読みます。",
  en: "They read strings, so they are kept, but no constraint can be read from them and they are listed in `dropped`. An empty field arrives as `''`, which `z.coerce.bigint()` reads as `0n`.",
});

export const mapOpaque = message({
  ja: 'スキーマから制約を読み取れないので、`type="text"` だけを出して `dropped` に載せます。検査はサーバーでだけ行われます。',
  en: 'Nothing can be read from the schema, so only `type="text"` is emitted and the field is listed in `dropped`. The checks run on the server only.',
});

export const requiredTitle = message({
  ja: '`required` の決まり方',
  en: 'Where `required` comes from',
});

export const requiredDescription = message({
  ja: 'JSON Schema の `required` は「キーがある」という意味ですが、フォームはすべての欄について何かを送ります。何を送るかは入力要素で決まるので、`formFields` はその「空の送信」をスキーマに渡してみて、拒まれたときだけ `required` を付けます。`parseForm` もまったく同じ値をスキーマに渡すので、ブラウザとサーバーの判断は食い違いません。ただし例外が 1 つあります。何も選ばれていないラジオボタンは何も送らないので、`.optional()` や `.default()` の enum はブラウザでは `required` になり、`parseForm` は受け付けます。',
  en: "JSON Schema's `required` means “the key is present”, but a form submits something for every control. What that is depends on the control, so `formFields` hands that empty submission to the schema and emits `required` only when the schema rejects it. `parseForm` hands the schema exactly the same value, so the browser and the server agree — with one exception: a radio group with nothing selected submits no entry, so an `.optional()` or `.default()` enum is `required` in the browser but accepted by `parseForm`.",
});

export const controlColumn = message({
  ja: '入力要素',
  en: 'Control',
});

export const emptyColumn = message({
  ja: '触られなかったときにスキーマが受け取る値',
  en: 'What the schema receives when it is left untouched',
});

export const emptyText = message({
  ja: 'テキスト系（text・email・url・date など）',
  en: 'Text-like (text, email, url, date, …)',
});

export const emptyCheckbox = message({
  ja: 'チェックボックス',
  en: 'Checkbox',
});

export const emptyNumber = message({
  ja: '数値',
  en: 'Number',
});

export const emptyFile = message({
  ja: 'ファイル',
  en: 'File',
});

export const emptyChoice = message({
  ja: '`<select>` / ラジオボタン',
  en: '`<select>` / radio group',
});

export const emptyGroup = message({
  ja: 'チェックボックス群',
  en: 'Checkbox group',
});

export const emptyTextValue = message({
  ja: "`''`",
  en: "`''`",
});

export const emptyCheckboxValue = message({
  ja: '`false`（チェックされていれば `value` に関係なく `true`）',
  en: '`false` (`true` when checked, whatever its `value`)',
});

export const emptyNothingValue = message({
  ja: '`undefined`（空の数値欄も、名前の無い 0 バイトのファイルも「未入力」）',
  en: '`undefined` (an empty numeric field and an unnamed zero-byte file both mean nothing entered)',
});

export const emptyChoiceValue = message({
  ja: "`<select>` のプレースホルダーは `''`。何も選ばれていないラジオボタンは何も送らず、スキーマはそのキーの値を受け取りません（`undefined` を受け付けない enum なら検証エラー）。",
  en: "A `<select>` placeholder submits `''`. A radio group with nothing selected submits nothing, so the schema receives no value for the key (a validation error unless the enum accepts `undefined`).",
});

export const emptyGroupValue = message({
  ja: '`[]`',
  en: '`[]`',
});

export const requiredOptional = message({
  ja: "テキスト欄の `.optional()` は、欄を任意にしません。テキスト欄は `undefined` ではなく `''` を送るので、`z.string().min(1).optional()` は `required` のままで、サーバーでも空欄を拒みます。空欄を許すには、`z.string().max(200)` のように `''` を受け付けるスキーマを書きます。",
  en: "`.optional()` does not make a text field optional. A text field submits `''`, not `undefined`, so `z.string().min(1).optional()` stays `required`, and the server rejects the empty field too. To allow an empty field, write a schema that accepts `''`, such as `z.string().max(200)`.",
});

export const messagesTitle = message({
  ja: 'メッセージは zod から取る',
  en: 'Messages come from zod',
});

export const messagesDescription = message({
  ja: '`messages` は、特定のチェックだけを落とす値をスキーマに通し、zod が返した文言を集めたものです。欄の横に出る文言は zod 自身が出す文言そのもので、サーバーの `parseForm` がそのチェックに使う文言と同じです。',
  en: '`messages` is collected by running the schema against values chosen to fail one check each and keeping the wording zod returns. The text next to a field is exactly what zod itself produces, and is the same text `parseForm` uses for that check on the server.',
});

export const messagesCustom = message({
  ja: "文言を変えるには、`.min(1, '…')` のようにチェックに書くか、`z.config(z.locales.ja())` で zod のロケールを読み込みます。どちらも `formFields` を呼んだ時点のものが使われます。",
  en: "To change the wording, write it into the check, as in `.min(1, '…')`, or load a zod locale with `z.config(z.locales.ja())`. Either way, what is in effect when `formFields` runs is what the fields carry.",
});

export const messagesNoBrowser = message({
  ja: 'ブラウザ自身の文言は使いません。ロケールに依存して制御できないからです。zod から文言が得られなかったフラグでは、クライアントには何も表示されず、判断はサーバーに任されます。',
  en: "The browser's own wording is never used: it depends on the browser's locale and cannot be controlled. A flag zod gave no message for shows nothing on the client, and the server decides.",
});

export const nestedTitle = message({
  ja: 'ネストしたオブジェクト',
  en: 'Nested objects',
});

export const nestedDescription = message({
  ja: 'ネストした欄はドット区切りのパスで取り出し、そのパスがブラウザの送る `name` にもなります。エラーのキーも同じ `address.city` です。',
  en: 'A nested field is addressed by its dotted path, which is also the `name` the browser submits. Its error is keyed by the same `address.city`.',
});

export const nestedOptional = message({
  ja: '`.optional()` や `.default()` の付いたオブジェクトも中の欄を保ちます。ただし中の入力要素は常に描いてください。名前が送られてこなければ `parseForm` は結線の誤りとして例外を投げます。',
  en: 'An object behind `.optional()` or `.default()` keeps its fields. Its controls must still be rendered: when a name never arrives, `parseForm` throws it as a wiring mistake.',
});

export const arrayTitle = message({
  ja: '繰り返し行: `array(path)`',
  en: 'Repeated rows: `array(path)`',
});

export const arrayDescription = message({
  ja: 'オブジェクトの配列は `form.array(path)` で扱い、`ArrayView` が返ります。React の state が持つのは各行の識別子だけで、値は DOM にあるので、行の追加や削除で値を React に写すことはありません。',
  en: 'An array of objects is reached through `form.array(path)`, which returns an `ArrayView`. React state holds only the identity of each row; the values stay in the DOM, so adding or removing a row never copies anything into React.',
});

export const arrayRows = message({
  ja: '各行。`key` は React の key に、`index` は今の位置として使います。`field(itemKey)` で行の中の欄を取り出し、`remove()` でその行を消します。`itemKey` はただの文字列でコンパイル時には検査されず、行に無いキーを渡すと描画時に例外を投げます。',
  en: "The rows. Use `key` as the React key; `index` is the row's current position. `field(itemKey)` returns a field inside the row, and `remove()` removes the row. `itemKey` is a plain string, not checked at compile time: a key the row does not have throws when the row renders.",
});

export const arrayAdd = message({
  ja: '末尾に行を足します。',
  en: 'Appends a row.',
});

export const arrayCanAdd = message({
  ja: '行数がスキーマの `.max()` に達すると `false`。',
  en: "`false` once the row count reaches the schema's `.max()`.",
});

export const arrayCanRemove = message({
  ja: '行数がスキーマの `.min()` 以下なら `false`。',
  en: "`false` while the row count is at or below the schema's `.min()`.",
});

export const arrayError = message({
  ja: '配列そのものへのサーバーのエラー（`.min(1, …)` を満たさないときなど）。',
  en: "The server's error about the array itself, such as a failed `.min(1, …)`.",
});

export const arrayInitial = message({
  ja: '最初の行数は、送信後なら `state.rows` の値、無ければ `.min()`、それも無ければ 0 です。JavaScript が無いときに表示される行数もこれで、追加や削除のボタンは動きません。',
  en: 'The first render has as many rows as `state.rows` says after a submission, otherwise `.min()`, otherwise none. That is also the row count without JavaScript, where the add and remove buttons do nothing.',
});

export const arrayNames = message({
  ja: '行の欄の `name` は `items[0].name` のように添字を含み、エラーのキーも同じです。行を消すと後ろの行が詰まり、ブラウザ側で出したメッセージも行と一緒に移ります。値は DOM にあるので消えません。`state.errors` のサーバーのエラーは添字を振り直さないので、上の行を消すと、まだ編集していないエラーはその添字になった行に出ます。',
  en: "A row field's `name` carries its index, as in `items[0].name`, and so does its error key. Removing a row shifts the later rows up; the browser-side messages move with their rows, and the values, being in the DOM, stay put. Server errors in `state.errors` are not renumbered: after a row above is removed, an unedited server error shows on whichever row now has that index.",
});

export const arrayParse = message({
  ja: '`parseForm` は送られてきた最大の添字から行数を数え、その範囲の行がすべて揃っていることを求めます。行数は `.max()`（無ければ 1000）で頭打ちになるので、偽造された大きな添字でサーバーが大きな配列を確保することはありません。',
  en: '`parseForm` counts rows from the highest index submitted and expects every row up to it. The count is capped at `.max()` (or 1000 without one), so a forged huge index cannot make the server allocate.',
});

export const arrayScalar = message({
  ja: '`z.array(z.string())` のようなスカラーの配列では、行の欄に名前がありません。`row.field()` と引数なしで呼び、`name` は `tags[0]` になります。',
  en: "For an array of scalars such as `z.array(z.string())`, the row's field has no key: call `row.field()` with no argument, and its `name` is `tags[0]`.",
});

export const arrayNested = message({
  ja: '繰り返しの中の繰り返しは `name` の添字が一意に決まらないので、`formFields` と `parseForm` が例外を投げます。型はこのスキーマを通してしまうので、気づくのは導出するときです。',
  en: 'A repeat inside a repeat has no unambiguous name, so `formFields` and `parseForm` throw on it. The types let such a schema through, so it surfaces when the fields are derived.',
});

export const choiceTitle = message({
  ja: '選択肢: `<select>` とラジオボタン',
  en: 'Choices: `<select>` and radio groups',
});

export const choiceDescription = message({
  ja: '`z.enum()` は `type` を持たない `input` になります。`<select>` には属性をそのまま広げられます。',
  en: '`z.enum()` derives an `input` with no `type`. A `<select>` takes the spread as it is.',
});

export const choiceRadio = message({
  ja: 'ラジオボタンには広げず、`name` と `required` を渡します。`state` に `values` があるときの `input` には、返ってきた値が `defaultValue` として入り、それぞれのボタンが持つ `value` とぶつかるからです。選ばれていた値は `state.values` から `defaultChecked` で戻します。',
  en: "Do not spread onto radio buttons; pass `name` and `required`. Once `state` carries `values`, `input` carries the echoed value as `defaultValue`, which collides with each button's own `value`. Restore the selection from `state.values` through `defaultChecked`.",
});

export const choicePlaceholder = message({
  ja: "`<option value=\"\">` のプレースホルダーを置くと、選ばれていない `<select>` は `''` を送ります。enum はそれを拒むので欄は `required` になります。JavaScript が無ければブラウザが送信を止めます。JavaScript があれば、選ばれていない `<select>` は欄を離れたときに `valueMissing` としてスキーマの文言を出し、サーバーでは `parseForm` が `''` を拒みます。",
  en: "With an `<option value=\"\">` placeholder, an unpicked `<select>` submits `''`. The enum rejects it, so the field is `required`: without JavaScript the browser stops the submission; with JavaScript, leaving the unpicked select reports `valueMissing` in the schema's wording, and `parseForm` rejects the `''` on the server.",
});

export const choiceOptional = message({
  ja: "`.optional()` や `.default()` の enum も空の送信 `''` を拒むので、`required` になります。何も選ばれていないラジオボタンは何も送らないので `parseForm` はそれを受け付けますが、`required` を渡したラジオボタンはブラウザで必須として扱われます。そうした enum のラジオボタンには `required` を渡しません。",
  en: "An `.optional()` or `.default()` enum rejects the empty submission `''` too, so it is `required`. A radio group with nothing selected submits nothing, which `parseForm` accepts, but radio buttons given `required` are treated as mandatory in the browser. Leave `required` off the radio buttons of such an enum.",
});

export const checkboxTitle = message({
  ja: 'チェックボックスとチェックボックス群',
  en: 'Checkboxes and checkbox groups',
});

export const checkboxDescription = message({
  ja: "`z.boolean()` は 1 つのチェックボックスです。チェックされていれば `true`、されていなければ `false` として届くので、`value` 属性は関係ありません。同意のように未チェックを拒みたいときは `z.literal(true, '…')` と書きます。",
  en: "`z.boolean()` is a single checkbox. It arrives as `true` when checked and `false` when not, so its `value` attribute does not matter. To reject an unchecked box, as for consent, write `z.literal(true, '…')`.",
});

export const groupDescription = message({
  ja: '列挙値の配列は、決まった選択肢から複数を選ぶチェックボックス群です。すべてのボックスが 1 つの名前を共有するので、繰り返し行ではなく 1 つの欄として `field()` で取り出します。',
  en: 'An array of enums is a fixed option set the person picks several of: a checkbox group. Every box shares one name, so it is one field reached through `field()`, not repeated rows.',
});

export const groupParse = message({
  ja: '`parseForm` はチェックされたボックスの値をすべて読みます。1 つもチェックされていなければ `[]` で、結線の誤りにはなりません。',
  en: '`parseForm` reads every checked box under the shared name. None checked is `[]`, never a wiring error.',
});

export const groupMin = message({
  ja: '`.min(2)` は HTML の属性にできません（群に `required` を付けると「すべてにチェック」の意味になります）。`dropped` に載るので、ブラウザでも検査するには `minChecked` を宣言します。',
  en: '`.min(2)` cannot become an HTML attribute (on a group, `required` would mean “check every box”). It is listed in `dropped`; declare `minChecked` to run the same bound in the browser.',
});

export const groupRestore = message({
  ja: '群のボックスには `name` だけを渡します。`state.values` に返る入力値は、2 つ以上チェックされていれば配列、1 つだけなら文字列なので、両方を配列に揃えてから `defaultChecked` を決めます。1 つだけのときは `input` にも `defaultValue` として入るので、属性を広げるとボックスの `value` とぶつかります。',
  en: "Give each box only `name`. The echo in `state.values` is an array when two or more boxes were checked and a plain string when one was, so normalise it to an array before deciding `defaultChecked`. With one box, the echo also lands in `input` as `defaultValue`, which would collide with each box's `value` if spread.",
});

export const filesTitle = message({
  ja: 'ファイル',
  en: 'Files',
});

export const filesDescription = message({
  ja: '`z.file()` は `type="file"` になり、`.mime([…])` は `accept` になります。`accept` はファイル選択の候補を絞るだけなので、種類を検査するのはサーバーだけです。そのことはまだ `dropped` に載りません。',
  en: '`z.file()` derives `type="file"`, and `.mime([…])` becomes `accept`, which only narrows the file picker: only the server checks the type, and `dropped` does not say so yet.',
});

export const filesEmpty = message({
  ja: '選ばれなかったファイル欄も、名前の無い 0 バイトのファイルを送ります。`z.file()` はそれを本物のファイルとして受け付けてしまうので、`parseForm` は未入力として渡し、`required` の意味を保ちます。',
  en: 'An unfilled file input still submits: an unnamed, zero-byte file, which `z.file()` would accept as a real upload. `parseForm` passes it on as nothing entered, so `required` keeps meaning what it says.',
});

export const filesSize = message({
  ja: 'サイズの `.min()` / `.max()` はバイト数で、対応する HTML 属性はありません。サーバーでだけ検査され、`dropped` に載ります。ファイルは `state.values` に返されません。ファイル欄に値を戻せるブラウザは無いからです。',
  en: 'Size bounds from `.min()` / `.max()` are byte counts, and no HTML attribute carries them: they run on the server only and are listed in `dropped`. A file is never echoed into `state.values`, since no browser lets a value be put back into a file control.',
});

export const filesMultiple = message({
  ja: '1 つの欄で複数のファイルを受けることはまだできません。`z.array(z.file())` は 1 ファイルずつの繰り返し行になります。',
  en: 'Several files in one control are not supported yet: `z.array(z.file())` derives repeated single-file rows.',
});

export const secretTitle = message({
  ja: 'パスワード',
  en: 'Passwords',
});

export const secretDescription = message({
  ja: "`parseForm` はやり直しのために入力値を返しますが、パスワードとして印を付けた欄は除きます。印を付けた欄は `type=\"password\"` になり、`secret` が `true` になります。印は、`zod` では `.meta({ input: 'password' })` で付けます。`zod/mini` には `.meta()` メソッドが無いので、`.check()` に `z.meta({ input: 'password' })` を渡すか、スキーマを `z.globalRegistry` に登録します。レジストリへの登録はどちらの入口でも動きます。",
  en: "`parseForm` echoes the submitted values for a retry, except the fields marked as passwords. A marked field derives `type=\"password\"` and `secret: true`. With `zod`, mark it with `.meta({ input: 'password' })`. `zod/mini` has no `.meta()` method: pass `z.meta({ input: 'password' })` to `.check()`, or add the schema to `z.globalRegistry`, which works with either entry.",
});

export const hiddenTitle = message({
  ja: '入力要素を描かない部品: `HiddenValue`',
  en: 'Components that render no input: `HiddenValue`',
});

export const hiddenDescription = message({
  ja: 'リッチテキストエディタや外部のコンボボックスは `<input name>` を描かないので、FormData に値が載りません。値を React の state から送信時に取り出すのではなく、隠し入力に置いておきます。値はふつうのフォームの項目なので、送信時に取り出すコードなしで、ほかの欄と一緒に FormData に載ります。',
  en: 'A rich text editor or a third-party combobox renders no `<input name>`, so FormData never sees its value. Rather than pulling the value out of React state at submit time, park it in a hidden input. The value is an ordinary form entry, so it goes out with the rest of the FormData and needs no submit-time code.',
});

export const hiddenWhy = message({
  ja: 'props を広げる関数ではなくコンポーネントなのは、React が制御された値を書き換えても DOM のイベントが起きないからです。`HiddenValue` は値が変わるたびに `input` イベントを出すので、複数の欄にまたがる検証や `isDirty` がキー入力と同じように気づきます。マウント時の値を変更の有無の基準として覚えます。',
  en: 'It is a component rather than a props helper because React updates a controlled value without any DOM event. `HiddenValue` announces each change with an `input` event, so cross-field rules and `isDirty` hear it like a keystroke. The value it mounted with is kept as the baseline for `isDirty`.',
});

export const hiddenLimits = message({
  ja: "隠し入力はブラウザの制約検証の対象外なので、この欄のメッセージはクライアントでは出ません。スキーマの検証はサーバーで行われ、エラーは `field('body').error` で読めます。フォームのリセットでも値は戻りません。値は呼び出し側の state だからです。",
  en: "A hidden input is exempt from the browser's constraint validation, so this field shows no client-side message. The schema still validates it on the server, and the error reads through `field('body').error`. A form reset does not restore it either: the value is the caller's state.",
});

export const pathsTitle = message({
  ja: 'パスはコンパイル時に検査される',
  en: 'Paths are checked at compile time',
});

export const pathsDescription = message({
  ja: '`formFields` はスキーマの型から有効なパスを導きます。打ち間違いはクリックして見つけるものではなく、ビルドエラーになります。オブジェクトの配列は `array()` に、列挙値の配列（チェックボックス群）は `field()` に振り分けられ、取り違えも型で止まります。複数の欄にまたがる検証も同じパスで型付けされます。',
  en: "`formFields` derives the set of valid paths from the schema's type, so a typo is a build error rather than something you find by clicking. Arrays of objects go to `array()` and arrays of enums (checkbox groups) to `field()`, and mixing them up fails to compile too. Cross-field rules are typed against the same paths.",
});

export const pathsTypo = message({
  ja: "`form.field('titel')` — スキーマに無い欄です。",
  en: "`form.field('titel')` — not a field in the schema.",
});

export const pathsArrayAsField = message({
  ja: "`form.field('items')` — オブジェクトの配列は `array()` で取り出します。",
  en: "`form.field('items')` — an array of objects is reached through `array()`.",
});

export const pathsObjectAsArray = message({
  ja: "`form.array('address')` — オブジェクトで、配列ではありません。",
  en: "`form.array('address')` — an object, not an array.",
});

export const pathsGroupAsArray = message({
  ja: "`form.array('topics')` — チェックボックス群は 1 つの欄で、`field()` で取り出します。",
  en: "`form.array('topics')` — a checkbox group is one field, reached through `field()`.",
});

export const pathsRule = message({
  ja: "`sameAs('confrim', 'password', …)` — ルールもスキーマのパスで型付けされるので、打ち間違いはコンパイルで止まります。",
  en: "`sameAs('confrim', 'password', …)` — rules are typed against the schema's paths too, so the typo fails to compile.",
});

export const droppedTitle = message({
  ja: 'ブラウザで検査されない検証: `dropped`',
  en: 'Checks the browser skips: `dropped`',
});

export const droppedDescription = message({
  ja: 'HTML の属性にできない検証は、黙って捨てずに `dropped` に `DroppedCheck`（`{ field, reason }`）として返します。これらはサーバーでは検査され、ブラウザでは検査されません。production 以外では、同じ一覧を `console.warn` でスキーマごとに一度だけ出すので、戻り値を読み忘れても気づけます。',
  en: 'A check that cannot become an attribute is not discarded in silence: it comes back in `dropped` as a `DroppedCheck` (`{ field, reason }`). It still runs on the server; it does not run in the browser. Outside production the same list is also logged with `console.warn`, once per schema, so it is seen without anyone remembering to read it.',
});

export const droppedList = message({
  ja: '`dropped` に載るのは次のものです。',
  en: 'These land in `dropped`:',
});

export const droppedRefine = message({
  ja: 'ルートのオブジェクトに付けた `.refine()` などのチェック（`field` は `(schema)` で、件数だけが分かります）',
  en: 'Checks such as `.refine()` on the root object (`field` is `(schema)`, and only their count is known)',
});

export const droppedRegex = message({
  ja: '`^…$` で囲まれていない、`u` 以外のフラグを持つ、または `v` フラグでコンパイルできない正規表現（`z.email()` を含む）',
  en: "Regexes not wrapped in `^…$`, carrying a flag other than `u`, or failing to compile under the `v` flag (`z.email()`'s included)",
});

export const droppedIgnoredPattern = message({
  ja: '`pattern` を読まない `type="time"` に付いた正規表現（`z.iso.time()` を含む）',
  en: 'A regex on `type="time"`, which ignores `pattern` (`z.iso.time()`\'s included)',
});

export const droppedExclusive = message({
  ja: '小数の `.gt()` / `.lt()` のような境界を含まない範囲',
  en: 'Exclusive bounds on a float, such as `.gt()` / `.lt()`',
});

export const droppedDatetime = message({
  ja: 'タイムゾーンを要求する `z.iso.datetime()`',
  en: '`z.iso.datetime()`, which demands a timezone',
});

export const droppedUnion = message({
  ja: '`.nullable()` や union の中の制約',
  en: 'Constraints inside `.nullable()` or a union',
});

export const droppedOpaque = message({
  ja: '`.transform()`・JSON Schema で表せない型への `.pipe()`・`z.custom()` などで制約を読み取れなくなった欄',
  en: 'Fields whose constraints became unreadable behind `.transform()`, a `.pipe()` into a type JSON Schema cannot describe, `z.custom()` and the like',
});

export const droppedGroup = message({
  ja: 'チェックボックス群の個数の制限と、ファイルのサイズの制限',
  en: 'Count bounds on a checkbox group and size bounds on a file',
});

export const droppedNotListed = message({
  ja: 'まだ `dropped` に載らないものがあります。1 つの欄、ネストしたオブジェクト、繰り返し行に付けた `.refine()` / `.superRefine()`（数えるのはルートのオブジェクトのチェックだけです）、ファイル選択の候補を絞るだけの `accept` になる `.mime()`、そして 2 つ以上の正規表現を持つ文字列や、形式に `.regex()`・`.lowercase()`・`.uppercase()` を足した文字列です。最後のものは `pattern` や `type` を失い、たとえば `z.email().regex(…)` はただの `type="text"` になります。いずれもサーバーでは検査されます。',
  en: 'Not listed in `dropped` yet: a `.refine()` / `.superRefine()` on a single field, on a nested object, or on a row (only the root object\'s checks are counted); a `.mime()` check, whose `accept` only narrows the file picker; and a string that carries more than one pattern, or puts a `.regex()`, `.lowercase()` or `.uppercase()` on a format, which loses its `pattern`, its `type`, or both — `z.email().regex(…)` derives a bare `type="text"`. They all still run on the server.',
});

export const droppedReason = message({
  ja: '`reason` の文言は日本語で書かれています。',
  en: 'The `reason` text is written in Japanese.',
});

export const droppedRules = message({
  ja: '複数の欄にまたがる検証をブラウザでも走らせるには、`.refine()` の代わりに `defineForm` のルールを使います。',
  en: 'To run a cross-field check in the browser as well, declare it as a `defineForm` rule instead of a `.refine()`.',
});

export const seeValidation = message({
  ja: 'ルールの宣言はバリデーションのページにあります。',
  en: 'Declaring rules is covered on the Validation page.',
});

export const refusedTitle = message({
  ja: '導出時に拒否されるスキーマ',
  en: 'Schemas refused at derive time',
});

export const refusedDescription = message({
  ja: 'フォームで表せないスキーマは、`formFields` がパスと理由を付けて例外を投げます。入力を黙って読み違えるフォームや、どんな送信でも必ず失敗するフォームを作らないためです。`parseForm` も同じ走査を使うので、同じ例外を投げます。',
  en: 'A schema no form can express makes `formFields` throw with the path and the reason, instead of deriving a form that silently misreads what was typed or can never succeed. `parseForm` walks the schema the same way and throws the same error.',
});

export const refusedNumber = message({
  ja: '`z.number()` と `z.literal(1)` — 値は文字列で届くので、どんな送信も通りません。`z.coerce.number()` を使います。',
  en: '`z.number()` and `z.literal(1)` — every value arrives as a string, so no submission could pass. Use `z.coerce.number()`.',
});

export const refusedDate = message({
  ja: '`z.date()`・`z.bigint()`・`z.nan()` — 文字列を受け付けません。`z.coerce.date()` と `z.coerce.bigint()` は文字列を読むので残ります。',
  en: '`z.date()`, `z.bigint()` and `z.nan()` — they accept no string. `z.coerce.date()` and `z.coerce.bigint()` read strings and are kept.',
});

export const refusedRecord = message({
  ja: '`z.record()` — キーの構成を列挙できません。',
  en: '`z.record()` — its keys cannot be enumerated.',
});

export const refusedTuple = message({
  ja: '`z.tuple()` — 要素の型が一様でなく、繰り返し行にできません。',
  en: '`z.tuple()` — its elements are not uniform, so it cannot be repeated rows.',
});

export const refusedNestedArray = message({
  ja: '繰り返しの中の繰り返し（繰り返し行の中の、列挙値以外の配列）',
  en: 'A repeat inside a repeat (an array of anything but enums inside a repeated row)',
});

export const refusedNullableObject = message({
  ja: '`.nullable()` のオブジェクトや配列、オブジェクトや配列を含む union',
  en: 'A `.nullable()` object or array, and a union containing an object or an array',
});

export const refusedKeys = message({
  ja: '`.`・`[`・`]` を含むキー — `name` の区切りとぶつかります。',
  en: 'Keys containing `.`, `[` or `]` — they collide with the separators in `name`.',
});

export const refusedCustom = message({
  ja: '文字列を拒む `z.custom()` は中身を読めないので拒否できず、テキスト欄として `dropped` に載り、サーバーで失敗します。',
  en: 'A `z.custom()` that rejects strings cannot be read, so it cannot be refused: it derives as a text input, is listed in `dropped`, and fails on the server.',
});
