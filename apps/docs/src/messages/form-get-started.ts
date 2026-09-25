import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'フォームの制約は zod スキーマに一度だけ書きます。`@k8ordo/form` はそこから、ブラウザに渡す制約属性とメッセージ、Server Action で使う型付きの検証を導きます。クライアント側の検証は手で書くものではなく、導かれるものです。',
  en: "Write a form's constraints once, in a zod schema. `@k8ordo/form` derives from it the constraint attributes and messages the browser gets, and the typed validation the Server Action runs. The client-side checks are derived, never written by hand.",
});

export const ideaTitle = message({
  ja: '考え方',
  en: 'The idea',
});

export const ideaDescription = message({
  ja: 'フォームの検証は、ふつう 2 回書かれます。JSX の `required` や `maxLength` と、サーバーの検証コードです。2 つは別々に直されるので、いずれ食い違います。このパッケージは書く場所を 1 つにして、残りを導きます。',
  en: 'Form validation is usually written twice: `required` and `maxLength` in the JSX, and a validation routine on the server. The two are edited separately, so sooner or later they disagree. This package keeps one place to write it and derives the rest.',
});

export const ideaSchema = message({
  ja: 'スキーマが唯一の出所です。`required`・`minLength`・`type="email"` といった属性も、欄の横に出すメッセージも、サーバーでの検証も、同じスキーマから来ます。',
  en: 'The schema is the only source. Attributes such as `required`, `minLength` and `type="email"`, the message shown next to a field, and the validation on the server all come from it.',
});

export const ideaDom = message({
  ja: '値は DOM が持ちます。React の state に載るのは、表示中のメッセージ、まだ有効なサーバーのエラー、繰り返し行の識別子、変更の有無を表す真偽値 1 つ、行の追加・削除を比べる基準の行数だけです。値を state に写さないので、キーを押すたびにフォームが描き直されることはありません。',
  en: 'The DOM holds the values. React state carries only the messages on screen, the server errors that are still current, the identity of each repeated row, one dirty flag, and the row counts that adding or removing a row is measured against. Values are never copied into state, so the form does not re-render on every keystroke.',
});

export const ideaNoJs = message({
  ja: 'JavaScript が無くても動きます。制約属性はサーバーが返す HTML に入っているので、スクリプトが無効でも読み込み前でも、ブラウザ自身の検証が働きます。',
  en: 'It works without JavaScript. The constraint attributes are in the HTML the server sends, so the browser validates on its own with scripts disabled or not yet loaded.',
});

export const ideaServer = message({
  ja: '最後に決めるのはサーバーです。HTML の属性で表せない検証もあるので、`parseForm` が送信のたびに同じスキーマで検証し、欄ごとのエラーと入力値を返します。',
  en: 'The server decides. Some checks have no HTML attribute, so `parseForm` validates every submission against the same schema and answers with per-field errors and the submitted values.',
});

export const installTitle = message({
  ja: 'インストール',
  en: 'Installation',
});

export const installDescription = message({
  ja: '`@k8ordo/form` と、スキーマを書くための `zod` を追加します。',
  en: 'Add `@k8ordo/form` and `zod`, which the schema is written in.',
});

export const peersDescription = message({
  ja: 'peer dependencies は次のとおりです。TypeScript と `@types/react` は、同梱の型定義を使うときにだけ必要です。',
  en: 'The peer dependencies are below. TypeScript and `@types/react` are needed only for the shipped type declarations.',
});

export const peerColumn = message({
  ja: 'パッケージ',
  en: 'Package',
});

export const versionColumn = message({
  ja: 'バージョン',
  en: 'Version',
});

export const purposeColumn = message({
  ja: '用途',
  en: 'Needed for',
});

export const peerReact = message({
  ja: '`useForm` と Server Action',
  en: '`useForm` and Server Actions',
});

export const peerReactDom = message({
  ja: '描画',
  en: 'Rendering',
});

export const peerZod = message({
  ja: 'スキーマ（`zod/mini` でも可）',
  en: 'The schema (`zod/mini` works too)',
});

export const peerTypes = message({
  ja: '同梱の型定義（任意）',
  en: 'The shipped type declarations (optional)',
});

export const zodTitle = message({
  ja: 'zod か zod/mini か',
  en: 'zod or zod/mini',
});

export const zodDescription = message({
  ja: '変換は zod の共有コアから読むので、どちらの入口で書いたスキーマでも動きます。パッケージはどちらが選ばれたかを区別しません。スキーマを import するのは Server Component と Server Action だけなので、どちらを選んでも zod はブラウザに届きません。スキーマのモジュールをクライアントからも import するとき（@k8ordo/state の GET フォームなど）は、`zod/mini` を選ぶとバンドルが小さく済みます。',
  en: "The conversion reads zod's shared core, so a schema written with either entry works, and nothing in the package notices which one you chose. Only the Server Component and the Server Action import the schema, so zod does not reach the browser either way. When the client imports the schema module too — a GET form with @k8ordo/state, for instance — `zod/mini` keeps that bundle small.",
});

export const zodMessages = message({
  ja: '`zod/mini` はロケールを同梱しないので、既定のメッセージは `Invalid input` です。ただし同じプロセスで `zod` の入口も使われていると、その英語のロケールが全体に効きます。欄の横に出る文言も zod のものなので、メッセージを自分で書くか、`z.config(z.locales.ja())` のようにロケールを読み込みます。',
  en: "`zod/mini` bundles no locale, so its default message is `Invalid input` — unless the classic `zod` entry is also in use in the same process, which installs its English locale globally. The text next to a field is zod's own too, so either write the messages yourself or load a locale, as in `z.config(z.locales.ja())`.",
});

export const splitTitle = message({
  ja: 'サーバーとクライアントの分担',
  en: 'The server/client split',
});

export const splitDescription = message({
  ja: '入口は 2 つあります。`@k8ordo/form/server` はスキーマを読む側、`@k8ordo/form` はブラウザで動くフックの側です。1 つのフォームは次の 3 段で組み立てます。',
  en: 'There are two entry points. `@k8ordo/form/server` is the side that reads the schema; `@k8ordo/form` holds the hooks that run in the browser. A form is put together in three steps.',
});

export const splitDerive = message({
  ja: 'Server Component か、そのモジュールスコープで `formFields(schema)` を呼びます。結果は属性・メッセージ・ルール・`dropped` からなる JSON で、関数も zod も含みません。',
  en: 'Call `formFields(schema)` in a Server Component or at its module scope. The result is plain JSON — attributes, messages, rules and the `dropped` report — with no functions and no zod.',
});

export const splitProps = message({
  ja: 'その結果を props でクライアントコンポーネントに渡し、`useForm(fields, state)` に渡します。JSON なので RSC の境界を越えられ、zod はクライアントのバンドルに入りません。',
  en: 'Pass the result to a client component as a prop and hand it to `useForm(fields, state)`. Being JSON, it crosses the RSC boundary, and zod stays out of the client bundle.',
});

export const splitParse = message({
  ja: '送信は Server Action が受け、`parseForm(schema, formData)` が型付きのデータか、欄ごとのエラーを含む `state` を返します。',
  en: 'The Server Action receives the submission, and `parseForm(schema, formData)` returns either typed data or a `state` holding per-field errors.',
});

export const entryColumn = message({
  ja: '入口',
  en: 'Entry',
});

export const valuesColumn = message({
  ja: '値',
  en: 'Values',
});

export const typesColumn = message({
  ja: '型',
  en: 'Types',
});

export const bothEntries = message({
  ja: '両方',
  en: 'Both',
});

export const splitTypes = message({
  ja: '`formFields` の結果と Server Action の `state` の型は、両方の入口から export されています。結果は props としてクライアントにも現れるからです。',
  en: 'The types of the `formFields` result and of the action state are exported from both entries, since the result shows up on the client as a prop.',
});

export const exampleTitle = message({
  ja: 'フォームを 1 つ作る',
  en: 'A complete form',
});

export const exampleDescription = message({
  ja: '講演を登録するフォームを、スキーマ・ページ・Server Action・フォームの 4 ファイルで書きます。例は Server Action を持つ @k8ordo/server のアプリです。',
  en: 'A form that registers a talk, in four files: the schema, the page, the Server Action and the form. The example is an @k8ordo/server application, which has Server Actions.',
});

export const exampleSchemaTitle = message({
  ja: '1. スキーマ',
  en: '1. The schema',
});

export const exampleSchemaDescription = message({
  ja: '型の変換はスキーマに書きます。送信される値はすべて文字列なので、数値は `z.coerce.number()` で受けます。空の数値欄は 0 ではなく「未入力」として届くので、未入力のときの文言は `z.coerce.number()` の引数に書きます。zod の版によっては、この文言が自分の文言を持たないチェックにも使われます（4.5.4 は使い、4.4.3 は使いません）。そのため `.int()` や `.min()` にはそれぞれの文言を書きます。',
  en: 'Type conversion belongs in the schema. Every submitted value is a string, so a number is read with `z.coerce.number()`. An empty numeric field arrives as nothing entered, not as 0, so the wording for an untouched field is the argument to `z.coerce.number()`. Depending on the zod version, that wording also stands in for any check without its own (4.5.4 does this, 4.4.3 does not), so give `.int()` and `.min()` theirs.',
});

export const examplePageTitle = message({
  ja: '2. ページ（Server Component）',
  en: '2. The page (Server Component)',
});

export const examplePageDescription = message({
  ja: '`formFields` はモジュールスコープで一度だけ呼びます。結果はどのリクエストでも同じなので、描画のたびに導き直す必要はありません。メッセージをリクエストの言語に合わせたいときだけ、描画の中で呼びます。',
  en: '`formFields` runs once, at module scope. The result is the same for every request, so there is no reason to derive it on each render. Call it inside the render only when the messages follow the request, such as its language.',
});

export const exampleActionTitle = message({
  ja: '3. Server Action',
  en: '3. The Server Action',
});

export const exampleActionDescription = message({
  ja: '`parseForm` が失敗したら、`parsed.state` をそのまま返します。欄ごとのエラーと入力値（パスワードとファイルは除く）が入っているので、JavaScript の有無にかかわらず、やり直しても入力は消えません。成功すれば `parsed.data` はスキーマの出力型です。',
  en: "When `parseForm` fails, return `parsed.state` as it is. It holds the per-field errors and the submitted values (never passwords or files), so a retry keeps what was typed, with or without JavaScript. On success, `parsed.data` has the schema's output type.",
});

export const exampleFormTitle = message({
  ja: '4. フォーム（クライアントコンポーネント）',
  en: '4. The form (client component)',
});

export const exampleFormDescription = message({
  ja: '`useForm` は `UseFormReturn`（`props`・`field`・`array`・`isDirty`）を返します。`form.props` を `<form>` に広げます。欄ごとの登録はありません。`field(path)` が返す `input` を入力要素に広げ、`error` があれば表示します。パスはスキーマから型で導かれるので、打ち間違いはコンパイルで止まります。props の型の `FormFields<FieldPath, ArrayPath>` は、1 つ目に `field()` のパス、2 つ目に `array()` のパスを取ります（無ければ `never`）。',
  en: '`useForm` returns a `UseFormReturn`: `props`, `field`, `array` and `isDirty`. Spread `form.props` onto the `<form>`; there is no per-field registration. Spread the `input` that `field(path)` returns onto the control, and show `error` when there is one. Paths are typed from the schema, so a typo stops at compile time. In the props type, `FormFields<FieldPath, ArrayPath>` takes the `field()` paths first and the `array()` paths second (`never` when there are none).',
});

export const exampleFormProps = message({
  ja: '`form.props` は `ref`・`onBlur`・`onInput`・`onReset` の 4 つです。同じ名前の props を `<form>` に自分でも書くと、あとに書いたほうだけが効き、`useForm` の検証やリセットの処理が外れることがあります。',
  en: "`form.props` is `ref`, `onBlur`, `onInput` and `onReset`. Writing a prop of the same name on the `<form>` yourself leaves only the one written last in effect, which can disconnect `useForm`'s validation or reset handling.",
});

export const exampleFormTypes = message({
  ja: 'パスを props の型に手で並べたくなければ、スキーマと `formFields` を `import type` で読み、`ReturnType<typeof formFields<typeof talkSchema>>` と書けます。型だけの import なので、zod もスキーマもクライアントのバンドルには入りません。',
  en: 'To avoid listing the paths in the props type by hand, bring in the schema and `formFields` with `import type` and write `ReturnType<typeof formFields<typeof talkSchema>>`. A type-only import puts neither zod nor the schema into the client bundle.',
});

export const flowTitle = message({
  ja: '送信したときに起きること',
  en: 'What happens on submit',
});

export const flowNoJs = message({
  ja: 'JavaScript が動いていなければ、ブラウザが制約属性で検証し、通らない送信を止めます。文言はブラウザのものです。',
  en: 'Without JavaScript, the browser validates against the constraint attributes and stops a submission that fails, in its own wording.',
});

export const flowJs = message({
  ja: 'JavaScript が動いていれば、`useForm` がフォームに `noValidate` を付け、欄を離れたときに zod の文言を出します。送信は止めず、そのまま Server Action に届けます。',
  en: "With JavaScript, `useForm` sets `noValidate` on the form and shows zod's wording when a field is left. It does not block the submission; the submission goes to the Server Action.",
});

export const flowServer = message({
  ja: '`parseForm` が失敗を返すと、エラーが欄ごとに表示され、ページ上で最初に失敗した欄にフォーカスが移ります。どの欄にも属さない `formError` は、`form.formError.props` を広げた要素に表示し、それが失敗した欄より前にあればそこにフォーカスが移ります。',
  en: 'When `parseForm` reports a failure, each error appears next to its field, and focus moves to the first failed field on the page. A `formError`, which belongs to no field, goes in the element you spread `form.formError.props` onto, and focus moves there instead when it comes before every failed field.',
});

export const flowMore = message({
  ja: 'メッセージが出て消えるまでの流れと、`parseForm` の結果の詳細はバリデーションのページにあります。',
  en: 'How a message appears and goes away, and what `parseForm` returns in detail, are on the Validation page.',
});

export const nextTitle = message({
  ja: '次に読む',
  en: 'Next steps',
});

export const nextFields = message({
  ja: 'フィールド — zod の型ごとに導かれる属性、ネスト・繰り返し行・チェックボックス群・ファイル',
  en: 'Fields — the attributes each zod type derives; nested objects, repeated rows, checkbox groups and files',
});

export const nextValidation = message({
  ja: 'バリデーション — メッセージの出方、`parseForm` の結果、複数の欄にまたがる検証、サーバーに問い合わせる検証',
  en: 'Validation — how messages behave, what `parseForm` returns, cross-field rules and server-answered checks',
});

export const nextPatterns = message({
  ja: 'パターン — 複数ステップのフォーム、@k8ordo/state と組む GET フォーム、@k8ordo/ui との組み合わせ',
  en: 'Patterns — multi-step forms, GET forms with @k8ordo/state, and pairing with @k8ordo/ui',
});

export const nextDemo = message({
  ja: '動くデモ — @k8ordo/form のトップにある GET フォーム',
  en: 'A live demo — the GET form on the @k8ordo/form landing page',
});

export const nextServer = message({
  ja: '@k8ordo/server の Server Action',
  en: 'Server Actions in @k8ordo/server',
});
