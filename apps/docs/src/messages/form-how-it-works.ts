import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/form`がどう動いているかを説明します。使い方を覚えるのに必要な内容ではありませんが、なぜそう書くのかが分かると、迷ったときに判断しやすくなります。',
  en: 'How `@k8ordo/form` works underneath. None of it is needed to use the package, but knowing why it is written this way makes the edge cases easier to reason about.',
});

export const shapeTitle = message({
  ja: '1つのスキーマが3か所で働く',
  en: 'One schema, at work in three places',
});

export const shapeDescription = message({
  ja: 'スキーマを使うのは、サーバーで入力欄の情報を作るときと、サーバーで送信を検証するときの2回です。ブラウザが受け取るのは、そこから作ったJSONだけです。',
  en: 'The schema is used twice, both times on the server: once to derive the fields, once to validate the submission. The browser only ever receives the JSON derived from it.',
});

export const shapeBundle = message({
  ja: 'そのため、zodはブラウザのバンドルに入りません。スキーマは`zod`でも`zod/mini`でも書けますが、ブラウザから読まないなら、どちらを選んでもバンドルの大きさは変わりません。',
  en: 'So zod never enters the browser bundle. A schema can be written with `zod` or `zod/mini`; as long as nothing in the browser reads it, the choice does not change the bundle size.',
});

export const domTitle = message({
  ja: '値はDOMが持つ',
  en: 'The DOM holds the values',
});

export const domDescription = message({
  ja: '入力された値は、Reactのstateに写さずにDOMに置いたままにします。stateに持つのは、DOMでは表せない次の5つだけです。',
  en: 'Values stay in the DOM and are never copied into React state. State holds only the five things the DOM cannot express:',
});

export const domMessages = message({
  ja: 'ブラウザが失敗と判断した入力欄に、どの文言を出すか',
  en: 'Which message to show for a field the browser has judged invalid',
});

export const domServerErrors = message({
  ja: 'サーバーが返したエラーのうち、まだ直していないものはどれか',
  en: 'Which server errors are still current',
});

export const domRows = message({
  ja: '繰り返しの行のそれぞれを見分けるキー',
  en: 'The identity of each repeated row',
});

export const domDirty = message({
  ja: 'DOMから読み直した、変更があるかどうかの1つの真偽値',
  en: 'One dirty flag, read back from the DOM',
});

export const domBaseline = message({
  ja: '行の追加や削除を比べるための、もとの行数',
  en: 'The row counts that adding or removing a row is measured against',
});

export const domWhy = message({
  ja: '値を写さないので、キーを押すたびに再描画されることはありません。また、ブラウザのリセットやReactがアクションのあとに行うリセットも、そのまま正しく働きます。',
  en: 'Since nothing is copied, typing never re-renders, and both the browser’s reset and React’s reset after an action simply work.',
});

export const noJsTitle = message({
  ja: 'JavaScriptが無くても動く理由',
  en: 'Why it works without JavaScript',
});

export const noJsDescription = message({
  ja: '入力欄の制約は、サーバーが描いたHTMLの属性に入っています。そのため、JavaScriptが届く前でもブラウザ自身が入力を確かめます。',
  en: 'The constraints are attributes in the server-rendered HTML, so the browser checks input itself before JavaScript arrives.',
});

export const noJsNoValidate = message({
  ja: 'JavaScriptが届くと、`useForm`はフォームに`noValidate`を付け、同じ検証をzodの文言で行います。`noValidate`はHTMLには書かずに後から付けるので、JavaScriptが無い環境ではブラウザの検証が残ります。',
  en: 'Once JavaScript arrives, `useForm` sets `noValidate` and runs the same checks in zod’s wording. It is set from JavaScript, never written into the HTML, so without JavaScript the browser’s own checks stay on.',
});

export const noJsEcho = message({
  ja: '送信に失敗したときは、送信した値が入力欄の`defaultValue`として描き直されます。JavaScriptが無い環境でも、入力した内容は失われません。',
  en: 'After a failed submission, the submitted values render as the fields’ `defaultValue`, so nothing typed is lost even without JavaScript.',
});

export const wordingTitle = message({
  ja: '文言がブラウザとサーバーで食い違わない理由',
  en: 'Why the wording never drifts',
});

export const wordingDescription = message({
  ja: '`formFields`は、検証の種類ごとに、その検証だけが失敗する値をスキーマに渡し、返ってきたエラーの文言を取り出します。ブラウザで表示する文言は、zodがサーバーで出す文言そのものです。',
  en: 'For each kind of check, `formFields` hands the schema a value that fails only that check and keeps the message that comes back. The text shown in the browser is exactly the text zod produces on the server.',
});

export const requiredTitle = message({
  ja: 'requiredの決まり方',
  en: 'How required is decided',
});

export const requiredDescription = message({
  ja: 'JSON Schemaの`required`は「キーがある」という意味ですが、フォームはどの入力欄からも何かしらを送ります。そこで`formFields`は、その入力欄が空のときに送る値をスキーマが拒むかどうかで、`required`を付けるかを決めます。',
  en: 'JSON Schema’s `required` means “the key is present”, but a form submits something for every control. So `formFields` emits `required` only when the schema rejects what the control submits when left empty.',
});

export const requiredEmpty = message({
  ja: '空のときに送る値は、入力欄によって違います。テキストは`""`、チェックの無いチェックボックスは`false`です。数値やファイル、選択肢は何も送りません。`parseForm`も同じ値をスキーマに渡すので、ブラウザとサーバーの判断がそろいます。下の例では、空の文字列を受け付ける`bio`と、空欄を省ける`age`には`required`が付きません。',
  en: 'What an empty control submits depends on the control: `""` for text, `false` for an unchecked checkbox, nothing for a number, a file or a choice. `parseForm` hands the schema exactly the same values, so the two sides agree. Below, `bio` accepts an empty string and `age` may be left out, so neither gets `required`.',
});

export const droppedTitle = message({
  ja: 'ブラウザで確かめられない検証を知らせる',
  en: 'Reporting what the browser cannot check',
});

export const droppedDescription = message({
  ja: 'スキーマ全体に付けた`.refine()`や、フラグ付きの正規表現のように、HTMLの属性で表せない検証があります。`formFields`はこうした検証を黙って捨てずに、`dropped`に並べて返します。',
  en: 'Some checks cannot be expressed as HTML attributes: a `.refine()` on the whole schema, a regex with flags. Rather than dropping them silently, `formFields` lists them in `dropped`.',
});

export const droppedWarn = message({
  ja: '本番環境以外では、`console.warn`でも一覧を出します。どの検証もサーバーでは必ず行われるので、ブラウザで確かめないだけです。',
  en: 'Outside production it also prints the list with `console.warn`. Every one of them still runs on the server; the browser just does not check them.',
});

export const refuseTitle = message({
  ja: 'フォームで表せないスキーマはエラーにする',
  en: 'A schema a form cannot express is an error',
});

export const refuseDescription = message({
  ja: 'フォームが送る値はいつも文字列なので、`z.number()`や`z.date()`はどんな入力も受け付けない入力欄になります。`z.record`やタプルのように、送信する名前が決まらない形もあります。`formFields`は、こうしたスキーマを受け取ると理由を添えてエラーを投げます。',
  en: 'Every submitted value is a string, so `z.number()` or `z.date()` would make a field nothing can satisfy, and shapes such as `z.record` or tuples have no name to submit under. `formFields` throws on these, with the reason.',
});

export const refuseWhy = message({
  ja: '入力した内容を黙って捨てたり、決して通らないフォームを作ったりするのは、間違いとして知らせるべきだと考えているからです。',
  en: 'A form that silently discards what the person did, or one that can never validate, is a mistake to report, not something to paper over.',
});
