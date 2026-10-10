import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '登壇の申し込みフォームを例に、zodのスキーマを1つ書き、入力欄の属性とサーバーでの検証をそこから作ります。',
  en: 'Build a talk submission form: write one zod schema, then derive the input attributes and the server-side validation from it.',
});

export const installTitle = message({
  ja: 'インストール',
  en: 'Install',
});

export const serverOnly = message({
  ja: 'スキーマを読む`formFields`と`parseForm`はサーバーで動き、`useForm`はClient Componentで動きます。',
  en: '`formFields` and `parseForm` read the schema on the server, and `useForm` runs in a Client Component.',
});

export const zodMini = message({
  ja: 'スキーマは`zod/mini`で書いても同じように動きます。クライアントのコードもスキーマのモジュールをimportするなら、バンドルの小さい`zod/mini`を選んでください。',
  en: 'A schema written with `zod/mini` works the same way. If client code imports the schema module too, choose `zod/mini` for the smaller bundle.',
});

export const schemaTitle = message({
  ja: 'スキーマの定義',
  en: 'Defining the schema',
});

export const schemaFields = message({
  ja: 'フォームの入力欄と、それぞれの制約をzodのスキーマに書きます。`min`や`url`に渡した文言は、そのままエラーの表示に使われます。',
  en: 'Describe the form’s fields and their constraints in a zod schema. The wording passed to `min` or `url` is what the error shows.',
});

export const schemaCoerce = message({
  ja: 'フォームは数値の入力欄の値も文字列として送ります。数値の入力欄は`z.coerce.number()`で定義し、文字列を数値に変換してから検証します。',
  en: 'A form submits every value as a string, numbers included. Declare a number field with `z.coerce.number()` so the string is converted before it is checked.',
});

export const deriveTitle = message({
  ja: '入力欄の属性',
  en: 'Input attributes',
});

export const deriveCallout = message({
  ja: 'モジュールスコープで1回だけ作る',
  en: 'Built once, at module scope',
});

export const deriveFields = message({
  ja: 'Server Componentで`formFields`にスキーマを渡します。入力欄に付ける`required`や`maxlength`などの属性と、エラーの文言が作られます。',
  en: 'Hand the schema to `formFields` in a Server Component. It builds the attributes for each input, such as `required` and `maxlength`, along with the error messages.',
});

export const deriveJson = message({
  ja: '戻り値はJSONなので、propsとしてClient Componentに渡せます。zodはブラウザのバンドルに入りません。',
  en: 'The result is plain JSON, so it can go to a Client Component as props. zod stays out of the browser bundle.',
});

export const actionTitle = message({
  ja: '送信の検証',
  en: 'Validating the submission',
});

export const actionParse = message({
  ja: '送信はServer Actionで受け取り、`parseForm`に同じスキーマと`formData`を渡します。',
  en: 'A Server Action receives the submission and hands the same schema and the `formData` to `parseForm`.',
});

export const actionResult = message({
  ja: '検証に通ると、`parsed.data`に型の付いた値が入ります。通らないときは`parsed.state`を返します。エラーと入力した値がフォームに戻り、最初にエラーになった入力欄にフォーカスが移ります。',
  en: 'When it passes, `parsed.data` holds the typed values. When it fails, return `parsed.state`. The errors and the values the user entered go back to the form, and focus moves to the first field with an error.',
});

export const actionRedirectBefore = message({
  ja: '保存のあとの移動は`@k8ordo/framework/server`の`redirect()`で行います。詳しくは',
  en: 'After saving, move on with `redirect()` from `@k8ordo/framework/server`. See ',
});

export const actionRedirectAfter = message({
  ja: 'を見てください。',
  en: '.',
});

export const formTitle = message({
  ja: 'フォームの描画',
  en: 'Rendering the form',
});

export const formHookCallout = message({
  ja: '入力欄の属性と、Server Actionが返したstate',
  en: 'The derived fields and the state the Server Action returned',
});

export const formPropsCallout = message({
  ja: '`<form>`にだけ展開する',
  en: 'Spread onto the `<form>` only',
});

export const formHook = message({
  ja: '`useActionState`にServer Actionを渡します。返ってくる`state`と、propsの`fields`を`useForm`に渡します。',
  en: 'Pass the Server Action to `useActionState`. Then pass the `state` it returns and the `fields` prop to `useForm`.',
});

export const formSpread = message({
  ja: '`form.props`は`<form>`に、各欄の`input`は対応する入力欄に展開します。エラーは`error`に入るので、入力欄のすぐ近くに表示します。',
  en: 'Spread `form.props` onto the `<form>`, and each field’s `input` onto its control. The error is in `error`; show it right next to the control.',
});

export const formDom = message({
  ja: '入力した値はReactのstateで管理しないので、キーを押すたびに再描画されることはありません。入力欄を1つずつ登録する手順もありません。',
  en: 'The typed values are not kept in React state, so typing never re-renders the form. There is no per-field registration either.',
});

export const tryTitle = message({
  ja: '申し込みのデモ',
  en: 'Talk form demo',
});

export const tryDescription = message({
  ja: 'ここまでで作ったフォームです。送信先が無いので、送信できる値になった時点で止まります。',
  en: 'The form built above. With nowhere to send it, it stops once the values are valid.',
});

export const trySteps = [
  message({
    ja: '何も入力せずに「申し込む」を押します。最初の欄にフォーカスが移り、エラーが表示されます。',
    en: 'Press “Submit” with nothing filled in. Focus moves to the first field, and each field’s error appears.',
  }),
  message({
    ja: '「イベントのURL」に`example`と入力して欄から離れます。「イベントのURLを入力してください」と表示されます。',
    en: 'Type `example` into “Event URL” and leave the field. “Enter the event URL” appears.',
  }),
  message({
    ja: '「長さ（分）」に`90`と入力して欄から離れます。「60分以下にしてください」と表示されます。',
    en: 'Type `90` into “Length (minutes)” and leave the field. “Make it 60 minutes or less” appears.',
  }),
] as const;

export const tryLabelTitle = message({
  ja: 'タイトル',
  en: 'Title',
});

export const tryLabelEventUrl = message({
  ja: 'イベントのURL',
  en: 'Event URL',
});

export const tryLabelMinutes = message({
  ja: '長さ（分）',
  en: 'Length (minutes)',
});

export const trySubmit = message({
  ja: '申し込む',
  en: 'Submit',
});

export const trySent = message({
  ja: 'この値なら送信できます。',
  en: 'These values can be sent.',
});

export const tryErrorTitle = message({
  ja: 'タイトルを入力してください',
  en: 'Enter a title',
});

export const tryErrorTitleLong = message({
  ja: 'タイトルは120文字までです',
  en: 'Keep the title to 120 characters',
});

export const tryErrorEventUrl = message({
  ja: 'イベントのURLを入力してください',
  en: 'Enter the event URL',
});

export const tryErrorMinutes = message({
  ja: '長さを分で入力してください',
  en: 'Enter the length in minutes',
});

export const tryErrorMinutesMin = message({
  ja: '5分以上にしてください',
  en: 'Make it at least 5 minutes',
});

export const tryErrorMinutesMax = message({
  ja: '60分以下にしてください',
  en: 'Make it 60 minutes or less',
});
