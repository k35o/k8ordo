import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/form`から使えるフックとコンポーネント、型の一覧です。どれもClient Componentの中で使います。サーバーで呼ぶ関数は「サーバーAPI」のページにまとめています。',
  en: 'The hooks, components and types that `@k8ordo/form` provides. Use them in Client Components; the server-side functions are under “Server API”.',
});

export const formHookSummary = message({
  ja: '`formFields`が作った入力欄の情報を、`<form>`とその中の入力欄につなぎます。',
  en: 'Wires the fields `formFields` derived to a `<form>` and its controls.',
});

export const formHookFields = message({
  ja: 'Server Componentで`formFields`を呼んだ結果です。propsで受け取ったものを、そのまま渡します。',
  en: 'What `formFields` returned in a Server Component, passed down as props as it is.',
});

export const formHookState = message({
  ja: 'Server Actionが返した`FormState`で、`useActionState`が返す1つ目の値です。送信先のアクションが無いGETのフォームでは省きます。',
  en: 'The `FormState` the Server Action returned: the first value of `useActionState`. Leave it out for a GET form with no action.',
});

export const formHookReturns = message({
  ja: '`<form>`に展開する`props`と、入力欄ごとの表示を返す関数をまとめたオブジェクト。',
  en: 'The `props` to spread onto the `<form>`, and functions that return what each field shows.',
});

export const formHookProps = message({
  ja: '`<form>`に展開するイベントハンドラ（`onSubmit`、`onBlur`、`onInput`、`onReset`）と`ref`。ほかの要素には付けません。',
  en: 'The `onSubmit`, `onBlur`, `onInput`, `onReset` and `ref` to spread onto the `<form>`, and nowhere else.',
});

export const formHookField = message({
  ja: 'パスを渡すと、その入力欄の`FieldView`を返します。入れ子の欄は`user.email`のようにドットでつなぎます。',
  en: 'Returns the `FieldView` for a path. A nested field is joined with dots, as in `user.email`.',
});

export const formHookArray = message({
  ja: '繰り返しの行を持つ配列のパスを渡すと、`ArrayView`を返します。',
  en: 'Returns the `ArrayView` for the path of an array of repeated rows.',
});

export const formHookFormError = message({
  ja: 'どの入力欄にも属さないエラーと、それを表示する要素に展開するprops。',
  en: 'The error no field owns, and the props for the element that shows it.',
});

export const formHookIsDirty = message({
  ja: 'どれかの入力欄の値が、描画したときから変わっていれば`true`。行を足したり消したりした場合も含みます。',
  en: '`true` once any control differs from the value it was rendered with. Adding or removing a row counts too.',
});

export const formHookCaveats = [
  message({
    ja: '入力された値はDOMが持っていて、Reactのstateには写しません。そのため、キーを押すたびに再描画されることはありません。',
    en: 'Values stay in the DOM and are never copied into React state, so typing never re-renders.',
  }),
  message({
    ja: '展開したあとに自分の`onSubmit`を書くと、`props.onSubmit`を上書きしてしまいます。自分の処理の中から`form.props.onSubmit(event)`を呼んでください。',
    en: 'An `onSubmit` of your own written after the spread replaces `props.onSubmit`. Call `form.props.onSubmit(event)` from yours.',
  }),
  message({
    ja: '`noValidate`はJavaScriptで付けます。サーバーが描いたHTMLには入らないので、読み込みの途中でもブラウザが入力を確かめます。',
    en: '`noValidate` is set from JavaScript and never rendered, so the browser keeps checking input while the page is still loading.',
  }),
  message({
    ja: '新しい`state`が届くと、画面の順で最初に失敗した欄へフォーカスを移します。`state`は中身と`token`で見分けるので、手で作るときは`token`も変えます。',
    en: 'When a new `state` arrives, focus moves to the first failure on the page. States are told apart by content and `token`, so a state built by hand needs a fresh `token`.',
  }),
] as const;

export const formHookExample = message({
  ja: '作り方の流れは「はじめる」を、エラーの表示の仕方は「エラーを表示する」を見てください。',
  en: 'See “Get started” for the whole flow, and “Show errors” for displaying them.',
});

export const fieldViewSummary = message({
  ja: '`form.field()`が返す、1つの入力欄の表示に必要な値です。',
  en: 'What `form.field()` returns for one field.',
});

export const fieldViewInput = message({
  ja: '入力欄に展開する属性。`name`や`type`、`required`、`maxLength`などで、送信に失敗したあとは送った値が`defaultValue`に入ります。',
  en: 'The attributes to spread onto the control: `name`, `type`, `required`, `maxLength` and so on. After a failed submission it carries the submitted value as `defaultValue`.',
});

export const fieldViewError = message({
  ja: 'いま表示するエラーの文言。ブラウザが確かめた結果か、サーバーが返したもので、無ければ`undefined`。',
  en: 'The error to show now, from the browser’s check or from the server; `undefined` when there is none.',
});

export const fieldViewInvalid = message({
  ja: '`error`があるときに`true`。`aria-invalid`などに渡します。',
  en: '`true` while there is an `error`. Pass it to `aria-invalid` and the like.',
});

export const fieldViewRequired = message({
  ja: 'スキーマが空の送信を受け付けないときに`true`。ラベルに必須の印を付けるのに使います。',
  en: '`true` when the schema rejects an empty submission. Use it for the label’s marker.',
});

export const fieldViewCaveats = [
  message({
    ja: 'サーバーのエラーは、その欄を書き換えるまで残ります。ブラウザの検査で出たエラーがあれば、そちらを優先します。',
    en: 'A server error stays until the field is edited, and an error from the browser’s check takes precedence over it.',
  }),
  message({
    ja: '`z.stringbool()`の欄だけは、`input`に送る文字列の`value`が入ります。',
    en: 'Only a `z.stringbool()` field’s `input` carries `value`, the string a checked box submits.',
  }),
] as const;

export const arrayViewSummary = message({
  ja: '`form.array()`が返す、繰り返しの行の表示に必要な値です。',
  en: 'What `form.array()` returns for repeated rows.',
});

export const arrayViewRows = message({
  ja: 'いま表示している行。1行ずつが`RowView`です。',
  en: 'The rows on screen, one `RowView` each.',
});

export const arrayViewAdd = message({
  ja: '末尾に行を1つ足します。',
  en: 'Adds a row at the end.',
});

export const arrayViewCanAdd = message({
  ja: 'スキーマの`.max()`に届いていなければ`true`。',
  en: '`true` while the schema’s `.max()` has not been reached.',
});

export const arrayViewCanRemove = message({
  ja: 'スキーマの`.min()`より多ければ`true`。',
  en: '`true` while there are more rows than the schema’s `.min()`.',
});

export const arrayViewError = message({
  ja: '配列そのもののエラー（行が多すぎる、または少なすぎる）。どの行の入力欄にも出ません。',
  en: 'The error about the array itself, too many or too few rows, which no row’s field carries.',
});

export const arrayViewErrorProps = message({
  ja: '`error`を表示する要素に展開する`id`と`tabIndex={-1}`。送信に失敗したとき、ここへフォーカスが移ります。',
  en: 'The `id` and `tabIndex={-1}` to spread onto the element that shows `error`, so focus can land there after a failed submission.',
});

export const rowViewSummary = message({
  ja: '繰り返しの1行です。',
  en: 'One repeated row.',
});

export const rowViewKey = message({
  ja: '行を見分けるための値で、`key`に渡します。行を消しても、ほかの行の`key`は変わりません。',
  en: 'The row’s identity, for `key`. Removing a row leaves the others’ keys alone.',
});

export const rowViewIndex = message({
  ja: 'いまの位置。0から数えます。',
  en: 'The row’s current position, counted from 0.',
});

export const rowViewField = message({
  ja: '行の中の入力欄のキーを渡すと、その欄の`FieldView`を返します。`name`は`items[0].name`のようになります。文字列の配列では、引数を省きます。',
  en: 'Returns the `FieldView` for a key within the row, named like `items[0].name`. For an array of scalars, call it with no argument.',
});

export const rowViewRemove = message({
  ja: 'この行を消します。',
  en: 'Removes this row.',
});

export const rowViewCaveats = [
  message({
    ja: '行の中の欄のキーは、パスと違って型で確かめません。書き間違えると、描画したときに例外を投げます。',
    en: 'Unlike paths, a key within a row is not checked by the types. A typo throws when the row renders.',
  }),
] as const;

export const formErrorViewSummary = message({
  ja: '`form.formError`の型です。スキーマ全体に付けた`.refine()`のエラーのように、どの入力欄にも属さないエラーを持ちます。',
  en: 'The shape of `form.formError`: an error no field owns, such as one from a `.refine()` on the whole schema.',
});

export const formErrorViewMessage = message({
  ja: '`state.formError`の文言。無ければ`undefined`。',
  en: 'The text of `state.formError`; `undefined` when there is none.',
});

export const formErrorViewProps = message({
  ja: '文言を表示する要素に展開する`id`と`tabIndex={-1}`。',
  en: 'The `id` and `tabIndex={-1}` to spread onto the element that shows the message.',
});

export const asyncCheckSummary = message({
  ja: '入力欄から離れたときに、その欄の値をサーバーに問い合わせます。名前がすでに使われているかどうかのように、サーバーにしか分からないことを確かめるのに使います。',
  en: 'Asks the server about one field’s value when the person leaves it — for checks only the server can answer, such as whether a name is taken.',
});

export const asyncCheckCheck = message({
  ja: '値を受け取り、表示する文言を返す関数。問題が無ければ`undefined`を返します。Server Actionをそのまま渡せます。',
  en: 'A function that takes the value and resolves to the message to show, or `undefined` when the value is fine. A Server Action fits.',
});

export const asyncCheckReturns = message({
  ja: '入力欄に展開する`props`と、問い合わせの途中かどうか。',
  en: 'The `props` to spread onto the control, and whether a check is in flight.',
});

export const asyncCheckProps = message({
  ja: '入力欄に展開する`onBlur`と`ref`。`field().input`と並べて展開します。',
  en: 'The `onBlur` and `ref` to spread onto the control, next to `field().input`.',
});

export const asyncCheckIsChecking = message({
  ja: '返事を待っている間は`true`。送信ボタンを押せないようにするのに使います。',
  en: '`true` while an answer is outstanding. Use it to disable the submit button.',
});

export const asyncCheckCaveats = [
  message({
    ja: '返事は`setCustomValidity`で欄に付くので、ほかのエラーと同じ`error`に出ます。',
    en: 'The answer is applied with `setCustomValidity`, so it arrives in the same `error` as every other message.',
  }),
  message({
    ja: '返事が前後して届いても、最後に問い合わせた値の返事だけを使います。前と同じ値のまま欄を離れても、問い合わせ直しません。',
    en: 'When answers arrive out of order, only the newest is used. Leaving the field with the value the last answer was about does not ask again.',
  }),
  message({
    ja: '欄を空にして離れると、前の返事は消えます。関数が失敗したときは何も付けず、送信後のサーバーの検証に任せます。',
    en: 'Emptying the field and leaving it clears the last answer. A rejected promise applies nothing, and the server still checks the submission.',
  }),
] as const;

export const hiddenValueSummary = message({
  ja: 'リッチテキストエディタのように`<input name>`を描かないコンポーネントの値を、フォームの送信に載せます。',
  en: 'Carries the value of a component that renders no `<input name>` — a rich text editor, say — into the form’s submission.',
});

export const hiddenValueName = message({
  ja: '送信するときの名前。スキーマでのパスと同じにします。',
  en: 'The name it submits under: the field’s path in the schema.',
});

export const hiddenValueValue = message({
  ja: '送信する値。コンポーネントのstateをそのまま渡します。',
  en: 'The value to submit: the component’s state, as it is.',
});

export const hiddenValueCaveats = [
  message({
    ja: '値が変わるたびに`input`イベントを出すので、複数の欄にまたがるルールや`isDirty`が、キー入力と同じように気づきます。',
    en: 'It fires an `input` event on every change, so cross-field rules and `isDirty` notice it like a keystroke.',
  }),
  message({
    ja: 'リセットしても値は戻りません。値は呼び出し側のstateなので、そちらも戻します。',
    en: 'A reset does not restore it: the value is the caller’s state, so reset that too.',
  }),
] as const;

export const formFieldsTypeSummary = message({
  ja: '`formFields`が返し、`useForm`が受け取る値の型です。中身はJSONなので、Server Componentからpropsで渡せます。',
  en: 'What `formFields` returns and `useForm` takes. It is JSON, so it crosses from a Server Component as props.',
});

export const formFieldsTypeFields = message({
  ja: 'パスごとの入力欄の情報。入力欄の属性と、検証ごとの文言を持ちます。',
  en: 'Each field by path, with the control’s attributes and a message per check.',
});

export const formFieldsTypeArrays = message({
  ja: 'パスごとの繰り返しの行の情報。行数の上限と下限と、1行分の入力欄を持ちます。',
  en: 'Each array of rows by path, with its bounds and the fields of one row.',
});

export const formFieldsTypeRules = message({
  ja: '`defineForm`で宣言した、複数の入力欄にまたがるルール。文言は`formFields`を呼んだ時点で決まっています。',
  en: 'The cross-field rules from `defineForm`, already worded when the fields were derived.',
});

export const formFieldsTypeDropped = message({
  ja: 'HTMLの属性で表せないため、ブラウザでは確かめない検証の一覧。サーバーでは確かめます。',
  en: 'Checks no HTML attribute can express, which the browser does not run. The server still does.',
});

export const formFieldsTypeCaveats = [
  message({
    ja: '型引数は、欄のパス、配列のパス、`z.stringbool()`の欄のパスの3つです。`formFields`の戻り値から推論されるので、ふつうは書きません。',
    en: 'Its type arguments are the field paths, the array paths, and the `z.stringbool()` field paths. They are inferred from what `formFields` returns, so you rarely write them.',
  }),
  message({
    ja: '`@k8ordo/form`と`@k8ordo/form/server`のどちらからもimportできます。',
    en: 'It can be imported from either `@k8ordo/form` or `@k8ordo/form/server`.',
  }),
] as const;
