import { message } from '@k8ordo/i18n';

export const description = message({
  ja: '文言を関数として書き、Server ComponentでもClient Componentでも同じ1行で呼ぶReactの国際化です。`defineLocales`に書いたロケールの一覧で、訳し忘れを型で検査します。言語の選択とURLのロケールの付け外しも、この一覧を使います。',
  en: 'React i18n with messages written as functions, called the same way in Server and Client Components. The locale list in `defineLocales` lets the types catch a missing translation. Choosing a language, and adding or removing the locale in a URL, use the same list.',
});

export const tagline = message({
  ja: 'Server ComponentでもClient Componentでも使えるReactの多言語対応',
  en: 'Internationalization for React that works in both Server and Client Components',
});

export const claimServerTitle = message({
  ja: 'プロバイダもフックも無い呼び出し',
  en: 'Calls without a provider or a hook',
});

export const claimServerBody = [
  message({
    ja: '文言はただの関数で、呼ばれた場所でロケールを読みます。ブラウザではURLの先頭にあるロケール（`/en/…`の`en`）を、サーバーでは`locales.run`か`locales.paramsSchema`が設定したロケールを読みます。',
    en: 'A message is a plain function that reads the locale where it is called. In the browser that is the locale at the start of the URL, such as `en` in `/en/…`; on the server it is the one `locales.run` or `locales.paramsSchema` set.',
  }),
  message({
    ja: '言語を切り替えるときは、別のロケールのURL（`/ja/…`から`/en/…`）へ移動するだけです。',
    en: 'To switch language, navigate to the same page under another locale, such as from `/ja/…` to `/en/…`.',
  }),
] as const;

export const claimTypesTitle = message({
  ja: '訳し忘れの型エラー',
  en: 'Type errors for missing translations',
});

export const claimTypesBody = [
  message({
    ja: 'ロケールの型が`Register`に登録されていれば、`message`はすべてのロケールの文を求めます。1つでも欠けていれば、その宣言が型エラーになります。',
    en: 'Once `Register` carries the locale type, `message` requires text in every locale. Leave one out, and the declaration is a type error.',
  }),
  message({
    ja: '値を差し込む文言は、ロケールごとの関数として書きます。引数の型を1つのロケールに書いておけば、ほかのロケールも同じ型で検査されます。',
    en: 'A message with values is a function in each locale. Annotate the arguments in one locale, and every other locale is checked against the same types.',
  }),
] as const;

export const claimTypesMissing = message({
  ja: '`en`が無いので型エラーになる',
  en: 'No `en`: a type error',
});

export const claimBundleTitle = message({
  ja: '使った文言だけのバンドル',
  en: 'Bundles with only the messages used',
});

export const claimBundleBody = [
  message({
    ja: '`message`の呼び出しには副作用が無いので、使われていない文言はバンドラが取り除きます。ブラウザに送られるのは、Client Componentが使っている文言だけです。',
    en: '`message` has no side effects, so a bundler drops every message nothing imports. Only the messages Client Components use reach the browser.',
  }),
  message({
    ja: 'Server Componentが描画した文言は、ブラウザに送るコードを増やしません。辞書を名前空間に分けて読み込む設定もいりません。',
    en: 'Text rendered by a Server Component adds nothing to the client bundle. There is no namespace list to split dictionaries by.',
  }),
] as const;

export const navLocales = message({
  ja: 'ロケール',
  en: 'Locales',
});

export const navMessages = message({
  ja: '文言',
  en: 'Messages',
});

export const navFormatting = message({
  ja: '日付と数値の書式',
  en: 'Formatting',
});

export const navRouting = message({
  ja: '今のロケール',
  en: 'Current locale',
});

export const navSwitch = message({
  ja: '言語の切り替え',
  en: 'Switching',
});

export const navNegotiate = message({
  ja: '最初の言語',
  en: 'Negotiation',
});

export const navTesting = message({
  ja: 'テスト',
  en: 'Testing',
});

export const navHowItWorks = message({
  ja: '仕組み',
  en: 'How it works',
});

export const navReference = message({
  ja: 'API',
  en: 'API',
});

export const navTroubleshooting = message({
  ja: 'トラブルシューティング',
  en: 'Troubleshooting',
});
