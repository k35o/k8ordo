import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/form`は`@k8ordo/ui`に依存しません。その代わり、`@k8ordo/ui`の入力部品のほうが、`formFields`が作った`input`をそのまま受け取れるように作られています。このページでは、部品ごとの組み合わせ方と、いくつかの例外を紹介します。',
  en: '`@k8ordo/form` does not depend on `@k8ordo/ui`; instead, `@k8ordo/ui`’s fields are built to take what `formFields` derives as it is. This page shows how each component fits, and the few exceptions.',
});

export const basicTitle = message({
  ja: 'FormControlと組み合わせる',
  en: 'Pair it with FormControl',
});

export const basicDescription = message({
  ja: '`FormControl`には、ラベルとエラー、`invalid`、`required`だけを渡します。`id`や`aria-*`による結び付けは`FormControl`が作るので、自分で書く必要はありません。',
  en: 'Give `FormControl` only what it uses: the label, the error, `invalid` and `required`. It creates the `id` and the `aria-*` links itself.',
});

export const basicSpread = message({
  ja: '`input`は、`FormControl`から受け取ったpropsのあとに展開します。`input`から取り除いておく属性はありません。`TextField`は日付や時刻の`type`も描き、`Textarea`は`<textarea>`に無い`type`を捨てます。',
  en: 'Spread `input` after the props `FormControl` hands over. Nothing has to be taken out first: `TextField` renders the date and time types too, and `Textarea` drops the `type` a `<textarea>` does not have.',
});

export const basicDom = message({
  ja: 'どの部品も値をDOMに持つので、リセットすると送信した値に戻り、`isDirty`もその値を読みます。増減ボタンや選択肢の選択のように部品がコードで値を変えたときも、キー入力と同じ`input`イベントが届きます。',
  en: 'Every field keeps its value in the DOM, so a reset restores the submitted values and `isDirty` reads them. A value a component changes in code — a stepper, a chosen option — arrives as an `input` event, the way typing does.',
});

export const mapTitle = message({
  ja: 'スキーマごとの部品',
  en: 'Components by schema',
});

export const mapDescription = message({
  ja: 'スキーマの型ごとに、使える部品と、`{...props} {...input}`のほかに渡すものは次のとおりです。',
  en: 'For each kind of schema, the components that fit and what to pass besides `{...props} {...input}`:',
});

export const mapText = message({
  ja: '`z.string()`、`z.email()`、`z.url()`、`z.iso.*()`：`TextField`か`Textarea`。ほかに渡すものはありません。',
  en: '`z.string()`, `z.email()`, `z.url()`, `z.iso.*()`: `TextField` or `Textarea`, with nothing else to pass.',
});

export const mapPassword = message({
  ja: 'パスワード：`PasswordInput`。展開した`type`の下でも、表示を切り替えるボタンが働きます。',
  en: 'A password: `PasswordInput`, whose show/hide toggle keeps working under a spread `type`.',
});

export const mapNumber = message({
  ja: '`z.coerce.number()`：`NumberField`か`Slider`。文字列の`min`や`max`、`step="any"`もそのまま受け取ります。',
  en: '`z.coerce.number()`: `NumberField` or `Slider`, which take string bounds and `step="any"` as they are.',
});

export const mapEnum = message({
  ja: '`z.enum([…])`：`Select`、`Radio`、`RadioCard`。`options`を渡し、ラジオボタンでは`FormControl`に`labelAs="legend"`を付けます。',
  en: '`z.enum([…])`: `Select`, `Radio` or `RadioCard`. Pass `options`, and `labelAs="legend"` on `FormControl` for radios.',
});

export const mapBoolean = message({
  ja: '`z.boolean()`、`z.literal(true)`：`Checkbox`か`Switch`。`label`を渡し、`FormControl`は使いません。',
  en: '`z.boolean()`, `z.literal(true)`: `Checkbox` or `Switch`, with a `label` and no `FormControl`.',
});

export const mapGroup = message({
  ja: '`z.array(z.enum([…]))`：`CheckboxGroup.Root`、`CheckboxCard`、`Autocomplete`。`state.values`から`defaultValue`を渡します。',
  en: '`z.array(z.enum([…]))`: `CheckboxGroup.Root`, `CheckboxCard` or `Autocomplete`, with `defaultValue` from `state.values`.',
});

export const mapFile = message({
  ja: '`z.file()`：`FileField.Root`。`FileField.Trigger`と`FileField.ItemList`を中に置きます。',
  en: '`z.file()`: `FileField.Root`, holding a `FileField.Trigger` and a `FileField.ItemList`.',
});

export const choiceTitle = message({
  ja: '選択肢の部品',
  en: 'Choice components',
});

export const choiceRadio = message({
  ja: '`Radio`と`RadioCard`には、`input`をそのまま展開します。自分で書くラジオボタンとは違い、`defaultValue`を選ばれている選択肢として読み、`required`をすべてのラジオボタンに付けます。',
  en: '`Radio` and `RadioCard` take the spread as it is. Unlike a hand-written radio, they read `defaultValue` as the selected option and put `required` on every radio.',
});

export const choiceSelect = message({
  ja: "`Select`で`required`を意味のあるものにするには、`options`の先頭に`{ value: '', label: '…' }`の選択肢を置きます。空の選択肢が無い`<select>`は、いつもどれかが選ばれているからです。",
  en: "For `required` to mean anything on a `Select`, put `{ value: '', label: '…' }` first in `options`. A `<select>` without an empty option always has a choice selected.",
});

export const choiceGroup = message({
  ja: 'チェックボックスの集まりは、送信した値が配列で戻ります。`input`には`name`しか入っていないので、チェックされていた値を`defaultValue`で渡します。',
  en: 'A checkbox group echoes as an array. `input` carries only the `name`, so pass what was checked back as `defaultValue`.',
});

export const choiceAutocomplete = message({
  ja: '`minChecked`は`Autocomplete`にも効きます。`Autocomplete`は何も選んでいなくても残る隠れた`<select multiple>`で値を送るので、ルールがエラーを付ける要素があり、失敗したあとのフォーカスは入力欄へ移ります。',
  en: '`minChecked` reaches `Autocomplete` too. It submits through a hidden `<select multiple>` that is there even with nothing selected, so the rule has an element to mark, and focus sent there after a failure goes on to the text input.',
});

export const exceptionsTitle = message({
  ja: '気をつける部品',
  en: 'Components to watch',
});

export const exceptionStringbool = message({
  ja: '`z.stringbool()`の欄に`Checkbox`を使うと、展開した`value`が届かず、ブラウザの既定の`on`が送られます。既定の`z.stringbool()`は`on`を`true`と読みますが、`truthy`を変えた場合やURLの状態と合わせる場合は食い違います。この欄は素の`<input {...field.input} />`で描いてください。',
  en: 'A spread `value` does not reach `Checkbox`, so a `z.stringbool()` box drawn with it submits the browser’s `on`. The default `z.stringbool()` reads that as `true`, but a custom `truthy`, or the URL state, does not share it. Render a plain `<input {...field.input} />` there.',
});

export const exceptionNumber = message({
  ja: '`NumberField`は値を整形して増減させるために`type="text"`で描くので、ブラウザは`min`と`max`を確かめません。範囲の外の値は`NumberField`自身が`setCustomValidity`で知らせますが、その文言はzodではなく`@k8ordo/ui`の辞書のものです。クライアントの文言がzodとそろわないのは、ここだけです。',
  en: '`NumberField` renders `type="text"` to format and step the value, so the browser does not check `min` and `max`. It reports an out-of-range value itself with `setCustomValidity`, in `@k8ordo/ui`’s wording rather than zod’s — the one place the client’s text is not zod’s own.',
});

export const exceptionTextarea = message({
  ja: '`Textarea`で描く欄の正規表現は`pattern`属性になりますが、`<textarea>`はこの属性を無視します。この検証はサーバーでだけ行われ、どの部品で描くかを`formFields`は知らないので、`dropped`にも載りません。',
  en: 'A regex on a field drawn as a `Textarea` reaches the markup as `pattern`, but a `<textarea>` ignores it. The check runs on the server only, and `dropped` cannot list it, since the derivation does not know which element renders the field.',
});

export const exceptionFile = message({
  ja: '`FileField`は、`FileField.ItemList`に表示されているファイルを送ります。一覧から外したファイルは送信からも外れ、リセットすると一覧も空になります。',
  en: '`FileField` submits what `FileField.ItemList` shows: removing a file there removes it from the submission, and a reset empties the list.',
});

export const formErrorTitle = message({
  ja: 'フォーム全体のエラーをAlertで出す',
  en: 'Show the form-level error with Alert',
});

export const formErrorDescription = message({
  ja: '`form.formError`は`Alert`で表示できます。`Alert`は`id`と`tabIndex`を要素まで渡すので、`form.formError.props`を展開すればフォーカスを受け取れます。',
  en: '`form.formError` fits `Alert`, which passes `id` and `tabIndex` through to its element, so spreading `form.formError.props` lets it take focus.',
});

export const formErrorTwice = message({
  ja: '`Alert`は`role="alert"`を持つので、表示されたときとフォーカスが移ったときの2回、スクリーンリーダーに読まれることがあります。エラーの一覧に`alert`ロールを付けた場合と同じ割り切りです。',
  en: '`Alert` has `role="alert"`, so a screen reader may read the message twice: once when it appears, once when focus lands on it. It is the same trade an error summary with an alert role makes.',
});
