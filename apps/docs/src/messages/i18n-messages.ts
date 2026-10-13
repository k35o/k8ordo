import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`message`で文言を宣言し、コンポーネントから呼べるようにします。値を差し込む文言を作り、Server ComponentからClient Componentへ渡せるようになります。',
  en: 'Declare messages with `message`, call them from components, give them values, and hand their text from a Server Component to a Client Component.',
});

export const textTitle = message({
  ja: '文だけの文言',
  en: 'Plain messages',
});

export const textKeys = message({
  ja: 'ロケールをキーに、そのロケールの文を書きます。`message`は引数を取らない関数を返し、呼ぶたびにその時点のロケールを読みます。',
  en: 'Key the text by locale. `message` returns a function of no arguments, and it reads the current locale each time it is called.',
});

export const textCheck = message({
  ja: 'ロケールの型が`Register`に登録されていれば、ロケールが1つでも欠けた文言は型エラーになります。一覧に無いロケールを書いた場合も同じです。',
  en: 'Once `Register` carries the locale type, a message missing any of the locales is a type error. So is a message with a locale outside them.',
});

export const textMissingCallout = message({
  ja: 'enが無いので型エラーになる',
  en: 'No en: a type error',
});

export const textNoLocale = message({
  ja: 'どこもロケールを指定していないときは、既定のロケールの文を返します。そうなる場面の一覧は',
  en: 'When nothing names a locale, the default locale’s text is returned. When that happens is listed under ',
});

export const valuesTitle = message({
  ja: '値を差し込む文言',
  en: 'Messages with values',
});

export const valuesFunction = message({
  ja: "値を差し込む文言は、すべてのロケールを同じ引数の関数で書きます。値を使わないロケールも関数にして、`(_count) => 'Items'`のように引数を宣言します。引数を省いた関数は、置いたロケールによって型エラーになったり、検査をすり抜けたりします。1つの文言の中で、文と関数は混ぜられません。",
  en: "A message that takes values is a function of the same arguments in every locale. A locale that does not use the value is a function too, and still declares the parameter, as in `(_count) => 'Items'`. A function that leaves it out either fails to compile or slips past the check, depending on which locale holds it. Text and functions cannot be mixed in one message.",
});

export const valuesTemplate = message({
  ja: '差し込みはテンプレートリテラルで書きます。引数の型はどれか1つのロケールに書けば、ほかのロケールも同じ型で検査されます。呼ぶ側が渡す値も、同じ型で検査されます。',
  en: 'Interpolation is a template literal. Annotate the argument types in one locale, and every other locale is checked against them. So is every value a caller passes.',
});

export const valuesCallout = message({
  ja: '`number`は渡せないので型エラーになる',
  en: 'A number does not compile',
});

export const valuesFormatBefore = message({
  ja: '複数形や日付、数値は、関数の中で`Intl`を使って書きます。書き方は',
  en: 'Plurals, dates and numbers are written with `Intl` inside the function. See ',
});

export const linkAfter = message({
  ja: 'にあります。',
  en: '.',
});

export const valuesUntyped = message({
  ja: 'どのロケールにも型を書かないと、引数は`unknown`になり、どんな値でも通ります。少なくとも1つのロケールに書くか、`message<[name: string]>({ … })`のように型引数で渡します。',
  en: 'With no annotation in any locale, the arguments are `unknown` and any value passes. Annotate at least one locale, or pass the types as a type argument: `message<[name: string]>({ … })`.',
});

export const whereTitle = message({
  ja: '置き場所',
  en: 'Where to put messages',
});

export const whereIndex = message({
  ja: '文言はどのファイルに置いてもかまいません。領域ごとに1つのファイルを`src/messages/`に置き、使う側は要る文言だけを名前でimportします。別のファイルの同じ名前は、`import { title as cartTitle }`のように付け替えます。',
  en: 'Messages can go in any file. Put one file per area in `src/messages/`, and import the messages a module needs by name. When two files export the same name, rename one on import: `import { title as cartTitle }`.',
});

export const whereNear = message({
  ja: '1つのコンポーネントだけが使う文言は、そのコンポーネントのモジュールの中に書けます。関係の深い文言をオブジェクトにまとめることもできます。ただし、使わない文言もオブジェクトごとバンドルに残ります。',
  en: 'A message only one component uses can be declared in that component’s own module. Related messages can also be grouped in an object, but unused ones then stay in the bundle with it.',
});

export const renderTitle = message({
  ja: '呼ぶ場所',
  en: 'Where to call it',
});

export const renderFixed = message({
  ja: 'モジュールのトップレベルで文言を呼んで文字列にすると、その時点のロケールで固定されます。',
  en: 'Called at the top level of a module, a message’s string is fixed in the locale of that moment.',
});

export const renderWhere = message({
  ja: 'サーバーでは、モジュールはたいていロケールが設定される前に読み込まれるので、既定のロケールの文字列になります。ブラウザでは、モジュールを読み込んだときのURLのロケールで固定され、言語を切り替えても変わりません。',
  en: 'On the server, a module usually loads before any locale is set, so the string is in the default locale. In the browser, it stays in the locale of the URL the module loaded under, even after the language is switched.',
});

export const renderKeep = message({
  ja: '`Message`のまま持っておき、描画するコンポーネントで呼びます。',
  en: 'Keep the `Message` and call it in the component that renders it.',
});

export const propsTitle = message({
  ja: '`Message`型のprops',
  en: '`Message` props',
});

export const propsType = message({
  ja: '文言を受け取るコンポーネントは、propsを`Message`型にして、描画するときに呼びます。',
  en: 'A component that takes a message types the prop as `Message` and calls it when it renders.',
});

export const propsArgs = message({
  ja: '値を差し込む文言は、`Message<[name: string]>`のように引数の組を型引数に書きます。文字列にするのは描画するコンポーネントだけなので、データを組み立てる側はロケールを知らずに済みます。',
  en: 'For a message that takes values, write the argument tuple as the type argument: `Message<[name: string]>`. Only the rendering component turns it into a string, so the code that builds the data never needs the locale.',
});

export const boundaryTitle = message({
  ja: '受け渡し',
  en: 'Passing to the client',
});

export const boundaryRule = message({
  ja: '文言は関数なので、Server ComponentからClient Componentへpropsとして渡せません。Reactは関数をシリアライズできないので、`Functions cannot be passed directly to Client Components`というエラーになります。',
  en: 'A message is a function, so it cannot be passed as a prop from a Server Component to a Client Component. React cannot serialize a function, and the render fails with `Functions cannot be passed directly to Client Components`.',
});

export const boundaryStringTitle = message({
  ja: '文字列のprops',
  en: 'A string prop',
});

export const boundaryString = message({
  ja: 'Server Componentの`ShareSection`が文言を呼び、今のロケールの文字列を渡します。文言そのものは、ブラウザのバンドルに入りません。',
  en: '`ShareSection`, a Server Component, calls the messages and passes the strings in the current locale. The messages themselves stay out of the browser bundle.',
});

export const boundaryMeasure = message({
  ja: 'ビルドしたブラウザ向けのJavaScriptを検索すると、Server Componentだけが描画する文が無いことを確かめられます。',
  en: 'After a build, search the JavaScript sent to the browser to confirm that text only a Server Component renders is not there.',
});

export const boundaryImportTitle = message({
  ja: '直接のimport',
  en: 'Direct import',
});

export const boundaryImport = message({
  ja: 'Client Componentが自分で文言をimportして呼ぶこともできます。その文言は、すべてのロケールの文を持ったままブラウザのバンドルに入ります。',
  en: 'A Client Component can also import the message and call it itself. That message then ships to the browser with its text in every locale.',
});

export const boundaryImportFit = message({
  ja: '入力に応じて変わる文や、ボタンを押したあとに出す文のように、ブラウザで決まる文に向いています。',
  en: 'This suits text the browser decides: text that follows input, or text shown after a click.',
});

export const boundaryMoreBefore = message({
  ja: 'どの文言がブラウザのバンドルに入るかは',
  en: 'Which messages reach the browser bundle is covered in ',
});

export const boundarySharedTitle = message({
  ja: 'ディレクティブ無し',
  en: 'No directive',
});

export const boundaryShared = message({
  ja: 'ディレクティブの無いコンポーネントは、描画したコンポーネントと同じ側で実行されます。Server Componentからならサーバー、Client Componentからならブラウザです。どちらの場合もpropsはシリアライズされないので、`Message`型のpropsを受け取れます。',
  en: 'A component without a directive runs on the server when a Server Component renders it, and in the browser when a Client Component does. In both cases the props are not serialized, so a `Message` prop is fine.',
});

export const boundarySharedUse = message({
  ja: "ページのタイトルのように、propsと文言を読むだけのコンポーネントには`'use client'`を付けません。",
  en: "A component that only reads props and messages, such as a page title, is left without `'use client'`.",
});
