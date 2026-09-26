import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '検証は 1 つのスキーマから 2 か所で走ります。ブラウザは制約属性を検査して zod の文言を出し、Server Action が最終的に決めます。このページでは、両側が何を保証するか、メッセージが出て消えるまでの流れ、`parseForm` の結果、複数の欄にまたがる検証、サーバーに問い合わせる検証を扱います。',
  en: "Validation runs in two places from one schema: the browser checks the constraint attributes and shows zod's wording, and the Server Action makes the final call. This page covers what each side guarantees, how a message appears and goes away, what `parseForm` returns, cross-field rules, and checks that ask the server.",
});

export const layersTitle = message({
  ja: 'ブラウザとサーバーの二段構え',
  en: 'Two layers: the browser and the server',
});

export const layersDescription = message({
  ja: 'どちらも同じスキーマを読むので、`useForm` が出す文言は、そのチェックに対する zod 自身の文言で、サーバーの `parseForm` がそのチェックに使う文言と同じです。違うのは、いつ、どこまで検査するかです。ブラウザは属性やルールになった検査だけを走らせ、1 つの値が複数のチェックに落ちるときは、両側が先に挙げるチェックが違うことがあります。',
  en: "Both sides read the same schema, so a message `useForm` shows is zod's own wording for that check — the same text `parseForm` uses for it on the server. What differs is when each side checks, and how much: the browser runs only what became an attribute or a rule, and when a value fails several checks, the two sides may name a different one first.",
});

export const layersNoJs = message({
  ja: 'JavaScript が無いとき、制約属性はそのままブラウザの制約検証として働きます。通らない送信はブラウザが止め、文言はブラウザのものです。',
  en: "Without JavaScript, the constraint attributes are simply the browser's constraint validation: it stops a failing submission, in its own wording.",
});

export const layersJs = message({
  ja: 'JavaScript が動くと、`form.props` の `ref` がフォームに `noValidate` を付け、ブラウザの検証に代わって `useForm` が送信のたびに同じ検証をします。触っていない欄も含めた全欄とルールを検査し、通らなければ送信を止めて、失敗した欄に zod の文言を出します。`noValidate` はマークアップに書かれないので、スクリプトが読み込まれるまではブラウザの検証が残ります。',
  en: "Once JavaScript runs, the `ref` in `form.props` sets `noValidate` on the form, and `useForm` runs the same check in the browser's place on every submit: every field, the untouched ones included, and the rules. A failing submission stops, and each failed field shows zod's wording. `noValidate` is never rendered into the markup, so the browser's own validation stays on until the script loads.",
});

export const layersServer = message({
  ja: 'ブラウザの検査を通った送信は Server Action に届きます。HTML で表せない検証（`dropped` に載ったもの）はサーバーでしか走らないので、決めるのはサーバーです。',
  en: 'A submission that passes the browser reaches the Server Action. The checks HTML cannot express — the ones in `dropped` — run only on the server, which is why the server decides.',
});

export const demoTitle = message({
  ja: '触って確かめる',
  en: 'Try it',
});

export const demoDescription = message({
  ja: '下のフォームは、このページの Server Component で `formFields(defineForm(…))` が導いたデータを `useForm` に渡しています。ハンドルは 3 文字以上 20 文字以下で英小文字・数字・`_` だけ、パスワードは 8 文字以上、確認欄には `sameAs` のルールが付いています。',
  en: "The form below hands `useForm` the data `formFields(defineForm(…))` derived in this page's Server Component. The handle takes 3 to 20 lowercase letters, digits or `_`, the password at least 8 characters, and the confirmation carries a `sameAs` rule.",
});

export const demoTryBlur = message({
  ja: 'ハンドルに 2 文字だけ入れて欄を離れると、メッセージが出ます。',
  en: 'Type two characters into the handle and leave the field: the message appears.',
});

export const demoTryTyping = message({
  ja: '戻って入力を続けると、表示中のメッセージが値に合わせて変わり、条件を満たした時点で消えます。まだメッセージの無い欄に、入力の途中で新しく出ることはありません。',
  en: 'Go back and keep typing: the message on screen follows the value and disappears once it is valid. A field with no message yet never gains one mid-word.',
});

export const demoTryRule = message({
  ja: '確認欄にパスワードと違う値を入れて離れると、`sameAs` の文言が出ます。パスワードの側を直すと、確認欄に触らなくても消えます。',
  en: 'Enter a confirmation that differs from the password and leave it: the `sameAs` message appears. Fix the password instead, and it clears without touching the confirmation.',
});

export const demoTryReset = message({
  ja: '「リセット」を押すと、値と一緒にメッセージが消え、`isDirty` が `false` に戻ります。',
  en: 'Press Reset: the messages go with the values, and `isDirty` returns to `false`.',
});

export const demoNoSubmit = message({
  ja: 'このサイトは @k8ordo/static で静的に書き出されていて Server Action が無いので、送信ボタンは置いていません。実際のフォームでは、ここから先をサーバーが引き受けます。',
  en: 'This site is built statically with @k8ordo/static and has no Server Action, so there is no submit button. In a real form, the server takes it from here.',
});

export const demoJson = message({
  ja: 'クライアントに渡っているデータの一部です。文言はこのページの言語で導かれています。',
  en: "Part of the data that crossed to the client. The wording was derived in this page's language.",
});

export const demoLabelHandle = message({
  ja: 'ハンドル',
  en: 'Handle',
});

export const demoLabelPassword = message({
  ja: 'パスワード',
  en: 'Password',
});

export const demoLabelConfirm = message({
  ja: 'パスワード（確認）',
  en: 'Confirm password',
});

export const demoHandleTooShort = message({
  ja: '3 文字以上で入力してください',
  en: 'Use at least 3 characters',
});

export const demoHandleTooLong = message({
  ja: '20 文字以内で入力してください',
  en: 'Use 20 characters or fewer',
});

export const demoHandlePattern = message({
  ja: '英小文字・数字・_ で入力してください',
  en: 'Use lowercase letters, digits and _',
});

export const demoPasswordTooShort = message({
  ja: '8 文字以上で入力してください',
  en: 'Use at least 8 characters',
});

export const demoMismatch = message({
  ja: 'パスワードが一致しません',
  en: 'The passwords do not match',
});

export const demoReset = message({
  ja: 'リセット',
  en: 'Reset',
});

export const lifecycleTitle = message({
  ja: 'メッセージが出て消えるまで',
  en: 'The life of a message',
});

export const lifecycleDescription = message({
  ja: '`useForm` はブラウザの ValidityState を読み、失敗しているフラグに対応するスキーマの文言を出します。いつ出して、いつ消すかは次のとおりです。',
  en: "`useForm` reads the browser's ValidityState and shows the schema's wording for the flag that fails. This is when a message appears and when it goes away.",
});

export const lifeBlur = message({
  ja: '欄を離れたとき（blur）に値が無効なら、メッセージが出ます。',
  en: 'When a field loses focus with an invalid value, its message appears.',
});

export const lifeInput = message({
  ja: '入力中は、すでに表示されているメッセージだけを更新し、値が有効になれば消します。入力の途中で新しいメッセージを出すことはありません。`:user-invalid` と同じ考え方です。',
  en: 'While typing, only a message already on screen is refreshed, and it clears once the value is valid. A new message is never raised mid-word — the same idea as `:user-invalid`.',
});

export const lifeSubmit = message({
  ja: '送信したときは、触っていない欄も含めて全欄を検査し、ルールも走らせます。失敗した欄にはすべてメッセージを出し、送信を止めて、ページ上で最初に失敗した欄にフォーカスを移します。`formNoValidate` の付いた送信ボタンは、ブラウザの検証と同じくこの検査を飛ばします。',
  en: 'On submit, every field is checked, the untouched ones included, and the rules run. Each failed field shows its message, the submission stops, and focus moves to the first failed field on the page. A submit button with `formNoValidate` skips this check, as it skips the browser’s.',
});

export const lifeOrder = message({
  ja: 'どの文言を出すかは、`setCustomValidity` で付いた文言（ルールや `useAsyncCheck` の答え）が最優先で、その後は `ValidityFlag` の `valueMissing`・`typeMismatch`・`patternMismatch`・`tooShort`・`tooLong`・`rangeUnderflow`・`rangeOverflow`・`stepMismatch`・`badInput` の順です。',
  en: 'Which wording shows: a message set with `setCustomValidity` (a rule, or a `useAsyncCheck` answer) comes first, then the `ValidityFlag` values `valueMissing`, `typeMismatch`, `patternMismatch`, `tooShort`, `tooLong`, `rangeUnderflow`, `rangeOverflow`, `stepMismatch` and `badInput`, in that order.',
});

export const lifeServer = message({
  ja: 'Server Action が返した `state.errors` のエラーは、その欄が編集されるまで表示されます。ブラウザ側のメッセージがあれば、そちらが優先されます。',
  en: "An error from the action's `state.errors` shows until its field is edited. A browser-side message, when there is one, takes precedence.",
});

export const lifeNewState = message({
  ja: 'Server Action から新しい結果が届くと、ブラウザ側のメッセージと「編集済み」の記録を捨て、行数を `state.rows` から作り直し、ページ上で最初の失敗にフォーカスを移します。文書順で最初に失敗した欄か、それより前にある、欄を持たないエラー（`formError` や配列そのもののエラー）の表示です。スクリーンリーダーの利用者が、送信が失敗したことと、その場所を知るためです。',
  en: "When a new result arrives from the action, the browser-side messages and the record of edited fields are dropped, rows are rebuilt from `state.rows`, and focus moves to the first failure on the page — the first failed field in document order, or a message no field owns (`formError`, or an array's own error) when it comes before it. That is how someone using a screen reader learns that the submit failed, and where.",
});

export const lifeToken = message({
  ja: '結果は内容と `token` で比べます。同じ失敗が 2 回続いても `token` が違うので新しい答えとして扱い、編集して消えていたエラーをもう一度表示します。`parseForm` を通さずに `FormState` を自分で組み立てるときは、新しい `token` も入れます。入れなければ、同じ内容の 2 回目の失敗は同じ答えとして読まれます。',
  en: 'Results are compared by content plus `token`. Two identical failures carry different tokens, so the second is treated as a new answer and brings back the errors that editing had hidden. A `FormState` built by hand, without `parseForm`, needs a fresh `token` too; without one, a second identical failure reads as the same answer.',
});

export const lifeRules = message({
  ja: 'ルールの対象の欄は、どの欄のイベントでも読み直されます。別の欄を直して解消した違反は、その場で消えます。ただし、まだメッセージの出ていない欄に、この経路で新しく出すことはありません。',
  en: "A rule's field is re-read on every event, whichever field it came from, so a breach fixed from the other field clears on the spot. A field that shows no message yet does not gain one this way.",
});

export const resetTitle = message({
  ja: 'リセット',
  en: 'Reset',
});

export const resetDescription = message({
  ja: '`form.props` の `onReset` はフォームのリセットを受け取ります。リセットボタン、`form.reset()`、action が終わったあと（何を返したかにかかわらず）React 自身が行うリセットのどれでも、古い値について覚えていたことを捨てます。',
  en: 'The `onReset` in `form.props` catches the form being reset — by a reset button, by `form.reset()`, or by React itself after a form action, whatever it returned — and forgets what it knew about the old values.',
});

export const resetMessages = message({
  ja: 'ブラウザ側のメッセージと、ルールが `setCustomValidity` で付けた文言を消します。',
  en: 'The browser-side messages go, and so do the messages rules set with `setCustomValidity`.',
});

export const resetEdited = message({
  ja: '「編集済み」の記録を消すので、今の `state.errors` にあるサーバーのエラーはもう一度表示されます。',
  en: 'The record of edited fields goes, so the server errors in the current `state.errors` show again.',
});

export const resetRows = message({
  ja: '行数を、今の `state.rows`（無ければ `.min()`）に戻します。',
  en: 'Rows go back to the current `state.rows`, or to `.min()` without one.',
});

export const resetDirty = message({
  ja: '`isDirty` は、ブラウザが値を戻し終えたあとに DOM から読み直します。',
  en: '`isDirty` is read back from the DOM once the browser has restored the values.',
});

export const resetEcho = message({
  ja: 'React は action のあと、失敗を返したときにもフォームをリセットします。それでも入力が残るのは、`state.values` が `defaultValue` として描かれ、リセットがその値に戻すからです。パスワードは返されないので空になります。',
  en: 'React resets the form after the action even when it returned a failure. The input survives because `state.values` is rendered as `defaultValue`, which is what the reset restores; passwords are never echoed, so they come back empty.',
});

export const dirtyTitle = message({
  ja: '変更の有無: `isDirty`',
  en: 'Unsaved changes: `isDirty`',
});

export const dirtyDescription = message({
  ja: '`form.isDirty` は、どれかの欄が描画されたときの値と違えば `true` です。値を追いかけるのではなく DOM から読み直すので、この値が再描画を起こすのは真偽値が変わるときだけです。比べるものは次のとおりです。',
  en: '`form.isDirty` is `true` once any field differs from the value it was rendered with. It is read back from the DOM rather than tracked, so the flag causes a re-render only when it flips. What it compares:',
});

export const dirtyText = message({
  ja: 'テキスト欄と `<textarea>` は `value` と `defaultValue`',
  en: 'Text inputs and `<textarea>`: `value` against `defaultValue`',
});

export const dirtyCheckbox = message({
  ja: 'チェックボックスとラジオボタンは `checked` と `defaultChecked`',
  en: 'Checkboxes and radio buttons: `checked` against `defaultChecked`',
});

export const dirtySelect = message({
  ja: '`<select>` は各 `<option>` の `selected` と `defaultSelected`',
  en: "`<select>`: each option's `selected` against `defaultSelected`",
});

export const dirtyHidden = message({
  ja: '`HiddenValue` はマウントしたときの値',
  en: '`HiddenValue`: the value it mounted with',
});

export const dirtyRows = message({
  ja: '繰り返し行は行数',
  en: 'Repeated rows: the row count',
});

export const dirtyHiddenReset = message({
  ja: 'リセットは `HiddenValue` を戻しません。値は呼び出し側の state で、React がそのまま書き戻すからです。編集された `HiddenValue` を持つフォームは、その state を戻すまで `isDirty` のままです。',
  en: "A reset does not restore a `HiddenValue`: its value is the caller's state, which React writes straight back. A form holding an edited one stays dirty until that state is reset too.",
});

export const dirtyServer = message({
  ja: 'サーバーが描く HTML では `isDirty` は常に `false` です。送信ボタンを `disabled={!form.isDirty}` にすると、JavaScript の無い人は送信できなくなります。表示や、ページを離れるときの確認に使います。',
  en: 'In the HTML the server renders, `isDirty` is always `false`. A submit button with `disabled={!form.isDirty}` leaves a visitor without JavaScript unable to submit; use the flag for an indicator or a leave-page prompt instead.',
});

export const parseTitle = message({
  ja: '`parseForm` の結果',
  en: 'What `parseForm` returns',
});

export const parseDescription = message({
  ja: "`parseForm(schema, formData)` は FormData をスキーマの形に組み立て直してから検証します。組み立てるのは構造だけ（ネスト、繰り返しの名前、チェックされていないボックス）で、`'42'` を `42` にするような型の変換はスキーマの `z.coerce` に任せます。",
  en: "`parseForm(schema, formData)` rebuilds the FormData into the schema's shape, then validates. It rebuilds only the structure — nesting, repeated names, unchecked boxes; converting `'42'` to `42` stays the schema's job, through `z.coerce`.",
});

export const parseSuccess = message({
  ja: '`parseForm` は `ParseResult` を返します。成功すれば `{ success: true, data, state }` です。`data` はスキーマの出力型です。',
  en: "`parseForm` returns a `ParseResult`. On success: `{ success: true, data, state }`, with `data` of the schema's output type.",
});

export const parseFailure = message({
  ja: '失敗すれば `{ success: false, state }` です。`state` を Server Action からそのまま返します。',
  en: 'On failure: `{ success: false, state }`. Return that `state` from the action as it is.',
});

export const stateTitle = message({
  ja: '`FormState` の中身',
  en: 'Inside `FormState`',
});

export const stateErrors = message({
  ja: '欄の `name` をキーにしたエラー。1 つの欄に複数の問題があれば最初のものだけを入れ、同じ欄にルールの違反があればそちらを入れます（違反が複数なら、ブラウザと同じく先に宣言したルールです）。',
  en: "Errors keyed by the field's `name`. Only the first issue per field is kept, and a rule breach on the same field takes its place (the rule declared first, as in the browser, when several break).",
});

export const stateValues = message({
  ja: '送られてきた値。やり直しで入力を戻すためのもので、パスワードとして印を付けた欄とファイルは入りません。チェックボックス群はチェックの数にかかわらず配列で、それ以外でも同じ名前で複数の値が送られれば配列になります。',
  en: 'The submitted values, so a retry keeps the input. Fields marked as passwords and files are never included. A checkbox group is an array however many boxes were checked, and any other name submitted more than once becomes an array too.',
});

export const stateRows = message({
  ja: '繰り返し行ごとの行数。JavaScript の有無にかかわらず、やり直しで同じ行数を描くためのものです。',
  en: 'The row count per repeated group, so a retry renders the same rows, with or without JavaScript.',
});

export const stateFormError = message({
  ja: 'どの欄にも属さない問題。`path` を持たないルートの `.refine()` などです。`form.formError.message` を、`form.formError.props` を広げた要素に自分で描きます。欄より上に置けば、送信に失敗したときにフォーカスがそこへ移ります。',
  en: 'An issue that belongs to no field, such as a root `.refine()` without a `path`. Render `form.formError.message` yourself, in an element you spread `form.formError.props` onto; placed above the fields, it takes focus when the submission fails.',
});

export const stateToken = message({
  ja: '1 回の検証の識別子。同じ内容の結果が 2 回返っても、クライアントが区別できるようにするためのものです。',
  en: 'The identity of one parse, so the client can tell apart two results with identical content.',
});

export const parseThrows = message({
  ja: '`parseForm` は、スキーマにある欄の名前が FormData に 1 つも無いと例外を投げます。`input` を広げ忘れたか、その欄を描いていないということで、入力した人の誤りではなく結線の誤りだからです。ただし、触られないと何も送らない入力要素は対象外です。何も選ばれていないラジオボタンは、プレースホルダーのままの `<select>` と同じく値が無いものとしてスキーマに渡り（`undefined` を受け付けない enum なら検証エラー）、チェックされていないチェックボックスは `false`、何もチェックされていないチェックボックス群は `[]` として届くので、これらで広げ忘れても例外にはなりません。',
  en: '`parseForm` throws when a field in the schema never arrived in the FormData. That means an `input` was not spread or the field was not rendered — a wiring mistake, not something the person filling in the form did. The controls that submit no entry at all when left alone are exempt: a radio group with nothing selected reaches the schema as no value, like a `<select>` on its placeholder (a validation error unless the enum accepts `undefined`), an unchecked checkbox as `false`, and a checkbox group with nothing checked as `[]`, so a forgotten spread on one of those is not caught.',
});

export const parseUntouched = message({
  ja: "触られなかった入力要素がスキーマに何を渡すか（テキストは `''`、チェックボックスは `false`、数値・`z.coerce.bigint()`・ファイル・選択肢は何も渡さない）は、フィールドのページの「`required` の決まり方」にまとめています。",
  en: "What an untouched control hands the schema — `''` for text, `false` for a checkbox, nothing at all for a number, a `z.coerce.bigint()`, a file or a choice — is laid out under “Where `required` comes from” on the Fields page.",
});

export const serverTitle = message({
  ja: 'サーバーにしか分からない検証',
  en: 'Checks only the server can make',
});

export const serverDescription = message({
  ja: 'データベースに問い合わせないと分からない検証（ハンドルがすでに使われているかどうかなど）は、`parseForm` が成功したあとで行い、同じ `FormState` の形で返します。`parsed.state` を広げれば、入力値と `token` も一緒に返ります。',
  en: 'A check only the database can answer, such as whether a handle is already taken, runs after `parseForm` succeeds and answers in the same `FormState` shape. Spreading `parsed.state` carries the submitted values and the `token` along.',
});

export const rulesTitle = message({
  ja: '複数の欄にまたがる検証: `defineForm`',
  en: 'Cross-field rules: `defineForm`',
});

export const rulesDescription = message({
  ja: 'パスワードの確認、「2 つ以上選ぶ」、「法人プランのときだけ会社名が必須」のような検証には、対応する制約属性がありません。`.refine()` は関数なのでクライアントに渡せません。そこで、スキーマの横にルールをデータとして宣言します。',
  en: 'Password confirmation, “pick at least two”, “a company name is required only on the business plan” — none of these has a constraint attribute, and a `.refine()` is a function, so it cannot cross to the client. Declare them next to the schema as data instead.',
});

export const rulesBoth = message({
  ja: 'スキーマを渡していた場所に定義を渡します。`defineForm(schema, rules)` は `FormDefinition` を返し、`sameAs`・`minChecked`・`requiredWhen` はそれぞれただのデータである `Rule` を返します。`formFields(signup)` がルールをデータとしてクライアントに運び、`parseForm(signup, formData)` がサーバーで評価します。両側は同じ評価関数を使うので、2 つ目の実装がずれていくことはありません。',
  en: '`defineForm(schema, rules)` returns a `FormDefinition`, and `sameAs`, `minChecked` and `requiredWhen` each return a `Rule`, which is plain data. Pass the definition wherever the schema went: `formFields(signup)` carries the rules to the client as data, and `parseForm(signup, formData)` evaluates them on the server. Both sides run the same evaluator, so there is no second implementation to drift from the first.',
});

export const rulesClient = message({
  ja: 'ブラウザでは、違反を `setCustomValidity` で欄に付けます。組み込みの検証と区別がつかないので `:user-invalid` にも一致し、文言はほかのメッセージと同じ経路で出ます。',
  en: 'In the browser, a breach is set on the field with `setCustomValidity`, so it is indistinguishable from a built-in check: `:user-invalid` matches, and the message arrives the same way as every other.',
});

export const ruleColumn = message({
  ja: 'ルール',
  en: 'Rule',
});

export const breachColumn = message({
  ja: '違反になるとき',
  en: 'Breached when',
});

export const ruleSameAs = message({
  ja: '`field` の値が `other` の値と違うとき',
  en: "`field`'s value differs from `other`'s",
});

export const ruleMinChecked = message({
  ja: '`field` の名前で送られる値が `min` 個より少ないとき',
  en: 'Fewer than `min` values are submitted under `field`',
});

export const ruleRequiredWhen = message({
  ja: '`when` の値が `equals` と等しく、`field` が空のとき',
  en: '`when` equals `equals` and `field` is empty',
});

export const rulesMessage = message({
  ja: '`message` には文字列のほか、文字列を返す関数も渡せます。zod の `{ error: () => … }` と同じく、宣言したときではなく報告するときに呼ばれます。`formFields` は欄を導くときに呼び（関数はクライアントに渡せないので、ルールは文言の入ったデータとして渡ります）、`parseForm` はルールが破れたときに呼びます。@k8ordo/i18n の文言を渡せば、モジュールの先頭に置いた定義のまま、リクエストごとのロケールで報告されます。',
  en: '`message` takes a function returning the text as well as a string. Like zod’s `{ error: () => … }`, it is called when the rule is reported, not where it is declared: `formFields` calls it as it derives the fields (a function cannot cross to the client, so the rules travel as data with the text in them), and `parseForm` calls it when the rule breaks. Pass an @k8ordo/i18n message, and a definition at module scope reports in each request’s locale.',
});

export const rulesStrings = message({
  ja: "ルールは送られる文字列を比べます。`sameAs` と `requiredWhen` はその名前の最初の値を読み、何も送られていなければ `''` として扱います。チェックされたチェックボックスは `value`（既定は `on`）を送ります。",
  en: "Rules compare the submitted strings. `sameAs` and `requiredWhen` read the first value under a name and treat nothing submitted as `''`. A checked checkbox submits its `value` (`on` by default).",
});

export const rulesTyped = message({
  ja: 'ルールの欄名はスキーマのパスで型付けされます。繰り返し行の中の欄はそのパスに含まれないので、ルールの対象にはできません。',
  en: "Rule field names are typed against the schema's paths. Fields inside repeated rows are not among those paths, so a rule cannot target them.",
});

export const rulesServerOnly = message({
  ja: 'ルールはサーバーでも評価されるので、スキーマ側に `.min(2)` を重ねて書く必要はありません。例の `topics` も `.min(2)` を持っていません。',
  en: 'Rules are evaluated on the server too, so there is no need to repeat the bound as `.min(2)` in the schema; `topics` in the example has none.',
});

export const rulesElse = message({
  ja: 'これ以外の検証は `.refine()` のまま、サーバーでだけ走ります。ルートのオブジェクトの `.refine()` は `dropped` に件数が載り、その問題は `path` を付ければその欄のエラーに、付けなければ `state.formError` になります。',
  en: 'Anything else stays a `.refine()` and runs on the server only. A `.refine()` on the root object is counted in `dropped`; its issue lands on a field when given a `path`, and in `state.formError` when not.',
});

export const asyncTitle = message({
  ja: 'サーバーに問い合わせる検証: `useAsyncCheck`',
  en: 'Asking the server about one field: `useAsyncCheck`',
});

export const asyncDescription = message({
  ja: 'ハンドルが使われているかどうかは、サーバーにしか分かりません。`useAsyncCheck(check)` は欄を離れたときに `check` を呼び、答えを `setCustomValidity` で欄に付けます。答えはほかのメッセージと同じ経路で表示されます。',
  en: 'Whether a handle is taken is something only the server knows. `useAsyncCheck(check)` calls `check` when the field is left and sets the answer with `setCustomValidity`, so it shows up through the same path as every other message.',
});

export const asyncSignature = message({
  ja: '`useAsyncCheck` は `AsyncCheck` を返します。`check` は値を受け取り、問題があれば文言を、無ければ `undefined` を返す非同期関数で、Server Action をそのまま渡せます。戻り値の `props`（`onBlur` と `ref`）を入力要素に広げます。`isChecking` は答えを待っている間 `true` です。',
  en: '`useAsyncCheck` returns an `AsyncCheck`. `check` takes the value and resolves to a message when something is wrong or `undefined` when not; a Server Action can be passed as it is. Spread the returned `props` (`onBlur` and `ref`) onto the input. `isChecking` is `true` while an answer is outstanding.',
});

export const asyncLatest = message({
  ja: '答えが順不同で届いても、最後の問い合わせの答えだけを使います。欄の値が問い合わせたときから変わっていれば、その答えは捨てます。',
  en: "When answers arrive out of order, only the newest question's answer counts, and an answer is discarded if the field no longer holds the value it was asked about.",
});

export const asyncSame = message({
  ja: '最後に答えを得た値のまま欄を離れても問い合わせません。問い合わせ中に離れたときは、もう一度問い合わせます。',
  en: 'Leaving the field while it still holds the value the last answer was about does not ask again; a blur while a check is still in flight does.',
});

export const asyncEmpty = message({
  ja: '欄を空にして離れると、前の答えも消えます。',
  en: 'Emptying the field and leaving it clears the last answer.',
});

export const asyncError = message({
  ja: '`check` が例外を投げたときは、どちらの判断も付けません。',
  en: 'If `check` throws, no verdict is applied either way.',
});

export const asyncUnmount = message({
  ja: 'アンマウントしたあとに届いた答えは使いません。',
  en: 'An answer that lands after unmount is ignored.',
});

export const asyncServer = message({
  ja: '`useAsyncCheck` は答えを早めに見せるためのもので、`parseForm` からは呼ばれません。上の例のように、Server Action でも同じ確認を行います。',
  en: '`useAsyncCheck` only shows the answer early; `parseForm` never calls it. Make the same check in the Server Action as well, as in the example above.',
});
