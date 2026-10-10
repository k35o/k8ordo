import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ブラウザの検証で見つかったエラーも、サーバーが返したエラーも、同じ`field()`の`error`で読みます。エラーをどこに表示するかと、送信に失敗したときにフォーカスがどこへ移るかが分かります。',
  en: 'Errors from browser validation and from the server both show up in `field().error`. Learn where to show them and where focus goes when a submission fails.',
});

export const fieldTitle = message({
  ja: '入力欄のエラー',
  en: 'Field errors',
});

export const fieldCallout = message({
  ja: '`error`があるときだけ表示する',
  en: 'Rendered only while `error` is set',
});

export const fieldView = message({
  ja: '`field()`が返す値のうち、`error`にはその欄のエラーの文言が入ります。`invalid`は、エラーがあるかどうかです。',
  en: '`error` on the value `field()` returns holds the field’s message. `invalid` is whether there is one.',
});

export const fieldWhen = message({
  ja: 'エラーが出るのは、入力欄から離れたときと送信したときです。入力中に新しいエラーは出ません。表示中のエラーは、正しい値に直すと消えます。',
  en: 'An error appears when the person leaves the field or submits. No new error appears while typing, and one already shown clears once the value is fixed.',
});

export const fieldServer = message({
  ja: 'サーバーが返したエラーは、その欄を編集するまで残ります。ブラウザの検証で見つかったエラーがあれば、そちらが優先されます。',
  en: 'A server error stays until the field is edited. An error from browser validation takes precedence over it.',
});

export const wordingTitle = message({
  ja: '文言の変更',
  en: 'Changing the wording',
});

export const wordingSchema = message({
  ja: '表示される文言は、zodのエラーメッセージです。文言を変えるときは、スキーマに書きます。',
  en: 'What is shown is zod’s own message. To change it, write it in the schema.',
});

export const wordingBoth = message({
  ja: 'ブラウザの検証もサーバーの検証も同じスキーマから文言を読むので、どちらで見つかっても同じ文言になります。',
  en: 'The browser and the server both read the message from the same schema, so the wording is the same whichever side finds the error.',
});

export const translationTitle = message({
  ja: '文言の翻訳',
  en: 'Translated wording',
});

export const translationFunction = message({
  ja: '文言は、文字列にせず関数のままzodに渡します。zodはエラーを報告するときに関数を呼ぶので、そのときのロケールの文言になります。`m.talk.titleMissing`のような文言の書き方は',
  en: 'Hand zod the message as a function, not as the string it returns. zod calls it when it reports the error, so the wording follows the locale at that moment. Writing a message such as `m.talk.titleMissing` is covered in ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const translationRule = message({
  ja: "`defineForm`のルールにも、`requiredWhen('reason', 'status', 'rejected', m.talk.reasonRequired)`のように関数を渡せます。",
  en: "`defineForm` rules take a function too, as in `requiredWhen('reason', 'status', 'rejected', m.talk.reasonRequired)`.",
});

export const translationTop = message({
  ja: '`formFields`は、描画の中で呼びます。モジュールのトップレベルで呼ぶと、最初に読み込んだときのロケールで文言が固定されます。',
  en: 'Call `formFields` during the render. Called at module scope, the messages stay in whatever locale was active when the module first loaded.',
});

export const translationAction = message({
  ja: 'Server Actionで`parseForm`を呼ぶときのロケールの決まり方は',
  en: 'How the locale is set when a Server Action calls `parseForm` is covered in ',
});

export const focusTitle = message({
  ja: '失敗した欄へのフォーカス',
  en: 'Focus on the failed field',
});

export const focusAuto = message({
  ja: '送信に失敗すると、ページで最初に失敗した入力欄へフォーカスが移ります。このために書くコードはありません。',
  en: 'When a submission fails, focus moves to the first failed field on the page. There is nothing to write for this.',
});

export const focusOrder = message({
  ja: '「最初」は、ページに並んでいる順です。スキーマに書いたキーの順ではありません。',
  en: '“First” means document order, not the order of the schema’s keys.',
});

export const focusPitfall = message({
  ja: '自分で組み立てたstateを返すときは、新しい`token`を入れます。`token`が同じだと、同じ内容の失敗が2回続いたときに同じ結果とみなされ、フォーカスが移りません。',
  en: 'A state you build by hand needs a fresh `token`. With the same `token`, two identical failures in a row read as the same result, and focus does not move.',
});

export const formErrorTitle = message({
  ja: 'フォーム全体のエラー',
  en: 'Form-level errors',
});

export const formErrorCallout = message({
  ja: '`id`と`tabIndex={-1}`が付く',
  en: 'Adds an `id` and `tabIndex={-1}`',
});

export const formErrorWhere = message({
  ja: 'どの入力欄にも属さないエラーは、`form.formError`に入ります。`path`を指定せずにスキーマ全体に付けた`.refine()`のエラーがその例です。',
  en: 'An error that belongs to no field goes to `form.formError`. A `.refine()` on the whole schema with no `path` is one example.',
});

export const formErrorProps = message({
  ja: '表示する要素には`formError.props`を展開します。要素がフォーカスを受け取れるようになるので、フォーカスが移るとスクリーンリーダーがエラーを読み上げます。',
  en: 'Spread `formError.props` onto the element that shows it. The element can then take focus, so a screen reader announces the error.',
});

export const formErrorPlace = message({
  ja: '表示する場所は、入力欄より上にします。入力欄も失敗したときは先にこちらへフォーカスが移り、Tabキーで入力欄へ進めます。',
  en: 'Place it above the fields. When fields failed too, focus lands here first, and Tab moves on to the fields.',
});

export const serverTitle = message({
  ja: 'サーバーで見つかる失敗',
  en: 'Failures found on the server',
});

export const serverCallout = message({
  ja: '入力欄の名前をキーにして文言を足す',
  en: 'Add the message under the field’s name',
});

export const serverState = message({
  ja: 'タイトルがすでに使われている、といった失敗はデータベースを見るまで分かりません。`parseForm`を通ったあとに見つけた失敗は、`parsed.state`にエラーを足して返します。',
  en: 'Some failures, such as a title that is already taken, can only be found by checking the database. When you find one after `parseForm` succeeds, add the error to `parsed.state` and return it.',
});

export const serverEcho = message({
  ja: '`parsed.state`には、入力された値と新しい`token`が入っています。値は入力欄に戻ります。',
  en: '`parsed.state` already holds the submitted values and a fresh `token`, so the values come back into the fields.',
});

export const demoTitle = message({
  ja: 'エラーのデモ',
  en: 'Error demo',
});

export const demoDescription = message({
  ja: 'ハンドルとパスワードを登録するフォームで、文言はすべてページのスキーマから作っています。',
  en: 'A sign-up form with a handle and a password, with every message taken from the page’s schema.',
});

export const demoSteps = [
  message({
    ja: 'ハンドルに`ab`と入力して欄から離れると、3文字以上にするよう求めるエラーが出ます。',
    en: 'Type `ab` as the handle and leave the field. The error asks for at least 3 characters.',
  }),
  message({
    ja: '確認用のパスワードを違う値にすると、一致しないというエラーが出ます。',
    en: 'Make the confirmation different from the password. The error says they do not match.',
  }),
  message({
    ja: '空の欄を残したまま「登録」を押すと、最初に失敗した欄へフォーカスが移ります。',
    en: 'Leave a field empty and press “Sign up”. Focus moves to the first field that failed.',
  }),
] as const;

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

export const demoSubmit = message({
  ja: '登録',
  en: 'Sign up',
});

export const demoSent = message({
  ja: 'この値なら送信できます。',
  en: 'These values can be sent.',
});

export const demoHandleTooShort = message({
  ja: 'ハンドルは3文字以上にしてください',
  en: 'Use at least 3 characters for the handle',
});

export const demoHandleTooLong = message({
  ja: 'ハンドルは20文字までです',
  en: 'Keep the handle to 20 characters',
});

export const demoHandlePattern = message({
  ja: '小文字の英字、数字、アンダースコアだけを使ってください',
  en: 'Use only lowercase letters, digits and underscores',
});

export const demoPasswordTooShort = message({
  ja: 'パスワードは8文字以上にしてください',
  en: 'Use at least 8 characters for the password',
});

export const demoMismatch = message({
  ja: 'パスワードが一致しません',
  en: 'The passwords do not match',
});
