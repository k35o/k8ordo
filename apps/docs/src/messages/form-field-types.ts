import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'スキーマの型が、入力欄の種類を決めます。欄の種類ごとに、スキーマの書き方と描き方を示します。',
  en: 'The schema decides which control each field becomes. This page shows how to write and render each kind.',
});

export const overviewTitle = message({
  ja: '対応表',
  en: 'At a glance',
});

export const overviewDescription = message({
  ja: '`field()`が返す`input`には、次の属性が入ります。そのまま入力欄に広げます。',
  en: 'The `input` that `field()` returns carries these attributes. Spread it onto the control as it is.',
});

export const columnSchema = message({
  ja: 'スキーマ',
  en: 'Schema',
});

export const columnInput = message({
  ja: '導かれる欄',
  en: 'Derived control',
});

export const rowSelect = message({
  ja: '`type`なし。`<select>`に広げる',
  en: 'No `type`. Spread it onto a `<select>`',
});

export const rowCheckboxGroup = message({
  ja: '`type`なし。選択肢ごとのチェックボックス',
  en: 'No `type`. One checkbox per option',
});

export const rowOther = message({
  ja: 'それ以外（`z.uuid()`など）',
  en: 'Anything else (`z.uuid()` and so on)',
});

export const textTitle = message({
  ja: '文字列を受け取る',
  en: 'Accept text',
});

export const textDescription = message({
  ja: '`z.string()`はテキストの欄になります。`.min()`、`.max()`、`.regex()`は、それぞれ`minlength`、`maxlength`、`pattern`になります。',
  en: '`z.string()` becomes a text field. `.min()`, `.max()` and `.regex()` become `minlength`, `maxlength` and `pattern`.',
});

export const textFormats = message({
  ja: '`z.email()`と`z.url()`は`type="email"`と`type="url"`になり、ブラウザが書式を確かめます。',
  en: '`z.email()` and `z.url()` become `type="email"` and `type="url"`, and the browser checks the format.',
});

export const textPitfall = message({
  ja: '空のテキスト欄は`""`を送ります。そのため`.optional()`を付けても、`.min(1)`があれば空欄は通りません。',
  en: 'An empty text field submits `""`. So even with `.optional()`, a field with `.min(1)` does not accept a blank.',
});

export const textPitfallFix = message({
  ja: '空欄を許すなら、`""`を受け付けるスキーマを書きます。',
  en: 'To allow a blank, write a schema that accepts `""`.',
});

export const datesTitle = message({
  ja: '日付と時刻を受け取る',
  en: 'Accept dates and times',
});

export const datesDescription = message({
  ja: '`z.iso`の書式は、ブラウザの日付と時刻の欄になります。値はISOの文字列のまま届きます。',
  en: 'The `z.iso` formats become the browser’s date and time controls. The value arrives as an ISO string.',
});

export const datesCoerce = message({
  ja: '`Date`で受け取りたいときは`z.coerce.date()`にします。この場合はテキストの欄になります。`z.date()`は文字列を受け付けないので、`formFields`が拒みます。',
  en: 'For a `Date`, use `z.coerce.date()`, which derives a text field. `z.date()` cannot accept a string, so `formFields` refuses it.',
});

export const numbersTitle = message({
  ja: '数値を受け取る',
  en: 'Accept numbers',
});

export const numbersDescription = message({
  ja: '数値の欄は`z.coerce.number()`で書きます。`type="number"`になり、`.min()`と`.max()`は`min`と`max`になります。',
  en: 'Write a numeric field with `z.coerce.number()`. It becomes `type="number"`, and `.min()` and `.max()` become `min` and `max`.',
});

export const numbersStep = message({
  ja: '`step`は、`.int()`なら`1`、`.multipleOf()`ならその値です。どちらも無ければ`any`になり、小数も入力できます。',
  en: '`step` is `1` after `.int()`, the given value after `.multipleOf()`, and `any` otherwise, which allows decimals.',
});

export const numbersEmpty = message({
  ja: '空の数値欄は何も送りません。`0`にはなりません。空欄を許すなら`.optional()`を付けます。',
  en: 'An empty numeric field submits nothing; it is not `0`. Add `.optional()` to allow a blank.',
});

export const numbersPitfall = message({
  ja: '`z.number()`は使えません。送られる値はいつも文字列なので、決して通らない欄になるからです。`formFields`は、これを例外で知らせます。',
  en: '`z.number()` does not work: every submitted value is a string, so the field could never pass. `formFields` throws to tell you.',
});

export const selectTitle = message({
  ja: '選択肢から1つ選ばせる',
  en: 'Pick one option',
});

export const selectDescription = message({
  ja: '`z.enum()`の`input`は`<select>`に広げます。先頭に値が空の選択肢を置くと、`required`が「どれかを選ぶ」という意味になります。',
  en: 'Spread a `z.enum()` field’s `input` onto a `<select>`. Put an option with an empty value first, so that `required` means “choose one”.',
});

export const selectOptional = message({
  ja: '`.optional()`を付けると、空の選択肢のままでも送れます。',
  en: 'With `.optional()`, the empty option can be submitted as it is.',
});

export const radioTitle = message({
  ja: 'ラジオボタンで選ばせる',
  en: 'Use radio buttons',
});

export const radioDescription = message({
  ja: '自分で書くラジオボタンには、`name`と`required`だけを渡します。選ばれていた値は、`state.values`から選択肢ごとに戻します。',
  en: 'Give hand-written radio buttons only `name` and `required`. Restore the chosen value per option from `state.values`.',
});

export const radioPitfall = message({
  ja: '`input`をそのまま広げないでください。送信のあとは`input`に前回の値が`defaultValue`として入り、各ラジオボタンの`value`とぶつかります。',
  en: 'Do not spread `input` as it is. After a submission it carries the previous choice as `defaultValue`, which collides with each radio button’s `value`.',
});

export const radioUi = message({
  ja: '`@k8ordo/ui`の`Radio`と`RadioCard`は、`input`をそのまま広げて使えます。',
  en: '`@k8ordo/ui`’s `Radio` and `RadioCard` take the spread `input` as it is.',
});

export const checkboxTitle = message({
  ja: 'チェックボックスで受け取る',
  en: 'Accept a checkbox',
});

export const checkboxDescription = message({
  ja: '`z.boolean()`はチェックボックスになります。チェックが無ければ`false`として届くので、必須にはなりません。',
  en: '`z.boolean()` becomes a checkbox. An unchecked box arrives as `false`, so it is never required.',
});

export const checkboxConsent = message({
  ja: '規約への同意のように、チェックを必須にしたいときは`z.literal(true)`にします。',
  en: 'When the box must be checked, as with agreeing to terms, use `z.literal(true)`.',
});

export const stringboolTitle = message({
  ja: '文字列を送るチェックボックス',
  en: 'A checkbox that submits a string',
});

export const stringboolDescription = message({
  ja: '`z.stringbool()`の欄は、チェックされると`input.value`の文字列（既定は`"true"`）を送ります。URLに残るGETのフォームで使います。',
  en: 'A `z.stringbool()` field submits the string in `input.value` (`"true"` by default) when checked. Use it in GET forms whose values stay in the URL.',
});

export const stringboolUnchecked = message({
  ja: 'チェックが無ければ何も送らないので、`.default(false)`か`.optional()`を付けます。`.default(true)`は、チェックを外しても`false`を送れないため拒まれます。',
  en: 'An unchecked box submits nothing, so add `.default(false)` or `.optional()`. `.default(true)` is refused, since unchecking could never submit `false`.',
});

export const groupTitle = message({
  ja: '複数を選ばせる',
  en: 'Pick several options',
});

export const groupDescription = message({
  ja: '`z.array(z.enum())`は、同じ`name`を持つチェックボックスの集まりになります。チェックされたものが配列で届き、1つも無ければ`[]`です。',
  en: '`z.array(z.enum())` becomes a group of checkboxes sharing one `name`. The checked ones arrive as an array, and none checked is `[]`.',
});

export const groupMin = message({
  ja: '`.min(2)`のような下限はHTMLの属性で表せないので、ブラウザでは検査されません。ブラウザでも確かめるなら、ルールの`minChecked`を宣言します。',
  en: 'A lower bound such as `.min(2)` has no HTML attribute, so the browser does not check it. Declare the `minChecked` rule to check it there too.',
});

export const filesTitle = message({
  ja: 'ファイルを受け取る',
  en: 'Accept a file',
});

export const filesDescription = message({
  ja: '`z.file()`はファイルの欄になり、`.mime()`は`accept`になります。',
  en: '`z.file()` becomes a file control, and `.mime()` becomes `accept`.',
});

export const filesServer = message({
  ja: '`accept`はファイル選択の候補を絞るだけで、ブラウザは種類を検査しません。種類と大きさの検査は、サーバーだけで行われます。',
  en: '`accept` only narrows what the file picker offers; the browser never checks the type. Type and size are checked on the server alone.',
});

export const filesEcho = message({
  ja: '送信に失敗しても、選んだファイルは欄に戻りません。ブラウザがファイルの欄に値を戻すことを許さないためです。',
  en: 'After a failed submission, the chosen file does not come back: browsers do not let a file control be given a value.',
});

export const passwordTitle = message({
  ja: 'パスワードを受け取る',
  en: 'Accept a password',
});

export const passwordDescription = message({
  ja: 'スキーマの登録情報で`input: "password"`を付けると、`type="password"`の欄になります。',
  en: 'Mark a field with `input: "password"` in the schema’s metadata, and it becomes a `type="password"` field.',
});

export const passwordEcho = message({
  ja: 'パスワードの欄は、送信に失敗しても入力した値を返しません。',
  en: 'A password field never sends what was typed back after a failed submission.',
});

export const passwordMini = message({
  ja: '`zod/mini`には`.meta()`が無いので、`.check(z.meta(…))`で付けます。',
  en: '`zod/mini` has no `.meta()`; add it with `.check(z.meta(…))`.',
});
