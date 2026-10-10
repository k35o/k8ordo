import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/form`が入力の検証をいつ、どこで行うかと、保証することとしないことが分かります。',
  en: 'When and where `@k8ordo/form` checks the input, and what it does and does not guarantee.',
});

export const shapeTitle = message({
  ja: 'スキーマの使われ方',
  en: 'Where the schema runs',
});

export const shapeServer = message({
  ja: 'スキーマを読むのは`formFields`と`parseForm`で、どちらもサーバーで動きます。スキーマについてブラウザが受け取るのは、`formFields`が返したJSONだけです。',
  en: 'Only `formFields` and `parseForm` read the schema, and both run on the server. Of the schema, the browser receives only the JSON `formFields` returns.',
});

export const shapeBundle = message({
  ja: 'スキーマをimportするのがサーバーのコードだけなら、zodはブラウザのバンドルに入りません。その場合、`zod`と`zod/mini`のどちらで書いてもバンドルの大きさは変わりません。',
  en: 'As long as only server code imports the schema, zod never enters the browser bundle. Writing it with `zod` or `zod/mini` then makes no difference to the bundle.',
});

export const shapeWhenBefore = message({
  ja: 'ブラウザで出す文言は、`formFields`を呼んだときに決まってJSONに入ります。リクエストの言語に合わせる呼び方は',
  en: 'The messages the browser shows are fixed when `formFields` runs, and travel in its JSON. How to call it so they follow the request’s language is in ',
});

export const shapeWhenAfter = message({
  ja: 'にあります。',
  en: '.',
});

export const domTitle = message({
  ja: '入力値とstate',
  en: 'Values and state',
});

export const domIntro = message({
  ja: '入力した値はReactのstateに入れず、入力欄から直接読みます。stateに入れるのは、DOMでは表せない次の5つだけです。',
  en: 'Typed values are read from the controls and never copied into React state. State holds only these five things the DOM cannot express.',
});

export const domMessages = message({
  ja: '検証に失敗した入力欄に出す文言',
  en: 'The message to show for a control that failed a check',
});

export const domServerErrors = message({
  ja: 'サーバーが返したエラーのうち、まだ直していないもの',
  en: 'Server errors the user has not fixed yet',
});

export const domRows = message({
  ja: '繰り返し行のそれぞれを見分けるキー',
  en: 'The key that identifies each repeated row',
});

export const domDirty = message({
  ja: '変更の有無を表す1つの真偽値（DOMから読む）',
  en: 'One dirty flag, read back from the DOM',
});

export const domBaseline = message({
  ja: '行の追加や削除を判定するための、描画時の行数',
  en: 'The row counts at render, used to detect added or removed rows',
});

export const domWhy = message({
  ja: '値をstateに入れないので、キーを押すたびに再描画されることはありません。ブラウザのリセットも、アクションのあとにReactが行うリセットも、そのまま働きます。',
  en: 'Since values are not kept in state, typing never re-renders. The browser’s reset and React’s reset after an action both work as they are.',
});

export const noJsTitle = message({
  ja: 'JavaScriptが無いとき',
  en: 'Without JavaScript',
});

export const noJsAttributes = message({
  ja: '`required`や`minLength`などの制約は、サーバーが描画するHTMLの属性に含まれます。JavaScriptが無い環境や読み込み前でも、ブラウザが入力を確かめます。',
  en: 'Constraints such as `required` and `minLength` are attributes in the server-rendered HTML. Without JavaScript, or before it loads, the browser checks the input itself.',
});

export const noJsNoValidate = message({
  ja: 'JavaScriptが読み込まれると、`useForm`がフォームに`noValidate`を付け、同じ検証をzodの文言で行います。`noValidate`はHTMLには書かず、マウント時に付けます。',
  en: 'Once JavaScript loads, `useForm` sets `noValidate` on the form and runs the same checks in zod’s wording. `noValidate` is set on mount and never written into the HTML.',
});

export const noJsEcho = message({
  ja: '送信に失敗したときは、送信した値が入力欄の`defaultValue`として描画し直されます。JavaScriptが無い環境でも、入力した内容は残ります。',
  en: 'After a failed submission, the submitted values are rendered again as each control’s `defaultValue`. Nothing typed is lost, even without JavaScript.',
});

export const wordingTitle = message({
  ja: '文言の取り出し方',
  en: 'Where the messages come from',
});

export const wordingProbe = message({
  ja: '`formFields`は、検証の種類ごとに、その検証だけが失敗する値をスキーマに渡します。返ってきたエラーの文言を、ブラウザで出す文言として保存します。',
  en: 'For each kind of check, `formFields` hands the schema a value that fails only that check. The message that comes back is stored as the one the browser shows.',
});

export const wordingSame = message({
  ja: "そのため、`min(1, '…')`のように自分で付けた文言も、ブラウザとサーバーで同じになります。",
  en: "So a message of your own, such as `min(1, '…')`, reads the same in the browser and on the server.",
});

export const requiredTitle = message({
  ja: '`required`の決まり方',
  en: 'How `required` is decided',
});

export const requiredRule = message({
  ja: 'JSON Schemaの`required`は「キーがある」という意味で、入力欄が空かどうかは表しません。そこで`formFields`は、入力欄が空のときの送信内容がスキーマに合うかどうかで`required`を決めます。',
  en: 'JSON Schema’s `required` means “the key is present”, which says nothing about an empty control. So `formFields` emits `required` only when the schema rejects what the control submits when left empty.',
});

export const requiredExample = message({
  ja: '上の例で印を付けた行のとおり、空の文字列を受け付ける`bio`と、空のままでよい`age`には`required`が付きません。`parseForm`も同じ値をスキーマに渡すので、ブラウザとサーバーの判断がそろいます。',
  en: 'Above, the marked `bio` and `age` get no `required`, since `bio` accepts an empty string and `age` may be left empty. `parseForm` hands the schema the same values, so the browser and the server agree.',
});

export const requiredEmptyBefore = message({
  ja: '空のときに入力欄が送る値の一覧は',
  en: 'What each control submits when left empty is listed in ',
});

export const requiredEmptyAfter = message({
  ja: 'にあります。',
  en: '.',
});

export const droppedTitle = message({
  ja: 'ブラウザで確かめない検証',
  en: 'Checks the browser skips',
});

export const droppedListBefore = message({
  ja: 'スキーマ全体に付けた`.refine()`や、フラグ付きの正規表現は、HTMLの属性で表せません。`formFields`はこうした検証を`dropped`に並べて返します。どの検証が載るかは',
  en: 'A `.refine()` on the whole schema or a regex with flags cannot be expressed as an HTML attribute. `formFields` lists such checks in `dropped`. Which checks it lists is in ',
});

export const droppedListAfter = message({
  ja: 'にあります。',
  en: '.',
});

export const droppedWarn = message({
  ja: '本番環境以外では、スキーマごとに1回、`console.warn`でも一覧を出します。どの検証もサーバーでは必ず行われます。',
  en: 'Outside production the list is also printed once per schema with `console.warn`. All of these checks still run on the server.',
});

export const droppedRulesBefore = message({
  ja: '`defineForm`で宣言したルールは`dropped`に載らず、ブラウザとサーバーが同じ処理で確かめます。宣言の仕方は',
  en: 'Rules declared with `defineForm` are not in `dropped`: the browser and the server check them with the same code. How to declare one is in ',
});

export const droppedRulesAfter = message({
  ja: 'にあります。',
  en: '.',
});

export const refuseTitle = message({
  ja: 'エラーになるスキーマ',
  en: 'Rejected schemas',
});

export const refuseStrings = message({
  ja: 'ファイル以外の送信値は文字列なので、`z.number()`や`z.date()`ではどの入力もスキーマに合いません。`z.record`やタプルのように、送信する名前が決まらない形もあります。',
  en: 'Apart from files, every submitted value is a string, so no input could satisfy `z.number()` or `z.date()`. Shapes such as `z.record` or a tuple have no name to submit under.',
});

export const refuseWhen = message({
  ja: '`formFields`と`parseForm`は、こうしたスキーマを受け取った時点でエラーになります。通らないフォームや、入力を読み違えるフォームを作らないためです。',
  en: '`formFields` and `parseForm` throw as soon as they receive such a schema, rather than build a form that could never pass or would misread the input.',
});

export const refuseSchemaBefore = message({
  ja: 'エラーになるスキーマの一覧は',
  en: 'The full list of rejected schemas is in ',
});

export const refuseSchemaAfter = message({
  ja: 'にあります。',
  en: '.',
});

export const guaranteesTitle = message({
  ja: '保証すること',
  en: 'Guarantees',
});

export const guaranteeNoZod = message({
  ja: 'ブラウザで動く`useForm`は、zodもスキーマも読み込みません。',
  en: '`useForm`, which runs in the browser, imports neither zod nor the schema.',
});

export const guaranteeTyping = message({
  ja: 'キーを押すたびにフォームが再描画されることはありません。',
  en: 'Typing does not re-render the form on every keystroke.',
});

export const guaranteeNoJs = message({
  ja: 'JavaScriptが無くても、制約の属性に合わない送信はブラウザで止まります。',
  en: 'Without JavaScript, the browser still stops a submission that breaks a constraint attribute.',
});

export const guaranteeEcho = message({
  ja: '送信に失敗すると、送信した値が入力欄に戻ります。`input: "password"`を付けたフィールドの値は戻しません。',
  en: 'After a failed submission, the submitted values come back into the controls. A field marked `input: "password"` is never echoed.',
});

export const guaranteeWording = message({
  ja: 'ブラウザで出す文言は、同じ検証でサーバーが返す文言と同じです。',
  en: 'The browser shows the same message the server returns for the same check.',
});

export const guaranteeRequired = message({
  ja: '空の入力欄について、ブラウザの`required`と`parseForm`は同じ判断をします。',
  en: 'For an empty control, the browser’s `required` and `parseForm` reach the same verdict.',
});

export const guaranteeDropped = message({
  ja: 'スキーマ全体に付けた`.refine()`やフラグ付きの正規表現のように、HTMLの属性で表せない検証は`dropped`に載ります。`parseForm`は、それも含めてすべての検証をサーバーで行います。',
  en: 'A check no HTML attribute can express, such as a `.refine()` on the whole schema or a regex with flags, is listed in `dropped`. `parseForm` runs every check on the server, those included.',
});

export const guaranteeRefuse = message({
  ja: '表せないスキーマは、`formFields`と`parseForm`を呼んだ時点でエラーになります。',
  en: '`formFields` and `parseForm` throw as soon as they receive a schema the package cannot express.',
});

export const nonGuaranteesTitle = message({
  ja: '保証しないこと',
  en: 'Not guaranteed',
});

export const nonGuaranteeDropped = message({
  ja: '`dropped`に載った検証は、ブラウザでは確かめません。',
  en: 'Checks listed in `dropped` never run in the browser.',
});

export const nonGuaranteeBeforeJs = message({
  ja: 'JavaScriptが読み込まれるまでは、ルールを確かめません。エラーはブラウザ自身の文言で知らせます。',
  en: 'Until JavaScript loads, rules are not checked, and the messages are the browser’s own.',
});

export const nonGuaranteeRefine = message({
  ja: '1つのフィールドや入れ子のオブジェクト、配列の行に付けた`.refine()`は、`dropped`に載りません。',
  en: 'A `.refine()` on a single field, a nested object or a row is not listed in `dropped`.',
});

export const nonGuaranteeNumberField = message({
  ja: '`@k8ordo/ui`の`NumberField`が出す範囲のエラーは、zodの文言ではありません。',
  en: 'The range message from `@k8ordo/ui`’s `NumberField` is not zod’s wording.',
});

export const nonGuaranteeFile = message({
  ja: '選んだファイルは、送信に失敗すると入力欄に戻りません。',
  en: 'A chosen file does not come back into its control after a failed submission.',
});
