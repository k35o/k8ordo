import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'スキーマの中のオブジェクトはドットでつないだパスで、オブジェクトの配列は行の集まりとして扱います。どちらも、パスがそのままブラウザの送る `name` になります。',
  en: 'An object inside the schema is reached by a dotted path, and an array of objects as a set of rows. Either way, the path is the `name` the browser submits.',
});

export const nestedTitle = message({
  ja: '入れ子のオブジェクトの欄を取り出す',
  en: 'Reach a field inside a nested object',
});

export const nestedDescription = message({
  ja: '`field()` にドットでつないだパスを渡します。送られる `name` も、`state.errors` のキーも同じパスです。',
  en: 'Pass `field()` a dotted path. The submitted `name` and the key in `state.errors` are the same path.',
});

export const nestedOptional = message({
  ja: '`.optional()` や `.default()` の付いたオブジェクトも、中の欄はそのまま使えます。',
  en: 'An object behind `.optional()` or `.default()` keeps its fields as they are.',
});

export const nestedAlwaysRender = message({
  ja: '中の欄は、オブジェクトを省けるときでも常に描きます。名前が `FormData` に無いと、`parseForm` は広げ忘れとみなして例外を投げます。',
  en: 'Render its controls even when the object may be left out. A name missing from the `FormData` makes `parseForm` throw, since it reads as a forgotten spread.',
});

export const rowsTitle = message({
  ja: '行を足す・消す',
  en: 'Add and remove rows',
});

export const rowsDescription = message({
  ja: 'オブジェクトの配列は `array()` で取り出します。行ごとの欄は `row.field()` で取り出し、`row.key` を `key` に渡します。',
  en: 'Reach an array of objects with `array()`. Get each row’s fields with `row.field()`, and pass `row.key` to `key`.',
});

export const rowsBounds = message({
  ja: '`canAdd` と `canRemove` は、スキーマの `.max()` と `.min()` から決まります。サーバーが拒む行数になる手前で、ボタンが消えます。',
  en: '`canAdd` and `canRemove` follow the schema’s `.max()` and `.min()`, so the buttons disappear right where the server would refuse.',
});

export const rowsState = message({
  ja: 'React の state が持つのは、行を見分ける `key` だけです。値は DOM にあるので、行を足しても消しても、入力した値を React に写すことはありません。',
  en: 'React state holds only each row’s `key`. The values stay in the DOM, so adding or removing a row never copies them into React.',
});

export const arrayErrorTitle = message({
  ja: '行数のエラーを表示する',
  en: 'Show an error about the number of rows',
});

export const arrayErrorDescription = message({
  ja: '行が `.min()` より少ない、`.max()` より多いというエラーは、どの行の欄にも属さず `items.error` に入ります。',
  en: 'Too few rows for `.min()`, or too many for `.max()`, is an error no row’s field owns. It arrives in `items.error`.',
});

export const arrayErrorProps = message({
  ja: '表示する要素に `items.errorProps` を広げます。広げないと、配列だけが失敗した送信でフォーカスがどこにも移らず、スクリーンリーダーには何も伝わりません。',
  en: 'Spread `items.errorProps` onto the element that shows it. Without them, a submission that failed only on the array moves focus nowhere, and a screen reader says nothing.',
});

export const arrayErrorPlace = message({
  ja: '行より上に置けば、行も失敗しているときにもまずここへフォーカスが移り、Tab で行へ進めます。',
  en: 'Put it above the rows: it takes focus first even when a row failed too, and Tab moves on into the rows.',
});

export const namesTitle = message({
  ja: '送られる名前',
  en: 'The names that are submitted',
});

export const namesDescription = message({
  ja: '行の中の欄の `name` は、`items[0].name` のように添字を含みます。エラーのキーも同じです。',
  en: 'A field inside a row is named with its index, as in `items[0].name`, and its error key is the same.',
});

export const namesRemove = message({
  ja: '行を消すと、後ろの行の添字が詰まります。ブラウザで出したエラーも、行と一緒に移ります。',
  en: 'Removing a row moves the later rows up one index, and the errors the browser raised move with them.',
});

export const namesServer = message({
  ja: 'サーバーが返したエラーは、添字を振り直しません。上の行を消すと、まだ直していないエラーは、その添字になった行に出ます。',
  en: 'Errors the server returned are not renumbered. Remove a row above one, and an error not yet fixed shows on whichever row now has that index.',
});

export const initialTitle = message({
  ja: '最初に描く行数',
  en: 'How many rows render first',
});

export const initialDescription = message({
  ja: '送信のあとなら `state.rows` の数、そうでなければスキーマの `.min()`、それも無ければ 0 行です。',
  en: 'After a submission, the count in `state.rows`; otherwise the schema’s `.min()`; otherwise none.',
});

export const initialNoJs = message({
  ja: '`parseForm` は届いた行数を `state.rows` に入れて返すので、JavaScript が無くても、送り直したときに同じ行数で描き直せます。',
  en: '`parseForm` reports how many rows arrived in `state.rows`, so a retry without JavaScript renders the same number of rows.',
});

export const initialForged = message({
  ja: '行数は送られた添字から数えますが、`.max()` を超えては信じません。大きな添字を偽って送っても、サーバーが大きな配列を作ることはありません。',
  en: 'The count is read from the submitted indexes but never trusted beyond `.max()`, so a forged index cannot make the server allocate.',
});

export const scalarTitle = message({
  ja: '文字列の配列',
  en: 'An array of strings',
});

export const scalarDescription = message({
  ja: '`z.array(z.string())` のような値の配列では、行に欄の名前がありません。`row.field()` を引数なしで呼ぶと、`name` は `tags[0]` になります。',
  en: 'In an array of plain values such as `z.array(z.string())`, a row’s field has no key. Call `row.field()` with no argument, and its `name` is `tags[0]`.',
});

export const scalarEnum = message({
  ja: '選択肢の配列（`z.array(z.enum([…]))`）は行ではなく、1 つの欄のチェックボックス群です。「入力欄の種類」を見てください。',
  en: 'An array of enums (`z.array(z.enum([…]))`) is not rows but one field, a checkbox group. See “Field types”.',
});

export const limitsTitle = message({
  ja: '書けない形',
  en: 'Shapes it cannot take',
});

export const limitsNested = message({
  ja: '行の中にさらに行を入れる形は、送る名前が一つに決まらないので、`formFields` と `parseForm` が例外を投げます。型では止まりません。',
  en: 'A repeat inside a repeat has no single name to submit under, so `formFields` and `parseForm` throw on it. The types let it through.',
});

export const limitsRules = message({
  ja: '`sameAs` などのルールは、行の中の欄には書けません。行の欄の検査は、スキーマの中に書きます。',
  en: 'Rules such as `sameAs` cannot name a field inside a row. Write a row field’s checks in the schema.',
});

export const demoTitle = message({
  ja: '注文の行を足す',
  en: 'Add rows to an order',
});

export const demoDescription = message({
  ja: '行は 1〜3 行のスキーマです。送信すると、送られるはずだった名前と値を表示します。',
  en: 'The schema allows one to three rows. Submitting shows the names and values that would be sent.',
});

export const demoSteps = [
  message({
    ja: '「行を足す」を 2 回押すと、3 行目でボタンが消えます。スキーマの `.max(3)` です。',
    en: 'Press “Add a row” twice. The button disappears at the third row: that is the schema’s `.max(3)`.',
  }),
  message({
    ja: '2 行目を空のまま「送信」を押すと、送信は止まり、2 行目の欄にフォーカスが移ります。',
    en: 'Leave the second row empty and press “Submit”. The submission stops and focus moves to the second row.',
  }),
  message({
    ja: '1 行目を消してから埋めて送ると、名前の添字が詰まって `items[0].name` から並びます。',
    en: 'Remove the first row, fill the rest, and submit. The indexes close up, starting again at `items[0].name`.',
  }),
] as const;

export const demoRow = message({
  ja: (number: number) => `${String(number)} 行目`,
  en: (number) => `Row ${String(number)}`,
});

export const demoLabelName = message({
  ja: '品名',
  en: 'Item',
});

export const demoLabelQuantity = message({
  ja: '数量',
  en: 'Quantity',
});

export const demoRemove = message({
  ja: '消す',
  en: 'Remove',
});

export const demoAdd = message({
  ja: '行を足す',
  en: 'Add a row',
});

export const demoSubmit = message({
  ja: '送信',
  en: 'Submit',
});

export const demoNameMissing = message({
  ja: '品名を入力してください',
  en: 'Enter an item',
});

export const demoQuantityMissing = message({
  ja: '数量を入力してください',
  en: 'Enter a quantity',
});

export const demoQuantityWhole = message({
  ja: '整数で入力してください',
  en: 'Use a whole number',
});

export const demoQuantityMin = message({
  ja: '1 以上にしてください',
  en: 'Order at least one',
});

export const demoItemsMin = message({
  ja: '1 行以上入力してください',
  en: 'Add at least one item',
});

export const demoItemsMax = message({
  ja: '3 行までにしてください',
  en: 'Keep it to three items',
});
