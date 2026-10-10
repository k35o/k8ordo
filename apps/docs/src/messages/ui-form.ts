import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/form`の`form.field(name).input`を、`@k8ordo/ui`の入力コンポーネントにそのまま展開できるようになります。スキーマごとにどのコンポーネントを使い、何を足して渡すかが分かります。',
  en: 'Spread the `input` that `@k8ordo/form` derives for a field straight onto `@k8ordo/ui`’s inputs. You also learn which component fits each schema and what else to pass.',
});

export const basicTitle = message({
  ja: '`input`の展開',
  en: 'Spreading `input`',
});

export const basicForm = message({
  ja: '`form.field(name).input`には、`@k8ordo/form`がスキーマから導いた`type`や`required`などの属性が入っています。`useForm`の使い方は、`@k8ordo/form`の',
  en: '`form.field(name).input` holds the attributes `@k8ordo/form` derives from the schema, such as `type` and `required`. How `useForm` works is covered in `@k8ordo/form`’s ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const basicSpread = message({
  ja: '`FormControl`には`label`と`errorText`、`invalid`、`required`だけを渡します。`id`と`aria-*`の結び付けは`FormControl`が作ります。`input`は`FormControl`から受け取ったpropsのあとに展開します。取り除いておく属性はありません。`TextField`は日付や時刻の`type`でも、その`type`の入力欄として描画します。`Textarea`は`<textarea>`に無い`type`を捨てます。',
  en: 'Give `FormControl` only `label`, `errorText`, `invalid` and `required`; it creates the `id` and the `aria-*` links itself. Spread `input` after the props `FormControl` hands over, with nothing taken out first. `TextField` renders the date and time types as well, and `Textarea` drops the `type` a `<textarea>` does not have.',
});

export const basicDom = message({
  ja: 'どのコンポーネントも非制御で使えます。値は入力要素に入っているので、リセットすると`defaultValue`に戻ります。`isDirty`も`defaultValue`と比べます。増減ボタンや選択肢の操作でコンポーネントが値を変えたときも、キー入力と同じ`input`イベントが発火します。',
  en: 'Every component works uncontrolled, with its value held in the input element. A reset puts it back to `defaultValue`, and `isDirty` compares against `defaultValue`. A value a component changes in code, such as a stepper or a chosen option, fires an `input` event the way typing does.',
});

export const mapTitle = message({
  ja: 'スキーマ別のコンポーネント',
  en: 'Components by schema',
});

export const mapLead = message({
  ja: 'スキーマの型ごとに、使えるコンポーネントと`{...props} {...input}`のほかに渡すものは次のとおりです。',
  en: 'For each schema type, the components that fit and what to pass besides `{...props} {...input}`.',
});

export const mapText = message({
  ja: '`z.string()`と`z.email()`、`z.url()`、`z.iso.*()`：`TextField`か`Textarea`。ほかに渡すものはありません。',
  en: '`z.string()`, `z.email()`, `z.url()`, `z.iso.*()`: `TextField` or `Textarea`, with nothing else to pass.',
});

export const mapPassword = message({
  ja: 'パスワード：`PasswordInput`。`type`を展開しても、表示を切り替えるボタンはそのまま働きます。',
  en: 'A password: `PasswordInput`. Its show/hide toggle still works after `type` is spread.',
});

export const mapNumber = message({
  ja: '`z.coerce.number()`：`NumberField`か`Slider`。文字列の`min`、`max`、`step="any"`もそのまま受け取ります。',
  en: '`z.coerce.number()`: `NumberField` or `Slider`. They accept string `min`, `max` and `step="any"`.',
});

export const mapEnum = message({
  ja: '`z.enum([…])`：`Select`、`Radio`、`RadioCard`。`options`を渡し、ラジオボタンでは`FormControl`に`labelAs="legend"`を付けます。',
  en: '`z.enum([…])`: `Select`, `Radio` or `RadioCard`. Pass `options`, and `labelAs="legend"` on `FormControl` for radios.',
});

export const mapBoolean = message({
  ja: '`z.boolean()`、`z.literal(true)`：`Checkbox`か`Switch`。`label`を渡し、`FormControl`は使いません。',
  en: '`z.boolean()`, `z.literal(true)`: `Checkbox` or `Switch`. Pass a `label`; they need no `FormControl`.',
});

export const mapGroup = message({
  ja: '`z.array(z.enum([…]))`：`CheckboxGroup.Root`、`CheckboxCard`、`Autocomplete`。`defaultValue`を渡します。',
  en: '`z.array(z.enum([…]))`: `CheckboxGroup.Root`, `CheckboxCard` or `Autocomplete`. Pass `defaultValue`.',
});

export const mapFile = message({
  ja: '`z.file()`：`FileField.Root`。`FileField.Trigger`と`FileField.ItemList`を中に置きます。',
  en: '`z.file()`: `FileField.Root`, with a `FileField.Trigger` and a `FileField.ItemList` inside.',
});

export const choiceTitle = message({
  ja: '選択肢のコンポーネント',
  en: 'Choice components',
});

export const choiceGroup = message({
  ja: 'チェックボックスの集まりの値は、送信後に`state.values`へ配列で入ります。`input`には`name`しか入っていないので、この配列を`defaultValue`で渡します。`minChecked`は`Autocomplete`にも効きます。`Autocomplete`は、何も選んでいなくても残る隠れた`<select multiple>`で値を送り、エラーはこの要素に付きます。失敗したあとのフォーカスは、この要素から入力欄へ移ります。',
  en: 'A checkbox group’s value comes back in `state.values` as an array. `input` carries only the `name`, so pass that array as `defaultValue`. `minChecked` applies to `Autocomplete` too. It submits through a hidden `<select multiple>` that stays even with nothing selected, and the error is attached to that element. Focus sent there after a failure moves on to the text input.',
});

export const choiceRadio = message({
  ja: '`Radio`と`RadioCard`には、`input`をそのまま展開します。`defaultValue`を選ばれている選択肢として読み、`required`をすべてのラジオボタンに付けます。',
  en: 'Spread `input` onto `Radio` and `RadioCard` directly. They read `defaultValue` as the selected option and put `required` on every radio.',
});

export const choiceSelect = message({
  ja: "`Select`で`required`を効かせるには、`options`の先頭に`{ value: '', label: '…' }`を置きます。空の選択肢が無い`<select>`は、いつもどれかが選ばれています。",
  en: "For `required` to take effect on a `Select`, put `{ value: '', label: '…' }` first in `options`. A `<select>` without an empty option always has a choice selected.",
});

export const exceptionsTitle = message({
  ja: '注意点',
  en: 'Caveats',
});

export const exceptionStringbool = message({
  ja: '`z.stringbool()`のフィールドに`Checkbox`を使うと、展開した`value`が`<input>`に渡らず、ブラウザの既定の`on`が送られます。`z.stringbool()`は初期設定のままなら`on`を`true`と読みます。`truthy`を変えると、送られた`on`はスキーマに合わない値になります。`@k8ordo/state`がURLに書く値とも一致しません。このフィールドは`<input {...field.input} />`で直接描画してください。',
  en: 'A spread `value` does not reach the `<input>` inside `Checkbox`, so a `z.stringbool()` field drawn with it submits the browser’s `on`. An unconfigured `z.stringbool()` reads `on` as `true`. With a custom `truthy`, the submitted `on` no longer fits the schema, and it differs from the value `@k8ordo/state` writes to the URL. Render that field as a plain `<input {...field.input} />`.',
});

export const exceptionNumber = message({
  ja: '`NumberField`は値の整形と増減のために`type="text"`で描画します。そのためブラウザは`min`と`max`を確かめません。範囲の外の値は`NumberField`自身が`setCustomValidity`で知らせます。その文言は`@k8ordo/ui`の辞書のもので、zodの文言とは別です。クライアントの文言がzodとそろわないのは、ここだけです。',
  en: '`NumberField` renders `type="text"` so it can format and step the value, and the browser does not check `min` and `max` on a text input. `NumberField` reports an out-of-range value itself with `setCustomValidity`. That message comes from `@k8ordo/ui`’s dictionary, not from zod. This is the only place the client’s text is not zod’s own.',
});

export const exceptionTextarea = message({
  ja: '`Textarea`で描画するフィールドの正規表現は`pattern`属性になりますが、`<textarea>`はこの属性を無視します。この検証はサーバーでだけ行われます。`formFields`はどの要素で描画するかを知らないので、`dropped`にも載りません。',
  en: 'A regex on a field rendered as a `Textarea` reaches the markup as `pattern`, but a `<textarea>` ignores that attribute. The check runs on the server only. `formFields` does not know which element renders the field, so `dropped` cannot list it either.',
});

export const exceptionFile = message({
  ja: '`FileField`は、`FileField.ItemList`に表示されているファイルを送ります。一覧から外したファイルは送信からも外れ、リセットすると一覧も空になります。',
  en: '`FileField` submits what `FileField.ItemList` shows. A file removed from the list leaves the submission, and a reset empties the list.',
});

export const formErrorTitle = message({
  ja: 'フォーム全体のエラー',
  en: 'Form-level error',
});

export const formErrorAlert = message({
  ja: '`form.formError`は`Alert`で表示できます。`Alert`は`id`と`tabIndex`を要素に渡すので、`form.formError.props`を展開するとフォーカスを受け取れます。',
  en: '`form.formError` can be shown with `Alert`. `Alert` passes `id` and `tabIndex` through to its element, so spreading `form.formError.props` lets it take focus.',
});

export const formErrorTwice = message({
  ja: '`Alert`は`role="alert"`を持つので、表示されたときとフォーカスが移ったときの2回、スクリーンリーダーに読まれることがあります。エラーの一覧に`alert`ロールを付けた場合と同じです。',
  en: '`Alert` has `role="alert"`, so a screen reader may read the message twice: once when it appears, once when focus lands on it. An error summary with an alert role behaves the same way.',
});
