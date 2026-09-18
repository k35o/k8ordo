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
  ja: '送信に失敗すると、`useForm` は `state.errors` の先頭の欄にフォーカスを移しますが、隠れたステップの欄はフォーカスを受け取れません。新しい結果が届いたら、描画の中で先頭のエラーを含むステップに戻します。',
  en: 'After a failed submission, `useForm` moves focus to the first field in `state.errors`, but a field in a hidden step cannot take focus. When a new result arrives, switch during render to the step that holds the first error.',
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
  ja: '`@k8ordo/form` は `@k8ordo/ui` に依存しません。属性は入力要素に、エラーは `FormControl` に渡します。`FormControl` は `id` と `aria-*` の結び付けを自分で作るので、渡すのは `label`・`errorText`・`invalid`・`required` だけです。',
  en: '`@k8ordo/form` does not depend on `@k8ordo/ui`. The attributes go to the input and the error to `FormControl`, which generates the `id` and the `aria-*` links itself, so it needs only `label`, `errorText`, `invalid` and `required`.',
});

export const uiTextField = message({
  ja: '`TextField` が受け付ける `type` は `text`・`email`・`tel`・`url`・`search` だけで、`input.type` は `string` なので、そのまま広げると型エラーになります。`type` を外して残りを広げ、`type` は自分で書きます。',
  en: '`TextField` accepts only `text`, `email`, `tel`, `url` and `search` as its `type`, while `input.type` is a `string`, so spreading it as it is fails to type-check. Take `type` out, spread the rest, and write `type` yourself.',
});

export const uiPassword = message({
  ja: '`PasswordInput` は表示を切り替えるために `type` を自分で書き換えます。導かれた `type` を広げると切り替えが効かなくなり、しかも型エラーにはならないので、必ず外します。`<textarea>` にも `type` 属性は無いので、`Textarea` でも外します。',
  en: '`PasswordInput` sets `type` itself to show and hide the password. Spreading the derived `type` breaks the toggle, and the compiler does not catch it, so always take it out. A `<textarea>` has no `type` attribute either, so take it out for `Textarea` too.',
});

export const uiSelect = message({
  ja: '`z.enum()` から導かれた `input` は `type` を持たないので、`Select` にはそのまま広げられます。選択肢は `options` で渡します。',
  en: 'The `input` derived from `z.enum()` has no `type`, so it spreads onto `Select` as it is. The choices go in `options`.',
});

export const uiNumber = message({
  ja: '`NumberField` は空欄なら `\'\'` を送り、`required` も中の入力要素に渡すので、空の数値欄を未入力として扱う約束も、導かれた `required` も働きます。それでも導かれた `input` はそのままでは広げられません。送信に失敗したあとに入る `defaultValue` は文字列で、`min`・`max`・`step` の型も数値だけではないのに、`NumberField` は数値しか受け取らないからです。しかも `type="text"` の入力を描くので、ブラウザは `min`・`max`・`step` を検査しません。数値には素の `<input>` に属性を広げます。',
  en: '`NumberField` submits `\'\'` when it is empty and passes `required` on to its input, so both the rule that a blank numeric field means nothing entered and the derived `required` hold. The derived `input` still does not spread onto it: the `defaultValue` a failed submit echoes back is a string, and `min`, `max` and `step` are not typed as plain numbers, while `NumberField` takes numbers only. It also renders a `type="text"` input, so the browser checks none of `min`, `max` and `step`. For a number, spread the attributes onto a plain `<input>`.',
});

export const uiOthers = message({
  ja: 'この節で扱ったのは `TextField`・`PasswordInput`・`Textarea`・`Select`・`NumberField` だけです。チェックボックス、ラジオボタン、ファイルは、フィールドのページにある素の要素で描きます。たとえば `Radio` は `required` を中の入力要素に渡しません。',
  en: 'This section covers only `TextField`, `PasswordInput`, `Textarea`, `Select` and `NumberField`. Render checkboxes, radio groups and files with the plain elements shown on the Fields page; `Radio`, for one, does not pass `required` on to its inputs.',
});

export const uiFieldsLink = message({
  ja: 'チェックボックス・ラジオボタン・ファイルの描き方（フィールド）',
  en: 'Checkboxes, radio groups and files on the Fields page',
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
