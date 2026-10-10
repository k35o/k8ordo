import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'zodのスキーマから導かれる入力欄の種類と属性、空のときに送られる値の一覧です。ブラウザで確かめない検証と、エラーになるスキーマも分かります。',
  en: 'The control and attributes each zod schema derives, and what an empty control submits. It also lists the checks the browser skips and the schemas that are rejected.',
});

export const typesTitle = message({
  ja: '入力欄の種類',
  en: 'Control types',
});

export const typesLead = message({
  ja: 'スキーマの型ごとに、`input`の`type`は次のとおりです。',
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
  en: '`z.stringbool()`: `type="checkbox"` with the `value` a checked box submits',
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
  en: 'A check such as `.regex()` stacked on `z.email()` or `z.iso.date()` does not change the control type.',
});

export const attrsTitle = message({
  ja: '制約と属性',
  en: 'Constraints and attributes',
});

export const attrsLead = message({
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
  ja: '空のときに送られる値がスキーマに合わないとき：`required`',
  en: 'When what an empty control submits does not match the schema: `required`',
});

export const emptyTitle = message({
  ja: '空のときに送られる値',
  en: 'Empty values',
});

export const emptyLead = message({
  ja: '`parseForm`は、空の入力欄を次の値としてスキーマに渡します。',
  en: '`parseForm` hands the schema these values for an empty control:',
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
  ja: '数値、`z.coerce.bigint()`、ファイル：何も送らない（`undefined`）',
  en: 'A number, a `z.coerce.bigint()` or a file: nothing (`undefined`)',
});

export const emptyUnselected = message({
  ja: '未選択のラジオと、プレースホルダーのままの`<select>`：何も送らない（`undefined`）',
  en: 'A radio group with nothing selected, or a `<select>` left on its placeholder: nothing (`undefined`)',
});

export const emptyStringbool = message({
  ja: 'チェックの無い`z.stringbool()`のチェックボックス：何も送らない（`undefined`）',
  en: 'An unchecked `z.stringbool()` checkbox: nothing (`undefined`)',
});

export const emptyGroup = message({
  ja: 'チェックの無いチェックボックスの集まり：`[]`',
  en: 'A checkbox group with nothing checked: `[]`',
});

export const droppedTitle = message({
  ja: 'ブラウザで確かめない検証',
  en: 'Checks the browser skips',
});

export const droppedLead = message({
  ja: '次の検証はHTMLの属性で表せないので、`dropped`に載ります。どれもサーバーでは確かめます。',
  en: 'These checks cannot be expressed as HTML attributes, so they are listed in `dropped`. The server still runs every one.',
});

export const droppedRefine = message({
  ja: 'スキーマ全体に付けた`.refine()`',
  en: 'A `.refine()` on the whole schema',
});

export const droppedExclusive = message({
  ja: '小数に付けた`.gt()`、`.lt()`（境界を含まない範囲）',
  en: 'An exclusive bound on a float (`.gt()`, `.lt()`)',
});

export const droppedRegex = message({
  ja: 'フラグやアンカーを持つ正規表現と、1つの文字列に重ねた複数の正規表現',
  en: 'A regex with flags or anchors, and several regexes on one string',
});

export const droppedPattern = message({
  ja: '`pattern`を無視する入力欄（`type="date"`など）に付けた正規表現',
  en: 'A regex on a control that ignores `pattern`, such as `type="date"`',
});

export const droppedMime = message({
  ja: 'ファイルの`.mime()`。`accept`は選択画面の候補を絞るだけで、ブラウザは種類を確かめません',
  en: '`.mime()` on a file. `accept` only filters the file picker, and the browser never checks the type',
});

export const droppedFileSize = message({
  ja: 'ファイルの大きさの`.min()`、`.max()`',
  en: 'Size bounds (`.min()`, `.max()`) on a file',
});

export const droppedDatetime = message({
  ja: '`datetime-local`の入力欄では満たせない`z.iso.datetime()`',
  en: 'A `z.iso.datetime()` that no `datetime-local` control can satisfy',
});

export const droppedGroupMin = message({
  ja: 'チェックボックスの集まりの`.min()`。`minChecked`を宣言するとブラウザでも確かめます',
  en: '`.min()` on a checkbox group; declare `minChecked` to run it in the browser too',
});

export const droppedTransform = message({
  ja: '`.transform()`や`z.custom()`を通したあとの制約。スキーマから読み取れません',
  en: 'Constraints after a `.transform()` or `z.custom()`, which the schema does not expose',
});

export const droppedNotYet = message({
  ja: '1つのフィールドや入れ子のオブジェクト、配列の行に付けた`.refine()`は、まだ`dropped`に載りません。ブラウザでは確かめず、サーバーでだけ確かめます。',
  en: 'A `.refine()` on a single field, a nested object or a row is not listed in `dropped` yet. The browser lets it through, and only the server checks it.',
});

export const refusedTitle = message({
  ja: 'エラーになるスキーマ',
  en: 'Rejected schemas',
});

export const refusedLead = message({
  ja: "次のスキーマを渡すと、`formFields`と`parseForm`はエラーになります。エラー文には場所と理由が入ります（例：`[@k8ordo/form] 'rows.tags': 繰り返しの中の繰り返しは name の添字が一意に決まらないため表現できません`）。",
  en: "`formFields` and `parseForm` throw on these schemas. The message names the path and the reason, for example `[@k8ordo/form] 'rows.tags': 繰り返しの中の繰り返しは name の添字が一意に決まらないため表現できません`.",
});

export const refusedNumber = message({
  ja: '`z.number()`と`z.bigint()`と`z.date()`と`z.literal(1)`：送られる値はすべて文字列なので、どの入力も通りません。`z.coerce`を使います',
  en: '`z.number()`, `z.bigint()`, `z.date()`, `z.literal(1)`: every submitted value is a string, so nothing could pass. Use `z.coerce`',
});

export const refusedShape = message({
  ja: '`z.record`、タプル、nullableなオブジェクト：`name`が1つに決まりません',
  en: '`z.record`, tuples, nullable objects: there is no single `name` to submit under',
});

export const refusedNested = message({
  ja: '繰り返しの中の繰り返し：`name`の添字が1つに決まりません',
  en: 'A repeat nested inside a repeat: the indexes in `name` cannot be determined',
});

export const refusedKey = message({
  ja: '`.`や`[`、`]`を含むキー：`name`の中の区切りと区別できません',
  en: 'Keys holding `.` or brackets: they cannot be told apart from the separators in `name`',
});

export const refusedStringbool = message({
  ja: '`z.stringbool().default(true)`：チェックを外しても`false`を送れません',
  en: '`z.stringbool().default(true)`: unchecking the box could never submit `false`',
});

export const notYetTitle = message({
  ja: 'まだできないこと',
  en: 'Not supported yet',
});

export const notYetFiles = message({
  ja: '1つの入力欄で複数のファイルを受け取ること。`z.array(z.file())`は、ファイル1つずつの行の繰り返しになります',
  en: 'Several files in one control. `z.array(z.file())` derives repeated single-file rows',
});

export const notYetRowRules = message({
  ja: '配列の行の中の入力欄に、ルールを宣言すること',
  en: 'Rules on fields inside repeated rows',
});

export const notYetMask = message({
  ja: '入力のマスク。値は書き換えられますが、カーソル位置は保ちません',
  en: 'Input masking. The value can be rewritten, but the caret position is not kept',
});
