import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '入力欄の種類は、スキーマの型で決まります。型ごとに、スキーマを書いて`input`を入力欄に渡せるようになります。',
  en: 'The schema type decides which control a field becomes. For each type, you can write the schema and pass `input` to the control.',
});

export const overviewTitle = message({
  ja: 'スキーマと入力欄の対応',
  en: 'Schema to control',
});

export const overview = message({
  ja: '`field()`が返す`input`には、スキーマに応じた属性が入ります。多くの場合は、そのまま入力欄に展開します。ラジオボタンと複数選択では、下の節のとおり一部だけを渡します。',
  en: 'The `input` that `field()` returns carries the attributes for the schema. Most of the time you spread it onto the control as it is. Radio buttons and several options take only part of it, as their sections below show.',
});

export const overviewNoType = message({
  ja: '`z.enum()`と`z.array(z.enum())`の`input`には`type`が入りません。前者は`<select>`に展開し、後者は選択肢ごとのチェックボックスにします。ここに無い型（`z.uuid()`など）は、テキストの入力欄になります。',
  en: 'The `input` for `z.enum()` and `z.array(z.enum())` has no `type`. Spread the first onto a `<select>`, and render the second as one checkbox per option. Any type not listed here (`z.uuid()` and so on) becomes a text field.',
});

export const textTitle = message({
  ja: '文字列',
  en: 'Text',
});

export const text = message({
  ja: '`z.string()`はテキストの入力欄になります。`.min()`は`minlength`、`.max()`は`maxlength`、`.regex()`は`pattern`の属性になります。',
  en: '`z.string()` becomes a text field. `.min()` becomes `minlength`, `.max()` becomes `maxlength`, and `.regex()` becomes `pattern`.',
});

export const textFormats = message({
  ja: '`z.email()`は`type="email"`、`z.url()`は`type="url"`になり、書式はブラウザが確かめます。',
  en: '`z.email()` becomes `type="email"` and `z.url()` becomes `type="url"`. The browser checks the format.',
});

export const textPitfall = message({
  ja: '空のテキスト欄は`""`を送ります。`.optional()`を付けていても、`.min(1)`があれば空欄のままでは通りません。',
  en: 'An empty text field submits `""`. Even with `.optional()`, a field with `.min(1)` does not accept a blank.',
});

export const textPitfallFix = message({
  ja: '空欄を許すときは、`""`を受け付けるスキーマにします。',
  en: 'To allow a blank, write a schema that accepts `""`.',
});

export const datesTitle = message({
  ja: '日付と時刻',
  en: 'Dates and times',
});

export const dates = message({
  ja: '`z.iso`の書式は、ブラウザの日付や時刻の入力欄になります。値はISO形式の文字列のまま受け取ります。',
  en: 'The `z.iso` formats become the browser’s date and time controls. The value arrives as an ISO string.',
});

export const datesCoerce = message({
  ja: '`Date`として受け取るには`z.coerce.date()`を使います。この場合はテキストの入力欄になります。`z.date()`は文字列を受け付けないので、`formFields`が`フォームが送信できる値がありません`というエラーにします。',
  en: 'To receive a `Date`, use `z.coerce.date()`. It becomes a text field. `z.date()` accepts no string, so `formFields` throws (`フォームが送信できる値がありません`).',
});

export const numbersTitle = message({
  ja: '数値',
  en: 'Numbers',
});

export const numbers = message({
  ja: '数値の入力欄は`z.coerce.number()`で書きます。`type="number"`になり、`.min()`と`.max()`は`min`と`max`の属性になります。',
  en: 'Write a numeric field with `z.coerce.number()`. It becomes `type="number"`, and `.min()` and `.max()` become `min` and `max`.',
});

export const numbersStep = message({
  ja: '`step`は、`.int()`があれば`1`に、`.multipleOf()`があればその値になります。どちらも無ければ`any`になり、小数も入力できます。',
  en: '`step` is `1` after `.int()` and the given value after `.multipleOf()`. Without either it is `any`, which allows decimals.',
});

export const numbersEmpty = message({
  ja: '空の数値欄は何も送らず、`0`にもなりません。空欄を許すなら`.optional()`を付けます。',
  en: 'An empty numeric field submits nothing, and is not `0`. Add `.optional()` to allow a blank.',
});

export const numbersPitfall = message({
  ja: '`z.number()`は使えません。フォームが送る値はいつも文字列なので、どの入力も通りません。`formFields`が`z.coerce.number() を使ってください`というエラーにします。',
  en: '`z.number()` does not work. Every submitted value is a string, so no input would pass. `formFields` throws (`z.coerce.number() を使ってください`).',
});

export const selectTitle = message({
  ja: '選択肢から1つ',
  en: 'One of several options',
});

export const select = message({
  ja: '`z.enum()`の`input`は`<select>`に展開します。先頭に値が空の選択肢を置くと、`required`は「どれかを選ぶ」という意味になります。',
  en: 'Spread a `z.enum()` field’s `input` onto a `<select>`. With an empty-valued option first, `required` means “choose one”.',
});

export const selectOptional = message({
  ja: '`.optional()`を付けると、空の選択肢のままでも送信できます。',
  en: 'With `.optional()`, the empty option can be submitted as it is.',
});

export const radioTitle = message({
  ja: 'ラジオボタン',
  en: 'Radio buttons',
});

export const radio = message({
  ja: 'ラジオボタンには、`input`の`name`と`required`を渡します。前回の選択は`state.values`を見て、選択肢ごとに`defaultChecked`で戻します。',
  en: 'Give a radio button the `name` and `required` from `input`. Restore the previous choice per option with `defaultChecked` from `state.values`.',
});

export const radioPitfall = message({
  ja: 'ラジオボタンに`input`をそのまま展開しないでください。送信のあとは`input`の`defaultValue`に前回の値が入り、各ラジオボタンの`value`とぶつかります。',
  en: 'Do not spread `input` onto a radio button as it is. After a submission, `input` carries the previous choice as `defaultValue`, which collides with each radio button’s `value`.',
});

export const radioUiBefore = message({
  ja: '`@k8ordo/ui`の`Radio`と`RadioCard`は、`input`をそのまま展開できます。使い方は',
  en: '`@k8ordo/ui`’s `Radio` and `RadioCard` take the spread `input` as it is. See ',
});

export const radioUiAfter = message({
  ja: 'を見てください。',
  en: '.',
});

export const checkboxTitle = message({
  ja: 'チェックボックス',
  en: 'Checkbox',
});

export const checkbox = message({
  ja: '`z.boolean()`はチェックボックスになります。チェックが無いときは`false`を受け取るので、必須の欄にはなりません。',
  en: '`z.boolean()` becomes a checkbox. An unchecked box arrives as `false`, so the field is never required.',
});

export const checkboxConsent = message({
  ja: '規約への同意のように、チェックを必須にするときは`z.literal(true)`を使います。',
  en: 'When the box must be checked, as with agreeing to terms, use `z.literal(true)`.',
});

export const stringboolTitle = message({
  ja: '文字列のチェックボックス',
  en: 'Checkbox that submits a string',
});

export const stringbool = message({
  ja: '`z.stringbool()`のチェックボックスは、チェックされると`input.value`の文字列を送ります。既定では`"true"`です。値がURLに残るGETのフォームで使います。',
  en: 'A `z.stringbool()` checkbox submits the string in `input.value` when checked, `"true"` by default. Use it in a GET form whose values stay in the URL.',
});

export const stringboolUnchecked = message({
  ja: 'チェックが無いときは何も送らないので、`.default(false)`か`.optional()`を付けます。`.default(true)`は、`formFields`が`false を送れません`というエラーにします。',
  en: 'An unchecked box submits nothing, so add `.default(false)` or `.optional()`. `formFields` throws on `.default(true)` (`false を送れません`).',
});

export const groupTitle = message({
  ja: '複数選択',
  en: 'Several options',
});

export const group = message({
  ja: '`z.array(z.enum())`は、同じ`name`を持つチェックボックスの集まりになります。チェックされた値を配列で受け取り、1つも無ければ`[]`です。',
  en: '`z.array(z.enum())` becomes a group of checkboxes sharing one `name`. The checked values arrive as an array, and none checked is `[]`.',
});

export const groupMinBefore = message({
  ja: '`.min(2)`のような下限はHTMLの属性にならないので、ブラウザでは確かめません。ブラウザでも確かめるには、',
  en: 'A lower bound such as `.min(2)` has no HTML attribute, so the browser does not check it. To check it in the browser too, declare the `minChecked` rule on ',
});

export const groupMinAfter = message({
  ja: 'の`minChecked`を宣言します。',
  en: '.',
});

export const filesTitle = message({
  ja: 'ファイル',
  en: 'Files',
});

export const files = message({
  ja: '`z.file()`はファイルの入力欄になり、`.mime()`は`accept`の属性になります。',
  en: '`z.file()` becomes a file control, and `.mime()` becomes `accept`.',
});

export const filesServer = message({
  ja: '`accept`はファイルを選ぶときの候補を絞るだけで、ブラウザは選ばれたファイルの種類を確かめません。種類と大きさは、サーバーだけで検証します。',
  en: '`accept` only narrows what the file picker offers. The browser never checks the type, so type and size are checked on the server alone.',
});

export const filesEcho = message({
  ja: '送信に失敗しても、選んだファイルは入力欄に戻りません。ブラウザはファイルの入力欄に値を設定できないためです。',
  en: 'After a failed submission, the chosen file does not come back: no browser lets a value be put into a file control.',
});

export const passwordTitle = message({
  ja: 'パスワード',
  en: 'Passwords',
});

export const password = message({
  ja: 'スキーマに`input: "password"`のメタ情報を付けると、`type="password"`の入力欄になります。',
  en: 'Mark a field with `input: "password"` in its metadata, and it becomes a `type="password"` field.',
});

export const passwordEcho = message({
  ja: '送信に失敗しても、入力されていた値は`state.values`に含まれません。',
  en: 'After a failed submission, what was typed is left out of `state.values`.',
});

export const passwordMini = message({
  ja: '`zod/mini`には`.meta()`が無いので、`.check(z.meta(…))`で付けます。',
  en: '`zod/mini` has no `.meta()`; add it with `.check(z.meta(…))`.',
});
