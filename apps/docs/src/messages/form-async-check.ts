import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ユーザー名がすでに使われているかどうかのように、サーバーにしか分からない検証を1つの入力欄に付けます。結果はほかのエラーと同じ場所に表示されます。',
  en: 'Attach a check only the server can answer, such as whether a username is already taken, to one field. Its result shows where every other error does.',
});

export const attachTitle = message({
  ja: '問い合わせの付け方',
  en: 'Adding a check',
});

export const attachFunction = message({
  ja: '`useAsyncCheck`には、値を受け取って文言を返す関数を渡します。問題が無ければ`undefined`を返します。Server Actionをそのまま渡せます。',
  en: 'Pass `useAsyncCheck` a function that takes the value and resolves to a message, or to `undefined` when the value is fine. A Server Action works as it is.',
});

export const attachProps = message({
  ja: '返ってきた`props`を、`input`と並べて入力欄に展開します。',
  en: 'Spread the returned `props` onto the field, next to `input`.',
});

export const pathTitle = message({
  ja: '結果の表示',
  en: 'Showing the result',
});

export const pathValidity = message({
  ja: '`useAsyncCheck`は、サーバーの結果を`setCustomValidity`で入力欄に設定します。組み込みの検証と同じように扱われ、文言は`field()`の`error`から読めます。',
  en: '`useAsyncCheck` applies the result to the field with `setCustomValidity`. It is treated like a built-in check, and the message is read from `field()`’s `error`.',
});

export const pathSubmit = message({
  ja: '結果を待っている間は`isChecking`が`true`になります。送信ボタンの`disabled`に渡すと、結果が返るまで送信できません。',
  en: '`isChecking` is `true` while the check is running. Pass it to the submit button’s `disabled` so the form cannot be sent until the check finishes.',
});

export const timingTitle = message({
  ja: '問い合わせるタイミング',
  en: 'Check timing',
});

export const timingBlur = message({
  ja: '問い合わせるのは入力欄から離れたときだけで、キーを押すたびには問い合わせません。',
  en: 'It runs only when the field loses focus, not on every keystroke.',
});

export const timingRules = message({
  ja: 'ほかにも、次の決まりがあります。',
  en: 'A few more rules apply.',
});

export const timingSame = message({
  ja: '最後に結果を受け取った値のまま入力欄を離れても、問い合わせ直しません。',
  en: 'Leaving the field with the value of the last result does not ask again.',
});

export const timingOrder = message({
  ja: '結果の順序が入れ替わっても、最後に問い合わせた値の結果だけを使います。',
  en: 'When results arrive out of order, only the one for the newest value is used.',
});

export const timingEmpty = message({
  ja: '入力欄を空にして離れると、前の結果は消えます。',
  en: 'Emptying the field and leaving it clears the last result.',
});

export const timingFailure = message({
  ja: '問い合わせが失敗したときは、使えるとも使えないとも判定しません。',
  en: 'When the request itself fails, it applies no verdict either way.',
});

export const serverNote = message({
  ja: '問い合わせの結果は、入力中の目安です。送信までの間にほかの人が同じ名前を取ることがあるので、Server Actionの中でも確かめてください。',
  en: 'The result is only a hint while typing. Someone else may take the name before the form is sent, so check again in the Server Action.',
});

export const demoTitle = message({
  ja: '使われている名前のデモ',
  en: 'Taken name demo',
});

export const demoDescription = message({
  ja: '`admin`と`k8o`と`ordo`を使用済みとして、サーバーへの問い合わせをブラウザ内の関数で代用したデモです。',
  en: 'A demo that treats `admin`, `k8o` and `ordo` as taken and stands in for the server with a function in the browser.',
});

export const demoSteps = [
  message({
    ja: '`admin`と入力して入力欄から離れると、少し待ってから「このユーザー名はすでに使われています」と表示されます。',
    en: 'Type `admin` and leave the field. After a moment, “This username is already taken” shows.',
  }),
  message({
    ja: '結果を待っている間は「確認しています」と表示され、「登録」ボタンは押せません。',
    en: 'While it waits, “Checking” shows and the “Sign up” button cannot be pressed.',
  }),
  message({
    ja: '別の名前に変えて入力欄から離れると、エラーが消えます。',
    en: 'Change it to another name and leave the field. The error goes away.',
  }),
] as const;

export const demoLabelHandle = message({
  ja: 'ユーザー名',
  en: 'Username',
});

export const demoChecking = message({
  ja: '確認しています…',
  en: 'Checking…',
});

export const demoSubmit = message({
  ja: '登録',
  en: 'Sign up',
});

export const demoSent = message({
  ja: 'この値なら送信できます。',
  en: 'These values can be sent.',
});

export const demoTaken = message({
  ja: 'このユーザー名はすでに使われています',
  en: 'This username is already taken',
});

export const demoHandleTooShort = message({
  ja: 'ユーザー名は3文字以上にしてください',
  en: 'Use at least 3 characters',
});

export const demoHandlePattern = message({
  ja: '小文字の英字と数字、アンダースコアだけを使ってください',
  en: 'Use only lowercase letters, digits and underscores',
});
