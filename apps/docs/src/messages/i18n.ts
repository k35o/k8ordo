import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'アプリケーションのロケール軸を持つ。ロケール集合1つからURLの区間・交渉・paramsSchema・静的化のパス一覧を導き、文言は1つずつ関数にする。関数は呼ばれた場所でロケールを読むので、サーバーでもクライアントでも同じ1行で、バンドルには呼ばれた文言しか残らない。',
  en: 'Owns the locale axis of an application. One locale set derives the URL segment, negotiation, the params schema, and the static paths; each message is a function that reads the locale where it is called, so the same line renders on the server and in the browser, and only the messages a page names reach its bundle.',
});

export const featuresTitle = message({
  ja: '特徴',
  en: 'Features',
});

export const featureLocales = message({
  ja: 'ロケールは1か所に',
  en: 'Locales in one place',
});

export const featureLocalesDescription = message({
  ja: '`defineLocales({ ja: …, en: … })` を書くのは1回だけ。各ロケールのタイムゾーンと文字の向きもそこに書く。既定値・所属判定・交渉・URL区間・`[locale]` のスキーマは全部そこから出るので、一覧を複製する場所が無い。',
  en: "`defineLocales({ ja: …, en: … })` is written once, with each locale's time zone and text direction. The default, membership, negotiation, the URL segment, and the `[locale]` schema all come from it, so there is nowhere to copy the list to.",
});

export const featureSegment = message({
  ja: 'URLの先頭区間を持つ',
  en: 'Owns the first URL segment',
});

export const featureSegmentDescription = message({
  ja: 'ロケールはURLに住む。`localize` / `delocalize` が区間の付け外しを、`paramsSchema` が `/fr/…` を本物の404にする。pathname の残りは `@k8ordo/router` のもの。',
  en: 'The locale lives in the URL. `localize` / `delocalize` put the segment on and take it off, and `paramsSchema` makes `/fr/…` a real 404. The rest of the pathname belongs to `@k8ordo/router`.',
});

export const featureNegotiate = message({
  ja: '交渉はリストに対して',
  en: 'Negotiates over a list',
});

export const featureNegotiateDescription = message({
  ja: '`negotiate(navigator.languages)` も、Cookie と `Accept-Language` を読む `negotiateRequest(request)` も同じ規則。要求の順に、完全一致→同じ言語→既定値で決める。',
  en: '`negotiate(navigator.languages)` and `negotiateRequest(request)`, which reads the cookie and `Accept-Language`, follow the same rule: each requested tag in order, exact match, then the same language, then the default.',
});

export const featureDictionary = message({
  ja: '文言は1つずつ関数',
  en: 'A message is a function',
});

export const featureDictionaryDescription = message({
  ja: '`message({ ja, en })` が1つの文言。全ロケールが揃わないと型が通らず、引数の型は書いた関数から流れる。キーの一覧も辞書オブジェクトも無い。',
  en: '`message({ ja, en })` is one message. It does not type-check until every locale is there, and its arguments are typed by the function you wrote. No key list, no dictionary object.',
});

export const featureFunctions = message({
  ja: '呼ばれた文言だけがバンドルに',
  en: 'Only what is called ships',
});

export const featureFunctionsDescription = message({
  ja: '文言は普通のexportなので、バンドラは名前で参照された分だけを残す。Server Component が引いた文言はクライアントに1バイトも運ばれない。',
  en: 'Messages are ordinary exports, so a bundler keeps only the ones a module names. Text a Server Component rendered never reaches the client.',
});

export const featureBoundary = message({
  ja: 'サーバーとクライアントで同じ1行',
  en: 'The same line on either side',
});

export const featureBoundaryDescription = message({
  ja: 'Provider も hook も無い。サーバーでは受理した `[locale]` がその描画のロケールになり、ブラウザでは URL がロケール。`nav.home()` はどちらでも同じに描ける。',
  en: 'No provider, no hook. On the server the accepted `[locale]` is the locale of that render; in the browser the URL is. `nav.home()` renders the same on both.',
});

export const exampleTitle = message({
  ja: '使い方',
  en: 'Usage',
});

export const exampleDescription = message({
  ja: 'ロケール集合を定義して `Register` に載せ、文言を `message` で1つずつ書く。あとは呼ぶだけ。',
  en: 'Define the locale set, register it, write each message with `message`, and call it. That is all.',
});

export const demoTitle = message({
  ja: 'このサイト自身が実演',
  en: 'This site is the demo',
});

export const demoDescription = message({
  ja: 'ヘッダーからフッターまでの文言は `@k8ordo/i18n` の `message` から出ています。下の挨拶は引数を取る文言です。',
  en: "Every word from the header to the footer comes from `@k8ordo/i18n`'s `message`. The greeting below is a message that takes an argument.",
});

export const demoLabelName = message({
  ja: '名前',
  en: 'Name',
});

export const demoGreeting = message({
  ja: (name: string) =>
    name === '' ? 'こんにちは。' : `こんにちは、${name}さん。`,
  en: (name) => (name === '' ? 'Hello.' : `Hello, ${name}.`),
});

export const demoPreferred = message({
  ja: 'ブラウザの言語設定から交渉したロケール',
  en: 'Locale negotiated from your browser languages',
});

export const demoPreferredUnknown = message({
  ja: '判定中',
  en: 'detecting',
});

export const demoHint = message({
  ja: '`greeting(name)` の引数は、`ja` に書いた関数の引数から型が付きます。`en` 側の引数を別の型で書くとコンパイルが通りません。',
  en: 'The argument of `greeting(name)` is typed by the function written for `ja`. An `en` whose parameter has another type does not compile.',
});

export const docsTitle = message({
  ja: '設計ガイド',
  en: 'Design guide',
});

export const docsDescription = message({
  ja: '設計ガイドは npm パッケージに同梱されています。AIコーディングエージェントは `node_modules/@k8ordo/i18n/docs/` からインストールした版そのものを読みます。',
  en: 'The guide ships inside the npm package. An AI coding assistant reads the exact installed version out of `node_modules/@k8ordo/i18n/docs/`.',
});

export const navLocales = message({
  ja: 'ロケール',
  en: 'Locales',
});

export const navMessages = message({
  ja: 'メッセージ',
  en: 'Messages',
});

export const navFormatting = message({
  ja: '日付と数値',
  en: 'Dates & numbers',
});

export const navRouting = message({
  ja: 'URL とロケール',
  en: 'URLs & locale',
});

export const navIntegrations = message({
  ja: '組み合わせ',
  en: 'Integrations',
});
