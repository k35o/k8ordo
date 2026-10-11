import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'よくある症状の原因と直し方です。エラー文で探すときは、ページの中を検索してください。',
  en: 'Common symptoms, their causes and their fixes. To look up an error, search this page for its wording.',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const missingTitle = message({
  ja: '`no text for "en"`',
  en: '`no text for "en"`',
});

export const missingCause = message({
  ja: '文言に、そのロケールの文がありません。ロケールの型が`Register`に登録される前に書いた文言や、`as`で型を通した文言、JavaScriptで書いた文言で起こります。',
  en: 'A message has no text for that locale. It happens to a message written before `Register` carried the locale type, forced through with `as`, or written in JavaScript.',
});

export const missingFix = message({
  ja: 'エラー文に、欠けているロケールと文言が持つロケールが出ています。欠けているロケールの文を足します。ロケールの型が`Register`に登録されていれば、宣言の時点で型エラーになります。',
  en: 'The error names the missing locale and the ones the message has. Add the missing text. With the locale type in `Register`, this is a type error at the declaration.',
});

export const untypedTitle = message({
  ja: '型エラーにならない文の不足',
  en: 'A missing locale that is not a type error',
});

export const untypedCause = message({
  ja: '`Register`にロケールの型が登録されていません。登録されるまで`RegisteredLocale`は`string`なので、どのロケールの組み合わせでも通ります。',
  en: '`Register` does not carry the locale type. Until it does, `RegisteredLocale` is `string`, and any combination of locales passes.',
});

export const untypedFix = message({
  ja: "ロケールの一覧を定義するモジュールに、`declare module '@k8ordo/i18n'`で`Register`を書きます。そのモジュールがTypeScriptのプロジェクトに含まれているかも確かめます。`@k8ordo/framework`のアプリでは`Register`が生成されます。生成される条件は`@k8ordo/framework`の",
  en: "Write `Register` with `declare module '@k8ordo/i18n'` in the module that defines the locale set, and check that the module is part of the TypeScript project. In an `@k8ordo/framework` app `Register` is generated; for when, see `@k8ordo/framework`’s ",
});

export const frozenTitle = message({
  ja: '言語を切り替えても変わらない文言',
  en: 'Text that does not change with the language',
});

export const frozenCause = message({
  ja: 'モジュールのトップレベルで文言を呼び、文字列にしています。文言は呼ばれた時点のロケールを読むので、モジュールを読み込んだときのロケールで固定されます。',
  en: 'The message is called at module scope and kept as a string. A message reads the locale at the moment it is called, so the string stays in the locale current when the module loaded.',
});

export const frozenFix = message({
  ja: '文言は`Message`のまま持ち、描画するコンポーネントの中で呼びます。',
  en: 'Keep the `Message` itself, and call it in the component that renders it.',
});

export const dateTitle = message({
  ja: 'サーバーとブラウザで食い違う日付',
  en: 'A date that differs between the server and the browser',
});

export const dateCause = message({
  ja: '`timeZone`を指定しない`new Intl.DateTimeFormat`は、実行環境のタイムゾーンで日付を整形します。サーバーとブラウザのタイムゾーンが違うと、日付がずれてハイドレーションで食い違います。',
  en: 'A `new Intl.DateTimeFormat` without a `timeZone` formats in the runtime’s own time zone. When the server and the browser are in different time zones, the date shifts and hydration disagrees.',
});

export const dateFix = message({
  ja: '`locales.dateTimeFormat`で整形します。ロケールの`timeZone`を使うので、サーバーとブラウザで同じ日付になります。訪問者のタイムゾーンで見せたいものは、ブラウザだけで描画する部分に置きます。',
  en: 'Format it with `locales.dateTimeFormat`. It uses the locale’s `timeZone`, so the server and the browser agree. Anything that should follow the visitor’s own zone belongs in a part that renders only in the browser.',
});

export const schemaTitle = message({
  ja: '既定のロケールで描画されるページ',
  en: 'Pages rendered in the default locale',
});

export const schemaCause = message({
  ja: 'サーバーで、`run`も`paramsSchema`もロケールを設定していません。サーバーの文言はURLを読まないので、`/en/…`でも既定のロケールで描画されます。',
  en: 'On the server, neither `run` nor `paramsSchema` has set a locale. Messages on the server do not read the URL, so even `/en/…` renders in the default locale.',
});

export const schemaFix = message({
  ja: '文言を呼ぶ処理を`locales.run`で囲むか、その前に`paramsSchema`でロケールを検証します。`@k8ordo/framework`では、`[locale]`のレイアウトから`paramsSchema`をexportします。詳しくは`@k8ordo/framework`の',
  en: 'Wrap the code that calls messages in `locales.run`, or validate the locale with `paramsSchema` before it. In `@k8ordo/framework`, export `paramsSchema` from the `[locale]` layout. See `@k8ordo/framework`’s ',
});

export const storageTitle = message({
  ja: '`no AsyncLocalStorage to scope a locale to`',
  en: '`no AsyncLocalStorage to scope a locale to`',
});

export const storageCause = message({
  ja: 'サーバーのランタイムに`process.getBuiltinModule`が無く、`AsyncLocalStorage`を取れません。ロケールを非同期コンテキストに設定できないので、既定のロケールで描画する代わりにエラーになります。',
  en: 'The server runtime has no `process.getBuiltinModule`, so `AsyncLocalStorage` cannot be reached. Without it, the locale cannot be scoped to an async context, so `run` and `paramsSchema` fail with this error instead of going on in the default locale.',
});

export const storageFix = message({
  ja: "`process.getBuiltinModule('node:async_hooks')`を持つランタイムで動かします。Node 24にはあります。",
  en: "Run on a runtime with `process.getBuiltinModule('node:async_hooks')`. Node 24 has it.",
});

export const runTitle = message({
  ja: '`in the browser the URL is the locale`',
  en: '`in the browser the URL is the locale`',
});

export const runCause = message({
  ja: 'ブラウザで`locales.run`を呼んでいます。jsdomやhappy-domのように`document`を定義するテスト環境も、ブラウザとして扱われます。',
  en: '`locales.run` was called in a browser. A test environment that defines `document`, such as jsdom or happy-dom, counts as one.',
});

export const runFix = message({
  ja: 'ブラウザでロケールを変えるには、そのロケールのURLへ移動します。テストでは`history.replaceState`でpathnameを変えます。書き方は',
  en: 'In a browser, change the locale by navigating to that locale’s URL. In a test, change the pathname with `history.replaceState`. See ',
});

export const uiEnglishTitle = message({
  ja: '英語のままの`@k8ordo/ui`のコンポーネント',
  en: '`@k8ordo/ui` components left in English',
});

export const uiEnglishCause = message({
  ja: 'ロケールの一覧を定義するモジュールが、ブラウザで読み込まれていません。',
  en: 'The module that defines the locale set is not loaded in the browser.',
});

export const uiEnglishFix = message({
  ja: 'Client Componentから`locales`をimportします。詳しくは`@k8ordo/ui`の',
  en: 'Import `locales` from a Client Component. See the `@k8ordo/ui` guide to ',
});

export const uiMissingTitle = message({
  ja: '`@k8ordo/ui: no built-in text for "fr"`',
  en: '`@k8ordo/ui: no built-in text for "fr"`',
});

export const uiMissingCause = message({
  ja: '`@k8ordo/ui`に、`ja`と`en`以外の辞書を登録していません。',
  en: 'No dictionary other than `ja` and `en` is registered with `@k8ordo/ui`.',
});

export const uiMissingFix = message({
  ja: "ロケールの一覧を定義するモジュールで、`@k8ordo/ui/i18n`の`registerMessages('fr', fr)`を呼びます。登録の仕方は`@k8ordo/ui`の",
  en: "Call `registerMessages('fr', fr)` from `@k8ordo/ui/i18n` in the module that defines the locale set. See the `@k8ordo/ui` guide to ",
});

export const doubleTitle = message({
  ja: 'ロケールが2つ並ぶ切り替え先のURL',
  en: 'A switcher URL with two locales',
});

export const doubleCause = message({
  ja: 'ロケールの区間が付いたままのpathnameを`localize`に渡しています。`localize`は、区間がすでにあるかを確かめません。',
  en: 'A pathname that still has its locale segment was passed to `localize`. `localize` does not check whether one is already there.',
});

export const doubleFix = message({
  ja: '先に`delocalize`で区間を外し、その`pathname`を`localize`に渡します。',
  en: 'Take the segment off with `delocalize` first, and pass its `pathname` to `localize`.',
});

export const notFoundTitle = message({
  ja: '既定の言語のままの404ページ',
  en: 'A 404 page left in the default language',
});

export const notFoundCause = message({
  ja: '静的なホストの`404.html`のように、1回だけ描画したHTMLをどのURLにも返しています。Server Componentが描画した文は、描画したときのロケールのまま変わりません。',
  en: 'HTML rendered once, such as the `404.html` a static host serves, is returned for every URL. Text a Server Component rendered stays in the locale it was rendered in.',
});

export const notFoundFix = message({
  ja: '訪問者のロケールで出したい文は、ハイドレーションが終わってからブラウザで描画します。HTMLの文のままハイドレーションすると、ブラウザが描画する文と食い違います。`@k8ordo/framework`は`404.html`をハイドレーションせずに描画し直すので、Client Componentの文言が訪問者のロケールになります。詳しくは`@k8ordo/framework`の',
  en: 'Render text that should follow the visitor’s locale in the browser, after hydration. Hydrated as it is, the HTML’s text disagrees with what the browser renders. `@k8ordo/framework` renders `404.html` again instead of hydrating it, so a Client Component’s messages come out in the visitor’s locale. See `@k8ordo/framework`’s ',
});

export const boundaryTitle = message({
  ja: 'Client Componentに渡せない文言',
  en: 'A message that cannot be passed to a Client Component',
});

export const boundaryCause = message({
  ja: '文言は関数で、Reactは関数をpropsとしてClient Componentへ送れません。',
  en: 'A message is a function, and React cannot send a function to a Client Component as a prop.',
});

export const boundaryFix = message({
  ja: '呼んだ結果の文字列を渡すか、Client Componentの中で文言をimportして呼びます。',
  en: 'Pass the string you get by calling it, or import the message in the Client Component and call it there.',
});

export const formTitle = message({
  ja: 'ページの言語にならないフォームのエラー',
  en: 'Form errors in the wrong language',
});

export const formCause = message({
  ja: 'zodに文言を文字列で渡しているか、`formFields`をモジュールのトップレベルで呼んでいます。',
  en: 'zod was given a string instead of the message, or `formFields` is called at module scope.',
});

export const formFix = message({
  ja: '直し方は、`@k8ordo/form`の',
  en: 'For the fix, see the `@k8ordo/form` guide to ',
});

export const causeLabel = message({
  ja: '原因',
  en: 'Cause',
});

export const fixLabel = message({
  ja: '直し方',
  en: 'Fix',
});
