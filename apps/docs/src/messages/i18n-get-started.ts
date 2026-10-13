import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '日本語と英語の文言を持つアプリを作ります。ロケールを定義し、文言をServer ComponentとClient Componentに表示します。',
  en: 'Build an app with Japanese and English messages: define the locales, then render messages from a Server Component and a Client Component.',
});

export const installTitle = message({
  ja: 'インストール',
  en: 'Install',
});

export const runtime = message({
  ja: 'サーバーでは、`process.getBuiltinModule`で`AsyncLocalStorage`を取り出せるランタイムが必要です。Node 24はこの条件を満たします。',
  en: 'On the server, the runtime must provide `AsyncLocalStorage` through `process.getBuiltinModule`. Node 24 does.',
});

export const localesTitle = message({
  ja: 'ロケールの定義',
  en: 'Defining the locales',
});

export const localesDefaultCallout = message({
  ja: '先頭に書いたロケールが既定のロケール',
  en: 'The first locale is the default',
});

export const localesDefine = message({
  ja: 'アプリが扱うロケールを`defineLocales`で書きます。ロケールごとに、日付を表示するタイムゾーン（`timeZone`）と文字の向き（`dir`）を添えます。',
  en: 'List the locales the app supports with `defineLocales`. Each one declares the time zone its dates are shown in (`timeZone`) and the direction its text runs in (`dir`).',
});

export const localesRegister = message({
  ja: '`Register`は、ロケールの型をパッケージに伝える宣言です。これを書くと、`message`がすべてのロケールの文を求めるようになります。`@k8ordo/framework`のアプリでは、`src/i18n.ts`がexportする`locales`から`Register`が生成されるので、この宣言は書きません。詳しくは`@k8ordo/framework`の',
  en: 'The `Register` block tells the package the type of your locales. With it, `message` requires text for every locale. An `@k8ordo/framework` app does not write it: the framework generates `Register` from the `locales` that `src/i18n.ts` exports. See `@k8ordo/framework`’s ',
});

export const localesMore = message({
  ja: '既定のロケールの選び方やタイムゾーンの決め方は',
  en: 'How to choose the default locale and each time zone is covered in ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const messagesTitle = message({
  ja: '文言の定義',
  en: 'Defining messages',
});

export const messagesCallout = message({
  ja: '`en`の`name`の型は`ja`の注釈から推論される',
  en: '`name` in `en` is inferred from the annotation on `ja`',
});

export const messagesDefine = message({
  ja: '文言は`message`で1つずつ書き、ロケールごとの文を並べます。値を差し込む文言は、ロケールごとの関数にします。',
  en: 'Write each message with `message`, giving its text in every locale. A message that takes a value is a function in every locale.',
});

export const messagesTypes = message({
  ja: '`en`の関数は、`ja`と同じ引数の型で書きます。',
  en: 'The `en` function takes the same argument types as `ja`.',
});

export const serverTitle = message({
  ja: 'Server Componentでの描画',
  en: 'Rendering in a Server Component',
});

export const serverCallout = message({
  ja: '呼ぶだけで、今のロケールの文が返る',
  en: 'Calling it returns the text in the current locale',
});

export const serverCall = message({
  ja: 'サーバーでは、今の非同期コンテキストに設定されたロケールの文を返します。何も設定されていなければ、既定のロケールの文（`ようこそ`）を返します。',
  en: 'On the server it returns the text in the locale set for the current async context. With none set, it returns the default locale’s text, `ようこそ`.',
});

export const serverSet = message({
  ja: 'ロケールを設定するのは`locales.run`と`locales.paramsSchema`です。使い方は',
  en: '`locales.run` and `locales.paramsSchema` set it. How to use them is covered in ',
});

export const serverFramework = message({
  ja: '`@k8ordo/framework`では、`[locale]`のレイアウトから`paramsSchema`をexportすると、`/en/…`のページが英語で描画されます。詳しくは`@k8ordo/framework`の',
  en: 'Under `@k8ordo/framework`, exporting `paramsSchema` from the `[locale]` layout renders the pages under `/en/…` in English. See `@k8ordo/framework`’s ',
});

export const clientTitle = message({
  ja: 'Client Componentでの描画',
  en: 'Rendering in a Client Component',
});

export const clientCallout = message({
  ja: '値を差し込む文言は、引数を付けて呼ぶ',
  en: 'A message with a value is called with the argument',
});

export const clientSame = message({
  ja: 'Client Componentでも書き方は同じです。ブラウザではURLの先頭の区間を読むので、プロバイダでロケールを渡す必要も、フックで読み出す必要もありません。',
  en: 'A Client Component calls it the same way. In the browser a message reads the first segment of the URL, so there is no provider to pass the locale down and no hook to read it with.',
});

export const clientBoundary = message({
  ja: 'Server ComponentからClient Componentへ文言をpropsで渡すときは、呼んだ結果の文字列を渡します。関数はClient Componentへのpropsとして渡せません。詳しくは',
  en: 'To pass a message from a Server Component to a Client Component as a prop, pass the string you get by calling it. A Server Component cannot pass a function to a Client Component as a prop. See ',
});
