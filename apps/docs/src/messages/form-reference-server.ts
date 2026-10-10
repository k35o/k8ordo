import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/form/server`から使える関数と型の一覧です。どれもサーバーで呼ぶので、zodはブラウザに送られません。',
  en: 'The functions and types that `@k8ordo/form/server` provides. All of them are called on the server, so zod never reaches the browser.',
});

export const formFieldsSummary = message({
  ja: 'スキーマから入力欄ごとの属性、文言、ルールを作ります。',
  en: 'Derives each field’s attributes, messages and rules from the schema.',
});

export const formFieldsInput = message({
  ja: 'zodのオブジェクトスキーマ、または`defineForm`で作った定義。',
  en: 'A zod object schema, or a definition made with `defineForm`.',
});

export const formFieldsReturns = message({
  ja: '`fields`、`arrays`、`rules`と`dropped`を持つJSON。そのまま`useForm`に渡します。',
  en: 'JSON holding `fields`, `arrays`, `rules` and `dropped`. Pass it to `useForm` as it is.',
});

export const formFieldsCaveats = [
  message({
    ja: 'Server Componentの中か、モジュールのトップレベルで呼びます。戻り値はJSONなので、propsでClient Componentに渡せます。',
    en: 'Call it in a Server Component or at module scope. The result is JSON, so it can be passed to a Client Component as props.',
  }),
  message({
    ja: '文言は呼んだ時点で決まります。リクエストの言語に合わせるなら、描画の中で呼びます。',
    en: 'Messages are fixed when it runs. To follow the request’s locale, call it during the render.',
  }),
  message({
    ja: "フォームで表せないスキーマ（`z.record`やタプル、`z.number()`など）を渡すと、`[@k8ordo/form] 'フィールド名': 理由`のエラーになります。",
    en: "A schema a form cannot express (`z.record`, tuples, `z.number()` and so on) fails with `[@k8ordo/form] 'field': reason`.",
  }),
  message({
    ja: 'HTMLの属性で表せない検証は`dropped`に入り、サーバーだけで行われます。本番環境以外では`console.warn`でも知らせます。',
    en: 'Checks no HTML attribute can express go into `dropped` and run on the server only. Outside production they are also reported with `console.warn`.',
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
  ja: '成功なら`{ success: true, data, state }`、失敗なら`{ success: false, state }`。`data`はスキーマの出力の型です。',
  en: '`{ success: true, data, state }` on success, `{ success: false, state }` on failure. `data` has the schema’s output type.',
});

export const parseFormCaveats = [
  message({
    ja: '送信された値はすべて文字列です。数への変換は、スキーマの`z.coerce`で行います。',
    en: 'Every submitted value is a string. Converting one to a number is the schema’s job, via `z.coerce`.',
  }),
  message({
    ja: 'チェックの無いチェックボックスは`false`に、同じ名前で送られた複数の値は配列になります。`parseForm`は、この形にしてからスキーマに渡します。',
    en: 'Before the schema runs, `parseForm` turns an unchecked checkbox into `false` and the values sent under one name into an array.',
  }),
  message({
    ja: 'スキーマにあるフィールドが`FormData`に無いと、`[@k8ordo/form] スキーマにあるフィールドが送信されていません: フィールド名`のエラーになります。`input`を入力欄に渡し忘れたときに出ます。ラジオボタンと`<select>`、チェックボックスは、何も選ばなければ値を送らないので対象外です。',
    en: 'A field in the schema that is missing from the `FormData` fails with `[@k8ordo/form] スキーマにあるフィールドが送信されていません: field`. It appears when `input` was never passed to the control. Radio buttons, `<select>` and checkboxes are exempt, since they send nothing when nothing is chosen.',
  }),
  message({
    ja: 'パスワードとファイルの値は、`state.values`に入りません。',
    en: 'Passwords and files are never included in `state.values`.',
  }),
] as const;

export const defineFormSummary = message({
  ja: 'スキーマに、複数の入力欄にまたがるルールを添えます。',
  en: 'Attaches rules that span several fields to a schema.',
});

export const defineFormSchema = message({
  ja: 'zodのオブジェクトスキーマ。',
  en: 'A zod object schema.',
});

export const defineFormRules = message({
  ja: '`sameAs`、`minChecked`、`requiredWhen`で作ったルール。入力欄のパスは型で確かめられます。',
  en: 'Rules made with `sameAs`, `minChecked` and `requiredWhen`. Field paths are type-checked.',
});

export const defineFormReturns = message({
  ja: 'スキーマの代わりに、`formFields`と`parseForm`へ渡します。',
  en: 'Pass it to `formFields` and `parseForm` in place of the schema.',
});

export const defineFormCaveats = [
  message({
    ja: 'ブラウザとサーバーは、同じ処理でルールを判定します。1つの入力欄が複数のルールを満たさないときは、先に宣言したルールの文言が表示されます。',
    en: 'The browser and the server evaluate the rules with the same code. When several rules fail on one field, the message of the rule declared first is shown.',
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
  en: 'Makes `field` required only while the value of `when` is `equals`.',
});

export const ruleField = message({
  ja: 'ルールを適用する入力欄のパス。ルールに違反したときのエラーは、この入力欄に表示されます。',
  en: 'The path of the field the rule applies to. When the rule fails, the error is shown on this field.',
});

export const ruleOther = message({
  ja: '比べる相手の入力欄のパス。',
  en: 'The path of the field to compare with.',
});

export const ruleMin = message({
  ja: 'チェックが必要な最小の数。',
  en: 'The fewest boxes that must be checked.',
});

export const ruleWhen = message({
  ja: '条件にする入力欄のパス。',
  en: 'The path of the field the condition reads.',
});

export const ruleEquals = message({
  ja: '`field`を必須にする、`when`の値。',
  en: 'The value of `when` that makes `field` required.',
});

export const ruleMessage = message({
  ja: 'ルールを満たさないときの文言。関数を渡すと、エラーを報告するときに呼ばれます。',
  en: 'The message shown when the rule fails. A function is called when the error is reported.',
});

export const ruleReturns = message({
  ja: '`defineForm`の2つ目の引数に並べます。',
  en: 'List it in the second argument of `defineForm`.',
});

export const formStateSummary = message({
  ja: 'Server Actionがフォームに返す値です。`parseForm`が作り、`useForm`が読みます。',
  en: 'What a Server Action returns to the form. `parseForm` builds it and `useForm` reads it.',
});

export const formStateErrors = message({
  ja: '入力欄ごとのエラー。キーは`items[1].name`のようなパスです。',
  en: 'Errors per field, keyed by a path such as `items[1].name`.',
});

export const formStateValues = message({
  ja: '送信された値。送信に失敗したあとは、入力欄の既定値になります。',
  en: 'The submitted values. After a failed submission they become the fields’ default values.',
});

export const formStateRows = message({
  ja: '配列ごとの行数。JavaScriptが無くても、送信時と同じ数の行で描画できます。',
  en: 'How many rows each array had, so the form renders the same number of rows without JavaScript.',
});

export const formStateFormError = message({
  ja: 'どの入力欄にも属さないエラー。',
  en: 'An error that belongs to no field.',
});

export const formStateToken = message({
  ja: '1回の検証を見分けるための値。同じ内容の失敗が続いても、別の応答として扱えます。',
  en: 'Identifies one parse, so two identical failures still count as two responses.',
});
