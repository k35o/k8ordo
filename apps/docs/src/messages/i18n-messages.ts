import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '文言は、`message`で1つずつ宣言する関数です。ロケールごとの文をその場に並べておくと、呼ばれた場所のロケールの文を返します。このページでは、値を差し込む文言の書き方と文言の置き場所、Server Componentから文言を渡す方法を説明します。',
  en: 'A message is a function, declared one at a time with `message`. Its text in every locale sits side by side, and it returns the text for the locale where it is called. This page covers messages that take values, where messages live, and handing text over from a Server Component.',
});

export const textTitle = message({
  ja: '文だけの文言を書く',
  en: 'Write a plain message',
});

export const textDescription = message({
  ja: 'ロケールをキーに、そのロケールの文を書きます。`message`が返すのは引数を取らない関数で、呼ぶたびにその時点のロケールを読みます。',
  en: 'Key the text by locale. `message` returns a function of no arguments, which reads the current locale each time it is called.',
});

export const textCheck = message({
  ja: '`Register`にロケールを登録したあとは、ロケールが1つでも欠けた文言は型エラーになります。集合に無いロケールを書いた場合も同じです。翻訳し忘れた文言は、宣言したその場所で見つかります。',
  en: 'Once `Register` is merged, a message missing any locale does not compile, and neither does one with a locale outside the set. A forgotten translation shows up where it is declared.',
});

export const textMissingCallout = message({
  ja: 'enが無いので型エラーになる',
  en: 'No en: a type error',
});

export const textNoLocale = message({
  ja: '何もロケールを指名していないときは、既定のロケールの文を返します。サーバーで`[locale]`の描画の外から呼んだときや、ロケールの区間が無いURLで呼んだときです。',
  en: 'When nothing names a locale, it returns the default locale’s text: called on the server outside a `[locale]` render, say, or under a URL with no locale segment.',
});

export const valuesTitle = message({
  ja: '値を差し込む',
  en: 'Take values',
});

export const valuesDescription = message({
  ja: '値を差し込む文言は、すべてのロケールを同じ引数の関数で書きます。どれか1つのロケールに引数の型を書けば、ほかのロケールも同じ型で書くよう求められます。',
  en: 'A message that takes values is a function of the same arguments in every locale. Annotate the types on one locale, and the others are held to them.',
});

export const valuesTemplate = message({
  ja: '差し込み方は、テンプレートリテラルそのものです。覚える記法は無く、ただの関数の引数なので、呼ぶ側が渡す値もTypeScriptが確かめます。',
  en: 'Interpolation is the template literal itself. There is no syntax to learn, and since these are plain function arguments, TypeScript checks what every caller passes.',
});

export const valuesCallout = message({
  ja: 'numberは渡せないので型エラーになる',
  en: 'A number does not compile',
});

export const valuesFormat = message({
  ja: '複数形や日付、数値は、関数の中で`Intl`を使って書きます。書き方は「日付や数値を書式化する」で説明します。',
  en: 'Plurals, dates and numbers are written with `Intl` inside the function; “Format dates and numbers” shows how.',
});

export const valuesPitfall = message({
  ja: "1つの文言の中で、文と関数を混ぜることはできません。値を使わないロケールも関数にして、引数も宣言します（`en: (_count) => 'Items'`）。引数を省いた関数は、どのロケールに置いたかによって型エラーになったり、検査をすり抜けたりします。",
  en: "Text and functions cannot be mixed in one message, so a locale that does not use the value is a function too, and declares the parameter (`en: (_count) => 'Items'`). A function that leaves it out either fails to compile or slips past the check, depending on which locale holds it.",
});

export const valuesUntyped = message({
  ja: 'どのロケールにも型を書かないと、引数は`unknown`になり、どんな値でも通ってしまいます。少なくとも1つのロケールに書くか、`message<[name: string]>({ … })`のように型引数で渡します。',
  en: 'With no annotation in any locale, the arguments are `unknown` and any value passes. Annotate at least one locale, or pass the types as an argument: `message<[name: string]>({ … })`.',
});

export const whereTitle = message({
  ja: '文言を置く場所',
  en: 'Where messages live',
});

export const whereDescription = message({
  ja: '文言はどのファイルに置いてもかまいません。読みやすいのは、領域ごとに1つのファイルにまとめ、索引のモジュールから名前空間として再exportする形です。',
  en: 'Anywhere. What reads well is one file per area, re-exported as a namespace from an index module.',
});

export const whereNear = message({
  ja: '1つのコンポーネントだけが使う文言は、そのコンポーネントの隣に置いてもかまいません。関係の深い文言をオブジェクトにまとめることもできますが、その場合バンドラはオブジェクトを丸ごと残します。',
  en: 'A message only one component uses can sit next to that component. Related messages can be grouped in an object too, but the bundler then keeps the object whole.',
});

export const whereReserved = message({
  ja: "`static`のような予約語を名前空間の名前にしたいときは、`export * as 'static' from './static'`のように文字列で書きます。使う側は`m.static.title()`と読めます。",
  en: "To name a namespace with a reserved word such as `static`, export it under a string name: `export * as 'static' from './static'`. The call site still reads `m.static.title()`.",
});

export const renderTitle = message({
  ja: '描く場所で呼ぶ',
  en: 'Call it where it renders',
});

export const renderDescription = message({
  ja: '文言は、呼ばれた瞬間のロケールを読みます。そのため、モジュールのトップレベルで呼んで文字列にしておくと、そのときのロケールで固定されます。',
  en: 'A message reads the locale at the moment it is called. Call it at the top of a module and keep the string, and the string is fixed in that moment’s locale.',
});

export const renderWhy = message({
  ja: 'サーバーでは、モジュールを読み込むのはたいていリクエストの外なので、既定のロケールの文字列になります。ブラウザでは、読み込んだときのURLのロケールのまま、言語を切り替えても変わりません。`Message`のまま持っておき、描くコンポーネントが呼んでください。',
  en: 'On the server a module usually loads outside any request, so the string is in the default locale. In the browser it stays in the locale of the URL the module loaded under, even after a language switch. Keep the `Message`, and let the component that renders it call it.',
});

export const propsTitle = message({
  ja: '文言をpropsで受け取る',
  en: 'Take a message as a prop',
});

export const propsDescription = message({
  ja: '文言を受け取るコンポーネントは、文字列ではなく`Message`型で受け取り、描くときに呼びます。',
  en: 'A component that takes a message takes a `Message`, not a string, and calls it when it renders.',
});

export const propsArgs = message({
  ja: '値を差し込む文言は、`Message<[name: string]>`のように引数の組を型引数に書きます。文字列にするのは描くコンポーネントだけなので、データを組み立てる側はロケールを知らずに済みます。',
  en: 'For a message that takes values, give the argument tuple as the type argument: `Message<[name: string]>`. Only the component that renders it turns it into a string, so whatever builds the data never needs the locale.',
});

export const propsSite = message({
  ja: 'このサイトのナビゲーションのデータも、`label: Message`を持っています。',
  en: 'This site’s navigation data holds `label: Message` the same way.',
});

export const boundaryTitle = message({
  ja: 'Server ComponentからClient Componentへ渡す',
  en: 'From a Server Component to a Client Component',
});

export const boundaryDescription = message({
  ja: '文言は関数なので、Server ComponentからClient Componentへpropsとして渡せません。Reactは関数をシリアライズできず、描画が失敗するからです。',
  en: 'A message is a function, so it cannot go from a Server Component to a Client Component as a prop: React cannot serialize a function, and the render fails.',
});

export const boundaryStringTitle = message({
  ja: '呼んだ結果を渡す',
  en: 'Pass the string',
});

export const boundaryString = message({
  ja: 'Server Componentが文言を呼び、文字列を渡します。文字列はそのページのロケールで作られ、文言そのものはブラウザのバンドルに入りません。',
  en: 'The Server Component calls the message and passes the string. The string is made in the page’s locale, and the message itself stays out of the browser bundle.',
});

export const boundaryImportTitle = message({
  ja: 'Client Componentでimportする',
  en: 'Import it in the Client Component',
});

export const boundaryImport = message({
  ja: 'Client Componentが自分で文言をimportして呼んでもかまいません。その代わり、その文言はすべてのロケールの文を持ったまま、ブラウザのバンドルに入ります。入力に応じて変わる文や、ボタンを押したあとに出す文のように、ブラウザで決まる文に向いています。',
  en: 'A Client Component can also import a message and call it itself. That message then ships to the browser with its text in every locale, which suits text the browser decides: text that follows input, or appears after a click.',
});

export const boundaryMore = message({
  ja: 'どの文言がブラウザのバンドルに入るかは、「仕組み」で説明します。',
  en: '“How it works” explains which messages reach the browser bundle.',
});

export const boundarySharedTitle = message({
  ja: 'ディレクティブの無いコンポーネント',
  en: 'Components without a directive',
});

export const boundaryShared = message({
  ja: "ディレクティブの無いコンポーネントは、Server Componentから描かれればサーバーで、Client Componentから描かれればブラウザで動きます。どちらの場合も境界を越えないので、`Message`型のpropsを受け取れます。ページのタイトルのように、propsと文言を読むだけのコンポーネントは、`'use client'`を付けずにおくのが向いています。",
  en: "A component without a directive runs on the server when a Server Component renders it, and in the browser when a Client Component does. Either way nothing crosses the boundary, so it can take a `Message` prop. A component that only reads props and messages, such as a page title, is best left without `'use client'`.",
});
