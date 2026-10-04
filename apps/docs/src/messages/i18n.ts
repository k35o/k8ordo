import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'アプリのロケールを受け持ちます。ロケールの一覧を1か所に書けば、URLの区間や言語の交渉、`[locale]`のparamsSchema、静的化するパスの一覧がそこから決まります。文言は1つずつ関数として書き、呼ばれた場所でロケールを読むので、サーバーでもブラウザでも同じ1行で呼べます。',
  en: 'Owns the locale axis of an application. One locale set derives the URL segment, negotiation, the params schema, and the static paths; each message is a function that reads the locale where it is called, so the same line renders on the server and in the browser, and only the messages a page names reach its bundle.',
});

export const tagline = message({
  ja: '文言を関数として書き、Server ComponentでもClient Componentでも同じ1行で呼べる国際化のライブラリ。',
  en: 'Write each message as a function, and call it the same way in Server and Client Components.',
});

export const claimServerTitle = message({
  ja: 'プロバイダもフックもいらない',
  en: 'No provider, no hook',
});

export const claimServerBody = [
  message({
    ja: '文言はただの関数で、呼ばれた場所でロケールを読みます。サーバーでは`[locale]`の`paramsSchema`が受け付けたロケールを、ブラウザではURLの先頭の区間を読みます。',
    en: 'A message is a plain function that reads the locale where it is called: on the server, the one the `[locale]` segment’s `paramsSchema` accepted; in the browser, the first segment of the URL.',
  }),
  message({
    ja: 'そのため、Server ComponentでもClient Componentでも、同じ1行で呼べます。言語を切り替えるときは、別の区間のURLへ移動するだけです。',
    en: 'So the same line works in a Server Component and in a Client Component, and switching locale is a navigation to the other segment.',
  }),
] as const;

export const claimTypesTitle = message({
  ja: '訳し忘れは型エラーになる',
  en: 'A missing translation does not compile',
});

export const claimTypesBody = [
  message({
    ja: '`Register`にロケールの一覧を登録すると、`message`はすべてのロケールの文を求めるようになります。1つでも欠けていれば、その宣言が型エラーになります。',
    en: 'Register the locale set, and `message` asks for text in every locale. Leave one out, and the declaration fails to compile.',
  }),
  message({
    ja: '値を差し込む文言は、ロケールごとの関数として書きます。引数の型を1つのロケールに書いておけば、ほかのロケールも同じ型で書くよう求められます。',
    en: 'A message with values is a function in each locale. Annotate the arguments once, and every other locale is held to the same types.',
  }),
] as const;

export const claimTypesMissing = message({
  ja: 'enが無いので型エラーになる',
  en: 'No en: a type error',
});

export const claimBundleTitle = message({
  ja: 'ブラウザに届くのは、使っている文言だけ',
  en: 'Only the messages you use reach the browser',
});

export const claimBundleBody = [
  message({
    ja: '`message`は宣言しただけでは何もしない関数なので、使われていない文言はバンドラーが取り除きます。ブラウザに届くのは、Client Componentが使っている文言だけです。',
    en: '`message` has no side effect, so a bundler drops every message nothing uses. Only the messages a Client Component names reach the browser.',
  }),
  message({
    ja: 'Server Componentが描いた文言は、ブラウザに送るコードを増やしません。辞書を名前空間に分けて読み込むような設定もいりません。',
    en: 'Text a Server Component renders adds nothing to the browser, and there is no namespace list to split dictionaries by.',
  }),
] as const;

export const nextGetStarted = message({
  ja: 'ロケールの一覧を定義し、最初の文言をサーバーとブラウザで描くところまで作ります。',
  en: 'Define the locale set, and render a first message on the server and in the browser.',
});

export const nextLocales = message({
  ja: '`defineLocales`が返す値と、ブラウザやリクエストから言語を選ぶ方法です。',
  en: 'What `defineLocales` returns, and negotiating from the browser or a request.',
});

export const nextMessages = message({
  ja: '`message`の書き方と置き場所、ブラウザに届く文言の決まり方です。',
  en: 'Writing messages, where they live, and what reaches the browser.',
});

export const nextFormatting = message({
  ja: '複数形や日付、数値を、ロケールに合った`Intl`で書きます。',
  en: 'Plurals, dates and numbers with the locale’s `Intl`.',
});

export const nextRouting = message({
  ja: 'URLの区間とロケールの関係、言語の切り替え、`/`からの振り分けです。',
  en: 'The URL segment, switching languages, and sending `/` somewhere.',
});

export const nextIntegrations = message({
  ja: 'ほかのk8ordoのパッケージとの組み合わせ方と、テストの書き方です。',
  en: 'Wiring it to the other k8ordo packages, and testing.',
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
  ja: 'URLとロケール',
  en: 'URLs & locale',
});

export const navIntegrations = message({
  ja: '組み合わせ',
  en: 'Integrations',
});
