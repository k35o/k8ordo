import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '入力欄が多いフォームは、いくつかのステップに分けると入力しやすくなります。`@k8ordo/form`では値をDOMが持つので、ステップごとに値を受け渡す仕組みは要りません。すべてのステップを描いたまま、いま表示しないものを隠すだけで作れます。',
  en: 'A long form is easier to fill in when split into steps. Since `@k8ordo/form` keeps the values in the DOM, nothing has to carry them from step to step: render every step, and hide the ones not in view.',
});

export const keepTitle = message({
  ja: 'すべてのステップを描いたまま隠す',
  en: 'Keep every step rendered, and hide the rest',
});

export const keepDescription = message({
  ja: 'ステップごとに`<fieldset>`で囲み、いまのステップ以外に`hidden`を付けます。隠れたステップの入力欄もDOMに残るので、ステップを行き来しても値は消えず、送信も最後に1回で済みます。',
  en: 'Wrap each step in a `<fieldset>` and mark every step but the current one `hidden`. The hidden steps’ fields stay in the DOM, so moving between steps loses nothing and the form is sent once, at the end.',
});

export const keepHydrated = message({
  ja: 'ステップを隠すのは、ハイドレーションが終わってからにします。サーバーが描いたHTMLの時点で隠してしまうと、JavaScriptが無い環境では後のステップにたどり着けません。',
  en: 'Hide steps only once hydrated. Hidden in the server’s HTML, the later steps would be out of reach without JavaScript.',
});

export const keepNoJs = message({
  ja: '隠さずにおけば、JavaScriptが無いときは1枚の長いフォームになり、1回のリクエストで送信されます。これは壊れているのではなく、正しい動きです。',
  en: 'Left visible, the form degrades to one long page that submits in a single request without JavaScript. That is the correct behaviour, not a broken one.',
});

export const validateTitle = message({
  ja: '次へ進む前に、いまのステップを確かめる',
  en: 'Check the current step before moving on',
});

export const validateDescription = message({
  ja: '次へ進む前に、いまのステップの中にある入力欄だけを`checkValidity()`で確かめます。まだ入力していない後のステップまで含めて確かめると、必ず失敗するからです。',
  en: 'Before moving on, check only the controls inside the current step with `checkValidity()`. The later steps are not filled in yet, so checking the whole form would always fail.',
});

export const validateFocus = message({
  ja: '`useForm`がエラーを表示するのは、入力欄から離れたときです。失敗した入力欄にフォーカスを移しておけば、その欄を離れたときにエラーが表示されます。',
  en: '`useForm` shows an error when the person leaves a field. Move focus to the first failed field, and its error appears once they leave it.',
});

export const submitTitle = message({
  ja: '送信ボタンは最後のステップにだけ描く',
  en: 'Render the submit button on the last step only',
});

export const submitDescription = message({
  ja: 'ハイドレーションが終わったら、送信ボタンは最後のステップにだけ描きます。',
  en: 'Once hydrated, render the submit button on the last step only.',
});

export const submitEnter = message({
  ja: 'テキストの入力欄でEnterキーを押すと、ブラウザはフォームの最初の送信ボタンが押されたものとして扱います。そのボタンが隠れたステップにあっても送信されてしまい、ステップごとの確認を飛ばしてフォーム全体が送られます。',
  en: 'Enter in a text field clicks the form’s first submit button, even when it sits in a hidden step. The whole form would be sent from an earlier step, skipping the per-step check.',
});

export const errorsTitle = message({
  ja: '送信に失敗したら、エラーのあるステップへ戻す',
  en: 'Return to the step holding the error',
});

export const errorsDescription = message({
  ja: '送信に失敗すると、`useForm`はページの中で最初に失敗した入力欄へフォーカスを移します。ただし、隠れたステップの入力欄はフォーカスを受け取れません。',
  en: 'After a failed submission `useForm` moves focus to the first failed field on the page, but a field inside a hidden step cannot take focus.',
});

export const errorsSwitch = message({
  ja: 'そこで新しいstateが届いたら、`state.errors`のキーを持つステップのうち最も前のものへ、描画の中で切り替えます。フォーカスが移る前に入力欄が表示されるので、エラーのある欄にフォーカスが届きます。',
  en: 'When a new state arrives, switch during render to the earliest step holding a key of `state.errors`. The field is visible by the time focus moves, so focus reaches it.',
});

export const errorsBrowser = message({
  ja: '送信のときのブラウザでの検証は、隠れたステップの入力欄も対象にします。そこで失敗すると、エラーを見せられないまま送信が止まります。ステップごとに確かめてから進めば、前のステップが最後になって失敗することはありません。',
  en: 'The browser-side check on submit covers the hidden steps too, and stops the submission for a failure there without being able to show it. Checking each step before moving on is what keeps the earlier steps from failing at the end.',
});

export const demoTitle = message({
  ja: '2ステップの申し込みフォームを試す',
  en: 'Try a two-step form',
});

export const demoDescription = message({
  ja: '1ステップ目で連絡先を、2ステップ目で登壇の内容を入力します。どちらのステップも同じ`<form>`の中にあります。',
  en: 'The first step asks for contact details, the second for the talk. Both steps live in the same `<form>`.',
});

export const demoSteps = [
  message({
    ja: '名前を空のまま「次へ」を押すと、先へは進まず、名前の入力欄にフォーカスが移ります。',
    en: 'Press “Next” with the name empty. The form stays on the step and focus moves to the name.',
  }),
  message({
    ja: '1ステップ目を埋めて進み、「戻る」を押すと、入力した値がそのまま残っています。',
    en: 'Fill the first step, move on, and press “Back”. What you typed is still there.',
  }),
  message({
    ja: '2ステップ目の長さに`90`と入力して「申し込む」を押すと、送信が止まり、エラーが表示されます。',
    en: 'Type `90` as the length on the second step and press “Submit”. The submission stops and the error shows.',
  }),
] as const;

export const demoProgress = message({
  ja: (step: number) => `ステップ${String(step)} / 2`,
  en: (step) => `Step ${String(step)} of 2`,
});

export const demoStepOne = message({
  ja: '連絡先',
  en: 'Contact',
});

export const demoStepTwo = message({
  ja: '登壇の内容',
  en: 'The talk',
});

export const demoLabelName = message({
  ja: '名前',
  en: 'Name',
});

export const demoLabelEmail = message({
  ja: 'メールアドレス',
  en: 'Email',
});

export const demoLabelTitle = message({
  ja: 'タイトル',
  en: 'Title',
});

export const demoLabelMinutes = message({
  ja: '長さ（分）',
  en: 'Length (minutes)',
});

export const demoNext = message({
  ja: '次へ',
  en: 'Next',
});

export const demoBack = message({
  ja: '戻る',
  en: 'Back',
});

export const demoSubmit = message({
  ja: '申し込む',
  en: 'Submit',
});

export const demoSent = message({
  ja: 'この値なら送信できます。',
  en: 'These values can be sent.',
});

export const demoNameMissing = message({
  ja: '名前を入力してください',
  en: 'Enter your name',
});

export const demoEmailInvalid = message({
  ja: 'メールアドレスの形式で入力してください',
  en: 'Enter an email address',
});

export const demoTitleMissing = message({
  ja: 'タイトルを入力してください',
  en: 'Enter a title',
});

export const demoMinutesMissing = message({
  ja: '長さを分で入力してください',
  en: 'Enter the length in minutes',
});

export const demoMinutesRange = message({
  ja: '5分から60分の間で入力してください',
  en: 'Keep it between 5 and 60 minutes',
});
