import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'リッチテキストエディタや独自の選択UIのように、`<input name>`を描画しないコンポーネントの値を`HiddenValue`で送信に含めます。',
  en: 'Put the value of a component that renders no `<input name>`, such as a rich text editor or a custom picker, into the submission with `HiddenValue`.',
});

export const placeTitle = message({
  ja: '値の送信',
  en: 'Submitting the value',
});

export const placeState = message({
  ja: 'コンポーネントの値はstateに持ち、同じ値を`HiddenValue`に渡します。`name`にはスキーマでのパスを書きます。',
  en: 'Keep the component’s value in state and pass the same value to `HiddenValue`. Its `name` is the field’s path in the schema.',
});

export const placeSubmit = message({
  ja: '`HiddenValue`は`<input type="hidden">`を描画します。値はほかの入力欄と一緒に送信されるので、送信時に値を集めるコードは要りません。',
  en: '`HiddenValue` renders an `<input type="hidden">`. The value is submitted with the other inputs, so it needs no submit-time code to gather it.',
});

export const placeUiBefore = message({
  ja: '`@k8ordo/ui`の部品は自分の値を送信に含めるので、`HiddenValue`は要りません（',
  en: '`@k8ordo/ui` components put their own values into the submission and need no `HiddenValue` (see ',
});

export const placeUiAfter = message({
  ja: '）。',
  en: ').',
});

export const whyTitle = message({
  ja: '値の変化の検知',
  en: 'Change detection',
});

export const whyNoEvent = message({
  ja: 'Reactが`value`を書き換えても、DOMのイベントは発火しません。そのため、`<input type="hidden">`を直接置くと、複数の入力欄にまたがるルールと`isDirty`は更新されません。',
  en: 'When React updates `value`, no DOM event fires. So with an `<input type="hidden">` placed directly, cross-field rules and `isDirty` are not updated.',
});

export const whyEvent = message({
  ja: '`HiddenValue`は値が変わるたびに`input`イベントを発火します。キー入力と同じように、ルールの判定と`isDirty`が更新されます。',
  en: '`HiddenValue` fires an `input` event on every change, so the rules and `isDirty` update as they do for a keystroke.',
});

export const cautionTitle = message({
  ja: 'リセットとブラウザの検証',
  en: 'Reset and browser validation',
});

export const cautionReset = message({
  ja: '値は呼び出し側のstateにあるので、フォームをリセットしても`HiddenValue`の値は戻りません。stateを戻すまで`isDirty`も`true`のままです。`onReset`で`form.props.onReset()`を呼んだあとに、stateを既定値に戻してください。',
  en: 'The value lives in the caller’s state, so resetting the form does not restore a `HiddenValue`, and `isDirty` stays `true` until that state is reset. In your own `onReset`, call `form.props.onReset()` and then reset the state.',
});

export const cautionValidation = message({
  ja: '`<input type="hidden">`は、ブラウザの検証の対象になりません。`required`や`min`のような制約はブラウザでは確かめられず、送信後にサーバーで確かめます。',
  en: 'A hidden input is excluded from the browser’s constraint validation. Constraints such as `required` or `min` are not checked in the browser; the server checks them after the submission.',
});

export const demoTitle = message({
  ja: '星の評価のデモ',
  en: 'Star rating demo',
});

export const demoDescription = message({
  ja: '星のボタンは`<input>`を持たない自前の入力部品で、選んだ値を`HiddenValue`で送信に含めます。',
  en: 'The star buttons are a custom control with no `<input>`. The chosen value goes into the submission through `HiddenValue`.',
});

export const demoSteps = [
  message({
    ja: '星を選ぶと、`HiddenValue`が`input`イベントを発火し、`isDirty`が`true`になります。',
    en: 'Choose a star. `HiddenValue` fires an `input` event and `isDirty` turns `true`.',
  }),
  message({
    ja: '「送信」を押すと、送られる値が`rating=3`のように表示されます。',
    en: 'Press “Submit”. The value that would be sent is shown, as in `rating=3`.',
  }),
  message({
    ja: '「元に戻す」を押すと、星の選択も`isDirty`も元に戻ります。',
    en: 'Press “Revert”. The stars and `isDirty` both go back.',
  }),
] as const;

export const demoLabelRating = message({
  ja: '評価',
  en: 'Rating',
});

export const demoStar = message({
  ja: (count: number) => `星${String(count)}つ`,
  en: (count) => `${String(count)} star${count === 1 ? '' : 's'}`,
});

export const demoSubmit = message({
  ja: '送信',
  en: 'Submit',
});

export const demoReset = message({
  ja: '元に戻す',
  en: 'Revert',
});

export const demoRatingMissing = message({
  ja: '評価を選んでください',
  en: 'Choose a rating',
});
