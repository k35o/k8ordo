import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'パスワードの確認や「2つ以上選ぶ」のように、複数の入力欄にまたがる検証をルールとして宣言します。ルールはブラウザとサーバーで同じ判定になります。',
  en: 'Declare checks that span several fields, such as a password confirmation or “pick at least two”, as rules. A rule gives the same verdict in the browser and on the server.',
});

export const declareTitle = message({
  ja: 'ルールの宣言',
  en: 'Declaring a rule',
});

export const declareRuleCallout = message({
  ja: 'スキーマの横にルールを並べる',
  en: 'Rules next to the schema',
});

export const declarePassCallout = message({
  ja: 'スキーマの代わりに定義を渡す',
  en: 'Pass the definition instead of the schema',
});

export const declareForm = message({
  ja: '`defineForm`に、スキーマとルールの配列を渡します。できた定義は、スキーマの代わりに`formFields`と`parseForm`へ渡します。',
  en: 'Pass `defineForm` the schema and an array of rules. The definition then goes to `formFields` and `parseForm` in place of the schema.',
});

export const declareData = message({
  ja: 'ルールはデータなので、入力欄の情報と一緒にブラウザへ送られます。',
  en: 'Rules are plain data, so they are sent to the browser with the fields.',
});

export const declareTyped = message({
  ja: 'ルールに書くフィールド名は、スキーマの型で確かめられます。無い名前を書くと型エラーになります。',
  en: 'The field names in a rule are checked against the schema’s types. A name the schema does not have is a type error.',
});

export const kindsTitle = message({
  ja: '用意されているルール',
  en: 'Available rules',
});

export const kindSameAs = message({
  ja: '`sameAs(field, other, message)`：`field`の値が`other`の値と同じであることを求めます。パスワードの確認に使います。',
  en: '`sameAs(field, other, message)`: `field` must equal `other`. Use it to confirm a password.',
});

export const kindMinChecked = message({
  ja: '`minChecked(field, min, message)`：同じ名前のチェックボックスのうち、`min`個以上にチェックが入っていることを求めます。',
  en: '`minChecked(field, min, message)`: at least `min` of the checkboxes sharing the name must be checked.',
});

export const kindRequiredWhen = message({
  ja: '`requiredWhen(field, when, equals, message)`：`when`の値が`equals`のときだけ、`field`を必須にします。',
  en: '`requiredWhen(field, when, equals, message)`: `field` is required only when `when` is `equals`.',
});

export const sameTitle = message({
  ja: 'ブラウザとサーバーの判定',
  en: 'Browser and server',
});

export const sameEvaluator = message({
  ja: 'ブラウザは入力中のフォームを、サーバーは送信された値を同じ処理で確かめます。',
  en: 'The browser checks the live form and the server checks the submission, with the same evaluator.',
});

export const sameCustomValidity = message({
  ja: 'ブラウザでは、ルールを満たさない入力欄に`setCustomValidity`でエラーを付けます。組み込みの検証と同じ扱いなので、`:user-invalid`に一致します。文言はほかのエラーと同じく入力欄の`error`で受け取ります。',
  en: 'In the browser, a field that fails a rule gets its error through `setCustomValidity`. It behaves like a built-in check: `:user-invalid` matches, and the message comes through the field’s `error` like any other.',
});

export const sameOrder = message({
  ja: '1つの入力欄が複数のルールを満たさないときは、先に宣言したルールの文言を表示します。',
  en: 'When one field fails several rules, the message of the rule declared first is shown.',
});

export const localeTitle = message({
  ja: '文言の翻訳',
  en: 'Translated wording',
});

export const localeFunction = message({
  ja: 'ルールの文言には、文字列の代わりに関数も渡せます。ブラウザで出す文言は、`formFields`を呼んだときのロケールで決まります。',
  en: 'A rule’s message can be a function instead of a string. The wording the browser shows is fixed in the locale current when `formFields` runs.',
});

export const localeZodBefore = message({
  ja: 'zodの文言と同じ仕組みなので、`formFields`を呼ぶ場所は',
  en: 'It works the same way as zod’s own messages. Where to call `formFields` is covered in ',
});

export const localeZodAfter = message({
  ja: 'を見てください。',
  en: '.',
});

export const refineTitle = message({
  ja: 'ルールで書けない検証',
  en: 'Checks outside the rules',
});

export const refineServer = message({
  ja: '3つのルールで書けない検証は、`.refine()`で書きます。`.refine()`はサーバーでしか動きません。',
  en: 'Write any check the three rules cannot express as a `.refine()`. A `.refine()` runs only on the server.',
});

export const refineWhole = message({
  ja: 'スキーマ全体に付けた`.refine()`は、ブラウザで確かめない検証として`dropped`に載ります。`path`を指定しなければ、エラーは`form.formError`に入ります。',
  en: 'A `.refine()` on the whole schema is listed in `dropped` as a check the browser does not run. Without a `path`, its error is in `form.formError`.',
});

export const refinePitfall = message({
  ja: '1つのフィールドや入れ子のオブジェクト、配列の行に付けた`.refine()`は、まだ`dropped`に載りません。ブラウザでは何も表示されず、送信したあとにサーバーでエラーになります。',
  en: 'A `.refine()` on a single field, a nested object or a row is not listed in `dropped` yet. The browser shows nothing, and the error appears only after the server checks the submission.',
});

export const demoTitle = message({
  ja: '審査フォームのデモ',
  en: 'Review form demo',
});

export const demoDescription = message({
  ja: '「却下」のときだけ理由が必須になり、観点を2つ以上選ぶ必要がある審査フォームです。',
  en: 'A review form where the reason is required only for “Reject”, and at least two aspects must be checked.',
});

export const demoSteps = [
  message({
    ja: '観点を2つ選び、判定で「却下」を選びます。理由を空のまま「送信」を押すと、理由の入力欄にエラーが出ます。',
    en: 'Check two aspects and choose “Reject”. Leave the reason empty and press “Submit”: the reason field shows an error.',
  }),
  message({
    ja: '判定を「承認」に戻すと、理由のエラーは消えます。',
    en: 'Switch back to “Accept”. The error on the reason goes away.',
  }),
  message({
    ja: '観点を1つだけにして送信すると、2つ以上選ぶよう求めるエラーが出ます。',
    en: 'Leave only one aspect checked and submit. The error asks for at least two.',
  }),
] as const;

export const demoLabelDecision = message({
  ja: '判定',
  en: 'Decision',
});

export const demoChoose = message({
  ja: '選んでください',
  en: 'Choose one',
});

export const demoAccept = message({
  ja: '承認',
  en: 'Accept',
});

export const demoReject = message({
  ja: '却下',
  en: 'Reject',
});

export const demoLabelReason = message({
  ja: '理由',
  en: 'Reason',
});

export const demoLabelAspects = message({
  ja: '審査した観点',
  en: 'Aspects reviewed',
});

export const demoAspectContent = message({
  ja: '内容',
  en: 'Content',
});

export const demoAspectStructure = message({
  ja: '構成',
  en: 'Structure',
});

export const demoAspectTiming = message({
  ja: '時間配分',
  en: 'Timing',
});

export const demoSubmit = message({
  ja: '送信',
  en: 'Submit',
});

export const demoSent = message({
  ja: 'この値なら送信できます。',
  en: 'These values can be sent.',
});

export const demoDecisionMissing = message({
  ja: '判定を選んでください',
  en: 'Choose a decision',
});

export const demoReasonRequired = message({
  ja: '却下するときは理由を入力してください',
  en: 'Give a reason when rejecting',
});

export const demoAspectsMin = message({
  ja: '観点を2つ以上選んでください',
  en: 'Check at least two aspects',
});
