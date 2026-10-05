import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'zodのスキーマが、どんな入力欄と属性になるかの一覧です。あわせて、空のときに送られる値と、ブラウザで確かめない検証、扱えないスキーマをまとめています。',
  en: 'What each zod schema becomes as a control and its attributes, along with what an empty control submits, the checks the browser does not run, and the schemas it cannot take.',
});

export const typesTitle = message({
  ja: '入力欄の種類',
  en: 'Control types',
});

export const typesDescription = message({
  ja: 'スキーマの型ごとに、`input`の`type`は次のようになります。',
  en: 'The `type` in `input` for each kind of schema:',
});

export const typeString = message({
  ja: '`z.string()`：`type="text"`',
  en: '`z.string()`: `type="text"`',
});

export const typeEmailUrl = message({
  ja: '`z.email()`、`z.url()`：`type="email"`、`type="url"`',
  en: '`z.email()`, `z.url()`: `type="email"`, `type="url"`',
});

export const typeDate = message({
  ja: '`z.iso.date()`、`z.iso.time()`：`type="date"`、`type="time"`',
  en: '`z.iso.date()`, `z.iso.time()`: `type="date"`, `type="time"`',
});

export const typeDatetime = message({
  ja: '`z.iso.datetime({ local: true })`：`type="datetime-local"`',
  en: '`z.iso.datetime({ local: true })`: `type="datetime-local"`',
});

export const typeNumber = message({
  ja: '`z.coerce.number()`：`type="number"`',
  en: '`z.coerce.number()`: `type="number"`',
});

export const typeBoolean = message({
  ja: '`z.boolean()`、`z.literal(true)`：`type="checkbox"`',
  en: '`z.boolean()`, `z.literal(true)`: `type="checkbox"`',
});

export const typeStringbool = message({
  ja: '`z.stringbool()`：`type="checkbox"`と、チェックしたときに送る`value`',
  en: '`z.stringbool()`: `type="checkbox"`, with the `value` a checked box submits',
});

export const typeFile = message({
  ja: '`z.file()`：`type="file"`',
  en: '`z.file()`: `type="file"`',
});

export const typePassword = message({
  ja: '`input: "password"`のメタ情報を付けた文字列：`type="password"`',
  en: 'A string with `input: "password"` metadata: `type="password"`',
});

export const typeEnum = message({
  ja: '`z.enum([…])`：`type`なし。`<select>`に展開します',
  en: '`z.enum([…])`: no `type`; spread it onto a `<select>`',
});

export const typeEnumArray = message({
  ja: '`z.array(z.enum([…]))`：`type`なし。選択肢ごとのチェックボックスにします',
  en: '`z.array(z.enum([…]))`: no `type`; one checkbox per option',
});

export const typeOther = message({
  ja: 'それ以外（`z.uuid()`や`z.coerce.date()`など）：`type="text"`',
  en: 'Anything else (`z.uuid()`, `z.coerce.date()`, …): `type="text"`',
});

export const typesFormat = message({
  ja: '`z.email()`や`z.iso.date()`に`.regex()`などの検証を重ねても、入力欄の種類は変わりません。',
  en: 'Stacking a check such as `.regex()` on `z.email()` or `z.iso.date()` does not change the control type.',
});

export const attrsTitle = message({
  ja: '制約と属性',
  en: 'Constraints and attributes',
});

export const attrsDescription = message({
  ja: 'スキーマの制約は、次の属性になります。',
  en: 'Schema constraints become these attributes:',
});

export const attrLength = message({
  ja: '文字列の`.min()`、`.max()`：`minLength`、`maxLength`',
  en: '`.min()`, `.max()` on a string: `minLength`, `maxLength`',
});

export const attrRegex = message({
  ja: '`.regex()`：`pattern`。正規表現が1つだけで、フラグを持たない場合に限ります',
  en: '`.regex()`: `pattern`, when it is the only regex and has no flags',
});

export const attrRange = message({
  ja: '数値の`.min()`、`.max()`：`min`、`max`',
  en: '`.min()`, `.max()` on a number: `min`, `max`',
});

export const attrStep = message({
  ja: '`.multipleOf()`：その値の`step`。`.int()`だけなら`step="1"`、どちらも無ければ`step="any"`',
  en: '`.multipleOf()`: that value as `step`. `.int()` alone gives `step="1"`, and neither gives `step="any"`',
});

export const attrMime = message({
  ja: 'ファイルの`.mime()`：`accept`',
  en: '`.mime()` on a file: `accept`',
});

export const attrRequired = message({
  ja: '空のときに送る値をスキーマが拒むとき：`required`',
  en: 'When the schema rejects what an empty control submits: `required`',
});

export const emptyTitle = message({
  ja: '空のときに送られる値',
  en: 'What an empty control submits',
});

export const emptyDescription = message({
  ja: '`required`を付けるかどうかも、`parseForm`がスキーマに渡す値も、ここで決まります。',
  en: 'This decides both whether `required` is emitted and what `parseForm` hands the schema.',
});

export const emptyText = message({
  ja: 'テキストの入力欄：`""`',
  en: 'A text control: `""`',
});

export const emptyCheckbox = message({
  ja: 'チェックの無い`z.boolean()`のチェックボックス：`false`',
  en: 'An unchecked `z.boolean()` checkbox: `false`',
});

export const emptyNothing = message({
  ja: '数値と`z.coerce.bigint()`、ファイル、選択肢：何も送らない（`undefined`）',
  en: 'A number, a `z.coerce.bigint()`, a file or a choice: nothing (`undefined`)',
});

export const emptyStringbool = message({
  ja: 'チェックの無い`z.stringbool()`のチェックボックス：何も送らない（`undefined`）',
  en: 'An unchecked `z.stringbool()` box: nothing (`undefined`)',
});

export const emptyGroup = message({
  ja: 'チェックの無いチェックボックスの集まり：`[]`',
  en: 'A checkbox group with nothing checked: `[]`',
});

export const droppedTitle = message({
  ja: 'ブラウザで確かめない検証',
  en: 'Checks the browser does not run',
});

export const droppedDescription = message({
  ja: '次の検証はHTMLの属性で表せないので、`dropped`に載ります。どれもサーバーでは確かめます。',
  en: 'These cannot be expressed as HTML attributes, so they are listed in `dropped`. The server still runs every one.',
});

export const droppedRefine = message({
  ja: 'スキーマ全体に付けた`.refine()`',
  en: 'A `.refine()` on the whole schema',
});

export const droppedExclusive = message({
  ja: '小数の範囲の、境界を含まない指定（`.gt()`、`.lt()`）',
  en: 'An exclusive bound on a float (`.gt()`, `.lt()`)',
});

export const droppedRegex = message({
  ja: 'フラグ付きの正規表現と、1つの文字列に重ねた複数の正規表現',
  en: 'A regex with flags, and several regexes on one string',
});

export const droppedPattern = message({
  ja: '`pattern`を無視する入力欄（`type="date"`など）に付けた正規表現',
  en: 'A regex on a control that ignores `pattern`, such as `type="date"`',
});

export const droppedMime = message({
  ja: 'ファイルの`.mime()`と、大きさの`.min()`、`.max()`',
  en: '`.mime()` on a file, and its size bounds',
});

export const droppedGroupMin = message({
  ja: 'チェックボックスの集まりの`.min()`。`minChecked`でブラウザでも確かめられます',
  en: '`.min()` on a checkbox group; declare `minChecked` to run it in the browser too',
});

export const droppedTransform = message({
  ja: '`.transform()`や`z.custom()`の後ろにあって、中身を読めない制約',
  en: 'Constraints behind a `.transform()` or a `z.custom()`, which cannot be read',
});

export const droppedNotYet = message({
  ja: '1つの入力欄や入れ子のオブジェクト、配列の行に付けた`.refine()`は、まだ`dropped`に載りません。ブラウザでは何も知らせずに通し、サーバーでだけ確かめます。',
  en: 'A `.refine()` on a single field, a nested object or a row is not listed in `dropped` yet. The browser lets it through without a word, and only the server checks it.',
});

export const refusedTitle = message({
  ja: 'エラーになるスキーマ',
  en: 'Schemas it refuses',
});

export const refusedDescription = message({
  ja: '次のスキーマを渡すと、`formFields`と`parseForm`が理由を添えてエラーを投げます。',
  en: '`formFields` and `parseForm` throw, with the reason, on these:',
});

export const refusedNumber = message({
  ja: '`z.number()`と`z.bigint()`、`z.date()`、`z.literal(1)`：どの値も文字列で届くので、どんな入力も通りません。`z.coerce`を使います',
  en: '`z.number()`, `z.bigint()`, `z.date()`, `z.literal(1)`: every value arrives as a string, so nothing could pass. Use `z.coerce`',
});

export const refusedShape = message({
  ja: '`z.record`、タプル、nullableなオブジェクト、行の中の行：送信する名前が1つに決まりません',
  en: '`z.record`, tuples, nullable objects, a repeat inside a repeat: there is no single name to submit under',
});

export const refusedKey = message({
  ja: '`.`や`[`、`]`を含むキー：名前の区切りと区別できません',
  en: 'Keys holding `.` or brackets: they cannot be told apart from the path separators',
});

export const refusedStringbool = message({
  ja: '`z.stringbool().default(true)`：チェックを外しても`false`を送れません',
  en: '`z.stringbool().default(true)`: unchecking the box could never submit `false`',
});

export const notYetTitle = message({
  ja: 'まだできないこと',
  en: 'What it does not do yet',
});

export const notYetFiles = message({
  ja: '1つの入力欄で複数のファイルを受け取ること。`z.array(z.file())`は、1ファイルずつの繰り返しの行になります',
  en: 'Several files in one control. `z.array(z.file())` derives repeated single-file rows',
});

export const notYetRowRules = message({
  ja: '配列の行の中の入力欄に、ルールを宣言すること',
  en: 'Rules on fields inside repeated rows',
});

export const notYetMask = message({
  ja: '入力のマスク。値を書き換えることはできますが、カーソル位置の管理はフォームとは別の問題として扱っていません',
  en: 'Input masking. Rewriting the value works, but managing the caret is a separate problem from wiring a form',
});
