import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'リッチテキストエディタや独自の選択UIのように、`<input name>`を描かないコンポーネントの値は、そのままでは`FormData`に入りません。このページでは、こうした値を`HiddenValue`で送信に載せる方法を紹介します。',
  en: 'A component that renders no `<input name>` — a rich text editor, a custom picker — never reaches the `FormData` on its own. This page shows how `HiddenValue` puts such a value into the submission.',
});

export const placeTitle = message({
  ja: '値を隠れた入力欄に置く',
  en: 'Park the value in a hidden field',
});

export const placeDescription = message({
  ja: 'コンポーネントの値はstateに持ち、同じ値を`HiddenValue`に渡します。`name`には、スキーマでのパスを書きます。',
  en: 'Keep the component’s value in state, and hand the same value to `HiddenValue`. Its `name` is the field’s path in the schema.',
});

export const placeSubmit = message({
  ja: '`HiddenValue`はただの`<input type="hidden">`を描くので、値はほかの入力欄と一緒に送信されます。送信のときに値を集めるコードは要りません。',
  en: '`HiddenValue` renders a plain `<input type="hidden">`, so the value goes out with the rest of the form. No code gathers it at submit time.',
});

export const whyTitle = message({
  ja: 'propsではなくコンポーネントになっている理由',
  en: 'Why it is a component, not a props helper',
});

export const whyDescription = message({
  ja: 'Reactが`value`を書き換えても、DOMのイベントは起きません。そのため、ただの隠れた入力欄では、複数の入力欄にまたがるルールも`isDirty`も、値が変わったことに気づけません。',
  en: 'React updates a controlled `value` without any DOM event, so with a bare hidden input neither the cross-field rules nor `isDirty` would notice the change.',
});

export const whyEvent = message({
  ja: '`HiddenValue`は、値が変わるたびに`input`イベントを出します。これで、キー入力と同じようにルールの判定と`isDirty`が更新されます。',
  en: '`HiddenValue` fires an `input` event on every change, so the rules and `isDirty` update just as they do for a keystroke.',
});

export const cautionTitle = message({
  ja: '気をつけること',
  en: 'Things to watch',
});

export const cautionValidation = message({
  ja: '隠れた入力欄は、ブラウザの検証の対象になりません。`required`や`min`のような制約は、ブラウザでは確かめられず、送信されたあとにサーバーで初めて確かめます。',
  en: 'A hidden input is barred from the browser’s constraint validation. Constraints such as `required` or `min` are not checked in the browser; the server checks them after the submission.',
});

export const cautionReset = message({
  ja: 'フォームをリセットしても、`HiddenValue`の値は戻りません。値は呼び出し側のstateにあるからです。リセットに合わせてstateも戻すなら、`onReset`で`form.props.onReset()`を呼んだあとに戻します。',
  en: 'Resetting the form does not restore a `HiddenValue`: the value is the caller’s state. To put the state back as well, call `form.props.onReset()` from your own `onReset`, then reset it.',
});

export const cautionUi = message({
  ja: '`@k8ordo/ui`のコンポーネントは、値を自分で送信に載せます。`Autocomplete`のように見た目と送信する要素が違うものも、`HiddenValue`は要りません。',
  en: '`@k8ordo/ui`’s components put their values into the submission themselves. Even `Autocomplete`, whose visible part is not what submits, needs no `HiddenValue`.',
});

export const demoTitle = message({
  ja: '星の評価を送る',
  en: 'Submit a star rating',
});

export const demoDescription = message({
  ja: '星のボタンは`<input>`を持たない自前の入力部品です。選んだ値を`HiddenValue`で送信に載せています。',
  en: 'The star buttons are a hand-made control with no `<input>`. The chosen value goes into the submission through `HiddenValue`.',
});

export const demoSteps = [
  message({
    ja: '星を選ぶと、`isDirty`が`true`に変わります。値の変化を`HiddenValue`がイベントで知らせているためです。',
    en: 'Choose a star. `isDirty` turns `true`, because `HiddenValue` announces the change with an event.',
  }),
  message({
    ja: '「送信」を押すと、送られる値が`rating=3`のように表示されます。',
    en: 'Press “Submit”. The value that would be sent shows, as in `rating=3`.',
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
