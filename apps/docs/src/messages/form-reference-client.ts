import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'Client Componentで使う、`@k8ordo/form`のフックとコンポーネント、型の一覧です。サーバーで呼ぶ関数は「サーバーAPI」のページにあります。',
  en: 'The hooks, components and types of `@k8ordo/form` used in Client Components. The functions called on the server are on the Server API page.',
});

export const formHookSummary = message({
  ja: '`formFields`が作った入力欄の情報を、`<form>`とその中の入力欄に結び付けます。',
  en: 'Connects the fields `formFields` derived to a `<form>` and the controls inside it.',
});

export const formHookFields = message({
  ja: 'Server Componentで`formFields`を呼んだ結果。propsで受け取ったものをそのまま渡します。',
  en: 'The result of calling `formFields` in a Server Component, passed down as props.',
});

export const formHookState = message({
  ja: 'Server Actionが返した`FormState`。`useActionState`が返す1つ目の値です。アクションの無いGETのフォームでは省きます。',
  en: 'The `FormState` the Server Action returned, which is the first value `useActionState` returns. Leave it out for a GET form that has no action.',
});

export const formHookReturns = message({
  ja: '`<form>`に展開する`props`と、入力欄ごとの表示を返す関数。',
  en: 'The `props` to spread onto the `<form>`, and the functions that return what each control shows.',
});

export const formHookProps = message({
  ja: '`<form>`に展開するイベントハンドラと`ref`。ほかの要素には付けません。',
  en: 'The event handlers and `ref` to spread onto the `<form>`. Do not put them on any other element.',
});

export const formHookField = message({
  ja: 'パスを渡すと、その入力欄の`FieldView`を返します。入れ子のフィールドは`user.email`のようにドットでつなぎます。',
  en: 'Returns the `FieldView` for a path. A nested field is written with dots, as in `user.email`.',
});

export const formHookArray = message({
  ja: '繰り返し行の配列のパスを渡すと、その`ArrayView`を返します。',
  en: 'Returns the `ArrayView` for the path of an array of repeated rows.',
});

export const formHookFormError = message({
  ja: 'どの入力欄にも属さないエラーと、それを表示する要素に展開するprops。',
  en: 'The error that belongs to no field, with the props for the element that shows it.',
});

export const formHookIsDirty = message({
  ja: 'どれかの入力欄の値が描画したときから変わっていれば`true`。行の追加や削除も含みます。',
  en: '`true` once any control differs from the value it was rendered with. Adding or removing a row counts too.',
});

export const formHookCaveats = [
  message({
    ja: '入力された値はReactのstateに保存せず、DOMから読みます。キー入力のたびに再描画されることはありません。',
    en: 'Typed values are read from the DOM and never copied into React state, so typing does not re-render.',
  }),
  message({
    ja: '展開したあとに自分の`onSubmit`を書くと、`props.onSubmit`が上書きされます。自分の処理の中から`form.props.onSubmit(event)`を呼んでください。',
    en: 'An `onSubmit` written after the spread replaces `props.onSubmit`. Call `form.props.onSubmit(event)` from your own handler.',
  }),
  message({
    ja: '`noValidate`はマウント時にJavaScriptで付け、サーバーが返すHTMLには含めません。JavaScriptを読み込むまでは、ブラウザが入力を検証します。',
    en: '`noValidate` is set from JavaScript on mount and is not in the HTML the server returns. Until JavaScript loads, the browser validates the input itself.',
  }),
  message({
    ja: '新しい`state`を受け取ると、エラーのある箇所のうち画面上で最初のものへフォーカスを移します。対象は、検証に失敗した入力欄と、`formError`や配列のエラーを表示する要素です。`state`は中身と`token`で見分けるので、手で作るときは`token`も変えます。',
    en: 'When a new `state` arrives, focus moves to the first failure in page order: a failed control, or the element showing `formError` or an array’s error, whichever comes first. States are told apart by their content and `token`, so a state built by hand needs a new `token`.',
  }),
] as const;

export const formHookExampleFlow = message({
  ja: '作り方の流れは',
  en: 'For the whole flow, see ',
});

export const formHookExampleErrors = message({
  ja: 'を見てください。エラーの表示は',
  en: '. For how errors are shown, see ',
});

export const formHookExampleEnd = message({
  ja: 'を見てください。',
  en: '.',
});

export const fieldViewSummary = message({
  ja: '`form.field()`が返す、1つの入力欄の表示に使う値です。',
  en: 'What `form.field()` returns for one control.',
});

export const fieldViewInput = message({
  ja: '入力欄に展開する属性。`name`や`type`、`required`などです。送信に失敗したあとは、送った値が`defaultValue`に入ります。',
  en: 'The attributes to spread onto the control: `name`, `type`, `required` and the like. After a failed submission, the submitted value is in `defaultValue`.',
});

export const fieldViewError = message({
  ja: 'いま表示するエラー文言。ブラウザの検証かサーバーの検証の結果です。無ければ`undefined`です。',
  en: 'The error message to show now, from the browser’s check or from the server. `undefined` when there is none.',
});

export const fieldViewInvalid = message({
  ja: '`error`があるときに`true`。`aria-invalid`などに渡します。',
  en: '`true` while there is an `error`. Pass it to `aria-invalid` and the like.',
});

export const fieldViewRequired = message({
  ja: 'スキーマが空の送信を受け付けないときに`true`。ラベルに必須の印を付けるのに使います。',
  en: '`true` when the schema rejects an empty submission. Use it for the label’s required marker.',
});

export const fieldViewCaveats = [
  message({
    ja: 'サーバーのエラーは、その入力欄を書き換えるまで残ります。ブラウザの検証のエラーがあれば、そちらを優先します。',
    en: 'A server error stays until the control is edited. An error from the browser’s check takes precedence over it.',
  }),
  message({
    ja: '`z.stringbool()`の入力欄だけは、`input`に`value`が入ります。チェックしたときに送る文字列です。',
    en: 'Only a `z.stringbool()` field has `value` in its `input`: the string a checked box submits.',
  }),
] as const;

export const arrayViewSummary = message({
  ja: '`form.array()`が返す、繰り返し行の表示に使う値です。',
  en: 'What `form.array()` returns for repeated rows.',
});

export const arrayViewRows = message({
  ja: 'いま表示している行。1行ずつが`RowView`です。',
  en: 'The rows on screen, one `RowView` each.',
});

export const arrayViewAdd = message({
  ja: '末尾に行を1つ追加します。',
  en: 'Adds a row at the end.',
});

export const arrayViewCanAdd = message({
  ja: '行数がスキーマの`.max()`より少なければ`true`。',
  en: '`true` while there are fewer rows than the schema’s `.max()`.',
});

export const arrayViewCanRemove = message({
  ja: '行数がスキーマの`.min()`より多ければ`true`。',
  en: '`true` while there are more rows than the schema’s `.min()`.',
});

export const arrayViewError = message({
  ja: '配列そのもののエラー。行数が`.min()`や`.max()`に合わないときに入ります。行の入力欄には表示されません。',
  en: 'The error about the array itself, such as too many or too few rows. No row’s control shows it.',
});

export const arrayViewErrorProps = message({
  ja: '`error`を表示する要素に展開する`id`と`tabIndex={-1}`。送信に失敗したとき、この要素にフォーカスを移せるようにします。',
  en: 'The `id` and `tabIndex={-1}` to spread onto the element that shows `error`, so focus can move to it after a failed submission.',
});

export const rowViewSummary = message({
  ja: '繰り返し行の1行です。',
  en: 'One repeated row.',
});

export const rowViewKey = message({
  ja: '行を見分ける値で、`key`に渡します。行を削除しても、ほかの行の`key`は変わりません。',
  en: 'The row’s identity, for `key`. Removing a row does not change the other rows’ keys.',
});

export const rowViewIndex = message({
  ja: 'いまの位置。0から数えます。',
  en: 'The row’s current position, counted from 0.',
});

export const rowViewField = message({
  ja: '行の中の入力欄のキーを渡すと、その`FieldView`を返します。`name`は`items[0].name`の形になります。文字列などの配列では引数を省きます。',
  en: 'Returns the `FieldView` for a key within the row. Its `name` has the form `items[0].name`. For an array of scalars, call it with no argument.',
});

export const rowViewRemove = message({
  ja: 'この行を削除します。',
  en: 'Removes this row.',
});

export const rowViewCaveats = [
  message({
    ja: "行の中のキーは、パスと違って型で確かめません。書き間違えると、描画したときにエラー`[@k8ordo/form] 配列 'items' に 'nmae' がありません。`になります。",
    en: "Unlike a path, a key within a row is not checked by the types. A typo fails when the row renders, with the error `[@k8ordo/form] 配列 'items' に 'nmae' がありません。`.",
  }),
] as const;

export const formErrorViewSummary = message({
  ja: '`form.formError`の型です。スキーマ全体の`.refine()`のエラーのように、どの入力欄にも属さないエラーを持ちます。',
  en: 'The type of `form.formError`: an error that belongs to no field, such as one from a `.refine()` on the whole schema.',
});

export const formErrorViewMessage = message({
  ja: '`state.formError`の文言。無ければ`undefined`。',
  en: 'The text of `state.formError`, or `undefined` when there is none.',
});

export const formErrorViewProps = message({
  ja: '文言を表示する要素に展開する`id`と`tabIndex={-1}`。送信に失敗したとき、この要素にフォーカスを移せるようにします。',
  en: 'The `id` and `tabIndex={-1}` to spread onto the element that shows the message, so focus can move to it after a failed submission.',
});

export const asyncCheckSummary = message({
  ja: '入力欄から離れたときに、その値をサーバーに問い合わせます。名前がすでに使われていないかなど、サーバーにしか分からない検証に使います。',
  en: 'Asks the server about a control’s value when the person leaves it. Use it for a check only the server can answer, such as whether a name is already taken.',
});

export const asyncCheckCheck = message({
  ja: '値を受け取り、表示する文言を返す関数。問題が無ければ`undefined`を返します。Server Actionをそのまま渡せます。',
  en: 'A function that takes the value and resolves to the message to show, or to `undefined` when the value is fine. A Server Action can be passed as it is.',
});

export const asyncCheckReturns = message({
  ja: '入力欄に展開する`props`と、問い合わせの途中かどうか。',
  en: 'The `props` to spread onto the control, and whether a check is in progress.',
});

export const asyncCheckProps = message({
  ja: '入力欄に展開する`onBlur`と`ref`。`field().input`と並べて展開します。',
  en: 'The `onBlur` and `ref` to spread onto the control, next to `field().input`.',
});

export const asyncCheckIsChecking = message({
  ja: '結果を待っている間は`true`。送信ボタンを無効にするのに使います。',
  en: '`true` while a result is pending. Use it to disable the submit button.',
});

export const asyncCheckCaveats = [
  message({
    ja: '返された文言は`setCustomValidity`で入力欄に設定され、ほかのエラーと同じく`error`に入ります。',
    en: 'The returned message is applied with `setCustomValidity`, so it shows in the same `error` as every other message.',
  }),
  message({
    ja: '結果が前後して返っても、最後に問い合わせた値の結果だけを使います。最後に結果を受け取った値のまま入力欄を離れても、問い合わせ直しません。',
    en: 'When results arrive out of order, only the result for the latest value is used. Leaving the control with the value of the last result does not ask again.',
  }),
  message({
    ja: '入力欄を空にして離れると、前の結果は消えます。関数が失敗したときは何も付けず、送信後のサーバーの検証に任せます。',
    en: 'Emptying the control and leaving it clears the last result. When the function rejects, nothing is applied, and the server checks the submission.',
  }),
] as const;

export const hiddenValueSummary = message({
  ja: '`<input name>`を描画しないコンポーネントの値を、フォームの送信に含めます。リッチテキストエディタなどに使います。',
  en: 'Includes the value of a component that renders no `<input name>`, such as a rich text editor, in the form’s submission.',
});

export const hiddenValueName = message({
  ja: '送信するときの名前。スキーマでのパスと同じにします。',
  en: 'The name to submit under. Use the field’s path in the schema.',
});

export const hiddenValueValue = message({
  ja: '送信する値。コンポーネントのstateをそのまま渡します。',
  en: 'The value to submit: the component’s state, as it is.',
});

export const hiddenValueCaveats = [
  message({
    ja: '値が変わるたびに`input`イベントを発火するので、複数の入力欄にまたがるルールや`isDirty`がキー入力と同じように反応します。',
    en: 'It fires an `input` event on every change, so cross-field rules and `isDirty` react to it like a keystroke.',
  }),
  message({
    ja: 'リセットしても値は戻りません。値は呼び出し側のstateなので、そちらも戻してください。',
    en: 'A reset does not restore the value. It is the caller’s state, so reset that too.',
  }),
] as const;

export const formFieldsTypeSummary = message({
  ja: '`formFields`が返し、`useForm`が受け取る値の型です。中身はJSONなので、Server Componentからpropsで渡せます。',
  en: 'The type of what `formFields` returns and `useForm` takes. It is plain JSON, so a Server Component can pass it as props.',
});

export const formFieldsTypeFields = message({
  ja: 'パスごとのフィールドの情報。入力欄の属性と、検証ごとの文言を持ちます。',
  en: 'Each field by path, with the control’s attributes and a message per check.',
});

export const formFieldsTypeArrays = message({
  ja: 'パスごとの繰り返し行の情報。行数の上限と下限、1行分の入力欄を持ちます。',
  en: 'Each array of rows by path, with its row bounds and the fields of one row.',
});

export const formFieldsTypeRules = message({
  ja: '`defineForm`で宣言した、複数の入力欄にまたがるルール。文言は`formFields`を呼んだ時点で決まっています。',
  en: 'The cross-field rules declared with `defineForm`. Their messages are fixed when `formFields` runs.',
});

export const formFieldsTypeDropped = message({
  ja: 'ブラウザでは確かめない検証の一覧。HTMLの属性で表せないものが入ります。サーバーでは確かめます。',
  en: 'The checks no HTML attribute can express, which the browser skips. The server still runs them.',
});

export const formFieldsTypeCaveats = [
  message({
    ja: '型引数は3つです。フィールドのパスと配列のパス、`z.stringbool()`のフィールドのパスです。`formFields`の戻り値から推論されるので、ふつうは書きません。',
    en: 'It has three type arguments: the field paths, the array paths and the `z.stringbool()` field paths. They are inferred from what `formFields` returns, so you rarely write them.',
  }),
  message({
    ja: '`@k8ordo/form`と`@k8ordo/form/server`のどちらからもimportできます。',
    en: 'It can be imported from either `@k8ordo/form` or `@k8ordo/form/server`.',
  }),
] as const;
