import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'よくある組み立て方をまとめます。扱うのは、複数ステップのフォーム、@k8ordo/state と組む GET フォーム、@k8ordo/ui のコンポーネントとの組み合わせ、そしてこのパッケージがまだできないことです。',
  en: 'Common ways to put the package to work: multi-step forms, GET forms with @k8ordo/state, pairing with @k8ordo/ui components, and what the package does not do yet.',
});

export const multiStepTitle = message({
  ja: '複数ステップのフォーム',
  en: 'Multi-step forms',
});

export const multiStepDescription = message({
  ja: 'すべてのステップを描いたまま、今のステップ以外を隠します。値は DOM にあるので、ステップを行き来しても何も失われず、送信は最後に 1 回で済みます。',
  en: 'Keep every step rendered and hide the ones you are not on. The values stay in the DOM, so moving between steps loses nothing, and the form submits once, at the end.',
});

export const multiStepHydrated = message({
  ja: 'ステップを隠すのは、ハイドレーションが終わってからにします。サーバーが返す HTML の時点で隠すと、JavaScript の無い人は後のステップにたどり着けません。隠さずにおけば、JavaScript が無いときは 1 枚の長いフォームになり、1 回のリクエストで送信されます。それが正しい動きです。',
  en: 'Hide steps only once hydration is done. Hidden in the HTML the server sends, the later steps would be out of reach without JavaScript. Left visible, the form without JavaScript is one long form that submits in a single request — which is the correct behaviour, not a broken one.',
});

export const multiStepValidate = message({
  ja: '次に進む前に、今のステップの中の入力要素だけを `checkValidity()` で確かめます。まだ入力していない後のステップまで含めると、必ず失敗するからです。',
  en: 'Before advancing, check only the controls inside the current step with `checkValidity()`. The later steps are not filled in yet, so checking the whole form would always fail.',
});

export const multiStepFocus = message({
  ja: '`useForm` がメッセージを出すのは欄を離れたときなので、触っていない欄は `checkValidity()` が失敗しても何も表示しません。最初の無効な欄にフォーカスを移すと、その欄を離れたときにメッセージが出ます。',
  en: '`useForm` shows a message when a field is left, so an untouched field shows nothing even though `checkValidity()` fails. Move focus to the first invalid field, and its message appears when the person leaves it.',
});

export const multiStepErrors = message({
  ja: '送信に失敗すると、`useForm` はページ上で最初に失敗した欄にフォーカスを移しますが、隠れたステップの欄はフォーカスを受け取れません。新しい結果が届いたら、描画の中で、エラーを含むステップのうち最も前のものに戻します。',
  en: 'After a failed submission, `useForm` moves focus to the first failed field on the page, but a field in a hidden step cannot take focus. When a new result arrives, switch during render to the earliest step that holds an error.',
});

export const multiStepSubmit = message({
  ja: '送信ボタンは、ハイドレーションが終わったあとは最後のステップでだけ描きます。テキスト欄で Enter を押すと、ブラウザはフォームの最初の送信ボタンを押したものとして扱い、そのボタンが隠れていても送信することがあります。前のステップから、ステップの確認を飛ばしてフォーム全体が送られてしまいます。',
  en: "Once hydrated, render the submit button only on the last step. Pressing Enter in a text field can make the browser click the form's first submit button, even a hidden one, which would send the whole form from an earlier step and skip the step check.",
});

export const getTitle = message({
  ja: '@k8ordo/state と組む GET フォーム',
  en: 'GET forms with @k8ordo/state',
});

export const getDescription = message({
  ja: '検索や絞り込みのフォームは GET フォームです。@k8ordo/state の `definePageState` の `url` スキーマを `formFields` に渡せば、同じスキーマがフォームの制約と URL の状態の両方の出所になります。',
  en: "A search or filter form is a GET form. Hand the `url` schema of an @k8ordo/state `definePageState` to `formFields`, and the same schema becomes the source of both the form's constraints and the URL state.",
});

export const getNoState = message({
  ja: '受け取る Server Action が無いので、`state` を省いて `useForm(fields)` と呼びます。送信すると値は URL の search params に着地し、`useAppState` が同じスキーマで読み返します。欄の初期値には、今の状態を `defaultValue` で渡します。',
  en: "No Server Action receives it, so call `useForm(fields)` without a state. Submitting lands the values in the URL's search params, and `useAppState` reads them back through the same schema. Pass the current state to each control as its `defaultValue`.",
});

export const getRouter = message({
  ja: '@k8ordo/router の下では、同じ pathname への GET フォームの送信はルーターが intercept し、ページの読み込みではなく状態の更新として扱います。JavaScript が無くても、同じフォームは同じ URL に着きます。',
  en: 'Under @k8ordo/router, the router intercepts a GET form submitted to the same pathname and treats it as a state update, not a page load. Without JavaScript, the same form lands on the same URL.',
});

export const getMini = message({
  ja: 'このスキーマは `useAppState` がブラウザで使うので、クライアントのバンドルに入ります。`zod/mini` を選ぶのはこういうときです。',
  en: 'This schema is used by `useAppState` in the browser, so it ships in the client bundle. This is the case `zod/mini` is for.',
});

export const getDemo = message({
  ja: 'この組み合わせは、@k8ordo/form のトップのデモで動いています',
  en: 'This combination runs in the demo on the @k8ordo/form landing page',
});

export const getStateDocs = message({
  ja: '@k8ordo/state の側から見た連携',
  en: "The same integration from @k8ordo/state's side",
});

export const uiTitle = message({
  ja: '@k8ordo/ui と組み合わせる',
  en: 'Working with @k8ordo/ui',
});

export const uiDescription = message({
  ja: '`@k8ordo/form` は `@k8ordo/ui` に依存しません。`@k8ordo/ui` のフィールドのほうが、`formFields` の導いたものをそのまま受けます。`input` は `FormControl` の props の後に広げます。`FormControl` は `id` と `aria-*` の結び付けを自分で作るので、渡すのは `label`・`errorText`・`invalid`・`required` だけです。',
  en: "`@k8ordo/form` does not depend on `@k8ordo/ui`; the fields in `@k8ordo/ui` take what `formFields` derives as it is. Spread `input` after `FormControl`'s props. `FormControl` generates the `id` and the `aria-*` links itself, so it needs only `label`, `errorText`, `invalid` and `required`.",
});

export const uiSpread = message({
  ja: '`input` から外しておくものはありません。`TextField` は日付と時刻の `type` も描き、`PasswordInput` は広げた `type` の下でも表示の切り替えを保ち、`Textarea` は `<textarea>` に無い `type` を捨てます。`NumberField` と `Slider` は、文字列の `min`・`max`、`step="any"`、文字列で戻るエコーの `defaultValue` を受けます。',
  en: 'Nothing has to be taken out of `input` first. `TextField` renders the date and time types too, `PasswordInput` keeps its show/hide toggle under a spread `type`, and `Textarea` drops the `type` a `<textarea>` does not have. `NumberField` and `Slider` take string `min` and `max`, `step="any"`, and the echoed `defaultValue`, which is a string.',
});

export const uiDom = message({
  ja: '非制御のフィールドは値を DOM に持つので、reset（action の後の React の自動リセットを含む）でエコーに戻り、`isDirty` がそれを読みます。部品がコードで変えた値（増減ボタン、選んだ選択肢、外したファイル）も、入力と同じく `input` イベントで届きます。',
  en: "Uncontrolled fields keep their value in the DOM, so a reset — React's after each action included — restores the echo and `isDirty` reads it. A value a component changes in code — a stepper, a chosen option, a removed file — arrives as an `input` event, the way typing does.",
});

export const uiRadio = message({
  ja: '`Radio` と `RadioCard` には、列挙型の `input` をそのまま広げます。手書きのラジオと違い、`defaultValue` は選ばれている選択肢として読まれ、`required` はすべてのラジオに届きます。',
  en: "Spread an enum's `input` onto `Radio` and `RadioCard` as it is. Unlike a hand-written radio, they read `defaultValue` as the selected option, and `required` reaches every radio.",
});

export const uiSelect = message({
  ja: "`Select` の `required` を効かせるには、`value` が `''` の選択肢を `options` の先頭に置きます。空の選択肢が無い `<select>` は、いつも何かが選ばれています。",
  en: "For `required` to mean anything on `Select`, put an option whose `value` is `''` first in `options`; a `<select>` without an empty option always has a choice selected.",
});

export const uiGroups = message({
  ja: 'チェックボックスの組（`CheckboxGroup`・`CheckboxCard`・`Autocomplete`）は、配列でエコーされます。`input` は `name` だけなので、チェックされた値を `defaultValue` で戻します。`minChecked` は `Autocomplete` にも届きます。何も選んでいなくても残る隠した `<select multiple>` で送るので、ルールが印を付ける要素があり、失敗後のフォーカスは入力欄へ移ります。',
  en: 'A checkbox group — `CheckboxGroup`, `CheckboxCard`, `Autocomplete` — echoes as an array, and `input` carries only the `name`, so pass what was checked back as `defaultValue`. `minChecked` reaches `Autocomplete` too: it submits through a hidden `<select multiple>` that stays even with nothing selected, so the rule has an element to mark, and focus after a failure goes on to the text input.',
});

export const uiNumber = message({
  ja: '`NumberField` は整形と増減のために `type="text"` の入力を描くので、ブラウザは `min`・`max` を検査しません。範囲外の値は `NumberField` が `setCustomValidity` で知らせ、`useForm` はほかの文言と同じく出します。ただしその文言は zod ではなく `@k8ordo/ui` の辞書（`numberFieldRangeUnderflow`・`numberFieldRangeOverflow`）のもので、クライアントの文言が zod と揃わない唯一の場所です。欄を離れると範囲内に収めるので、この文言が出るのは入力のあいだだけです。`.int()` や `.multipleOf()` が丸める桁を決め、ただの `z.coerce.number()`（`step="any"`）は丸めません。JavaScript が無いと、サーバーより前に範囲を検査するものはありません。導かれた `type="number"` のまま `TextField` に広げれば、ブラウザ自身の検査とその文言が残ります。',
  en: '`NumberField` renders a `type="text"` input so it can format and step the value, and the browser does not check `min` and `max` there. `NumberField` reports an out-of-range value with `setCustomValidity`, which `useForm` shows like any other message — but in `@k8ordo/ui`\'s wording (`numberFieldRangeUnderflow` / `numberFieldRangeOverflow`), not zod\'s, the one place the client\'s text is not zod\'s own. Leaving the field clamps the value into range, so the message shows only while typing. `.int()` and `.multipleOf()` set the precision it rounds to; a plain `z.coerce.number()` (`step="any"`) is not rounded. Without JavaScript nothing checks the range before the server does; a `TextField` given the derived `type="number"` keeps the browser\'s own check, and its wording.',
});

export const uiTextarea = message({
  ja: '`Textarea` で描く欄の正規表現は `pattern` として描かれますが、`<textarea>` はそれを無視します。検査はサーバーだけで行われ、どの要素が欄を描くかを導出は知らないので、`dropped` にも載りません。',
  en: 'A regex on a field drawn as a `Textarea` reaches the markup as `pattern`, which a `<textarea>` ignores: it runs on the server only, and `dropped` cannot list it, since the derivation does not know which element renders the field.',
});

export const uiFile = message({
  ja: '`FileField` は `FileField.ItemList` に見えているファイルを送ります。一覧から外したファイルは入力からも外れ、reset で一覧も空になります。',
  en: '`FileField` submits what `FileField.ItemList` shows: removing a file there removes it from the input, and a reset empties the list with it.',
});

export const notYetTitle = message({
  ja: 'まだできないこと',
  en: 'What it does not do yet',
});

export const notYetDescription = message({
  ja: '現在のバージョンでは、次のことはできません。',
  en: 'The current version does not do the following.',
});

export const notYetFiles = message({
  ja: '1 つの欄で複数のファイルを受けること。`z.array(z.file())` は `multiple` の付いた 1 つの欄ではなく 1 ファイルずつの繰り返し行になり、`parseForm` は 1 つの名前に 1 つのファイルを期待します。',
  en: 'Several files in one control. `z.array(z.file())` derives repeated single-file rows rather than one `multiple` input, and `parseForm` expects one file per name.',
});

export const notYetTransform = message({
  ja: '`.transform()` の後ろにある制約や、出力を JSON Schema で表せない `.pipe()` の制約を導くこと。スキーマが送信される値を語らなくなるので、欄は素のテキスト欄になり `dropped` に載ります。検証はすべてサーバーで行われます。',
  en: 'Constraints behind a `.transform()`, or a `.pipe()` whose output JSON Schema cannot describe. The schema no longer says what the control submits, so the field derives as a bare text input and is listed in `dropped`; every check still runs on the server.',
});

export const notYetCustom = message({
  ja: '文字列を拒む `z.custom()` を導出時に拒否すること。中身を読めないので、テキスト欄として `dropped` に載り、サーバーで失敗します。',
  en: 'Refusing, at derive time, a `z.custom()` that rejects the strings a text control submits. Nothing about it is readable, so it derives as a text input, is listed in `dropped`, and fails on the server.',
});

export const notYetRefine = message({
  ja: '1 つの欄、ネストしたオブジェクト、繰り返し行に付けた `.refine()` / `.superRefine()` を `dropped` で報告すること。報告されるのはルートのオブジェクトのチェックの件数だけで、それ以外はクライアントに何も知らせずサーバーでだけ走ります。',
  en: "Reporting a `.refine()` / `.superRefine()` on a single field, on a nested object, or on a row in `dropped`. Only the count of the root object's checks is reported; the others run on the server without a word on the client.",
});

export const notYetRowRules = message({
  ja: '繰り返し行の中の欄を対象にしたルール。ルールの欄名はスキーマのパスで型付けされ、行の中の欄はそこに含まれません。',
  en: "Rules that target fields inside repeated rows. Rule field names are typed against the schema's paths, and row fields are not among them.",
});

export const notYetMask = message({
  ja: '入力のマスク。DOM を正とする設計でも `el.value` を書き換えれば実現できますが、キャレットの管理はフォームの結線とは別の問題です。',
  en: 'Input masking. Rewriting `el.value` on input works with the DOM as the source of truth, but managing the caret is a separate problem from wiring a form.',
});
