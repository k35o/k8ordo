import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'スキーマの中のオブジェクトを`field()`のパスで、オブジェクトの配列を`array()`の行として扱えるようになります。どちらも、パスがそのまま送信される`name`です。',
  en: 'Work with an object inside the schema through a `field()` path, and with an array of objects through the rows of `array()`. In both cases the path is the `name` the browser submits.',
});

export const nestedTitle = message({
  ja: '入れ子のオブジェクト',
  en: 'Nested objects',
});

export const nestedPath = message({
  ja: '`field()`には、ドットでつないだパスを渡します。送信される`name`も、`state.errors`のキーも同じパスです。',
  en: 'Pass `field()` a dotted path. The submitted `name` and the key in `state.errors` are that same path.',
});

export const nestedOptional = message({
  ja: '`.optional()`や`.default()`の付いたオブジェクトでも、中の入力欄は同じように使えます。',
  en: 'An object behind `.optional()` or `.default()` keeps its fields, and they are used the same way.',
});

export const nestedAlwaysRender = message({
  ja: 'オブジェクトを省ける場合でも、中の入力欄は必ず描画してください。`name`が`FormData`に無いと、`parseForm`は`スキーマにあるフィールドが送信されていません`というエラーになります。',
  en: 'Render the fields even when the object may be left out. When a `name` is missing from the `FormData`, `parseForm` throws `スキーマにあるフィールドが送信されていません`.',
});

export const rowsTitle = message({
  ja: '繰り返し行',
  en: 'Repeated rows',
});

export const rowsKeyCallout = message({
  ja: '行を見分ける`key`',
  en: 'The `key` that tells rows apart',
});

export const rowsApi = message({
  ja: 'オブジェクトの配列は`array()`で扱います。行ごとの入力欄は`row.field()`で取り出し、`row.key`を`key`に渡します。',
  en: 'Use `array()` for an array of objects. Get each row’s fields with `row.field()`, and pass `row.key` to `key`.',
});

export const rowsBounds = message({
  ja: '行数がスキーマの`.max()`に達すると`canAdd`が、`.min()`に達すると`canRemove`が`false`になります。ボタンは、サーバーが受け付ける行数の範囲でだけ出ます。',
  en: '`canAdd` turns false once the row count reaches the schema’s `.max()`, and `canRemove` once it reaches `.min()`. The buttons only allow counts the server accepts.',
});

export const rowsState = message({
  ja: '行についてReactのstateが持つのは`key`だけです。行を追加や削除しても、入力した値はstateに入りません。',
  en: 'Per row, React state keeps only the `key`. Adding or removing a row never puts the typed values into state.',
});

export const arrayErrorTitle = message({
  ja: '行数のエラー',
  en: 'Row count errors',
});

export const arrayErrorOwner = message({
  ja: '行数が`.min()`や`.max()`に合わないときのエラーは、どの行にも表示されません。`items.error`に入ります。',
  en: 'An error for too few or too many rows belongs to no row. It is set on `items.error`.',
});

export const arrayErrorProps = message({
  ja: '表示する要素には`items.errorProps`を展開します。展開しないと、行数のエラーだけで送信が止まったときにフォーカスがどこにも移りません。スクリーンリーダーも何も読み上げません。',
  en: 'Spread `items.errorProps` onto the element that shows it. Without them, when only the row count stops a submission, focus moves nowhere. A screen reader announces nothing either.',
});

export const arrayErrorPlace = message({
  ja: 'エラーは行より上に表示します。行にもエラーがあるときは、まずここにフォーカスが移り、Tabキーで行へ進めます。',
  en: 'Show the error above the rows. When a row has errors too, focus lands here first, and Tab moves on into the rows.',
});

export const namesTitle = message({
  ja: '送信される`name`',
  en: 'Submitted `name`s',
});

export const namesIndex = message({
  ja: '行の中の入力欄の`name`は、`items[0].name`のように添字を含みます。`state.errors`のキーも同じ形です。',
  en: 'A field inside a row is named with its index, as in `items[0].name`. The key in `state.errors` has the same shape.',
});

export const namesRemove = message({
  ja: '行を削除すると、後ろの行の添字は1つずつ詰まります。ブラウザの検証で出たエラーも、行と一緒に移ります。',
  en: 'Removing a row moves the later rows up one index. Errors from validation in the browser move with them.',
});

export const namesServer = message({
  ja: 'サーバーが返したエラーの添字は振り直されません。上の行を削除すると、まだ直していないエラーはその添字になった別の行に表示されます。',
  en: 'Errors the server returned are not renumbered. Remove a row above one, and an error not yet fixed shows on whichever row now has that index.',
});

export const initialTitle = message({
  ja: '最初の行数',
  en: 'Initial row count',
});

export const initialCount = message({
  ja: '最初はスキーマの`.min()`の行数を描画します。`.min()`が無ければ0行です。',
  en: 'Before any submission, the form renders the schema’s `.min()` rows, or none without one.',
});

export const initialNoJs = message({
  ja: '送信のあとは、`parseForm`が返す`state.rows`の行数で描画します。JavaScriptが無い状態で送り直しても、行数は変わりません。',
  en: 'After a submission, it renders the count `parseForm` returns in `state.rows`. A retry without JavaScript keeps the same rows.',
});

export const initialForged = message({
  ja: '行数は送信された添字から数えます。ただし`.max()`より多くは数えません。大きな添字を偽って送られても、サーバーが大きな配列を作ることはありません。',
  en: 'The count is read from the submitted indexes and capped at `.max()`. A forged large index cannot make the server allocate a large array.',
});

export const scalarTitle = message({
  ja: '文字列の配列',
  en: 'Arrays of strings',
});

export const scalarField = message({
  ja: '`z.array(z.string())`のような値の配列では、行の中にフィールド名がありません。`row.field()`を引数なしで呼ぶと、`name`は`tags[0]`になります。',
  en: 'In an array of plain values such as `z.array(z.string())`, a row has no field name of its own. Call `row.field()` with no argument, and its `name` is `tags[0]`.',
});

export const scalarEnumBefore = message({
  ja: '選択肢の配列（`z.array(z.enum([…]))`）は繰り返し行にはなりません。チェックボックスの集まりを1つのフィールドとして扱います。詳しくは',
  en: 'An array of enums (`z.array(z.enum([…]))`) does not become rows. It is a checkbox group, handled as one field. See ',
});

export const scalarEnumAfter = message({
  ja: 'を見てください。',
  en: '.',
});

export const limitsTitle = message({
  ja: '扱えない形',
  en: 'Unsupported shapes',
});

export const limitsNested = message({
  ja: '行の中にさらに行を入れる形は、型チェックを通ります。実行時に`formFields`と`parseForm`が`繰り返しの中の繰り返しは name の添字が一意に決まらないため表現できません`というエラーになります。',
  en: 'A repeat inside a repeat passes type checking. At runtime `formFields` and `parseForm` throw `繰り返しの中の繰り返しは name の添字が一意に決まらないため表現できません`.',
});

export const limitsRules = message({
  ja: '`sameAs`などのルールは、行の中の入力欄には宣言できません。行の入力欄の検証はスキーマの中に書きます。',
  en: 'Rules such as `sameAs` cannot name a field inside a row. Write a row field’s checks in the schema.',
});

export const demoTitle = message({
  ja: '注文の行のデモ',
  en: 'Order rows demo',
});

export const demoDescription = message({
  ja: '1行から3行まで入力できる注文フォームで、送信した`name`と値を一覧にします。',
  en: 'An order form that takes one to three rows and lists the submitted `name`s and values.',
});

export const demoSteps = [
  message({
    ja: '「行を足す」を2回押すと、3行目でボタンが消えます。スキーマの`.max(3)`が効いています。',
    en: 'Press “Add a row” twice. The button disappears at the third row: that is the schema’s `.max(3)`.',
  }),
  message({
    ja: '2行目を空のまま「送信」を押すと、送信が止まり、その入力欄にフォーカスが移ります。',
    en: 'Leave the second row empty and press “Submit”. The submission stops and focus moves to the second row.',
  }),
  message({
    ja: '1行目を消してから残りを埋めて送ると、添字が詰まり、`items[0].name`から並びます。',
    en: 'Remove the first row, fill the rest, and submit. The indexes close up, starting again at `items[0].name`.',
  }),
] as const;

export const demoRow = message({
  ja: (number: number) => `${String(number)}行目`,
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
  ja: '1以上にしてください',
  en: 'Order at least one',
});

export const demoItemsMin = message({
  ja: '1行以上入力してください',
  en: 'Add at least one item',
});

export const demoItemsMax = message({
  ja: '3行までにしてください',
  en: 'Keep it to three items',
});
