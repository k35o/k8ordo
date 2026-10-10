import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '入力欄の多いフォームを、いくつかのステップに分けて作ります。すべてのステップを描画したまま、いまのステップ以外を隠します。',
  en: 'Build a long form as a sequence of steps. Every step stays rendered, and all but the current one are hidden.',
});

export const keepTitle = message({
  ja: 'ステップの隠し方',
  en: 'Hiding steps',
});

export const keepHydratedCallout = message({
  ja: 'ハイドレーションが終わると`true`になる',
  en: 'Becomes `true` once hydrated',
});

export const keepHiddenCallout = message({
  ja: 'いまのステップ以外に`hidden`を付ける',
  en: 'Every step but the current one is `hidden`',
});

export const keepFieldset = message({
  ja: 'ステップごとに`<fieldset>`で囲み、いまのステップ以外に`hidden`を付けます。隠れた入力欄もDOMに残るので、ステップを行き来しても値は消えません。送信は最後に1回です。',
  en: 'Wrap each step in a `<fieldset>` and mark every step but the current one `hidden`. The hidden controls stay in the DOM, so moving between steps loses nothing, and the form is sent once at the end.',
});

export const keepHydrated = message({
  ja: '隠すのは、ハイドレーションが終わってからです。JavaScriptが無いときは1枚の長いフォームになり、1回のリクエストで送信されます。',
  en: 'Hide steps only once hydrated. Without JavaScript the form is one long page, submitted in a single request.',
});

export const validateTitle = message({
  ja: 'ステップごとの検証',
  en: 'Per-step validation',
});

export const validateScopeCallout = message({
  ja: 'いまのステップの中の入力欄だけ',
  en: 'Only the controls inside the current step',
});

export const validateScope = message({
  ja: '「次へ」では、いまのステップの中の入力欄だけを`checkValidity()`で確かめます。後のステップはまだ入力していないので、フォーム全体を確かめると必ず失敗します。',
  en: '“Next” checks only the controls inside the current step with `checkValidity()`. The later steps are not filled in yet, so checking the whole form would always fail.',
});

export const validateFocus = message({
  ja: '`useForm`は、入力欄を離れたときにエラーを表示します。最初に失敗した入力欄へフォーカスを移しておけば、そこを離れたときにエラーが出ます。',
  en: '`useForm` shows an error when the person leaves a control. Move focus to the first failed control, and its error appears once they leave it.',
});

export const submitTitle = message({
  ja: '送信ボタン',
  en: 'The submit button',
});

export const submitLast = message({
  ja: 'ハイドレーションが終わったら、送信ボタンは最後のステップにだけ描画します。',
  en: 'Once hydrated, render the submit button on the last step only.',
});

export const submitEnter = message({
  ja: 'テキストの入力欄でEnterキーを押すと、ブラウザはフォームの最初の送信ボタンを押します。隠れたステップにあるボタンでも押されるので、前のステップからフォーム全体が送られます。',
  en: 'Enter in a text field clicks the form’s first submit button, even one inside a hidden step. The whole form would be sent from an earlier step.',
});

export const errorsTitle = message({
  ja: '送信後のエラー',
  en: 'Errors after submit',
});

export const errorsSwitchCallout = message({
  ja: '新しい`state`を受け取った描画で、エラーのあるステップへ切り替える',
  en: 'In the render that receives a new `state`, switch to the step holding the error',
});

export const errorsFocus = message({
  ja: '送信に失敗すると、`useForm`はページで最初に失敗した入力欄にフォーカスを移します。隠れたステップの入力欄は、フォーカスを受け取れません。',
  en: 'After a failed submission, `useForm` moves focus to the first failed control on the page. A control inside a hidden step cannot take focus.',
});

export const errorsSwitch = message({
  ja: '`state.errors`に入力欄があるステップのうち、最も前のステップへ描画の中で切り替えます。入力欄が先に表示されるので、フォーカスはその欄に移ります。',
  en: 'Switch during render to the earliest step with a control in `state.errors`. The control is visible first, so focus lands on it.',
});

export const errorsBrowser = message({
  ja: '送信時の検証は、隠れたステップの入力欄も対象です。そこで失敗すると、エラーを表示できないまま送信が止まります。',
  en: 'The check on submit covers the hidden steps too. A failure there stops the submission without a visible error.',
});

export const demoTitle = message({
  ja: '2ステップのデモ',
  en: 'Two-step demo',
});

export const demoDescription = message({
  ja: '1ステップ目で連絡先を、2ステップ目で登壇の内容を入力する、1つの`<form>`です。',
  en: 'One `<form>` that asks for contact details on the first step and the talk on the second.',
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
