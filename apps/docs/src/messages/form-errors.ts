import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ブラウザの検査で見つかった失敗も、サーバーからの返事も、同じ`error`に届きます。どこに表示するかと、失敗したときのフォーカスの動きを扱います。',
  en: 'A failure the browser finds and one the server returns both arrive in the same `error`. This page covers where to show them and where focus goes.',
});

export const fieldTitle = message({
  ja: '欄にエラーを表示する',
  en: 'Show an error on its field',
});

export const fieldDescription = message({
  ja: '`field()`は、その欄のエラーを`error`に、失敗しているかを`invalid`に持ちます。',
  en: '`field()` returns the field’s error in `error`, and whether it failed in `invalid`.',
});

export const fieldWhen = message({
  ja: 'エラーは、欄を離れたときと送信したときに出ます。直して入力し直すと消えます。',
  en: 'An error appears when the person leaves the field or submits, and clears once they fix the value.',
});

export const wordingTitle = message({
  ja: '文言を変える',
  en: 'Change the wording',
});

export const wordingDescription = message({
  ja: '表示される文言は、zodが出すメッセージそのものです。変えるときは、スキーマに書きます。',
  en: 'What is shown is zod’s own message. To change it, write it in the schema.',
});

export const wordingBoth = message({
  ja: 'ブラウザでの検査もサーバーでの検証も同じスキーマから文言を取るので、両側で同じ言葉になります。',
  en: 'The browser and the server both take the message from the same schema, so the two sides always say the same thing.',
});

export const wordingLocale = message({
  ja: 'リクエストのロケールに合わせるなら、文言を関数で渡し、`formFields`を描画の中で呼びます。モジュールスコープで呼ぶと、最初の1回のロケールで固定されます。',
  en: 'To follow the request’s locale, pass the message as a function and call `formFields` during the render. Called at module scope, it is fixed to whichever locale ran first.',
});

export const focusTitle = message({
  ja: '失敗した欄にフォーカスを移す',
  en: 'Move focus to the failure',
});

export const focusDescription = message({
  ja: '送信が失敗すると、ページの中で最初に失敗した欄にフォーカスが移ります。書くコードはありません。',
  en: 'When a submission fails, focus moves to the first failed field on the page. There is nothing to write.',
});

export const focusOrder = message({
  ja: '「最初」は文書の並び順です。スキーマのキーの順ではありません。',
  en: '“First” means document order, not the order of the schema’s keys.',
});

export const focusPitfall = message({
  ja: '自分で組み立てたstateを返すときは、新しい`token`を入れます。同じ内容の失敗が2度続くと、`token`が無ければ同じ返事とみなされ、フォーカスが移りません。',
  en: 'When you build a state by hand, give it a new `token`. Without one, two identical failures in a row read as the same response, and focus does not move.',
});

export const formErrorTitle = message({
  ja: 'フォーム全体のエラーを表示する',
  en: 'Show an error about the whole form',
});

export const formErrorDescription = message({
  ja: 'どの欄にも属さない失敗は`form.formError`に入ります。たとえば、`path`を指定していないスキーマ全体の`.refine()`です。',
  en: 'A failure that belongs to no field goes to `form.formError` — for example, a `.refine()` on the whole schema with no `path`.',
});

export const formErrorProps = message({
  ja: '表示する要素に`formError.props`を広げます。フォーカスを受け取れるようになり、読み上げにも伝わります。',
  en: 'Spread `formError.props` onto the element that shows it. That lets it take focus, so a screen reader announces it.',
});

export const formErrorPlace = message({
  ja: '欄より上に置きます。欄の失敗と同時に起きても、こちらに先にフォーカスが移ります。',
  en: 'Place it above the fields. If fields failed too, focus lands here first.',
});

export const serverTitle = message({
  ja: 'サーバーでしか分からない失敗を返す',
  en: 'Return a failure only the server can find',
});

export const serverDescription = message({
  ja: 'タイトルがすでに使われている、のような失敗は、データベースを見るまで分かりません。`parseForm`が成功したあとに見つけたら、`parsed.state`にエラーを足して返します。',
  en: 'Some failures, such as a title that is already taken, only show up once you look in the database. When you find one after `parseForm` succeeds, add the error to `parsed.state` and return it.',
});

export const serverState = message({
  ja: '`parsed.state`には、入力した値と新しい`token`が入っています。そのため値は欄に戻り、フォーカスもその欄に移ります。',
  en: '`parsed.state` already holds what was typed and a fresh `token`, so the values come back and focus moves to that field.',
});

export const demoTitle = message({
  ja: 'エラーの出方を試す',
  en: 'See how errors appear',
});

export const demoDescription = message({
  ja: 'ハンドルとパスワードの登録フォームです。どの文言も、ページのスキーマから導いています。',
  en: 'A sign-up form with a handle and a password. Every message comes from the page’s schema.',
});

export const demoSteps = [
  message({
    ja: 'ハンドルに`ab`と入れて欄を離れます。3文字以上、というエラーが出ます。',
    en: 'Type `ab` as the handle and leave the field. The error asks for at least 3 characters.',
  }),
  message({
    ja: '確認用のパスワードを違う値にします。一致しない、というエラーが出ます。',
    en: 'Make the confirmation different from the password. The error says they do not match.',
  }),
  message({
    ja: '空の欄を残したまま「登録」を押します。最初に失敗した欄にフォーカスが移ります。',
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
