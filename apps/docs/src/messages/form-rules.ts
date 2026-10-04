import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'パスワードの確認や「2つ以上選ぶ」のように、1つの入力欄だけでは決まらない検証があります。こうした検証はHTMLの属性で表せず、関数である`.refine()`はブラウザへ送れません。そこで`@k8ordo/form`では、これをルールとしてスキーマの横に宣言します。',
  en: 'Some checks depend on more than one field: a password confirmation, or “pick at least two”. No HTML attribute expresses them, and a `.refine()` is a function that cannot travel to the browser. `@k8ordo/form` has you declare them as rules beside the schema instead.',
});

export const declareTitle = message({
  ja: 'ルールを宣言する',
  en: 'Declare a rule',
});

export const declareDescription = message({
  ja: '`defineForm`に、スキーマとルールの配列を渡します。',
  en: 'Pass `defineForm` the schema and an array of rules.',
});

export const declarePass = message({
  ja: 'できあがった定義は、スキーマの代わりに`formFields`と`parseForm`へ渡します。ルールはただのデータなので、入力欄の情報と一緒にブラウザへ届きます。',
  en: 'Pass the definition wherever you passed the schema: to `formFields` and to `parseForm`. Rules are plain data, so they travel to the browser along with the fields.',
});

export const declareTyped = message({
  ja: 'ルールに書く入力欄のパスは、スキーマから型で確かめられます。存在しない欄の名前を書くと、型エラーになります。',
  en: 'The field paths in a rule are checked against the schema’s types. Naming a field that does not exist fails to compile.',
});

export const kindsTitle = message({
  ja: '用意されているルール',
  en: 'The available rules',
});

export const kindsDescription = message({
  ja: 'いま使えるルールは3つです。',
  en: 'Three rules are available.',
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
  en: '`requiredWhen(field, when, equals, message)`: `field` is required only while `when` holds `equals`.',
});

export const sameTitle = message({
  ja: 'ブラウザとサーバーで同じ判定をする',
  en: 'The same verdict in the browser and on the server',
});

export const sameDescription = message({
  ja: 'ルールは、ブラウザでもサーバーでも同じ処理で判定します。ブラウザは入力中のフォームを、サーバーは送信された値を確かめます。判定の処理が1つしかないので、両者の結果が食い違うことはありません。',
  en: 'One evaluator judges the rules on both sides: the browser against the live form, the server against the submission. There is no second implementation to drift from the first.',
});

export const sameCustomValidity = message({
  ja: 'ブラウザでは、ルールを満たさない入力欄に`setCustomValidity`でエラーを付けます。そのため組み込みの検証と見分けがつかず、`:user-invalid`の擬似クラスも当たり、文言もほかのエラーと同じ`error`に届きます。',
  en: 'In the browser a broken rule is applied with `setCustomValidity`, so it looks exactly like a built-in check: `:user-invalid` matches, and the message arrives in the same `error` as every other one.',
});

export const sameOrder = message({
  ja: '1つの入力欄が複数のルールを満たさないときは、先に宣言したルールの文言を表示します。',
  en: 'When several rules break on one field, the message of the one declared first is shown.',
});

export const localeTitle = message({
  ja: 'リクエストの言語で文言を出す',
  en: 'Word the message in the request’s locale',
});

export const localeDescription = message({
  ja: 'ルールの文言には、文字列の代わりに関数も渡せます。関数はルールを宣言したときではなく、エラーを報告するときに呼ばれます。',
  en: 'A rule’s message can be a function instead of a string. It is called when the rule is reported, not where the rule is declared.',
});

export const localeRender = message({
  ja: 'ブラウザはサーバーから送られた関数を呼べないので、`formFields`は入力欄の情報を作る時点で文言を確定させます。言語に合わせるなら、`formFields`を描画の中で呼んでください。',
  en: 'The browser cannot call a function sent from the server, so `formFields` settles the wording as it derives the fields. To follow the locale, call `formFields` during the render.',
});

export const refineTitle = message({
  ja: 'ルールで書けない検証',
  en: 'Checks rules cannot express',
});

export const refineDescription = message({
  ja: '3つのルールで書けない検証は、これまでどおり`.refine()`で書きます。ただし、`.refine()`はサーバーでしか動きません。',
  en: 'Anything the three rules cannot express stays a `.refine()`, which runs on the server only.',
});

export const refineWhole = message({
  ja: 'スキーマ全体に付けた`.refine()`は、ブラウザでは確かめない検証として`dropped`に載ります。`path`を指定しなければ、エラーは`form.formError`に届きます。',
  en: 'A `.refine()` on the whole schema is listed in `dropped` as a check the browser does not run. Without a `path`, its error arrives in `form.formError`.',
});

export const refinePitfall = message({
  ja: '1つの入力欄や入れ子のオブジェクト、配列の行に付けた`.refine()`は、まだ`dropped`に載りません。ブラウザでは何も知らせずに素通りし、送信してから初めてサーバーでエラーになります。',
  en: 'A `.refine()` on a single field, a nested object or a row is not listed in `dropped` yet. The browser lets it through without a word, and the error only appears once the server checks the submission.',
});

export const demoTitle = message({
  ja: 'ルールの動きを試す',
  en: 'Try the rules',
});

export const demoDescription = message({
  ja: '登壇の審査フォームです。「却下」のときだけ理由が必須になり、観点は2つ以上選ぶ必要があります。',
  en: 'A talk review form. The reason is required only for “Reject”, and at least two aspects must be checked.',
});

export const demoSteps = [
  message({
    ja: '観点を2つ選んでから、判定で「却下」を選び、理由を空のまま「送信」を押してください。理由の入力欄にエラーが出ます。',
    en: 'Check two aspects, choose “Reject”, leave the reason empty, and press “Submit”. The reason field shows an error.',
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
