import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/form/server`が提供する関数と型です。どれもサーバーで呼びます。zodをブラウザに送らないためです。',
  en: 'The functions and types that `@k8ordo/form/server` provides. Call them on the server, which keeps zod out of the browser.',
});

export const formFieldsSummary = message({
  ja: 'スキーマから、各欄の属性、文言、ルールを導きます。',
  en: 'Derives each field’s attributes, messages and rules from the schema.',
});

export const formFieldsInput = message({
  ja: 'zodのオブジェクト、または`defineForm`で作った定義。',
  en: 'A zod object, or a definition made with `defineForm`.',
});

export const formFieldsReturns = message({
  ja: '`fields`、`arrays`、`rules`、`dropped`を持つJSON。そのまま`useForm`に渡します。',
  en: 'JSON holding `fields`, `arrays`, `rules` and `dropped`. Pass it to `useForm` as it is.',
});

export const formFieldsCaveats = [
  message({
    ja: 'Server Componentか、モジュールスコープで呼びます。結果はJSONなので、propsでクライアントへ渡せます。',
    en: 'Call it in a Server Component or at module scope. The result is JSON, so it crosses to the client as props.',
  }),
  message({
    ja: '文言は呼んだ時点で決まります。リクエストのロケールに合わせるなら、描画の中で呼びます。',
    en: 'Messages are fixed when it runs. To follow the request’s locale, call it during the render.',
  }),
  message({
    ja: 'フォームで表せないスキーマ（`z.record`、タプル、`z.number()`など）には、理由を添えて例外を投げます。',
    en: 'It throws, with the reason, on a schema a form cannot express (`z.record`, tuples, `z.number()` and so on).',
  }),
  message({
    ja: 'HTMLの属性で表せない検査は`dropped`に入ります。本番以外では`console.warn`でも知らせます。',
    en: 'Checks no HTML attribute can express go into `dropped`. Outside production it also reports them with `console.warn`.',
  }),
] as const;

export const parseFormSummary = message({
  ja: '送信された`FormData`を、スキーマで検証します。',
  en: 'Validates a submitted `FormData` against the schema.',
});

export const parseFormInput = message({
  ja: '`formFields`に渡したものと同じスキーマか定義。',
  en: 'The same schema or definition you passed to `formFields`.',
});

export const parseFormFormData = message({
  ja: 'Server Actionが受け取った`FormData`。',
  en: 'The `FormData` the Server Action received.',
});

export const parseFormReturns = message({
  ja: '成功なら`{ success: true, data, state }`、失敗なら`{ success: false, state }`。`data`は型の付いた値です。',
  en: '`{ success: true, data, state }` on success, `{ success: false, state }` on failure. `data` is typed.',
});

export const parseFormCaveats = [
  message({
    ja: 'チェックの無いチェックボックスや、同じ名前で送られた値をまとめてから、スキーマに渡します。文字列から数への変換は、スキーマの`z.coerce`が行います。',
    en: 'It gathers unchecked checkboxes and repeated names before handing the values to the schema. Turning strings into numbers is the schema’s job, through `z.coerce`.',
  }),
  message({
    ja: 'スキーマにある欄が`FormData`に無いと、例外を投げます。`input`の広げ忘れだからです。何も選ばなければ送られない欄（ラジオ、`<select>`、チェックボックス）は除きます。',
    en: 'It throws when a field in the schema is missing from the `FormData`, since that means an `input` was never spread. Controls that send nothing when left alone (radio buttons, `<select>`, checkboxes) are the exception.',
  }),
  message({
    ja: 'パスワードとファイルの値は、`state.values`に入りません。',
    en: 'Passwords and files are never included in `state.values`.',
  }),
] as const;

export const defineFormSummary = message({
  ja: 'スキーマに、複数の欄にまたがるルールを添えます。',
  en: 'Attaches rules that span several fields to a schema.',
});

export const defineFormSchema = message({
  ja: 'zodのオブジェクト。',
  en: 'A zod object.',
});

export const defineFormRules = message({
  ja: '`sameAs`、`minChecked`、`requiredWhen`で作ったルール。欄のパスは型で検査されます。',
  en: 'Rules made with `sameAs`, `minChecked` and `requiredWhen`. Field paths are type-checked.',
});

export const defineFormReturns = message({
  ja: 'スキーマの代わりに`formFields`と`parseForm`へ渡します。',
  en: 'Pass it to `formFields` and `parseForm` in place of the schema.',
});

export const defineFormCaveats = [
  message({
    ja: 'ルールはブラウザとサーバーで同じ評価器が実行します。同じ欄で複数のルールが破れたときは、先に宣言したルールの文言を出します。',
    en: 'The same evaluator runs the rules in the browser and on the server. When several rules break on one field, the first one declared is shown.',
  }),
] as const;

export const sameAsSummary = message({
  ja: '`field`の値が`other`の値と同じであることを求めます。パスワードの確認に使います。',
  en: 'Requires `field` to equal `other`. Use it to confirm a password.',
});

export const minCheckedSummary = message({
  ja: '同じ名前のチェックボックスのうち、`min`個以上がチェックされていることを求めます。',
  en: 'Requires at least `min` of the checkboxes sharing a name to be checked.',
});

export const requiredWhenSummary = message({
  ja: '`when`の値が`equals`であるあいだだけ、`field`を必須にします。',
  en: 'Makes `field` required only while `when` holds `equals`.',
});

export const ruleField = message({
  ja: 'ルールを適用する欄のパス。破れたときのエラーはこの欄に出ます。',
  en: 'The path of the field the rule applies to. A breach is reported on it.',
});

export const ruleOther = message({
  ja: '比べる相手の欄のパス。',
  en: 'The path of the field to compare with.',
});

export const ruleMin = message({
  ja: 'チェックが必要な最小の数。',
  en: 'The fewest boxes that must be checked.',
});

export const ruleWhen = message({
  ja: '条件にする欄のパス。',
  en: 'The path of the field the condition reads.',
});

export const ruleEquals = message({
  ja: '`field`を必須にする、`when`の値。',
  en: 'The value of `when` that makes `field` required.',
});

export const ruleMessage = message({
  ja: '破れたときの文言。関数を渡すと、報告するときに呼ばれます。',
  en: 'The message for a breach. A function is called when the breach is reported.',
});

export const ruleReturns = message({
  ja: '`defineForm`の2つ目の引数に並べます。',
  en: 'List it in `defineForm`’s second argument.',
});

export const formStateSummary = message({
  ja: 'Server Actionがフォームに返す値です。`parseForm`が作り、`useForm`が読みます。',
  en: 'What a Server Action hands back to the form. `parseForm` builds it and `useForm` reads it.',
});

export const formStateErrors = message({
  ja: '欄ごとのエラー。キーは`items[1].name`のようなパスです。',
  en: 'Errors per field, keyed by path such as `items[1].name`.',
});

export const formStateValues = message({
  ja: '送られた値。失敗したあと、欄の初期値として戻ります。',
  en: 'The submitted values, restored as the fields’ defaults after a failure.',
});

export const formStateRows = message({
  ja: '繰り返し行ごとの行数。JavaScriptが無くても、同じ数の行を描き直せます。',
  en: 'How many rows each array had, so the same rows render again without JavaScript.',
});

export const formStateFormError = message({
  ja: 'どの欄にも属さないエラー。',
  en: 'An error that belongs to no field.',
});

export const formStateToken = message({
  ja: '1回の検証を見分ける値。同じ内容の失敗が続いても、別の返事として扱えます。',
  en: 'Identifies one parse, so two identical failures still read as two responses.',
});
