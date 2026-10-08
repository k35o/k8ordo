import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'よくつまずく症状と、その原因、直し方をまとめています。',
  en: 'Common symptoms, what causes them, and how to fix them.',
});

export const missingTitle = message({
  ja: '「no text for "en"」というエラーが出る',
  en: 'A “no text for "en"” error is thrown',
});

export const missingCause = message({
  ja: '型をすり抜けて、そのロケールの文が無い文言を読んでいます。JavaScriptで書いた文言や、`as`で型を通した文言、`Register`を登録する前に書いた文言で起こります。',
  en: 'A message with no text for that locale got past the types and was read. It happens to a message written in JavaScript, forced through with `as`, or written before `Register` was merged.',
});

export const missingFix = message({
  ja: 'エラーの文面に、欠けているロケールと、文言が持っているロケールが出ています。欠けたロケールの文を足してください。`Register`を登録しておけば、同じ欠けは宣言の時点で型エラーになります。',
  en: 'The error names the missing locale and the ones the message has. Add the missing text. With `Register` merged, the same gap is a type error at the declaration.',
});

export const untypedTitle = message({
  ja: 'ロケールが欠けても型エラーにならない',
  en: 'A missing locale is not a type error',
});

export const untypedCause = message({
  ja: '`Register`にロケールの型が登録されていません。登録する前は`RegisteredLocale`が`string`なので、どのロケールの組み合わせでも通ります。',
  en: '`Register` does not carry the locales’ type. Until it does, `RegisteredLocale` is `string`, and any set of locales passes.',
});

export const untypedFix = message({
  ja: "集合を定義するモジュールに、`declare module '@k8ordo/i18n'`で`Register`を書きます。そのモジュールがTypeScriptのプロジェクトに含まれているかも確かめてください。",
  en: "Write `Register` with `declare module '@k8ordo/i18n'` in the module that defines the set, and check that the module is part of the TypeScript project.",
});

export const frozenTitle = message({
  ja: '言語を切り替えても、一部の文言だけが変わらない',
  en: 'Some text does not change with the language',
});

export const frozenCause = message({
  ja: 'モジュールのトップレベルで文言を呼び、文字列にしています。文言は呼ばれた瞬間のロケールを読むので、モジュールを読み込んだときのロケールのまま固定されます。',
  en: 'The message is called at the top of a module and kept as a string. A message reads the locale at the moment it is called, so the string stays in whatever locale was current when the module loaded.',
});

export const frozenFix = message({
  ja: '文言を`Message`のまま持ち、描くコンポーネントの中で呼びます。',
  en: 'Keep the `Message` itself, and call it in the component that renders it.',
});

export const dateTitle = message({
  ja: '日付がサーバーとブラウザで食い違う',
  en: 'A date differs between the server and the browser',
});

export const dateCause = message({
  ja: '`timeZone`を指定しない`new Intl.DateTimeFormat`は、実行環境のタイムゾーンで書きます。サーバーとブラウザでタイムゾーンが違うと、日付や時刻がずれて、ハイドレーションで食い違います。',
  en: 'A `new Intl.DateTimeFormat` without a `timeZone` writes in the runtime’s own zone. When the server’s zone and the browser’s differ, the date or time shifts, and hydration disagrees.',
});

export const dateFix = message({
  ja: '`locales.dateTimeFormat`で書きます。ロケールの`timeZone`で書くので、両側で同じ日付になります。訪問者のタイムゾーンで見せたいものは、ブラウザだけで描く部分に置きます。',
  en: 'Write it with `locales.dateTimeFormat`, which uses the locale’s `timeZone`, so both sides agree. Anything that should follow the visitor’s own zone belongs in a part that renders in the browser only.',
});

export const schemaTitle = message({
  ja: 'ページが既定のロケールで描かれる',
  en: 'Pages render in the default locale',
});

export const schemaCause = message({
  ja: '`[locale]`のレイアウトが`paramsSchema`をexportしていません。サーバーはスキーマが受け付けたロケールしか読まないので、`/en/…`でも既定のロケールで描かれます。一覧に無い`/fr/…`も、404になりません。',
  en: 'The `[locale]` layout does not export `paramsSchema`. The server reads only a locale a schema accepted, so even `/en/…` renders in the default, and `/fr/…`, outside the list, is no 404.',
});

export const schemaFix = message({
  ja: "Server Componentのレイアウトに`export const { paramsSchema } = locales`と書きます。`'use client'`を付けたモジュールからexportしても、スキーマとしては届きません。",
  en: "Write `export const { paramsSchema } = locales` in a Server Component layout. Exported from a `'use client'` module, it does not reach the framework as a schema.",
});

export const storageTitle = message({
  ja: '「no AsyncLocalStorage to scope a locale to」というエラーが出る',
  en: 'A “no AsyncLocalStorage to scope a locale to” error is thrown',
});

export const storageCause = message({
  ja: 'サーバーのランタイムが、`process.getBuiltinModule`で`AsyncLocalStorage`を渡せません。受け付けたロケールを描画に結び付けられないので、既定のロケールで描く代わりにエラーを投げています。',
  en: 'The server runtime cannot hand out `AsyncLocalStorage` through `process.getBuiltinModule`. With nowhere to tie an accepted locale to the render, it throws rather than render in the default.',
});

export const storageFix = message({
  ja: "`process.getBuiltinModule('node:async_hooks')`を持つランタイムで動かします。`@k8ordo/framework`が求めるNode 24は、これを持っています。",
  en: "Run on a runtime with `process.getBuiltinModule('node:async_hooks')`. Node 24, which `@k8ordo/framework` requires, has it.",
});

export const runTitle = message({
  ja: '「in the browser the URL is the locale」というエラーが出る',
  en: 'An “in the browser the URL is the locale” error is thrown',
});

export const runCause = message({
  ja: 'ブラウザで`locales.run`を呼んでいます。jsdomやhappy-domのように`document`を定義するテスト環境も、ブラウザとして扱われます。',
  en: '`locales.run` was called in a browser. A test environment that defines `document`, such as jsdom or happy-dom, counts as one.',
});

export const runFix = message({
  ja: 'ブラウザでロケールを変えるには、そのロケールのURLへ移動します。テストでは、`history.replaceState`でpathnameを変えます。',
  en: 'In a browser, change the locale by navigating to that locale’s URL. In a test, change the pathname with `history.replaceState`.',
});

export const uiEnglishTitle = message({
  ja: '@k8ordo/uiのコンポーネントだけが英語になる',
  en: 'Only @k8ordo/ui’s components speak English',
});

export const uiEnglishCause = message({
  ja: '集合を定義するモジュールが、ブラウザで読み込まれていません。集合が無い環境では、`@k8ordo/ui`は英語で描くので、サーバーのHTMLとも食い違います。',
  en: 'The module that defines the set is not loaded in the browser. Where no set is defined, `@k8ordo/ui` speaks English, which also disagrees with the server’s HTML.',
});

export const uiEnglishFix = message({
  ja: 'リンクの`bindParams`や言語の切り替えのように、Client Componentから`locales`をimportします。',
  en: 'Import `locales` from a Client Component, as the `bindParams` links or the language switcher do.',
});

export const uiMissingTitle = message({
  ja: '「@k8ordo/ui: no built-in text for "fr"」というエラーが出る',
  en: 'A “@k8ordo/ui: no built-in text for "fr"” error is thrown',
});

export const uiMissingCause = message({
  ja: '`@k8ordo/ui`には、`ja`と`en`の文言しか入っていません。登録の無いロケールで描くと、エラーを投げます。`fr-CA`のような地域の付いたタグは、登録が無ければ言語の`fr`を探します。',
  en: '`@k8ordo/ui` ships text for `ja` and `en` only, and throws when it renders in a locale nothing registered. A regional tag such as `fr-CA` without a registration of its own looks for its language, `fr`.',
});

export const uiMissingFix = message({
  ja: "集合を定義するモジュールで、`@k8ordo/ui/i18n`の`registerMessages('fr', fr)`を呼びます。",
  en: "Call `registerMessages('fr', fr)` from `@k8ordo/ui/i18n` in the module that defines the set.",
});

export const pathsTitle = message({
  ja: '静的ビルドが「static build needs pathnames for」で止まる',
  en: 'The static build stops with “static build needs pathnames for”',
});

export const pathsCause = message({
  ja: '`/:locale/blog/:slug`のように、ロケールのほかにもパラメータを持つパターンがあります。`locales.paths`はロケールしか展開しないので、`:slug`が残ります。',
  en: 'A pattern has a parameter besides the locale, such as `/:locale/blog/:slug`. `locales.paths` expands only the locale, so `:slug` is left.',
});

export const pathsFix = message({
  ja: '`paths`に渡す関数の中で、`locales.paths`の結果に残ったパラメータを展開します。書き方は「静的に書き出す」にあります。',
  en: 'In the function passed as `paths`, expand what is left in `locales.paths`’ result. “Static builds” shows how.',
});

export const doubleTitle = message({
  ja: '切り替え先のURLにロケールが2つ並ぶ',
  en: 'The switcher’s URL has two locales in it',
});

export const doubleCause = message({
  ja: 'ロケールの区間が付いたままのpathnameを、`localize`に渡しています。`localize`は、区間がすでにあるかを確かめません。',
  en: 'A pathname still holding its locale segment went to `localize`, which does not check for one.',
});

export const doubleFix = message({
  ja: '先に`delocalize`で区間を外し、その`pathname`を`localize`に渡します。',
  en: 'Take the segment off with `delocalize` first, and hand its `pathname` to `localize`.',
});

export const notFoundTitle = message({
  ja: '404ページが既定の言語のまま変わらない',
  en: 'The 404 page stays in the default language',
});

export const notFoundCause = message({
  ja: '静的なホストが返す`404.html`は、ビルドで1回だけ、既定のロケールで描かれます。Server Componentが描いた文は、既定のロケールのまま残ります。',
  en: 'The `404.html` a static host serves is rendered once at build time, in the default locale, and text a Server Component rendered stays that way.',
});

export const notFoundFix = message({
  ja: '`not-found.tsx`をClient Componentにして文言を描きます。ブラウザが訪問者のURLで描き直すときに、訪問者のロケールになります。',
  en: 'Make `not-found.tsx` a Client Component that renders the text. When the browser renders it afresh at the visitor’s URL, it comes out in their locale.',
});

export const boundaryTitle = message({
  ja: 'Server ComponentからClient Componentに文言を渡すと描画に失敗する',
  en: 'Passing a message to a Client Component fails',
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
  ja: 'フォームのエラー文言がページの言語にならない',
  en: 'Form errors are not in the page’s language',
});

export const formCause = message({
  ja: 'zodに文言を呼んだ結果の文字列を渡しているか、`formFields`をモジュールのトップレベルで呼んでいます。どちらも、その時点のロケールで文字列が固定されます。',
  en: 'zod was given the string a message returned, or `formFields` is called at the top of a module. Either way the string is fixed in the locale current at that moment.',
});

export const formFix = message({
  ja: 'zodには`{ error: m.talk.titleRequired }`のように文言を関数のまま渡し、`formFields`はページの描画の中で呼びます。',
  en: 'Give zod the message itself, as in `{ error: m.talk.titleRequired }`, and call `formFields` inside the page’s render.',
});

export const causeLabel = message({
  ja: '原因',
  en: 'Cause',
});

export const fixLabel = message({
  ja: '直し方',
  en: 'Fix',
});
