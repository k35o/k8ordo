import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '登壇の申し込みフォームを作りながら、使い方を一通りたどります。スキーマを 1 つ書き、ブラウザとサーバーの検証をそれに任せます。',
  en: 'Build a form for submitting a talk, start to finish. You write one schema and let it drive validation in the browser and on the server.',
});

export const installTitle = message({
  ja: 'インストールする',
  en: 'Install',
});

export const installDescription = message({
  ja: '`@k8ordo/form` と zod を入れます。',
  en: 'Add `@k8ordo/form` and zod.',
});

export const peersDescription = message({
  ja: '次のパッケージを peer dependency として使います。',
  en: 'It relies on these peer dependencies:',
});

export const peerReact = message({
  ja: '`useForm` などのフック',
  en: 'The hooks, such as `useForm`',
});

export const peerReactDom = message({
  ja: 'フォームの描画',
  en: 'Rendering the form',
});

export const peerZod = message({
  ja: 'スキーマ。`zod` と `zod/mini` のどちらでも書けます',
  en: 'The schema, written with either `zod` or `zod/mini`',
});

export const peerTypes = message({
  ja: '同梱の型定義',
  en: 'The shipped type declarations',
});

export const zodMini = message({
  ja: 'スキーマは `zod/mini` で書いても同じように動きます。スキーマのモジュールをクライアントからも import するなら、バンドルが小さくなる `zod/mini` を選びます。',
  en: 'A schema written with `zod/mini` works the same way. If client code imports the schema module too, choose `zod/mini` for the smaller bundle.',
});

export const schemaTitle = message({
  ja: 'スキーマを書く',
  en: 'Write the schema',
});

export const schemaDescription = message({
  ja: 'フォームの欄と、その制約を zod で書きます。',
  en: 'Describe the fields and their constraints with zod.',
});

export const schemaCoerce = message({
  ja: 'フォームはどの値も文字列で送ります。数値の欄は `z.coerce.number()` にして、文字列を数に変えます。',
  en: 'A form submits every value as a string, so a numeric field uses `z.coerce.number()` to turn it into a number.',
});

export const deriveTitle = message({
  ja: '欄を導く',
  en: 'Derive the fields',
});

export const deriveDescription = message({
  ja: 'Server Component で `formFields` を呼び、結果をフォームに渡します。',
  en: 'Call `formFields` in a Server Component and pass the result to the form.',
});

export const deriveJson = message({
  ja: '結果はただの JSON なので、props としてクライアントへ渡せます。zod そのものはブラウザに届きません。',
  en: 'The result is plain JSON, so it crosses to the client as props. zod itself never reaches the browser.',
});

export const actionTitle = message({
  ja: '送信を受け取る',
  en: 'Receive the submission',
});

export const actionDescription = message({
  ja: 'Server Action で `parseForm` を呼びます。',
  en: 'Call `parseForm` in a Server Action.',
});

export const actionResult = message({
  ja: '成功すると、`parsed.data` に型の付いた値が入ります。失敗したら `parsed.state` をそのまま返します。エラーと入力した値がフォームに戻ります。',
  en: 'On success, `parsed.data` holds the typed values. On failure, return `parsed.state` as it is, and the errors and what was typed go back to the form.',
});

export const formTitle = message({
  ja: 'フォームを描く',
  en: 'Render the form',
});

export const formDescription = message({
  ja: 'Server Action を `useActionState` で包み、その state を `useForm` に渡します。',
  en: 'Wrap the Server Action in `useActionState` and pass its state to `useForm`.',
});

export const formSpread = message({
  ja: '`form.props` を `<form>` に、各欄の `input` を入力欄に広げます。エラーがあれば `error` に入るので、欄の近くに表示します。',
  en: 'Spread `form.props` onto the `<form>` and each field’s `input` onto its control. A field’s error is in `error`; show it next to the field.',
});

export const formDom = message({
  ja: '欄ごとの登録も、値を持つ state もありません。値は DOM が持ちます。',
  en: 'There is no per-field registration and no state holding the values. The DOM holds them.',
});

export const tryTitle = message({
  ja: '動かしてみる',
  en: 'Try it',
});

export const tryDescription = message({
  ja: 'ここまでに作ったフォームです。このサイトには Server Action が無いので、送信できる値になったところで止めています。',
  en: 'The form you just built. This site has no Server Action, so it stops once the values could be sent.',
});

export const trySteps = [
  message({
    ja: '何も入れずに「申し込む」を押します。最初の欄にフォーカスが移り、エラーが出ます。',
    en: 'Press “Submit” with nothing filled in. Focus moves to the first field and its error appears.',
  }),
  message({
    ja: '「イベントの URL」に `example` と入れて欄を離れます。URL の形ではない、というエラーが出ます。',
    en: 'Type `example` into “Event URL” and leave the field. The error says it is not a URL.',
  }),
  message({
    ja: '「長さ（分）」に `90` と入れます。上限の 60 を超えた、というエラーが出ます。',
    en: 'Type `90` into “Length (minutes)”. The error says it is over the limit of 60.',
  }),
] as const;

export const tryLabelTitle = message({
  ja: 'タイトル',
  en: 'Title',
});

export const tryLabelEventUrl = message({
  ja: 'イベントの URL',
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
  ja: 'タイトルは 120 文字までです',
  en: 'Keep the title to 120 characters',
});

export const tryErrorEventUrl = message({
  ja: 'イベントの URL を入力してください',
  en: 'Enter the event’s URL',
});

export const tryErrorMinutes = message({
  ja: '長さを分で入力してください',
  en: 'Enter the length in minutes',
});

export const tryErrorMinutesMin = message({
  ja: '5 分以上にしてください',
  en: 'Make it at least 5 minutes',
});

export const tryErrorMinutesMax = message({
  ja: '60 分以下にしてください',
  en: 'Make it 60 minutes or less',
});

export const nextTitle = message({
  ja: '次のステップ',
  en: 'Next steps',
});

export const nextFieldTypes = message({
  ja: '数値・選択肢・チェックボックス・ファイルの欄を足す。',
  en: 'Add numbers, choices, checkboxes and files.',
});

export const nextErrors = message({
  ja: 'フォーム全体のエラーや、サーバーでしか分からない失敗を表示する。',
  en: 'Show errors about the whole form, and failures only the server can find.',
});

export const nextReference = message({
  ja: '`formFields` と `parseForm` の引数と戻り値を調べる。',
  en: 'Look up what `formFields` and `parseForm` take and return.',
});
