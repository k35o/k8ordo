import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'よくある症状の原因と直し方です。エラー文で探すときは、ページの中を検索してください。',
  en: 'Common symptoms, their causes and their fixes. To look up an error, search this page for its wording.',
});

export const missingTitle = message({
  ja: '`スキーマにあるフィールドが送信されていません`',
  en: '`スキーマにあるフィールドが送信されていません`',
});

export const missingCause = message({
  ja: 'スキーマにあるフィールドの名前が送信された`FormData`に無いと、`parseForm`がこのエラーになります。多くの場合、その入力欄に`input`を展開していないか、条件によって入力欄を描画していないのが原因です。',
  en: '`parseForm` throws this error when a field in the schema is not in the submitted `FormData`. Usually its `input` was not spread, or the field is not rendered under some condition.',
});

export const missingFix = message({
  ja: 'すべての入力欄に`input`を展開します。`.optional()`の付いたオブジェクトの中の入力欄も描画します。何も選んでいないラジオボタンと、プレースホルダーのままの`<select>`は、値が無いものとして読まれます。チェックしていないチェックボックスは`false`として読まれます。どれもこのエラーにはなりません。',
  en: 'Spread `input` onto every field, and render the fields inside an `.optional()` object too. A radio group with nothing selected and a `<select>` on its placeholder are read as no value, and an unchecked checkbox as `false`. None of them raises this error.',
});

export const optionalTitle = message({
  ja: '`.optional()`でも通らない空欄',
  en: 'Empty field rejected despite `.optional()`',
});

export const optionalCause = message({
  ja: '空のテキスト欄は`""`を送ります。`.optional()`が許すのは値が無い場合だけなので、`.min(1)`のような検証は`""`にもそのまま適用されます。',
  en: 'An empty text field submits `""`. `.optional()` only allows a missing value, so a check such as `.min(1)` still runs against `""`.',
});

export const optionalFix = message({
  ja: '空欄を許すには、`z.union([z.literal(\'\'), z.string().min(3)])`のように`""`を受け付けるスキーマを書きます。この`.min(3)`はunionの中にあるため、ブラウザでは検証されず`dropped`に入ります。',
  en: 'To allow an empty field, write a schema that accepts `""`, such as `z.union([z.literal(\'\'), z.string().min(3)])`. The `.min(3)` is inside a union, so the browser does not check it and it is listed in `dropped`.',
});

export const miniTitle = message({
  ja: '`Invalid input`',
  en: '`Invalid input`',
});

export const miniCause = message({
  ja: '`zod/mini`はエラーメッセージのロケールを自動では読み込みません。ロケールが無いと、どのエラーも`Invalid input`になります。',
  en: '`zod/mini` does not load a message locale on its own. Without one, every error reads `Invalid input`.',
});

export const miniFix = message({
  ja: 'サーバーで最初に読み込まれるモジュールで、`z.config(z.locales.ja())`のようにロケールを読み込みます。または、スキーマの検証ごとに文言を書きます。',
  en: 'Load a locale with `z.config(z.locales.en())` in a module the server loads first. Or write a message on each check in the schema.',
});

export const radioTitle = message({
  ja: '復元されないラジオボタンの選択',
  en: 'Radio selection not restored',
});

export const radioCause = message({
  ja: '自分で書いた`<input type="radio">`に、enumのフィールドの`input`をそのまま展開しています。送信のあとは`input`の`defaultValue`に前回の選択が入ります。これが各ラジオボタンの`value`と衝突し、選択が復元されません。',
  en: 'The enum’s `input` is spread whole onto a hand-written `<input type="radio">`. After a submission, `input` carries the previous choice as `defaultValue`. That collides with each radio’s own `value`, so no selection is restored.',
});

export const radioFix = message({
  ja: '`input`からは`name`と`required`だけを渡します。`defaultChecked`は、`state.values`の値と選択肢を比べて決めます。',
  en: 'Take only `name` and `required` from `input`. Set `defaultChecked` per option by comparing it with the value in `state.values`.',
});

export const focusTitle = message({
  ja: '2回目の失敗で動かないフォーカス',
  en: 'Focus not moving on a repeated failure',
});

export const focusCause = message({
  ja: '`useForm`は、受け取った`state`を中身と`token`で見分けます。自分で組み立てた`state`に新しい`token`が無いと、同じ内容の2回目の失敗は前と同じ応答とみなされます。',
  en: '`useForm` tells responses apart by their content and `token`. A hand-built `state` without a fresh `token` makes a second identical failure look like the same response.',
});

export const focusFix = message({
  ja: '`parseForm`が返した`state`をそのまま返します。自分で組み立てるときは、毎回新しい`token`を入れます。',
  en: 'Return the `state` from `parseForm` unchanged. When building one by hand, give it a fresh `token` every time.',
});

export const hiddenTitle = message({
  ja: '隠れたステップへのフォーカス',
  en: 'Focus on a hidden step',
});

export const hiddenCause = message({
  ja: '`hidden`の付いたステップの中の入力欄は、フォーカスを受け取れません。',
  en: 'A field inside a `hidden` step cannot take focus.',
});

export const hiddenFix = message({
  ja: '新しい`state`を受け取ったら、描画の中でエラーのある最初のステップへ切り替えます。手順は',
  en: 'When a new `state` arrives, switch during render to the first step holding an error. The steps are in ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const causeLabel = message({
  ja: '原因',
  en: 'Cause',
});

export const fixLabel = message({
  ja: '直し方',
  en: 'Fix',
});
