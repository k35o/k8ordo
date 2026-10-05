import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ユーザー名がすでに使われているかどうかは、サーバーに問い合わせないと分かりません。送信してから知らせるより、入力欄を離れた時点で知らせたほうが、直す手間が少なく済みます。`useAsyncCheck`は、この問い合わせを1つの入力欄に付けます。',
  en: 'Whether a username is already taken is something only the server knows. Telling the person when they leave the field, rather than after they submit, saves them a round of fixing. `useAsyncCheck` attaches that question to one field.',
});

export const attachTitle = message({
  ja: '入力欄に問い合わせを付ける',
  en: 'Attach a check to a field',
});

export const attachDescription = message({
  ja: '`useAsyncCheck`に、値を受け取って文言を返す関数を渡します。問題が無ければ`undefined`を返します。返ってきた`props`は、`input`と並べて入力欄に展開します。',
  en: 'Pass `useAsyncCheck` a function that takes the value and resolves to a message, or to `undefined` when the value is fine. Spread the `props` it returns onto the field, next to `input`.',
});

export const attachAction = message({
  ja: '問い合わせる関数には、Server Actionをそのまま使えます。',
  en: 'A Server Action works as the function as it is.',
});

export const pathTitle = message({
  ja: 'ほかのエラーと同じ場所に出る',
  en: 'The answer arrives like any other error',
});

export const pathDescription = message({
  ja: 'サーバーの返事は、`setCustomValidity`で入力欄に付けます。そのため組み込みの検証と同じように扱われ、文言は`field()`の`error`に届きます。表示のために別の仕組みを用意する必要はありません。',
  en: 'The answer is applied to the field with `setCustomValidity`, so it is treated like a built-in check and its message arrives in `field()`’s `error`. Nothing separate is needed to show it.',
});

export const pathSubmit = message({
  ja: '返事を待っている間は`isChecking`が`true`になります。送信ボタンを押せないようにしておけば、答えが出る前に送られることはありません。',
  en: '`isChecking` is `true` while an answer is outstanding. Disable the submit button with it, and nothing is sent before the answer is in.',
});

export const timingTitle = message({
  ja: '問い合わせるタイミング',
  en: 'When it asks',
});

export const timingDescription = message({
  ja: '問い合わせるのは、入力欄から離れたときだけです。キーを押すたびにサーバーへ問い合わせることはありません。',
  en: 'It asks only when the person leaves the field, never on every keystroke.',
});

export const timingRules = message({
  ja: 'ほかにも、無駄な問い合わせや古い返事を避けるための決まりがあります。',
  en: 'A few more rules keep it from asking needlessly or showing a stale answer.',
});

export const timingSame = message({
  ja: '前回の返事と同じ値のまま入力欄を離れても、問い合わせ直しません。',
  en: 'Leaving the field with the same value the last answer was about does not ask again.',
});

export const timingOrder = message({
  ja: '返事が前後して届いても、最後に問い合わせた値の返事だけを使います。',
  en: 'When answers arrive out of order, only the one for the newest value is used.',
});

export const timingEmpty = message({
  ja: '入力欄を空にして離れると、前の返事は消えます。',
  en: 'Emptying the field and leaving it clears the last answer.',
});

export const timingFailure = message({
  ja: '問い合わせ自体が失敗したときは、何も表示しません。送信されたあとに、サーバーが改めて検証します。',
  en: 'When the request itself fails, nothing is shown; the server still checks the submission.',
});

export const serverNote = message({
  ja: '問い合わせの結果は、あくまで入力中の案内です。名前は送信までの間にほかの人に取られることもあるので、Server Actionの中でも必ず確かめてください。',
  en: 'The answer is only guidance while typing: the name may be taken by someone else before the form is sent, so check again in the Server Action.',
});

export const demoTitle = message({
  ja: '使われている名前を試す',
  en: 'Try a taken name',
});

export const demoDescription = message({
  ja: 'このデモでは、サーバーへの問い合わせをブラウザの中の関数で置き換えています。`admin`、`k8o`、`ordo`が使用済みです。',
  en: 'This demo stands in for the server with a function in the browser. `admin`, `k8o` and `ordo` are taken.',
});

export const demoSteps = [
  message({
    ja: '`admin`と入力して入力欄から離れると、少し待ったあとに使われているというエラーが出ます。',
    en: 'Type `admin` and leave the field. After a moment, the error says it is taken.',
  }),
  message({
    ja: '返事を待っている間は、「確認しています」と表示され、「登録」ボタンは押せません。',
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
