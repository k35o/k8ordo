import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '登壇の申し込みフォームを1つ作りながら、`@k8ordo/form`の使い方を最初から最後までたどります。フォームの制約はzodのスキーマに1度だけ書き、ブラウザでの検証もサーバーでの検証も、そのスキーマに任せます。',
  en: 'Build a form for submitting a talk, from start to finish. You write the form’s constraints once, in a zod schema, and let that schema drive validation in the browser and on the server.',
});

export const installTitle = message({
  ja: 'インストールする',
  en: 'Install',
});

export const installDescription = message({
  ja: '`@k8ordo/form`と、スキーマを書くためのzodをインストールします。',
  en: 'Install `@k8ordo/form`, and zod to write the schema with.',
});

export const zodMini = message({
  ja: 'スキーマは`zod/mini`で書いても同じように動きます。スキーマを書いたモジュールをクライアントのコードからもimportするなら、バンドルが小さく済む`zod/mini`を選んでください。',
  en: 'A schema written with `zod/mini` works the same way. If client code imports the schema module too, choose `zod/mini` for the smaller bundle.',
});

export const schemaTitle = message({
  ja: 'スキーマを書く',
  en: 'Write the schema',
});

export const schemaDescription = message({
  ja: 'まず、フォームにどんな入力欄があり、それぞれにどんな制約があるかを、zodのスキーマで書きます。',
  en: 'First, describe the form’s fields and their constraints in a zod schema.',
});

export const schemaCoerce = message({
  ja: 'フォームは、数値の入力欄の値も文字列として送ります。そのため数値の欄は`z.coerce.number()`で受け、文字列を数に変換してから検証します。',
  en: 'A form submits even a numeric field as a string, so a number field uses `z.coerce.number()`, which turns the string into a number before checking it.',
});

export const deriveTitle = message({
  ja: '入力欄の属性を作る',
  en: 'Derive the fields',
});

export const deriveDescription = message({
  ja: '次に、Server Componentで`formFields`を呼びます。スキーマから、入力欄に付ける`required`や`maxlength`などの属性と、エラーの文言が作られます。',
  en: 'Next, call `formFields` in a Server Component. From the schema it builds the attributes for each control, such as `required` and `maxlength`, along with the error messages.',
});

export const deriveJson = message({
  ja: '`formFields`の戻り値はただのJSONなので、そのままpropsとしてClient Componentに渡せます。zodを使うのはサーバー側だけで、ブラウザには届きません。',
  en: 'What `formFields` returns is plain JSON, so it goes to a Client Component as props. Only the server uses zod; it never reaches the browser.',
});

export const actionTitle = message({
  ja: '送信を受け取る',
  en: 'Receive the submission',
});

export const actionDescription = message({
  ja: '送信されたフォームは、Server Actionの中で`parseForm`に渡して検証します。',
  en: 'A submitted form is validated in a Server Action, by handing it to `parseForm`.',
});

export const actionResult = message({
  ja: '検証に通れば、`parsed.data`に型の付いた値が入ります。通らなかったときは`parsed.state`をそのまま返してください。エラーと入力していた値がフォームに戻るので、直してすぐに送り直せます。',
  en: 'When it passes, `parsed.data` holds the typed values. When it fails, return `parsed.state` as it is: the errors and what was typed go back to the form, so the person can fix them and send again.',
});

export const formTitle = message({
  ja: 'フォームを描く',
  en: 'Render the form',
});

export const formDescription = message({
  ja: '最後に、Server Actionを`useActionState`でフォームにつなぎ、返ってくるstateを`useForm`に渡します。',
  en: 'Finally, connect the Server Action to the form with `useActionState`, and pass the state it returns to `useForm`.',
});

export const formSpread = message({
  ja: '`form.props`は`<form>`に、各欄の`input`は対応する入力欄に展開します。エラーがあると`error`に入るので、入力欄のすぐ近くに表示します。',
  en: 'Spread `form.props` onto the `<form>`, and each field’s `input` onto its control. A field’s error arrives in `error`; show it right next to the control.',
});

export const formDom = message({
  ja: '入力欄を1つずつ登録する手順も、入力値を持つstateもありません。値はDOMが持っているので、キーを押すたびに再描画されることもありません。',
  en: 'There is no per-field registration and no state holding the values. The DOM keeps them, so typing never re-renders.',
});

export const tryTitle = message({
  ja: '動かしてみる',
  en: 'Try it',
});

export const tryDescription = message({
  ja: 'ここまでで作ったフォームです。このサイトには送信先のServer Actionが無いので、送信できる状態になったところで止めています。',
  en: 'The form you just built. This site has no Server Action to send it to, so it stops once the values are ready to be sent.',
});

export const trySteps = [
  message({
    ja: '何も入力せずに「申し込む」を押してみてください。最初の欄にフォーカスが移り、エラーが表示されます。',
    en: 'Press “Submit” with nothing filled in. Focus moves to the first field, and its error appears.',
  }),
  message({
    ja: '「イベントのURL」に`example`と入力して欄から離れると、URLの形式ではないというエラーが出ます。',
    en: 'Type `example` into “Event URL” and leave the field. The error says it is not a URL.',
  }),
  message({
    ja: '「長さ（分）」に`90`と入力して欄から離れると、上限の60分を超えているというエラーが出ます。',
    en: 'Type `90` into “Length (minutes)” and leave the field. The error says it is over the 60-minute limit.',
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
  en: 'Enter the event’s URL',
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

export const nextTitle = message({
  ja: '次のステップ',
  en: 'Next steps',
});

export const nextFieldTypes = message({
  ja: '数値や選択肢、チェックボックス、ファイルの入力欄を足す。',
  en: 'Add numbers, choices, checkboxes and files.',
});

export const nextErrors = message({
  ja: 'フォーム全体のエラーや、サーバーでしか分からない失敗を表示する。',
  en: 'Show errors about the whole form, and failures only the server can find.',
});

export const nextReference = message({
  ja: '`formFields`や`parseForm`が受け取るものと返すものを調べる。',
  en: 'Look up what `formFields` and `parseForm` take and return.',
});
