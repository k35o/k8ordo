import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'どの種類の入力欄になるかは、スキーマの型で決まります。このページでは、入力欄の種類ごとに、スキーマの書き方とフォームでの描き方を紹介します。',
  en: 'The schema decides which control each field becomes. This page shows how to write and render each kind.',
});

export const overviewTitle = message({
  ja: 'スキーマと入力欄の対応',
  en: 'At a glance',
});

export const overviewDescription = message({
  ja: '`field()`が返す`input`には、スキーマに応じて次の属性が入ります。どれも、そのまま入力欄に展開して使います。',
  en: 'The `input` that `field()` returns carries these attributes. Spread it onto the control as it is.',
});

export const columnSchema = message({
  ja: 'スキーマ',
  en: 'Schema',
});

export const columnInput = message({
  ja: '作られる入力欄',
  en: 'Derived control',
});

export const rowSelect = message({
  ja: '`type`なし。`<select>`に展開する',
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
  ja: '`z.string()`はテキストの入力欄になります。`.min()`と`.max()`、`.regex()`は、それぞれ`minlength`と`maxlength`、`pattern`の属性になります。',
  en: '`z.string()` becomes a text field. `.min()`, `.max()` and `.regex()` become `minlength`, `maxlength` and `pattern`.',
});

export const textFormats = message({
  ja: '`z.email()`は`type="email"`、`z.url()`は`type="url"`の入力欄になり、書式はブラウザが確かめます。',
  en: '`z.email()` and `z.url()` become `type="email"` and `type="url"`, and the browser checks the format.',
});

export const textPitfall = message({
  ja: '空のテキスト欄は、値が無いのではなく`""`を送ります。そのため`.optional()`を付けていても、`.min(1)`があれば空欄のままでは通りません。',
  en: 'An empty text field submits `""`. So even with `.optional()`, a field with `.min(1)` does not accept a blank.',
});

export const textPitfallFix = message({
  ja: '空欄を許したいときは、`""`を受け付けるスキーマを書きます。',
  en: 'To allow a blank, write a schema that accepts `""`.',
});

export const datesTitle = message({
  ja: '日付と時刻を受け取る',
  en: 'Accept dates and times',
});

export const datesDescription = message({
  ja: '`z.iso`の書式は、ブラウザの日付や時刻の入力欄になります。値はISO形式の文字列のまま届きます。',
  en: 'The `z.iso` formats become the browser’s date and time controls. The value arrives as an ISO string.',
});

export const datesCoerce = message({
  ja: '`Date`として受け取りたいときは`z.coerce.date()`を使います。ただしこの場合はテキストの入力欄になります。`z.date()`は文字列を受け付けず、どんな値も通らない欄になるので、`formFields`がエラーにします。',
  en: 'For a `Date`, use `z.coerce.date()`, which derives a text field. `z.date()` cannot accept a string, so `formFields` refuses it.',
});

export const numbersTitle = message({
  ja: '数値を受け取る',
  en: 'Accept numbers',
});

export const numbersDescription = message({
  ja: '数値の入力欄は`z.coerce.number()`で書きます。`type="number"`の入力欄になり、`.min()`と`.max()`は`min`と`max`の属性になります。',
  en: 'Write a numeric field with `z.coerce.number()`. It becomes `type="number"`, and `.min()` and `.max()` become `min` and `max`.',
});

export const numbersStep = message({
  ja: '`step`は、`.int()`があれば`1`に、`.multipleOf()`があればその値になります。どちらも無ければ`any`になり、小数も入力できます。',
  en: '`step` is `1` after `.int()`, the given value after `.multipleOf()`, and `any` otherwise, which allows decimals.',
});

export const numbersEmpty = message({
  ja: '空の数値欄は何も送らず、`0`にもなりません。空欄を許すなら`.optional()`を付けます。',
  en: 'An empty numeric field submits nothing; it is not `0`. Add `.optional()` to allow a blank.',
});

export const numbersPitfall = message({
  ja: '`z.number()`は使えません。フォームが送る値はいつも文字列なので、どんな入力も通らない欄になってしまうからです。`formFields`はこれをエラーにして知らせます。',
  en: '`z.number()` does not work: every submitted value is a string, so the field could never pass. `formFields` throws to tell you.',
});

export const selectTitle = message({
  ja: '選択肢から1つ選ばせる',
  en: 'Pick one option',
});

export const selectDescription = message({
  ja: '`z.enum()`の`input`は`<select>`に展開します。先頭に値が空の選択肢を置いておくと、`required`が「どれかを選ぶ」という意味になります。',
  en: 'Spread a `z.enum()` field’s `input` onto a `<select>`. Put an option with an empty value first, so that `required` means “choose one”.',
});

export const selectOptional = message({
  ja: '`.optional()`を付けると、空の選択肢を選んだままでも送信できます。',
  en: 'With `.optional()`, the empty option can be submitted as it is.',
});

export const radioTitle = message({
  ja: 'ラジオボタンで選ばせる',
  en: 'Use radio buttons',
});

export const radioDescription = message({
  ja: '自分で書くラジオボタンには、`input`から`name`と`required`だけを渡します。送信前に選ばれていた値は、`state.values`を見て選択肢ごとに戻します。',
  en: 'Give hand-written radio buttons only `name` and `required`. Restore the chosen value per option from `state.values`.',
});

export const radioPitfall = message({
  ja: 'ラジオボタンに`input`をそのまま展開しないでください。送信のあとは`input`に前回の値が`defaultValue`として入っていて、各ラジオボタンの`value`とぶつかってしまいます。',
  en: 'Do not spread `input` as it is. After a submission it carries the previous choice as `defaultValue`, which collides with each radio button’s `value`.',
});

export const radioUi = message({
  ja: '`@k8ordo/ui`の`Radio`と`RadioCard`は、`input`をそのまま展開して使えるように作ってあります。',
  en: '`@k8ordo/ui`’s `Radio` and `RadioCard` take the spread `input` as it is.',
});

export const checkboxTitle = message({
  ja: 'チェックボックスで受け取る',
  en: 'Accept a checkbox',
});

export const checkboxDescription = message({
  ja: '`z.boolean()`はチェックボックスになります。チェックが無いときは`false`として届くので、必須の欄にはなりません。',
  en: '`z.boolean()` becomes a checkbox. An unchecked box arrives as `false`, so it is never required.',
});

export const checkboxConsent = message({
  ja: '規約への同意のように、チェックを必須にしたいときは`z.literal(true)`を使います。',
  en: 'When the box must be checked, as with agreeing to terms, use `z.literal(true)`.',
});

export const stringboolTitle = message({
  ja: '文字列を送るチェックボックス',
  en: 'A checkbox that submits a string',
});

export const stringboolDescription = message({
  ja: '`z.stringbool()`のチェックボックスは、チェックされると`input.value`の文字列（既定では`"true"`）を送ります。値がURLに残るGETのフォームで使います。',
  en: 'A `z.stringbool()` field submits the string in `input.value` (`"true"` by default) when checked. Use it in GET forms whose values stay in the URL.',
});

export const stringboolUnchecked = message({
  ja: 'チェックが無いときは何も送らないので、`.default(false)`か`.optional()`を付けます。`.default(true)`はエラーになります。チェックを外しても`false`を送る手段が無いからです。',
  en: 'An unchecked box submits nothing, so add `.default(false)` or `.optional()`. `.default(true)` is refused, since unchecking could never submit `false`.',
});

export const groupTitle = message({
  ja: '複数を選ばせる',
  en: 'Pick several options',
});

export const groupDescription = message({
  ja: '`z.array(z.enum())`は、同じ`name`を持つチェックボックスの集まりになります。チェックされた値が配列で届き、1つもチェックが無ければ`[]`になります。',
  en: '`z.array(z.enum())` becomes a group of checkboxes sharing one `name`. The checked ones arrive as an array, and none checked is `[]`.',
});

export const groupMin = message({
  ja: '`.min(2)`のような下限はHTMLの属性で表せないので、ブラウザでは確かめません。ブラウザでも確かめたいときは、ルールの`minChecked`を宣言します。',
  en: 'A lower bound such as `.min(2)` has no HTML attribute, so the browser does not check it. Declare the `minChecked` rule to check it there too.',
});

export const filesTitle = message({
  ja: 'ファイルを受け取る',
  en: 'Accept a file',
});

export const filesDescription = message({
  ja: '`z.file()`はファイルの入力欄になり、`.mime()`は`accept`の属性になります。',
  en: '`z.file()` becomes a file control, and `.mime()` becomes `accept`.',
});

export const filesServer = message({
  ja: '`accept`はファイルを選ぶときの候補を絞るだけで、ブラウザは選ばれたファイルの種類を確かめません。種類と大きさの検証は、サーバーだけで行います。',
  en: '`accept` only narrows what the file picker offers; the browser never checks the type. Type and size are checked on the server alone.',
});

export const filesEcho = message({
  ja: '送信に失敗しても、選んだファイルは入力欄に戻りません。ブラウザが、ファイルの入力欄に値を戻すことを許していないためです。',
  en: 'After a failed submission, the chosen file does not come back: browsers do not let a file control be given a value.',
});

export const passwordTitle = message({
  ja: 'パスワードを受け取る',
  en: 'Accept a password',
});

export const passwordDescription = message({
  ja: 'スキーマに`input: "password"`のメタ情報を付けると、`type="password"`の入力欄になります。',
  en: 'Mark a field with `input: "password"` in the schema’s metadata, and it becomes a `type="password"` field.',
});

export const passwordEcho = message({
  ja: 'パスワードの入力欄は、送信に失敗しても入力されていた値を返しません。',
  en: 'A password field never sends what was typed back after a failed submission.',
});

export const passwordMini = message({
  ja: '`zod/mini`には`.meta()`が無いので、`.check(z.meta(…))`の形で付けます。',
  en: '`zod/mini` has no `.meta()`; add it with `.check(z.meta(…))`.',
});
